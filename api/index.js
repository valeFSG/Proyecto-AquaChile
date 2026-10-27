import express from 'express'
import cors from 'cors'
import { carpetaDeCandidato, driveActivo, enlaceCarpeta } from './drive.js'
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
    } catch (error) {
      console.error('Drive no respondió:', error.message)
    }
  }

  res.status(201).json(await bd.crearSolicitud(nueva))
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

// Cualquier error de la base de datos llega aquí en vez de botar el servidor.
app.use((error, req, res, next) => {
  console.error(error)
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Ya existe un candidato con ese correo.' })
  }
  res.status(500).json({ error: 'Error interno del servidor.' })
})

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env. Revisa api/.env.example.')
  process.exit(1)
}

app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000')
  console.log('Drive:', driveActivo() ? 'conectado' : 'apagado')
})