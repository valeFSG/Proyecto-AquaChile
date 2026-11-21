import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import * as bd from './bd/repositorio.js'
import * as drive from './servicios/google_drive.js'
import { firmarToken } from './seguridad.js'
import { ROLES } from './permisos.js'
import app from './index.js'

// Nada sale a internet ni a Neon: la base y los servicios externos van simulados.
vi.mock('./bd/repositorio.js')
vi.mock('./servicios/google_drive.js', () => ({
  driveActivo: vi.fn(() => false),
  carpetaDeCandidato: vi.fn(),
  copiarPlantillas: vi.fn(),
  enlaceCarpeta: vi.fn(),
  renombrarCarpeta: vi.fn(),
  subirArchivo: vi.fn(),
  subirDocumento: vi.fn(),
}))
vi.mock('./servicios/resend.js', () => ({
  correoActivo: () => false, avisarCandidato: vi.fn(), avisarReclutamiento: vi.fn(),
}))
vi.mock('./servicios/google_calendar.js', () => ({
  calendarioActivo: () => false, crearEntrevista: vi.fn(),
}))
vi.mock('./servicios/llm.js', () => ({ llmActivo: () => false }))
vi.mock('./informe.js', () => ({ redactarInforme: vi.fn() }))

const token = (rol) => `Bearer ${firmarToken({ id: 1, nombre: 'Prueba', correo: 'prueba@aquachile.demo', rol })}`
const ANALISTA = token(ROLES.ANALISTA)
const EVALUADOR = token(ROLES.EVALUADOR)
const JEFATURA = token(ROLES.JEFATURA)

const SOLICITUD_VALIDA = {
  tipo: 'Externo',
  nombre: 'Persona Ficticia',
  correo: 'ficticia@correo.cl',
  familiaCargo: 'Operaciones',
  cargo: 'Operario de Proceso',
  analista: 'Camila Rojas',
}

const COMPETENCIAS_OPERACIONES = [
  { competencia: 'Seguridad y prevención de riesgos', nivel: 'Destacado' },
  { competencia: 'Trabajo en equipo', nivel: 'Satisfactorio' },
  { competencia: 'Orientación a la calidad', nivel: 'En desarrollo', justificacion: 'Revisa poco su trabajo.' },
  { competencia: 'Cumplimiento de procedimientos', nivel: 'Satisfactorio' },
  { competencia: 'Adaptación al cambio', nivel: 'Destacado' },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Login y token', () => {
  it('entrega un token con la contraseña correcta', async () => {
    bd.usuarioPorCorreo.mockResolvedValue({
      id: 1, correo: 'analista@aquachile.demo', nombre: 'Camila Rojas',
      rol: ROLES.ANALISTA, claveHash: bcrypt.hashSync('clave-de-prueba', 4),
    })

    const res = await request(app).post('/api/login')
      .send({ correo: 'analista@aquachile.demo', clave: 'clave-de-prueba' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()
    expect(res.body.usuario.rol).toBe(ROLES.ANALISTA)
  })

  it('rechaza una contraseña incorrecta', async () => {
    bd.usuarioPorCorreo.mockResolvedValue({
      id: 1, correo: 'analista@aquachile.demo', nombre: 'Camila Rojas',
      rol: ROLES.ANALISTA, claveHash: bcrypt.hashSync('clave-de-prueba', 4),
    })

    const res = await request(app).post('/api/login')
      .send({ correo: 'analista@aquachile.demo', clave: 'otra' })

    expect(res.status).toBe(401)
  })

  it('rechaza una petición sin token', async () => {
    const res = await request(app).get('/api/solicitudes')
    expect(res.status).toBe(401)
    expect(bd.listarSolicitudes).not.toHaveBeenCalled()
  })

  it('rechaza un token falsificado', async () => {
    const res = await request(app).get('/api/solicitudes').set('Authorization', 'Bearer abc.def.ghi')
    expect(res.status).toBe(401)
  })
})

describe('Permisos por rol', () => {
  it('Jefatura no puede crear solicitudes', async () => {
    const res = await request(app).post('/api/solicitudes')
      .set('Authorization', JEFATURA).send(SOLICITUD_VALIDA)

    expect(res.status).toBe(403)
    expect(bd.crearSolicitud).not.toHaveBeenCalled()
  })

  it('el Evaluador no puede editar los datos de la solicitud', async () => {
    const res = await request(app).patch('/api/solicitudes/1')
      .set('Authorization', EVALUADOR).send({ cargo: 'Otro cargo' })

    expect(res.status).toBe(403)
  })

  it('el Analista no puede registrar la evaluación', async () => {
    const res = await request(app).patch('/api/solicitudes/1')
      .set('Authorization', ANALISTA).send({ categoria: 'Recomendado' })

    expect(res.status).toBe(403)
    expect(bd.actualizarSolicitud).not.toHaveBeenCalled()
  })
})

describe('POST /api/solicitudes', () => {
  const crear = (datos) => request(app).post('/api/solicitudes')
    .set('Authorization', ANALISTA).send(datos)

  it('exige los campos obligatorios', async () => {
    const res = await crear({ ...SOLICITUD_VALIDA, cargo: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Faltan datos obligatorios.')
  })

  it('rechaza un correo inválido', async () => {
    const res = await crear({ ...SOLICITUD_VALIDA, correo: 'sin-arroba' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('El correo no es válido.')
  })

  it('exige área y cargo actual a un candidato interno', async () => {
    const res = await crear({ ...SOLICITUD_VALIDA, tipo: 'Interno' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/área y cargo actual/)
  })

  it('crea la solicitud aunque Google Drive falle', async () => {
    drive.driveActivo.mockReturnValue(true)
    drive.carpetaDeCandidato.mockRejectedValue(new Error('Drive caído'))
    bd.candidatoPorCorreo.mockResolvedValue({ id: 'c9', nombre: 'Persona Ficticia' })
    bd.crearSolicitud.mockResolvedValue({ id: '9', cargo: 'Operario de Proceso' })

    const res = await crear(SOLICITUD_VALIDA)

    expect(res.status).toBe(201)
    expect(bd.crearSolicitud).toHaveBeenCalledOnce()
    expect(bd.crearSolicitud.mock.calls[0][0].carpetaId).toBeUndefined()
  })
})

describe('Recursos que no existen', () => {
  it('responde 404 al editar un candidato inexistente', async () => {
    bd.actualizarCandidato.mockResolvedValue(null)

    const res = await request(app).patch('/api/candidatos/no-existe')
      .set('Authorization', ANALISTA).send({ telefono: '+56 9 0000 0000' })

    expect(res.status).toBe(404)
  })

  it('responde 404 al mover una solicitud inexistente', async () => {
    bd.actualizarSolicitud.mockResolvedValue(null)

    const res = await request(app).patch('/api/solicitudes/99')
      .set('Authorization', ANALISTA).send({ etapa: 'Entrevista agendada' })

    expect(res.status).toBe(404)
  })

  it('responde 404 al evaluar una solicitud inexistente', async () => {
    bd.obtenerSolicitud.mockResolvedValue(null)

    const res = await request(app).patch('/api/solicitudes/99')
      .set('Authorization', EVALUADOR).send({ competencias: COMPETENCIAS_OPERACIONES })

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/solicitudes/:id', () => {
  const actualizar = (cambios) => request(app).patch('/api/solicitudes/1')
    .set('Authorization', EVALUADOR).send(cambios)

  it('rechaza una etapa que no existe', async () => {
    const res = await actualizar({ etapa: 'Etapa inventada' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('La etapa no es válida.')
  })

  it('rechaza una categoría que no existe', async () => {
    const res = await actualizar({ categoria: 'Excelente' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('La categoría no es válida.')
  })

  it('no guarda una competencia negativa sin justificación', async () => {
    bd.obtenerSolicitud.mockResolvedValue({ id: '1', familiaCargo: 'Operaciones' })
    const sinJustificar = COMPETENCIAS_OPERACIONES.map((c) => ({ ...c, justificacion: undefined }))

    const res = await actualizar({ competencias: sinJustificar })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Falta justificar el nivel de "Orientación a la calidad".')
    expect(bd.actualizarSolicitud).not.toHaveBeenCalled()
  })

  it('guarda las competencias y quita la justificación de los niveles positivos', async () => {
    bd.obtenerSolicitud.mockResolvedValue({ id: '1', familiaCargo: 'Operaciones' })
    bd.actualizarSolicitud.mockResolvedValue({ id: '1' })
    const conSobrante = COMPETENCIAS_OPERACIONES.map((c) => ({ justificacion: 'sobra', ...c }))

    const res = await actualizar({ competencias: conSobrante })

    expect(res.status).toBe(200)
    const guardadas = bd.actualizarSolicitud.mock.calls[0][1].competencias
    expect(guardadas[0]).toEqual({ competencia: 'Seguridad y prevención de riesgos', nivel: 'Destacado' })
    expect(guardadas[2].justificacion).toBe('Revisa poco su trabajo.')
  })
})

describe('Informe en Drive', () => {
  it('no deja subir el informe antes de realizar la entrevista', async () => {
    bd.obtenerSolicitud.mockResolvedValue({
      id: '1', etapa: 'Entrevista agendada', carpetaId: 'abc',
    })

    const res = await request(app)
      .post('/api/solicitudes/1/informe/drive')
      .set('Authorization', EVALUADOR)
      .send({ texto: 'Informe de prueba.' })

    expect(res.status).toBe(409)
    expect(drive.subirDocumento).not.toHaveBeenCalled()
  })

  it('sube el informe y guarda el enlace', async () => {
    bd.obtenerSolicitud.mockResolvedValue({
      id: '1', etapa: 'Entrevista realizada', carpetaId: 'abc',
      candidato: { nombre: 'Persona Ficticia' },
    })
    drive.subirDocumento.mockResolvedValue({
      webViewLink: 'https://docs.google.com/document/d/xyz',
    })
    bd.guardarInformeUrl.mockResolvedValue({ id: '1', informeUrl: 'https://docs.google.com/document/d/xyz' })

    const res = await request(app)
      .post('/api/solicitudes/1/informe/drive')
      .set('Authorization', EVALUADOR)
      .send({ texto: 'Informe corregido por la profesional.' })

    expect(res.status).toBe(200)
    expect(drive.subirDocumento).toHaveBeenCalledWith(
      expect.objectContaining({ carpetaId: 'abc', contenido: 'Informe corregido por la profesional.' }),
    )
    expect(bd.guardarInformeUrl).toHaveBeenCalledWith('1', 'https://docs.google.com/document/d/xyz')
  })

  it('rechaza al analista, que no registra evaluaciones', async () => {
    const res = await request(app)
      .post('/api/solicitudes/1/informe/drive')
      .set('Authorization', ANALISTA)
      .send({ texto: 'Informe de prueba.' })

    expect(res.status).toBe(403)
  })
})