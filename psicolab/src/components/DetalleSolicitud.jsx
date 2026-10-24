import { useState } from 'react'
import { planificarCarpeta } from '../lib/carpeta'
import { ETAPAS, TIPOS, CATEGORIAS } from '../data/solicitudes'
import { FAMILIAS } from '../data/catalogo'

const SIGUIENTE_ETAPA = {
  [ETAPAS.RECIBIDA]: ETAPAS.AGENDADA,
  [ETAPAS.AGENDADA]: ETAPAS.REALIZADA,
  [ETAPAS.REALIZADA]: ETAPAS.ENVIADA,
  [ETAPAS.ENVIADA]: ETAPAS.JEFATURA,
  [ETAPAS.JEFATURA]: ETAPAS.CONTRATACION,
}

function DetalleSolicitud({
  solicitud,
  onCerrar,
  onAvanzar,
  onDescartar,
  onGuardarEvaluacion,
  onGuardarDatos,
}) {
  const [guardando, setGuardando] = useState(false)
  const [errorEval, setErrorEval] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [editando, setEditando] = useState(false)
  const [errorDatos, setErrorDatos] = useState(null)
  const [datos, setDatos] = useState(null)
  const [evaluacion, setEvaluacion] = useState({
    fechaEvaluacion: solicitud.fechaEvaluacion ?? '',
    categoria: solicitud.categoria ?? '',
    observaciones: solicitud.observaciones ?? '',
  })

  const { carpeta, archivos } = planificarCarpeta(solicitud)

  const candidato = solicitud.candidato
  const esInterno = candidato?.tipo === TIPOS.INTERNO
  const siguiente = SIGUIENTE_ETAPA[solicitud.etapa]

  function cambiarEval(evento) {
    const { name, value } = evento.target
    setEvaluacion((previos) => ({ ...previos, [name]: value }))
  }

  function cambiarDato(evento) {
    const { name, value } = evento.target
    setDatos((previos) => ({ ...previos, [name]: value }))
  }

  async function accion(fn) {
    setGuardando(true)
    try {
      await fn()
    } finally {
      setGuardando(false)
    }
  }

  function abrirEdicion() {
    setDatos({
      nombre: candidato?.nombre ?? '',
      correo: candidato?.correo ?? '',
      telefono: candidato?.telefono ?? '',
      areaActual: candidato?.areaActual ?? '',
      cargoActual: candidato?.cargoActual ?? '',
      antiguedadAnios: candidato?.antiguedadAnios ?? '',
      cargo: solicitud.cargo,
      familiaCargo: solicitud.familiaCargo,
      analista: solicitud.analista,
    })
    setErrorDatos(null)
    setMensaje(null)
    setEditando(true)
  }

  async function guardarDatos() {
    if (!datos.nombre.trim()) {
      setErrorDatos('El nombre es obligatorio.')
      return
    }
    if (!datos.correo.includes('@')) {
      setErrorDatos('El correo no es válido.')
      return
    }
    if (!datos.cargo.trim()) {
      setErrorDatos('El cargo es obligatorio.')
      return
    }

    const datosCandidato = {
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
    }

    if (esInterno) {
      datosCandidato.areaActual = datos.areaActual
      datosCandidato.cargoActual = datos.cargoActual
      datosCandidato.antiguedadAnios = Number(datos.antiguedadAnios) || 0
    }

    const datosSolicitud = {
      cargo: datos.cargo,
      familiaCargo: datos.familiaCargo,
      analista: datos.analista,
    }

    setErrorDatos(null)
    setGuardando(true)
    try {
      await onGuardarDatos(datosCandidato, datosSolicitud)
      setEditando(false)
      setMensaje('Datos actualizados.')
    } catch (err) {
      setErrorDatos(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function guardarEvaluacion() {
    setMensaje(null)

    if (!evaluacion.categoria) {
      setErrorEval('Elige una categoría.')
      return
    }
    if (!evaluacion.fechaEvaluacion) {
      setErrorEval('Indica la fecha de la evaluación.')
      return
    }

    setErrorEval(null)
    setGuardando(true)
    try {
      await onGuardarEvaluacion(solicitud.id, evaluacion)
      setMensaje('Evaluación guardada.')
    } catch (err) {
      setErrorEval(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div style={{ maxWidth: '52rem' }}>

      <button type="button" className="btn-volver" onClick={onCerrar}>
        ← Volver al dashboard
      </button>

      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mt-3 mb-4">
        <div>
          <h1 className="titulo">{candidato?.nombre ?? 'Sin candidato'}</h1>
          <p className="subtitulo">
            Postula a {solicitud.cargo} · {solicitud.familiaCargo}
          </p>
        </div>
        <span className={esInterno ? 'pill pill-int' : 'pill pill-ext'}>
          {candidato?.tipo}
        </span>
      </div>

      {editando ? (
        <div className="bloque mb-3">
          <h2 className="bloque-titulo">Editar datos</h2>

          <div className="row g-3">
            <div className="col-12 col-md-7">
              <label className="campo-label" htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre" name="nombre" className="campo-input"
                value={datos.nombre} onChange={cambiarDato}
              />
            </div>

            <div className="col-12 col-md-5">
              <label className="campo-label" htmlFor="correo">Correo</label>
              <input
                id="correo" name="correo" type="email" className="campo-input"
                value={datos.correo} onChange={cambiarDato}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="campo-label" htmlFor="telefono">Teléfono</label>
              <input
                id="telefono" name="telefono" className="campo-input"
                value={datos.telefono} onChange={cambiarDato}
              />
            </div>

            {esInterno && (
              <>
                <div className="col-12 col-md-4">
                  <label className="campo-label" htmlFor="areaActual">Área actual</label>
                  <input
                    id="areaActual" name="areaActual" className="campo-input"
                    value={datos.areaActual} onChange={cambiarDato}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="campo-label" htmlFor="cargoActual">Cargo actual</label>
                  <input
                    id="cargoActual" name="cargoActual" className="campo-input"
                    value={datos.cargoActual} onChange={cambiarDato}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="campo-label" htmlFor="antiguedadAnios">Antigüedad</label>
                  <input
                    id="antiguedadAnios" name="antiguedadAnios" type="number" min="0"
                    className="campo-input"
                    value={datos.antiguedadAnios} onChange={cambiarDato}
                  />
                </div>
              </>
            )}

            <div className="col-12 col-md-4">
              <label className="campo-label" htmlFor="familiaCargo">Familia de cargo</label>
              <select
                id="familiaCargo" name="familiaCargo" className="campo-input"
                value={datos.familiaCargo} onChange={cambiarDato}
              >
                {FAMILIAS.map((familia) => (
                  <option key={familia.id} value={familia.nombre}>{familia.nombre}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="campo-label" htmlFor="cargo">Cargo al que postula</label>
              <input
                id="cargo" name="cargo" className="campo-input"
                value={datos.cargo} onChange={cambiarDato}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="campo-label" htmlFor="analista">Analista</label>
              <input
                id="analista" name="analista" className="campo-input"
                value={datos.analista} onChange={cambiarDato}
              />
            </div>
          </div>

          {errorDatos && <span className="campo-error d-block mt-2">{errorDatos}</span>}

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn-cancelar"
              disabled={guardando}
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-nuevo"
              disabled={guardando}
              onClick={guardarDatos}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bloque mb-3">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h2 className="bloque-titulo mb-0">Datos del candidato</h2>
              <button type="button" className="btn-restaurar" onClick={abrirEdicion}>
                Editar
              </button>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="dato-label">Correo</div>
                <div className="dato-valor">{candidato?.correo || '—'}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="dato-label">Teléfono</div>
                <div className="dato-valor">{candidato?.telefono || '—'}</div>
              </div>
            </div>

            {esInterno && (
              <div className="row g-3 mt-1 pt-3" style={{ borderTop: '1px solid var(--linea)' }}>
                <div className="col-6 col-md-4">
                  <div className="dato-label">Área actual</div>
                  <div className="dato-valor">{candidato.areaActual}</div>
                </div>
                <div className="col-6 col-md-5">
                  <div className="dato-label">Cargo actual</div>
                  <div className="dato-valor">{candidato.cargoActual}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="dato-label">Antigüedad</div>
                  <div className="dato-valor">{candidato.antiguedadAnios} años</div>
                </div>
              </div>
            )}
          </div>

          <div className="bloque mb-3">
            <h2 className="bloque-titulo">Datos de la solicitud</h2>
            <div className="row g-3">
              <div className="col-6 col-md-4">
                <div className="dato-label">Solicitó</div>
                <div className="dato-valor">{solicitud.analista}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="dato-label">Fecha de solicitud</div>
                <div className="dato-valor">{solicitud.fechaSolicitud}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="dato-label">Etapa</div>
                <div className="dato-valor">{solicitud.etapa}</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bloque mb-3">
        <h2 className="bloque-titulo">Evaluación psicolaboral</h2>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="campo-label" htmlFor="fechaEvaluacion">
              Fecha de evaluación
            </label>
            <input
              id="fechaEvaluacion"
              name="fechaEvaluacion"
              type="date"
              className="campo-input"
              value={evaluacion.fechaEvaluacion}
              onChange={cambiarEval}
            />
          </div>

          <div className="col-12 col-md-8">
            <label className="campo-label" htmlFor="categoria">
              Categoría del evaluado
            </label>
            <select
              id="categoria"
              name="categoria"
              className="campo-input"
              value={evaluacion.categoria}
              onChange={cambiarEval}
            >
              <option value="">Sin evaluar</option>
              {Object.values(CATEGORIAS).map((opcion) => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="campo-label" htmlFor="observaciones">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              className="campo-input campo-area"
              rows="4"
              value={evaluacion.observaciones}
              onChange={cambiarEval}
              placeholder="Fortalezas, oportunidades de desarrollo y conclusión general."
            />
          </div>
        </div>

        {errorEval && <span className="campo-error d-block mt-2">{errorEval}</span>}
        {mensaje && <span className="campo-ayuda d-block mt-2">{mensaje}</span>}

        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            className="btn btn-nuevo"
            disabled={guardando}
            onClick={guardarEvaluacion}
          >
            Guardar evaluación
          </button>
        </div>
      </div>

      <div className="bloque mb-4">
        <h2 className="bloque-titulo">Carpeta de trabajo</h2>
        <p className="ruta">{carpeta}</p>

        <div className="archivos">
          {archivos.map((archivo) => (
            <div key={archivo.nombre} className="archivo">
              <span className="archivo-nombre">{archivo.nombre}</span>
              <span className="archivo-tipo">{archivo.tipo}</span>
              <span className="archivo-origen">{archivo.origen}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex gap-2 flex-wrap">
        {siguiente && (
          <button
            type="button"
            className="btn btn-nuevo"
            disabled={guardando}
            onClick={() => accion(() => onAvanzar(solicitud.id, siguiente))}
          >
            Avanzar a {siguiente}
          </button>
        )}
        <button
          type="button"
          className="btn-descartar"
          disabled={guardando}
          onClick={() => accion(() => onDescartar(solicitud.id))}
        >
          Descartar candidato
        </button>
      </div>
    </div>
  )
}

export default DetalleSolicitud