import { pedir, conJson } from './peticion'

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

export function subirCv(id, archivo) {
  const datos = new FormData()
  datos.append('cv', archivo)

  return pedir(
    `/solicitudes/${id}/cv`,
    { method: 'POST', body: datos },
    'No se pudo subir el CV.',
  )
}