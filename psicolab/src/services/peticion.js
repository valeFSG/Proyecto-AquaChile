import { borrarSesion, leerSesion, EVENTO_EXPIRADA } from '../lib/almacenSesion'

const BASE = 'http://localhost:3000/api'

// Envoltura de fetch: agrega el token y lanza un error con el mensaje del servidor
// si la respuesta no fue correcta.
export async function pedir(ruta, opciones = {}, mensajeError) {
  const token = leerSesion()?.token
  const headers = { ...opciones.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const respuesta = await fetch(`${BASE}${ruta}`, { ...opciones, headers })

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null)

    // Token vencido o inválido: se cierra la sesión y la app vuelve al login.
    if (respuesta.status === 401 && token) {
      borrarSesion()
      window.dispatchEvent(new CustomEvent(EVENTO_EXPIRADA, { detail: cuerpo?.error }))
    }

    throw new Error(cuerpo?.error ?? mensajeError)
  }

  return respuesta.json()
}

export const conJson = (metodo, datos) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos),
})
