import { Navigate } from 'react-router-dom'
import { useSesion } from '../context/sesion'

function RutaProtegida({ permiso, children }) {
  const { usuario, puede } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  if (permiso && !puede(permiso)) return <Navigate to="/" replace />

  return children
}

export default RutaProtegida