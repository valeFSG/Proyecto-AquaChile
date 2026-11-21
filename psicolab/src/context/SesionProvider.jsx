import { useEffect, useState } from 'react'
import { SesionContext } from './sesion'
import { puede } from '../lib/sesion'
import { borrarSesion, guardarSesion, leerSesion, EVENTO_EXPIRADA } from '../lib/almacenSesion'
import { iniciarSesion as pedirSesion } from '../services/sesion'

function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    function alExpirar(evento) {
      setUsuario(null)
      setAviso(evento.detail ?? 'Tu sesión expiró. Vuelve a iniciar sesión.')
    }
    window.addEventListener(EVENTO_EXPIRADA, alExpirar)
    return () => window.removeEventListener(EVENTO_EXPIRADA, alExpirar)
  }, [])

  async function iniciarSesion(correo, clave) {
    const { token, usuario: datos } = await pedirSesion(correo, clave)
    guardarSesion({ token, usuario: datos })
    setAviso(null)
    setUsuario(datos)
  }

  function cerrarSesion() {
    borrarSesion()
    setUsuario(null)
  }

  const valor = {
    usuario,
    aviso,
    iniciarSesion,
    cerrarSesion,
    puede: (accion) => (usuario ? puede(usuario.rol, accion) : false),
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export default SesionProvider
