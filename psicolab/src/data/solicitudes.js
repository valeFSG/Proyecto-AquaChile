
export const ESTADOS = {
  RECIBIDA: 'Recibida',
  PREPARADA: 'Carpeta lista',
  EN_ENTREVISTA: 'En entrevista',
  EN_ANALISIS: 'En análisis',
  INFORME_LISTO: 'Informe listo',
  ENVIADA: 'Enviada',
}


export const solicitudesIniciales = [
  {
    id: 1,
    candidato: 'María Fernanda Soto',
    familiaCargo: 'Operaciones',
    cargo: 'Jefe de Turno Planta',
    analista: 'Camila Rojas',
    estado: ESTADOS.RECIBIDA,
    fechaSolicitud: '2026-09-01',
  },
  {
    id: 2,
    candidato: 'Juan Pablo Márquez',
    familiaCargo: 'Administración',
    cargo: 'Analista de Compras',
    analista: 'Camila Rojas',
    estado: ESTADOS.EN_ENTREVISTA,
    fechaSolicitud: '2026-08-28',
  },
  {
    id: 3,
    candidato: 'Ignacia Vera Muñoz',
    familiaCargo: 'Mantención',
    cargo: 'Supervisor Eléctrico',
    analista: 'Diego Fuentes',
    estado: ESTADOS.INFORME_LISTO,
    fechaSolicitud: '2026-08-25',
  },
]
export const FILTROS = ['Todas', ...Object.values(ESTADOS)]