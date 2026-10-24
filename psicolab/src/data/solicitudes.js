// Etapas reales del proceso, según el Planner de AquaChile.
export const ETAPAS = {
  RECIBIDA: 'Evaluación recibida',
  AGENDADA: 'Entrevista agendada',
  REALIZADA: 'Entrevista realizada',
  ENVIADA: 'Informe enviado',
  JEFATURA: 'Entrevista con jefe de área',
  CONTRATACION: 'Contratación',
}

export const COLUMNAS = Object.values(ETAPAS)

// Postulante externo o movimiento interno dentro de la empresa.
export const TIPOS = {
  EXTERNO: 'Externo',
  INTERNO: 'Interno',
}

// Resultado de la evaluación psicolaboral.
export const CATEGORIAS = {
  RECOMENDADO: 'Recomendado',
  CON_OBSERVACIONES: 'Recomendado con observaciones',
  NO_RECOMENDADO: 'No recomendado',
}

export const solicitudesIniciales = [
  {
    id: '1',
    candidatoId: 'c1',
    cargo: 'Jefe de Turno Planta',
    familiaCargo: 'Operaciones',
    analista: 'Camila Rojas',
    nombreCv: 'cv-maria-soto.pdf',
    etapa: ETAPAS.RECIBIDA,
    descartada: false,
    fechaSolicitud: '2026-09-01',
  },
  {
    id: '2',
    candidatoId: 'c2',
    cargo: 'Analista de Compras',
    familiaCargo: 'Administración',
    analista: 'Camila Rojas',
    nombreCv: 'cv-jp-marquez.pdf',
    etapa: ETAPAS.REALIZADA,
    descartada: false,
    fechaSolicitud: '2026-08-28',
  },
  {
    id: '3',
    candidatoId: 'c3',
    cargo: 'Supervisor Eléctrico',
    familiaCargo: 'Mantención',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-ignacia-vera.pdf',
    etapa: ETAPAS.ENVIADA,
    categoria: CATEGORIAS.RECOMENDADO,
    fechaEvaluacion: '2026-09-03',
    observaciones: 'Buen manejo técnico y disposición al trabajo en equipo.',
    descartada: false,
    fechaSolicitud: '2026-08-25',
  },
  {
    id: '4',
    candidatoId: 'c4',
    cargo: 'Supervisor de Línea',
    familiaCargo: 'Operaciones',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-rodrigo-pinto.pdf',
    etapa: ETAPAS.AGENDADA,
    descartada: false,
    fechaSolicitud: '2026-09-10',
  },
]