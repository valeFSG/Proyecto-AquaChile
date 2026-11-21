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

// Cuentas ficticias de demostración. Las contraseñas viven solo en la base, como hash.
export const CUENTAS_DEMO = [
  { correo: 'analista@aquachile.demo', rol: ROLES.ANALISTA },
  { correo: 'evaluador@aquachile.demo', rol: ROLES.EVALUADOR },
  { correo: 'jefatura@aquachile.demo', rol: ROLES.JEFATURA },
]

export function puede(rol, accion) {
  return PERMISOS[rol]?.includes(accion) ?? false
}