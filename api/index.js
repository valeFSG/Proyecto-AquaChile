import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const ETAPAS = {
  RECIBIDA: 'Evaluación recibida',
  AGENDADA: 'Entrevista agendada',
  REALIZADA: 'Entrevista realizada',
  ENVIADA: 'Informe enviado',
}

let candidatos = [
  {
    id: 'c1',
    nombre: 'María Fernanda Soto',
    correo: 'maria.soto@correo.cl',
    telefono: '+56 9 8412 7730',
    tipo: 'Externo',
  },
  {
    id: 'c2',
    nombre: 'Juan Pablo Márquez',
    correo: 'jp.marquez@correo.cl',
    telefono: '+56 9 7765 2214',
    tipo: 'Interno',
    areaActual: 'Bodega',
    cargoActual: 'Auxiliar de Bodega',
    antiguedadAnios: 4,
  },
  {
    id: 'c3',
    nombre: 'Ignacia Vera Muñoz',
    correo: 'ignacia.vera@correo.cl',
    telefono: '+56 9 6238 9015',
    tipo: 'Externo',
  },
  {
    id: 'c4',
    nombre: 'Rodrigo Pinto Lagos',
    correo: 'r.pinto@correo.cl',
    telefono: '+56 9 5590 4471',
    tipo: 'Interno',
    areaActual: 'Planta 2',
    cargoActual: 'Operario de Proceso',
    antiguedadAnios: 6,
  },
]

let solicitudes = [
  {
    id: '1',
    candidatoId: 'c1',
    cargo: 'Jefe de Turno Planta',
    familiaCargo: 'Operaciones',
    analista: 'Camila Rojas',
    nombreCv: 'cv-maria-soto.pdf',
    etapa: ETAPAS.RECIBIDA,
    descartada: false,
    fechaSolicitud: '2026-09-01',
  },
  {
    id: '2',
    candidatoId: 'c2',
    cargo: 'Analista de Compras',
    familiaCargo: 'Administración',
    analista: 'Camila Rojas',
    nombreCv: 'cv-jp-marquez.pdf',
    etapa: ETAPAS.REALIZADA,
    descartada: false,
    fechaSolicitud: '2026-08-28',
  },
  {
    id: '3',
    candidatoId: 'c3',
    cargo: 'Supervisor Eléctrico',
    familiaCargo: 'Mantención',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-ignacia-vera.pdf',
    etapa: ETAPAS.ENVIADA,
    categoria: 'Recomendado',
    fechaEvaluacion: '2026-09-03',
    observaciones: 'Buen manejo técnico y disposición al trabajo en equipo.',
    descartada: false,
    fechaSolicitud: '2026-08-25',
  },
  {
    id: '4',
    candidatoId: 'c4',
    cargo: 'Supervisor de Línea',
    familiaCargo: 'Operaciones',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-rodrigo-pinto.pdf',
    etapa: ETAPAS.AGENDADA,
    descartada: false,
    fechaSolicitud: '2026-09-10',
  },
]

// Une cada solicitud con los datos de su candidato.
function conCandidato(solicitud) {
  const candidato = candidatos.find((c) => c.id === solicitud.candidatoId)
  return { ...solicitud, candidato: candidato ?? null }
}

app.get('/api/candidatos', (req, res) => {
  res.json(candidatos)
})

app.patch('/api/candidatos/:id', (req, res) => {
  const indice = candidatos.findIndex((c) => c.id === req.params.id)
  if (indice === -1) {
    return res.status(404).json({ error: 'Candidato no encontrado.' })
  }

  const { nombre, correo, telefono, areaActual, cargoActual, antiguedadAnios } = req.body

  if (correo && !correo.includes('@')) {
    return res.status(400).json({ error: 'El correo no es válido.' })
  }

  const actual = candidatos[indice]
  const actualizado = {
    ...actual,
    nombre: nombre ?? actual.nombre,
    correo: correo ?? actual.correo,
    telefono: telefono ?? actual.telefono,
    areaActual: areaActual ?? actual.areaActual,
    cargoActual: cargoActual ?? actual.cargoActual,
    antiguedadAnios: antiguedadAnios ?? actual.antiguedadAnios,
  }

  candidatos[indice] = actualizado
  res.json(actualizado)
})

app.get('/api/solicitudes', (req, res) => {
  res.json(solicitudes.map(conCandidato))
})

app.post('/api/solicitudes', (req, res) => {
  const {
    tipo, nombre, correo, telefono, familiaCargo, cargo, analista, nombreCv,
    areaActual, cargoActual, antiguedadAnios,
  } = req.body

  if (!nombre || !correo || !familiaCargo || !cargo || !analista) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' })
  }

  if (!correo.includes('@')) {
    return res.status(400).json({ error: 'El correo no es válido.' })
  }

  if (tipo === 'Interno' && (!areaActual || !cargoActual)) {
    return res.status(400).json({
      error: 'Un movimiento interno requiere área y cargo actual.',
    })
  }

  // Si la persona ya postuló antes, se reutiliza su registro.
  let candidato = candidatos.find(
    (c) => c.correo.toLowerCase() === correo.toLowerCase(),
  )

  if (!candidato) {
    candidato = {
      id: crypto.randomUUID(),
      nombre,
      correo,
      telefono: telefono ?? '',
      tipo: tipo ?? 'Externo',
    }

    if (candidato.tipo === 'Interno') {
      candidato.areaActual = areaActual
      candidato.cargoActual = cargoActual
      candidato.antiguedadAnios = Number(antiguedadAnios) || 0
    }

    candidatos = [candidato, ...candidatos]
  }

  const nueva = {
    id: crypto.randomUUID(),
    candidatoId: candidato.id,
    cargo,
    familiaCargo,
    analista,
    nombreCv: nombreCv ?? '',
    etapa: ETAPAS.RECIBIDA,
    descartada: false,
    fechaSolicitud: new Date().toISOString().slice(0, 10),
  }

  solicitudes = [nueva, ...solicitudes]
  res.status(201).json(conCandidato(nueva))
})

app.patch('/api/solicitudes/:id', (req, res) => {
  const indice = solicitudes.findIndex((s) => s.id === req.params.id)
  if (indice === -1) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' })
  }

  const {
    etapa, descartada, categoria, observaciones, fechaEvaluacion,
    cargo, familiaCargo, analista,
  } = req.body

  const actual = solicitudes[indice]
  const actualizada = {
    ...actual,
    etapa: etapa ?? actual.etapa,
    descartada: descartada ?? actual.descartada,
    categoria: categoria ?? actual.categoria,
    observaciones: observaciones ?? actual.observaciones,
    fechaEvaluacion: fechaEvaluacion ?? actual.fechaEvaluacion,
    cargo: cargo ?? actual.cargo,
    familiaCargo: familiaCargo ?? actual.familiaCargo,
    analista: analista ?? actual.analista,
  }

  solicitudes[indice] = actualizada
  res.json(conCandidato(actualizada))
})

app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000')
})