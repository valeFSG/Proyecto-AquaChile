export const NIVELES = ['Destacado', 'Satisfactorio', 'En desarrollo', 'Por debajo de lo esperado']
export const NIVELES_NEGATIVOS = ['En desarrollo', 'Por debajo de lo esperado']

// Cinco competencias por familia de cargo. Debe coincidir con psicolab/src/data/competencias.js
export const COMPETENCIAS = {
  Operaciones: [
    'Seguridad y prevención de riesgos',
    'Trabajo en equipo',
    'Orientación a la calidad',
    'Cumplimiento de procedimientos',
    'Adaptación al cambio',
  ],
  Administración: [
    'Organización y planificación',
    'Atención al detalle',
    'Comunicación efectiva',
    'Orientación al cliente interno',
    'Manejo de herramientas digitales',
  ],
  Mantención: [
    'Resolución de problemas técnicos',
    'Seguridad y prevención de riesgos',
    'Planificación del trabajo',
    'Trabajo en equipo',
    'Aprendizaje continuo',
  ],
  Comercial: [
    'Orientación al cliente',
    'Negociación',
    'Comunicación efectiva',
    'Orientación a resultados',
    'Proactividad',
  ],
}

const esNegativo = (nivel) => NIVELES_NEGATIVOS.includes(nivel)

// Devuelve el mensaje de error, o null si las competencias están bien.
export function validarCompetencias(lista, familia) {
  const esperadas = COMPETENCIAS[familia]
  if (!esperadas) return 'La familia de cargo no es válida.'
  if (!Array.isArray(lista) || lista.length !== esperadas.length) {
    return `Deben venir las ${esperadas.length} competencias de ${familia}.`
  }

  for (const nombre of esperadas) {
    const item = lista.find((c) => c?.competencia === nombre)
    if (!item) return `Falta la competencia "${nombre}".`
    if (!NIVELES.includes(item.nivel)) return `El nivel de "${nombre}" no es válido.`
    if (esNegativo(item.nivel)
      && (typeof item.justificacion !== 'string' || !item.justificacion.trim())) {
      return `Falta justificar el nivel de "${nombre}".`
    }
  }
  return null
}

// Deja solo lo que se guarda: la justificación existe solo si el nivel es negativo.
export function limpiarCompetencias(lista) {
  return lista.map(({ competencia, nivel, justificacion }) => (
    esNegativo(nivel)
      ? { competencia, nivel, justificacion: justificacion.trim() }
      : { competencia, nivel }
  ))
}
