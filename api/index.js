import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

let solicitudes = [
    {
        id: 1,
        candidato: 'Maria Fernanda Soto',
        familiaCargo: 'Operaciones',
        cargo: 'Jefe de Turno Planta',
        analista: 'Camila Rojas',
        nombreCv: 'cv-camila-soto-pdf',
        estado: 'Recibida',
        fechaSolicitud: '2026-09-01',
    },
    {
        id: 2,
        candidato: 'Juan Pablo Marquez',
        familiaCargo: 'Administracion ',
        cargo: 'Analista de Compras',
        analista: 'Camila Rojas',
        nombreCv: 'cv-jp-marquez.pdf',
        estado: 'En entrevista',
        fechaSolicitud: '2026-08-28',
    },
]

app.get('/api/solicitudes', (req, res) => {
    res.json(solicitudes)
})

app.post('/api/solicitudes', (req, res) => {
    const { candidato, familiaCargo, cargo, analista, nombreCv, estado, fechaSolicitud } = req.body
    
    if (!candidato || !familiaCargo || !cargo || !analista) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' })
    }

    const nueva = {
        id: crypto.randomUUID(),
        candidato,
        familiaCargo,
        cargo,
        analista,
        nombreCv: nombreCv ?? '',
        estado: 'Recibida',
        fechaSolicitud: new Date().toISOString().slice(0, 10),
    }
        
    solicitudes = [nueva, ...solicitudes]
    res.status(201).json(nueva)
})

app.listen(3000, () => {
    console.log('API escuchando en http://localhost:3000')
})