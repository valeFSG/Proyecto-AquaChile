import 'dotenv/config'

const URL = 'https://generativelanguage.googleapis.com/v1beta/models'

const MODELOS = [
  process.env.GEMINI_MODELO ?? 'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
]

export function llmActivo() {
  return Boolean(process.env.GEMINI_API_KEY)
}

const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms))

async function pedirAlModelo(modelo, sistema, instruccion) {
  const respuesta = await fetch(`${URL}/${modelo}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: sistema }] },
      contents: [{ parts: [{ text: instruccion }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
    }),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    const error = new Error(`El modelo respondió ${respuesta.status}: ${detalle.slice(0, 300)}`)
    error.estado = respuesta.status
    throw error
  }

  const datos = await respuesta.json()

  if (datos.promptFeedback?.blockReason) {
    throw new Error(`El modelo bloqueó la petición: ${datos.promptFeedback.blockReason}`)
  }

  const texto = (datos.candidates?.[0]?.content?.parts ?? [])
    .filter((parte) => parte.text && !parte.thought)
    .map((parte) => parte.text)
    .join('')
    .trim()

  if (!texto) throw new Error('El modelo no devolvió texto.')
  return texto
}

// Único punto que conoce al proveedor: recibe instrucciones y devuelve texto.
// Reintenta cuando el modelo está saturado y, si insiste, pasa al de respaldo;
// un 503 pasajero no debería botar la redacción del informe.
export async function redactar({ sistema, instruccion }) {
  if (!llmActivo()) {
    throw new Error('Falta GEMINI_API_KEY en el archivo .env.')
  }

  let ultimo = null

  for (const modelo of MODELOS) {
    for (let intento = 0; intento < 3; intento += 1) {
      try {
        return await pedirAlModelo(modelo, sistema, instruccion)
      } catch (error) {
        ultimo = error
        const recuperable = [429, 500, 502, 503].includes(error.estado)
        if (!recuperable) break
        await esperar(1000 * (intento + 1))
      }
    }
  }

  throw ultimo ?? new Error('No se pudo contactar al modelo.')
}