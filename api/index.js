import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const ETAPAS = {
  CANDIDATOS: 'Candidatos',
  EVALUACION: 'Evaluación',
  CONTRATACION: 'Contratación',
}

const PASOS = {
  PENDIENTE: 'Carpeta pendiente',
  PREPARADA: 'Carpeta lista',
  ENTREVISTA: 'Entrevista realizada',
  INFORME: 'Informe en revisión',
  APROBADO: 'Informe aprobado',
}

let solicitudes = [
  {
    id: '1',
    tipo: 'Externo',
    candidato: 'María Fernanda Soto',
    rut: '18.452.339-1',
    familiaCargo: 'Operaciones',
    cargo: 'Jefe de Turno Planta',
    analista: 'Camila Rojas',
    nombreCv: 'cv-maria-soto.pdf',
    etapa: ETAPAS.CANDIDATOS,
    paso: PASOS.PENDIENTE,
    descartada: false,
    fechaSolicitud: '2026-09-01',
  },
  {
    id: '2',
    tipo: 'Interno',
    candidato: 'Juan Pablo Márquez',
    rut: '16.903.117-K',
    familiaCargo: 'Administración',
    cargo: 'Analista de Compras',
    areaActual: 'Bodega',
    cargoActual: 'Auxiliar de Bodega',
    antiguedadAnios: 4,
    analista: 'Camila Rojas',
    nombreCv: 'cv-jp-marquez.pdf',
    etapa: ETAPAS.EVALUACION,
    paso: PASOS.ENTREVISTA,
    descartada: false,
    fechaSolicitud: '2026-08-28',
  },
  {
    id: '3',
    tipo: 'Externo',
    candidato: 'Ignacia Vera Muñoz',
    rut: '19.774.028-5',
    familiaCargo: 'Mantención',
    cargo: 'Supervisor Eléctrico',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-ignacia-vera.pdf',
    etapa: ETAPAS.CONTRATACION,
    paso: PASOS.APROBADO,
    descartada: false,
    fechaSolicitud: '2026-08-25',
  },
  {
    id: '4',
    tipo: 'Interno',
    candidato: 'Rodrigo Pinto Lagos',
    rut: '17.228.604-9',
    familiaCargo: 'Operaciones',
    cargo: 'Supervisor de Línea',
    areaActual: 'Planta 2',
    cargoActual: 'Operario de Proceso',
    antiguedadAnios: 6,
    analista: 'Diego Fuentes',
    nombreCv: 'cv-rodrigo-pinto.pdf',
    etapa: ETAPAS.CANDIDATOS,
    paso: PASOS.PENDIENTE,
    descartada: false,
    fechaSolicitud: '2026-09-10',
  },
]

app.get('/api/solicitudes', (req, res) => {
  res.json(solicitudes)
})

app.post('/api/solicitudes', (req, res) => {
  const {
    tipo, candidato, rut, familiaCargo, cargo, analista, nombreCv,
    areaActual, cargoActual, antiguedadAnios,
  } = req.body

  if (!candidato || !rut || !familiaCargo || !cargo || !analista) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' })
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
    rut,
    familiaCargo,
    cargo,
    analista,
    nombreCv: nombreCv ?? '',
    etapa: ETAPAS.CANDIDATOS,
    paso: PASOS.PENDIENTE,
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
  const { etapa, paso, descartada } = req.body
  const indice = solicitudes.findIndex((s) => s.id === req.params.id)

  if (indice === -1) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' })
  }

  const actual = solicitudes[indice]
  const actualizada = {
    ...actual,
    etapa: etapa ?? actual.etapa,
    paso: paso ?? actual.paso,
    descartada: descartada ?? actual.descartada,
  }

  solicitudes[indice] = actualizada
  res.json(actualizada)
})

app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000')
})