import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ACCIONES, puede } from './permisos.js'

const DURACION = '8h'

// Sin JWT_SECRET el API arranca igual, pero las sesiones se pierden al reiniciarlo.
const SECRETO = process.env.JWT_SECRET || randomBytes(32).toString('hex')
export const secretoTemporal = () => !process.env.JWT_SECRET

// Hash de relleno: si el correo no existe se compara igual, para no delatarlo por el tiempo de respuesta.
const HASH_RELLENO = bcrypt.hashSync(randomBytes(16).toString('hex'), 10)

export function verificarClave(clave, hash) {
  return bcrypt.compare(clave, hash ?? HASH_RELLENO)
}

export function firmarToken(usuario) {
  return jwt.sign(
    { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    SECRETO,
    { subject: String(usuario.id), expiresIn: DURACION },
  )
}

export function autenticar(req, res, next) {
  const [tipo, token] = (req.get('Authorization') ?? '').split(' ')
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' })
  }

  try {
    const datos = jwt.verify(token, SECRETO)
    req.usuario = { id: datos.sub, nombre: datos.nombre, correo: datos.correo, rol: datos.rol }
    next()
  } catch (error) {
    const mensaje = error.name === 'TokenExpiredError'
      ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
      : 'La sesión no es válida.'
    res.status(401).json({ error: mensaje })
  }
}

const rechazar = (res) =>
  res.status(403).json({ error: 'Tu rol no tiene permiso para esta acción.' })

export function permitir(accion) {
  return (req, res, next) => (puede(req.usuario?.rol, accion) ? next() : rechazar(res))
}

// Un mismo PATCH puede mover la etapa, editar datos o evaluar: se exige el permiso de cada parte.
const CAMPOS_POR_ACCION = {
  [ACCIONES.MOVER_ETAPA]: ['etapa', 'descartada'],
  [ACCIONES.EDITAR_DATOS]: ['cargo', 'familiaCargo', 'analista'],
  [ACCIONES.REGISTRAR_EVALUACION]: ['fechaEvaluacion', 'categoria', 'observaciones', 'competencias'],
}

export function permitirCambios(req, res, next) {
  const requeridas = Object.entries(CAMPOS_POR_ACCION)
    .filter(([, campos]) => campos.some((campo) => req.body?.[campo] !== undefined))
    .map(([accion]) => accion)

  const autorizado = requeridas.every((accion) => puede(req.usuario?.rol, accion))
  return autorizado ? next() : rechazar(res)
}
