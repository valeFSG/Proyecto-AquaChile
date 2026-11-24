export const FAMILIAS = [
  {
    id: 'operaciones',
    nombre: 'Operaciones',
    plantillaInforme: 'informe-operaciones.xlsx',
    pautaEntrevista: 'pauta-operaciones.docx',
    cargos: [
      'Operario de Proceso',
      'Supervisor de Línea',
      'Jefe de Turno Planta',
      'Encargado de Calidad',
      'Jefe de Planta',
    ],
  },
  {
    id: 'administracion',
    nombre: 'Administración',
    plantillaInforme: 'informe-administracion.xlsx',
    pautaEntrevista: 'pauta-administracion.docx',
    cargos: [
      'Asistente Administrativo',
      'Analista Contable',
      'Analista de Remuneraciones',
      'Encargado de Adquisiciones',
      'Jefe de Administración',
    ],
  },
  {
    id: 'mantencion',
    nombre: 'Mantención',
    plantillaInforme: 'informe-mantencion.xlsx',
    pautaEntrevista: 'pauta-mantencion.docx',
    cargos: [
      'Mecánico de Mantención',
      'Eléctrico Industrial',
      'Técnico en Refrigeración',
      'Supervisor de Mantención',
      'Jefe de Mantención',
    ],
  },
  {
    id: 'comercial',
    nombre: 'Comercial',
    plantillaInforme: 'informe-comercial.xlsx',
    pautaEntrevista: 'pauta-comercial.docx',
    cargos: [
      'Ejecutivo Comercial',
      'Analista de Ventas',
      'Encargado de Exportaciones',
      'Ejecutivo de Grandes Cuentas',
      'Jefe de Ventas',
    ],
  },
]

// Los cargos de una familia, para el desplegable del formulario.
export const cargosDe = (nombreFamilia) =>
  FAMILIAS.find((familia) => familia.nombre === nombreFamilia)?.cargos ?? []