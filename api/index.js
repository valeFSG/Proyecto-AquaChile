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

let solicitudes = [
  {
    id: '1',
    tipo: 'Externo',
    candidato: 'María Fernanda Soto',
    correo: 'maria.soto@correo.cl',
    telefono: '+56 9 8412 7730',
    familiaCargo: 'Operaciones',
    cargo: 'Jefe de Turno Planta',
    analista: 'Camila Rojas',
    nombreCv: 'cv-maria-soto.pdf',
    etapa: ETAPAS.RECIBIDA,
    descartada: false,
    fechaSolicitud: '2026-09-01',
  },
  {
    id: '2',
    tipo: 'Interno',
    candidato: 'Juan Pablo Márquez',
    correo: 'jp.marquez@correo.cl',
    telefono: '+56 9 7765 2214',
    familiaCargo: 'Administración',
    cargo: 'Analista de Compras',
    areaActual: 'Bodega',
    cargoActual: 'Auxiliar de Bodega',
    antiguedadAnios: 4,
    analista: 'Camila Rojas',
    nombreCv: 'cv-jp-marquez.pdf',
    etapa: ETAPAS.REALIZADA,
    descartada: false,
    fechaSolicitud: '2026-08-28',
  },
  {
    id: '3',
    tipo: 'Externo',
    candidato: 'Ignacia Vera Muñoz',
    correo: 'ignacia.vera@correo.cl',
    telefono: '+56 9 6238 9015',
    familiaCargo: 'Mantención',
    cargo: 'Supervisor Eléctrico',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-ignacia-vera.pdf',
    etapa: ETAPAS.ENVIADA,
    categoria: 'Recomendado',
    descartada: false,
    fechaSolicitud: '2026-08-25',
  },
  {
    id: '4',
    tipo: 'Interno',
    candidato: 'Rodrigo Pinto Lagos',
    correo: 'r.pinto@correo.cl',
    telefono: '+56 9 5590 4471',
    familiaCargo: 'Operaciones',
    cargo: 'Supervisor de Línea',
    areaActual: 'Planta 2',
    cargoActual: 'Operario de Proceso',
    antiguedadAnios: 6,
    analista: 'Diego Fuentes',
    nombreCv: 'cv-rodrigo-pinto.pdf',
    etapa: ETAPAS.AGENDADA,
    descartada: false,
    fechaSolicitud: '2026-09-10',
  },
]

app.get('/api/solicitudes', (req, res) => {
  res.json(solicitudes)
})

app.post('/api/solicitudes', (req, res) => {
  const {
    tipo, candidato, correo, telefono, familiaCargo, cargo, analista, nombreCv,
    areaActual, cargoActual, antiguedadAnios,
  } = req.body

  if (!candidato || !correo || !familiaCargo || !cargo || !analista) {
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

  const nueva = {
    id: crypto.randomUUID(),
    tipo: tipo ?? 'Externo',
    candidato,
    correo,
    telefono: telefono ?? '',
    familiaCargo,
    cargo,
    analista,
    nombreCv: nombreCv ?? '',
    etapa: ETAPAS.RECIBIDA,
    descartada: false,
    fechaSolicitud: new Date().toISOString().slice(0, 10),
  }

  if (nueva.tipo === 'Interno') {
    nueva.areaActual = areaActual
    nueva.cargoActual = cargoActual
    nueva.antiguedadAnios = Number(antiguedadAnios) || 0
  }

  solicitudes = [nueva, ...solicitudes]
  res.status(201).json(nueva)
})

app.patch('/api/solicitudes/:id', (req, res) => {
  const { etapa, descartada, categoria, observaciones, fechaEvaluacion } = req.body
  const indice = solicitudes.findIndex((s) => s.id === req.params.id)

  if (indice === -1) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' })
  }

  const actual = solicitudes[indice]
  const actualizada = {
    ...actual,
    etapa: etapa ?? actual.etapa,
    descartada: descartada ?? actual.descartada,
    categoria: categoria ?? actual.categoria,
    observaciones: observaciones ?? actual.observaciones,
    fechaEvaluacion: fechaEvaluacion ?? actual.fechaEvaluacion,
  }

  solicitudes[indice] = actualizada
  res.json(actualizada)
})

app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000')
})