import { useState, useEffect } from 'react'
import { FILTROS } from '../data/solicitudes'
import { obtenerSolicitudes } from '../lib/api'
import TarjetaSolicitud from '../components/TarjetaSolicitud'
import DetalleSolicitud from '../components/DetalleSolicitud'

function Bandeja() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('Todas')
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    obtenerSolicitudes()
      .then((datos) => setSolicitudes(datos))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const visibles =
    filtro === 'Todas'
      ? solicitudes
      : solicitudes.filter((s) => s.estado === filtro)

  if (seleccionada) {
    return (
      <DetalleSolicitud
        solicitud={seleccionada}
        onCerrar={() => setSeleccionada(null)}
      />
    )
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Candidatos en evaluación</h1>
        <p className="text-secondary mb-0">
          {visibles.length} de {solicitudes.length} solicitudes
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex flex-wrap gap-2 mb-4">
        {FILTROS.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={
              opcion === filtro
                ? 'btn btn-sm btn-dark'
                : 'btn btn-sm btn-outline-secondary'
            }
            onClick={() => setFiltro(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="text-center text-secondary py-5">Cargando solicitudes…</p>
      ) : visibles.length === 0 ? (
        <p className="text-center text-secondary py-5 border rounded">
          No hay solicitudes en este estado.
        </p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {visibles.map((solicitud) => (
            <TarjetaSolicitud
              key={solicitud.id}
              solicitud={solicitud}
              onAbrir={() => setSeleccionada(solicitud)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Bandeja