export const ROLES = {
  ANALISTA: 'Analista de Reclutamiento',
  EVALUADOR: 'Profesional Evaluador',
  JEFATURA: 'Jefatura',
}

export const ACCIONES = {
  CREAR_SOLICITUD: 'crearSolicitud',
  EDITAR_DATOS: 'editarDatos',
  MOVER_ETAPA: 'moverEtapa',
  REGISTRAR_EVALUACION: 'registrarEvaluacion',
}

const PERMISOS = {
  [ROLES.ANALISTA]: [ACCIONES.CREAR_SOLICITUD, ACCIONES.EDITAR_DATOS, ACCIONES.MOVER_ETAPA],
  [ROLES.EVALUADOR]: [ACCIONES.MOVER_ETAPA, ACCIONES.REGISTRAR_EVALUACION],
  [ROLES.JEFATURA]: [],
}

// Usuarios ficticios para el login simulado.
export const USUARIOS = [
  { correo: 'analista@aquachile.demo', clave: 'analista123', nombre: 'Camila Rojas', rol: ROLES.ANALISTA },
  { correo: 'evaluador@aquachile.demo', clave: 'evaluador123', nombre: 'Paula Herrera', rol: ROLES.EVALUADOR },
  { correo: 'jefatura@aquachile.demo', clave: 'jefatura123', nombre: 'Andrés Muñoz', rol: ROLES.JEFATURA },
]

export function autenticar(correo, clave) {
  const usuario = USUARIOS.find(
    (u) => u.correo === correo.trim().toLowerCase() && u.clave === clave,
  )
  if (!usuario) return null
  return { correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol }
}

export function puede(rol, accion) {
  return PERMISOS[rol]?.includes(accion) ?? false
}