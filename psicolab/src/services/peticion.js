const BASE = 'http://localhost:3000/api'

// Envoltura de fetch: lanza un error con el mensaje del servidor si la
// respuesta no fue correcta.
export async function pedir(ruta, opciones, mensajeError) {
  const respuesta = await fetch(`${BASE}${ruta}`, opciones)

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null)
    throw new Error(cuerpo?.error ?? mensajeError)
  }

  return respuesta.json()
}

export const conJson = (metodo, datos) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos),
})