const BASE = 'http://localhost:3000/api'

export async function obtenerSolicitudes() {
    const respuesta = await fetch(`${BASE}/solicitudes`)
    if (!respuesta.ok) throw new Error('No se pudieron cargar las solictudes.')
        return respuesta.json()
    }

export async function crearSolicitud(datos) {
    const respuesta = await fetch(`${BASE}/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    })
    if (!respuesta.ok) throw new Error('No se pudo crear la solicitud.')
        return respuesta.json()
}

export async function actualizarSolicitud(id, cambios) {
  const respuesta = await fetch(`${BASE}/solicitudes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios),
  })
  if (!respuesta.ok) throw new Error('No se pudo actualizar la solicitud.')
  return respuesta.json()
}