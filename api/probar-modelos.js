import 'dotenv/config'

const MODELOS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3-flash-preview',
  'gemini-2.5-flash-lite',
]

for (const modelo of MODELOS) {
  const inicio = Date.now()
  try {
    const respuesta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Responde solo con la palabra: ok' }] }],
        }),
      },
    )
    const ms = Date.now() - inicio
    console.log(respuesta.ok ? `OK    ${modelo}  (${ms} ms)` : `${respuesta.status}   ${modelo}`)
  } catch (error) {
    console.log(`ERROR ${modelo}: ${error.message}`)
  }
}