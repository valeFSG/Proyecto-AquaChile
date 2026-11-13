import { pedir, conJson } from './peticion'

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
