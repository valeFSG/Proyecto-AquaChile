import { Outlet } from 'react-router-dom'
import BarraLateral from '../components/BarraLateral'

function LayoutPrincipal() {
  return (
    <div className="layout">
      <BarraLateral />
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutPrincipal