// Etapas reales del proceso, según el Planner de AquaChile.
export const ETAPAS = {
  RECIBIDA: 'Evaluación recibida',
  AGENDADA: 'Entrevista agendada',
  REALIZADA: 'Entrevista realizada',
  ENVIADA: 'Informe enviado',
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
    tipo: TIPOS.EXTERNO,
    candidato: 'María Fernanda Soto',
    rut: '18.452.339-1',
    familiaCargo: 'Operaciones',
    cargo: 'Jefe de Turno Planta',
    analista: 'Camila Rojas',
    nombreCv: 'cv-maria-soto.pdf',
    etapa: ETAPAS.RECIBIDA,
    descartada: false,
    fechaSolicitud: '2026-09-01',
  },
  {
    id: '2',
    tipo: TIPOS.INTERNO,
    candidato: 'Juan Pablo Márquez',
    rut: '16.903.117-K',
    familiaCargo: 'Administración',
    cargo: 'Analista de Compras',
    areaActual: 'Bodega',
    cargoActual: 'Auxiliar de Bodega',
    antiguedadAnios: 4,
    analista: 'Camila Rojas',
    nombreCv: 'cv-jp-marquez.pdf',
    etapa: ETAPAS.REALIZADA,
    descartada: false,
    fechaSolicitud: '2026-08-28',
  },
  {
    id: '3',
    tipo: TIPOS.EXTERNO,
    candidato: 'Ignacia Vera Muñoz',
    rut: '19.774.028-5',
    familiaCargo: 'Mantención',
    cargo: 'Supervisor Eléctrico',
    analista: 'Diego Fuentes',
    nombreCv: 'cv-ignacia-vera.pdf',
    etapa: ETAPAS.ENVIADA,
    categoria: CATEGORIAS.RECOMENDADO,
    descartada: false,
    fechaSolicitud: '2026-08-25',
  },
  {
    id: '4',
    tipo: TIPOS.INTERNO,
    candidato: 'Rodrigo Pinto Lagos',
    rut: '17.228.604-9',
    familiaCargo: 'Operaciones',
    cargo: 'Supervisor de Línea',
    areaActual: 'Planta 2',
    cargoActual: 'Operario de Proceso',
    antiguedadAnios: 6,
    analista: 'Diego Fuentes',
    nombreCv: 'cv-rodrigo-pinto.pdf',
    etapa: ETAPAS.AGENDADA,
    descartada: false,
    fechaSolicitud: '2026-09-10',
  },
]