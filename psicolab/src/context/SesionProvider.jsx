import { useState } from 'react'
import { SesionContext } from './sesion'
import { autenticar, puede } from '../lib/sesion'

const CLAVE = 'aquachile-sesion'

function leerGuardada() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerGuardada)

  function iniciarSesion(correo, clave) {
    const encontrado = autenticar(correo, clave)
    if (!encontrado) return false
    sessionStorage.setItem(CLAVE, JSON.stringify(encontrado))
    setUsuario(encontrado)
    return true
  }

  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE)
    setUsuario(null)
  }

  const valor = {
    usuario,
    iniciarSesion,
    cerrarSesion,
    puede: (accion) => (usuario ? puede(usuario.rol, accion) : false),
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export default SesionProvider