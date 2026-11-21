import { pedir, conJson } from './peticion'

export function iniciarSesion(correo, clave) {
  return pedir('/login', conJson('POST', { correo, clave }), 'No se pudo iniciar sesión.')
}
