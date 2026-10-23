import { Routes, Route } from 'react-router-dom'
import BarraLateral from './components/BarraLateral'
import Dashboard from './pages/Dashboard'
import Solicitar from './pages/Solicitar'
import Candidatos from './pages/Candidatos'

function App() {
  return (
    <div className="layout">
      <BarraLateral />
      <main className="contenido">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/solicitar" element={<Solicitar />} />
        </Routes>
      </main>
    </div>
  )
}

export default App