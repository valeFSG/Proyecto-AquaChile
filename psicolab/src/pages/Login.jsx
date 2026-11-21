import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/sesion'
import { CUENTAS_DEMO } from '../lib/sesion'
import logo from '../assets/logo-aquachile-blanco.png'

function Login() {
  const { usuario, aviso, iniciarSesion } = useSesion()
  const navigate = useNavigate()
  const campoClave = useRef(null)
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  async function enviar(evento) {
    evento.preventDefault()
    if (!correo.trim() || !clave) {
      setError('Ingresa tu correo y contraseña.')
      return
    }

    setError(null)
    setEnviando(true)
    try {
      await iniciarSesion(correo, clave)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  function usarDemo(demo) {
    setCorreo(demo.correo)
    setClave('')
    setError(null)
    campoClave.current?.focus()
  }

  return (
    <div className="login">
      <section className="login-marca">
        <img src={logo} alt="AquaChile" className="login-logo" />
        <p className="login-lema">
          Evaluación psicolaboral del área de Reclutamiento y Selección.
        </p>
      </section>

      <form className="login-caja" onSubmit={enviar} noValidate>
        <h1 className="titulo mb-1">Iniciar sesión</h1>
        <p className="subtitulo mb-4">Acceso exclusivo del equipo de reclutamiento.</p>

        {aviso && <span className="campo-error d-block mb-3">{aviso}</span>}

        <label className="campo-label" htmlFor="correo">Correo</label>
        <input
          id="correo" type="email" className="campo-input mb-3"
          value={correo} onChange={(e) => setCorreo(e.target.value)}
          placeholder="nombre@aquachile.demo"
        />

        <label className="campo-label" htmlFor="clave">Contraseña</label>
        <input
          id="clave" type="password" className="campo-input" ref={campoClave}
          value={clave} onChange={(e) => setClave(e.target.value)}
        />

        {error && <span className="campo-error d-block mt-2">{error}</span>}

        <button type="submit" className="btn btn-nuevo w-100 mt-4" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        <div className="login-demo">
          <span className="dato-label d-block mb-2">Cuentas de prueba</span>
          {CUENTAS_DEMO.map((demo) => (
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