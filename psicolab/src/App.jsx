import { Routes, Route } from 'react-router-dom'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Candidatos from './pages/Candidatos'
import Solicitar from './pages/Solicitar'
import Informes from './pages/Informes'
import { ACCIONES } from './lib/sesion'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RutaProtegida>
            <LayoutPrincipal />
          </RutaProtegida>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidatos" element={<Candidatos />} />
        <Route path="/informes" element={<Informes />} />
        <Route
          path="/solicitar"
          element={
            <RutaProtegida permiso={ACCIONES.CREAR_SOLICITUD}>
              <Solicitar />
            </RutaProtegida>
          }
        />
      </Route>
    </Routes>
  )
}

export default App