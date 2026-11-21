import { redactar } from './servicios/llm.js'

const NOTA = `NOTA SOBRE LA ELABORACIÓN DE ESTE DOCUMENTO
Borrador generado automáticamente con apoyo de inteligencia artificial, a partir
de las notas de entrevista y la evaluación por competencias registradas por la
profesional evaluadora. Requiere revisión, corrección y validación profesional
antes de su envío.`

const SISTEMA = `Eres un psicólogo laboral chileno con experiencia en selección
para la industria acuícola. Redactas informes psicolaborales en español de Chile,
en tercera persona, con registro formal y claro.

Reglas estrictas:
- Usa únicamente la información que se te entrega. No inventes datos, pruebas
  aplicadas, puntajes ni antecedentes que no aparezcan.
- Los niveles por competencia los asignó la profesional evaluadora: respétalos
  tal cual, no los subas ni los bajes ni los reinterpretes.
- Si falta información para una sección, dilo explícitamente en vez de rellenar.
- No emites diagnósticos clínicos ni etiquetas de salud mental.
- Hablas de conductas observadas y de ajuste al cargo, no de la persona en abstracto.
- No uses viñetas con asteriscos ni markdown: texto corrido con títulos en mayúscula.`

function antecedentes(solicitud) {
  const c = solicitud.candidato ?? {}
  const lineas = [
    `Candidato: ${c.nombre ?? 'sin registrar'}`,
    `Cargo al que postula: ${solicitud.cargo}`,
    `Familia de cargo: ${solicitud.familiaCargo}`,
    `Tipo de postulación: ${c.tipo ?? 'sin registrar'}`,
  ]

  if (c.areaActual) lineas.push(`Área actual: ${c.areaActual}`)
  if (c.cargoActual) lineas.push(`Cargo actual: ${c.cargoActual}`)
  if (c.antiguedadAnios) lineas.push(`Antigüedad en la empresa: ${c.antiguedadAnios} años`)
  if (solicitud.entrevistador) lineas.push(`Entrevistador: ${solicitud.entrevistador}`)
  if (solicitud.fechaEntrevista) lineas.push(`Fecha de entrevista: ${solicitud.fechaEntrevista}`)
  if (solicitud.fechaEvaluacion) lineas.push(`Fecha de evaluación: ${solicitud.fechaEvaluacion}`)
  if (solicitud.categoria) lineas.push(`Categoría asignada: ${solicitud.categoria}`)

  return lineas.join('\n')
}

// Los niveles vienen de la pauta que llenó la evaluadora, no del modelo.
function competencias(solicitud) {
  const lista = (solicitud.competencias ?? []).filter((c) => c.nivel)

  if (lista.length === 0) return null

  return lista
    .map((c) => {
      const justificacion = c.justificacion?.trim()
        return justificacion
        ? `${c.competencia}: ${c.nivel} — ${justificacion}`
        : `${c.competencia}: ${c.nivel}`
    })
    .join('\n')
}

export async function redactarInforme(solicitud) {
  const notas = solicitud.observaciones?.trim()

  if (!notas) {
    throw new Error('Primero registra las notas de la entrevista.')
  }

  const pauta = competencias(solicitud)

  const estructura = pauta
    ? `ANTECEDENTES DEL CANDIDATO
DESARROLLO DE LA EVALUACIÓN
EVALUACIÓN POR COMPETENCIAS
ANÁLISIS DE AJUSTE AL CARGO
CONCLUSIÓN Y RECOMENDACIÓN`
    : `ANTECEDENTES DEL CANDIDATO
DESARROLLO DE LA EVALUACIÓN
ANÁLISIS DE AJUSTE AL CARGO
CONCLUSIÓN Y RECOMENDACIÓN`

  const bloquePauta = pauta
    ? `\nNIVELES ASIGNADOS POR LA PROFESIONAL EVALUADORA\n${pauta}\n`
    : ''

  const reglaPauta = pauta
    ? `En EVALUACIÓN POR COMPETENCIAS comenta cada competencia nombrando su nivel
tal como fue asignado, apoyándote en las notas de la entrevista para explicarlo.
El análisis y la conclusión deben ser coherentes con esos niveles: no recomiendes
sin reservas a alguien con competencias por debajo de lo esperado.`
    : ''

  const instruccion = `Redacta el borrador de un informe psicolaboral con esta estructura:

${estructura}

Extensión total: entre 400 y 600 palabras.

DATOS DEL PROCESO
${antecedentes(solicitud)}
${bloquePauta}
NOTAS DE LA ENTREVISTA ESCRITAS POR LA PROFESIONAL EVALUADORA
${notas}

La conclusión debe ser coherente con la categoría asignada. Si no hay categoría,
cierra con una recomendación fundada en las notas, sin inventar un resultado.
${reglaPauta}`

  const texto = await redactar({ sistema: SISTEMA, instruccion })

  // La nota se agrega acá y no en el prompt: así no depende de que el
  // modelo se acuerde de ponerla.
  return `${texto.replace(/\n{3,}/g, '\n\n')}\n\n${NOTA}`
}