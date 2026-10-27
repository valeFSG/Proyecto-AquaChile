import { pool } from './conexion.js'

const SELECT_SOLICITUD = `
  SELECT s.*, e.fecha AS fecha_evaluacion, e.categoria, e.observaciones,
         c.id AS c_id, c.nombre, c.correo, c.telefono, c.tipo,
         c.area_actual, c.cargo_actual, c.antiguedad_anios
  FROM solicitud s
  JOIN candidato c ON c.id = s.candidato_id
  LEFT JOIN evaluacion e ON e.solicitud_id = s.id`

function aCandidato(fila, prefijoId = 'id') {
  const candidato = {
    id: fila[prefijoId],
    nombre: fila.nombre,
    correo: fila.correo,
    telefono: fila.telefono,
    tipo: fila.tipo,
  }
  if (fila.tipo === 'Interno') {
    candidato.areaActual = fila.area_actual
    candidato.cargoActual = fila.cargo_actual
    candidato.antiguedadAnios = fila.antiguedad_anios
  }
  return candidato
}

function aSolicitud(fila) {
  const solicitud = {
    id: fila.id,
    candidatoId: fila.candidato_id,
    cargo: fila.cargo,
    familiaCargo: fila.familia_cargo,
    analista: fila.analista,
    nombreCv: fila.nombre_cv,
    etapa: fila.etapa,
    descartada: fila.descartada,
    fechaSolicitud: fila.fecha_solicitud,
    candidato: aCandidato(fila, 'c_id'),
  }
  if (fila.carpeta_id) {
    solicitud.carpetaId = fila.carpeta_id
    solicitud.carpetaUrl = fila.carpeta_url
  }
  if (fila.categoria || fila.fecha_evaluacion || fila.observaciones) {
    solicitud.categoria = fila.categoria
    solicitud.fechaEvaluacion = fila.fecha_evaluacion
    solicitud.observaciones = fila.observaciones
  }
  return solicitud
}

export async function listarCandidatos() {
  const { rows } = await pool.query('SELECT * FROM candidato ORDER BY nombre')
  return rows.map((fila) => aCandidato(fila))
}

export async function actualizarCandidato(id, cambios) {
  const { rows } = await pool.query(
    `UPDATE candidato SET
       nombre = COALESCE($2, nombre),
       correo = COALESCE($3, correo),
       telefono = COALESCE($4, telefono),
       area_actual = COALESCE($5, area_actual),
       cargo_actual = COALESCE($6, cargo_actual),
       antiguedad_anios = COALESCE($7, antiguedad_anios)
     WHERE id = $1
     RETURNING *`,
    [id, cambios.nombre, cambios.correo, cambios.telefono,
      cambios.areaActual, cambios.cargoActual, cambios.antiguedadAnios],
  )
  return rows[0] ? aCandidato(rows[0]) : null
}

export async function listarSolicitudes() {
  const { rows } = await pool.query(`${SELECT_SOLICITUD} ORDER BY s.fecha_solicitud DESC, s.id`)
  return rows.map(aSolicitud)
}

export async function obtenerSolicitud(id) {
  const { rows } = await pool.query(`${SELECT_SOLICITUD} WHERE s.id = $1`, [id])
  return rows[0] ? aSolicitud(rows[0]) : null
}

// Busca al candidato por correo; si no existe, lo crea.
export async function candidatoPorCorreo(datos) {
  const existente = await pool.query(
    'SELECT * FROM candidato WHERE lower(correo) = lower($1)',
    [datos.correo],
  )
  if (existente.rows[0]) return aCandidato(existente.rows[0])

  const esInterno = datos.tipo === 'Interno'
  const { rows } = await pool.query(
    `INSERT INTO candidato (nombre, correo, telefono, tipo, area_actual, cargo_actual, antiguedad_anios)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [datos.nombre, datos.correo, datos.telefono ?? '', esInterno ? 'Interno' : 'Externo',
      esInterno ? datos.areaActual : null,
      esInterno ? datos.cargoActual : null,
      esInterno ? Number(datos.antiguedadAnios) || 0 : null],
  )
  return aCandidato(rows[0])
}

export async function crearSolicitud(datos) {
  const { rows } = await pool.query(
    `INSERT INTO solicitud (candidato_id, cargo, familia_cargo, analista, nombre_cv, carpeta_id, carpeta_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [datos.candidatoId, datos.cargo, datos.familiaCargo, datos.analista,
      datos.nombreCv ?? '', datos.carpetaId ?? null, datos.carpetaUrl ?? null],
  )
  return obtenerSolicitud(rows[0].id)
}

export async function actualizarSolicitud(id, cambios) {
  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')

    const { rowCount } = await cliente.query(
      `UPDATE solicitud SET
         etapa = COALESCE($2, etapa),
         descartada = COALESCE($3, descartada),
         cargo = COALESCE($4, cargo),
         familia_cargo = COALESCE($5, familia_cargo),
         analista = COALESCE($6, analista)
       WHERE id = $1`,
      [id, cambios.etapa, cambios.descartada, cambios.cargo, cambios.familiaCargo, cambios.analista],
    )
    if (rowCount === 0) {
      await cliente.query('ROLLBACK')
      return null
    }

    const tocaEvaluacion = ['categoria', 'observaciones', 'fechaEvaluacion']
      .some((campo) => cambios[campo] !== undefined)

    if (tocaEvaluacion) {
      await cliente.query(
        `INSERT INTO evaluacion (solicitud_id, fecha, categoria, observaciones)
         VALUES ($1, $2, $3, COALESCE($4, ''))
         ON CONFLICT (solicitud_id) DO UPDATE SET
           fecha = COALESCE(EXCLUDED.fecha, evaluacion.fecha),
           categoria = COALESCE(EXCLUDED.categoria, evaluacion.categoria),
           observaciones = COALESCE($4, evaluacion.observaciones)`,
        [id, cambios.fechaEvaluacion || null, cambios.categoria || null, cambios.observaciones],
      )
    }

    await cliente.query('COMMIT')
  } catch (error) {
    await cliente.query('ROLLBACK')
    throw error
  } finally {
    cliente.release()
  }
  return obtenerSolicitud(id)
}