import { Routes, Route, NavLink } from 'react-router-dom'
import Bandeja from './pages/Bandeja'
import Solicitar from './pages/Solicitar'

function App() {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Evaluación psicolaboral</span>
          <div className="navbar-nav">
            <NavLink className="nav-link" to="/" end>
              Bandeja
            </NavLink>
            <NavLink className="nav-link" to="/solicitar">
              Solicitar
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Bandeja />} />
          <Route path="/solicitar" element={<Solicitar />} />
        </Routes>
      </main>
    </>
  )
}

export default App