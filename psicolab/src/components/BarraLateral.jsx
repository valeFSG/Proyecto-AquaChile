import { NavLink } from 'react-router-dom'
import { useSesion } from '../context/sesion'
import { ACCIONES } from '../lib/sesion'

const ENLACES = [
  { to: '/', texto: 'Dashboard', exacto: true },
  { to: '/candidatos', texto: 'Candidatos' },
  { to: '/solicitar', texto: 'Solicitar', permiso: ACCIONES.CREAR_SOLICITUD },
  { to: '/informes', texto: 'Informes' },
]

function BarraLateral() {
  const { usuario, puede, cerrarSesion } = useSesion()
  const visibles = ENLACES.filter((enlace) => !enlace.permiso || puede(enlace.permiso))

  return (
    <aside className="lateral">
      <div className="logo">
        <div className="logo-marca">AC</div>
        <div className="logo-texto">
          AquaChile
          <small>Psicolaboral</small>
        </div>
      </div>

      <nav className="menu">
        {visibles.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            end={enlace.exacto}
            className={({ isActive }) => (isActive ? 'activo' : '')}
          >
            <span className="punto" />
            {enlace.texto}
          </NavLink>
        ))}
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
  )
}

export default BarraLateral