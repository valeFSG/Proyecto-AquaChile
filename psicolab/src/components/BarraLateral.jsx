import { NavLink } from 'react-router-dom'
import { useSesion } from '../context/sesion'
import { ACCIONES } from '../lib/sesion'
import logo from '../assets/logo-aquachile-blanco.png'
import isotipo from '../assets/isotipo-blanco.png'

const ENLACES = [
  { to: '/', texto: 'Dashboard', exacto: true },
  { to: '/candidatos', texto: 'Candidatos' },
  { to: '/solicitar', texto: 'Solicitar', permiso: ACCIONES.CREAR_SOLICITUD },
  { to: '/informes', texto: 'Informes' },
]

function Enlaces({ enlaces }) {
  return enlaces.map((enlace) => (
    <NavLink
      key={enlace.to}
      to={enlace.to}
      end={enlace.exacto}
      className={({ isActive }) => (isActive ? 'activo' : '')}
    >
      <span className="punto" />
      {enlace.texto}
    </NavLink>
  ))
}

function BarraLateral() {
  const { usuario, puede, cerrarSesion } = useSesion()
  const visibles = ENLACES.filter((enlace) => !enlace.permiso || puede(enlace.permiso))

  return (
    <>
      <header className="superior">
        <div className="superior-fila">
          <img src={isotipo} alt="AquaChile" className="superior-isotipo" />
          <span className="superior-titulo">Psicolaboral</span>
          {usuario && (
            <button type="button" className="btn-salir ms-auto mt-0" onClick={cerrarSesion}>
              Salir
            </button>
          )}
        </div>
        <nav className="menu menu-horizontal">
          <Enlaces enlaces={visibles} />
        </nav>
      </header>

      <aside className="lateral">
        <div className="logo">
          <img src={logo} alt="AquaChile" className="logo-img" />
          <small className="logo-sub">Evaluación psicolaboral</small>
        </div>

        <nav className="menu">
          <Enlaces enlaces={visibles} />
        </nav>

        {usuario && (
          <div className="usuario-actual">
            {usuario.nombre}
            <small>{usuario.rol}</small>
            <button type="button" className="btn-salir" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default BarraLateral