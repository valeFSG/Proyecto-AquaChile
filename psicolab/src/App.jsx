import { Routes, Route } from 'react-router-dom'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import Dashboard from './pages/Dashboard'
import Candidatos from './pages/Candidatos'
import Solicitar from './pages/Solicitar'

function App() {
  return (
    <Routes>
      <Route element={<LayoutPrincipal />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidatos" element={<Candidatos />} />
        <Route path="/solicitar" element={<Solicitar />} />
      </Route>
    </Routes>
  )
}

export default App