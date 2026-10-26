import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/sesion'
import { USUARIOS } from '../lib/sesion'

function Login() {
  const { usuario, iniciarSesion } = useSesion()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(null)

  if (usuario) return <Navigate to="/" replace />

  function enviar(evento) {
    evento.preventDefault()
    if (!correo.trim() || !clave) {
      setError('Ingresa tu correo y contraseña.')
      return
    }
    if (!iniciarSesion(correo, clave)) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    navigate('/', { replace: true })
  }

  function usarDemo(demo) {
    setCorreo(demo.correo)
    setClave(demo.clave)
    setError(null)
  }

  return (
    <div className="login">
      <form className="login-caja" onSubmit={enviar} noValidate>
        <div className="logo mb-4">
          <div className="logo-marca">AC</div>
          <div className="logo-texto">
            AquaChile
            <small>Psicolaboral</small>
          </div>
        </div>

        <h1 className="titulo mb-1">Iniciar sesión</h1>
        <p className="subtitulo mb-4">Acceso exclusivo del equipo de reclutamiento.</p>

        <label className="campo-label" htmlFor="correo">Correo</label>
        <input
          id="correo" type="email" className="campo-input mb-3"
          value={correo} onChange={(e) => setCorreo(e.target.value)}
          placeholder="nombre@aquachile.demo"
        />

        <label className="campo-label" htmlFor="clave">Contraseña</label>
        <input
          id="clave" type="password" className="campo-input"
          value={clave} onChange={(e) => setClave(e.target.value)}
        />

        {error && <span className="campo-error d-block mt-2">{error}</span>}

        <button type="submit" className="btn btn-nuevo w-100 mt-4">Ingresar</button>

        <div className="login-demo">
          <span className="dato-label d-block mb-2">Cuentas de prueba</span>
          {USUARIOS.map((demo) => (
            <button
              key={demo.correo}
              type="button"
              className="tipo-btn w-100 mb-2"
              onClick={() => usarDemo(demo)}
            >
              {demo.rol}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}

export default Login