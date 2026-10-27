import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {
  carpetaDeCandidato, copiarPlantillas, driveActivo, enlaceCarpeta, subirArchivo,
} from './drive.js'
import { PLANTILLAS } from './plantillas.js'
import { bdConfigurada } from './bd/conexion.js'
import * as bd from './bd/repositorio.js'

const app = express()

app.use(cors())
app.use(express.json())

const ETAPAS = [
  'Evaluación recibida',
  'Entrevista agendada',
  'Entrevista realizada',
  'Informe enviado',
  'Entrevista con jefe de área',
  'Contratación',
]

const CATEGORIAS = ['Recomendado', 'Recomendado con observaciones', 'No recomendado']

const ERROR_PDF = 'El CV debe ser un archivo PDF.'

// El archivo se mantiene en memoria: va directo a Drive sin tocar el disco.
const subida = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, archivo, cb) => {
    if (archivo.mimetype !== 'application/pdf') return cb(new Error(ERROR_PDF))
    cb(null, true)
  },
})

app.get('/api/candidatos', async (req, res) => {
  res.json(await bd.listarCandidatos())
})

app.patch('/api/candidatos/:id', async (req, res) => {
  const { correo } = req.body

  if (correo && !correo.includes('@')) {
    return res.status(400).json({ error: 'El correo no es válido.' })
  }

  const actualizado = await bd.actualizarCandidato(req.params.id, req.body)
  if (!actualizado) {
    return res.status(404).json({ error: 'Candidato no encontrado.' })
  }
  res.json(actualizado)
})

app.get('/api/solicitudes', async (req, res) => {
  res.json(await bd.listarSolicitudes())
})

app.post('/api/solicitudes', async (req, res) => {
  const {
    tipo, nombre, correo, familiaCargo, cargo, analista, nombreCv,
    areaActual, cargoActual,
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
  const candidato = await bd.candidatoPorCorreo(req.body)
  const nueva = { candidatoId: candidato.id, cargo, familiaCargo, analista, nombreCv }

  // La carpeta de Drive es opcional: si falla, la solicitud se crea igual.
  if (driveActivo()) {
    try {
      nueva.carpetaId = await carpetaDeCandidato(candidato.nombre)
      nueva.carpetaUrl = enlaceCarpeta(nueva.carpetaId)
      await copiarPlantillas(PLANTILLAS[familiaCargo] ?? [], nueva.carpetaId)
    } catch (error) {
      console.error('Drive no respondió:', error.message)
    }
  }

  res.status(201).json(await bd.crearSolicitud(nueva))
})

app.post('/api/solicitudes/:id/cv', subida.single('cv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Falta el archivo del CV.' })
  }

  const solicitud = await bd.obtenerSolicitud(req.params.id)
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' })
  }
  if (!solicitud.carpetaId) {
    return res.status(409).json({ error: 'La solicitud no tiene carpeta en Drive.' })
  }

  const archivo = await subirArchivo({
    carpetaId: solicitud.carpetaId,
    nombre: req.file.originalname,
    tipo: req.file.mimetype,
    contenido: req.file.buffer,
  })

  res.status(201).json({ nombre: archivo.name, enlace: archivo.webViewLink })
})

app.patch('/api/solicitudes/:id', async (req, res) => {
  const { etapa, categoria } = req.body

  if (etapa && !ETAPAS.includes(etapa)) {
    return res.status(400).json({ error: 'La etapa no es válida.' })
  }
  if (categoria && !CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: 'La categoría no es válida.' })
  }

  const actualizada = await bd.actualizarSolicitud(req.params.id, req.body)
  if (!actualizada) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' })
  }
  res.json(actualizada)
})

// Cualquier error de la base de datos o de la subida llega aquí
// en vez de botar el servidor.
app.use((error, req, res, next) => {
  console.error(error)
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Ya existe un candidato con ese correo.' })
  }
  if (error instanceof multer.MulterError || error.message === ERROR_PDF) {
    return res.status(400).json({ error: error.message })
  }
  res.status(500).json({ error: 'Error interno del servidor.' })
})

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env. Revisa api/.env.example.')
  process.exit(1)
}

app.listen(3000, (error) => {
  if (error) {
    console.error(error.code === 'EADDRINUSE'
      ? 'El puerto 3000 ya está en uso: la API ya está encendida en otra terminal.'
      : error.message)
    process.exit(1)
  }
  console.log('API escuchando en http://localhost:3000')
  console.log('Drive:', driveActivo() ? 'conectado' : 'apagado')
})