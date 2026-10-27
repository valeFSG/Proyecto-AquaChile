const BASE = 'http://localhost:3000/api'

async function pedir(ruta, opciones, mensajeError) {
  const respuesta = await fetch(`${BASE}${ruta}`, opciones)
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null)
    throw new Error(cuerpo?.error ?? mensajeError)
  }
  return respuesta.json()
}

const conJson = (metodo, datos) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos),
})

export function obtenerSolicitudes() {
  return pedir('/solicitudes', undefined, 'No se pudieron cargar las solicitudes.')
}

export function crearSolicitud(datos) {
  return pedir('/solicitudes', conJson('POST', datos), 'No se pudo crear la solicitud.')
}

export function actualizarSolicitud(id, cambios) {
  return pedir(
    `/solicitudes/${id}`,
    conJson('PATCH', cambios),
    'No se pudo actualizar la solicitud.',
  )
}

export function obtenerCandidatos() {
  return pedir('/candidatos', undefined, 'No se pudieron cargar los candidatos.')
}

export function actualizarCandidato(id, cambios) {
  return pedir(
    `/candidatos/${id}`,
    conJson('PATCH', cambios),
    'No se pudo actualizar el candidato.',
  )
}

export function subirCv(id, archivo) {
  const datos = new FormData()
  datos.append('cv', archivo)
  return pedir(
    `/solicitudes/${id}/cv`,
    { method: 'POST', body: datos },
    'No se pudo subir el CV.',
  )
}