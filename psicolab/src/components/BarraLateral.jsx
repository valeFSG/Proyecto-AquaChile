import { NavLink } from 'react-router-dom'

const ENLACES = [
  { to: '/', texto: 'Dashboard', exacto: true },
  { to: '/candidatos', texto: 'Candidatos' },
  { to: '/solicitar', texto: 'Solicitar' },
  { to: '/informes', texto: 'Informes' },
]

function BarraLateral() {
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
        {ENLACES.map((enlace) => (
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
    </aside>
  )
}

export default BarraLateral