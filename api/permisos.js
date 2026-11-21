// Mismos roles y acciones que psicolab/src/lib/sesion.js: el front esconde botones, el API decide.
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

export function puede(rol, accion) {
  return PERMISOS[rol]?.includes(accion) ?? false
}
