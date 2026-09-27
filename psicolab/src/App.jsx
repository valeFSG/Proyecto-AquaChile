import { useState, useEffect } from 'react'
import { FILTROS } from './data/solicitudes'
import { obtenerSolicitudes, crearSolicitud } from './lib/api'
import TarjetaSolicitud from './components/TarjetaSolicitud'
import FormularioSolicitud from './components/FormularioSolicitud'
import DetalleSolicitud from './components/DetalleSolicitud'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('Todas')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
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

  async function guardarSolicitud(datos) {
    try {
      const nueva = await crearSolicitud({
        candidato: datos.candidato,
        familiaCargo: datos.familiaCargo,
        cargo: datos.cargo,
        analista: datos.analista,
        nombreCv: datos.cv?.name ?? '',
      })
      setSolicitudes((previas) => [nueva, ...previas])
      setMostrarFormulario(false)
      setFiltro('Todas')
    } catch (err) {
      setError(err.message)
    }
  }

  if (seleccionada) {
    return (
      <div className="contenedor">
        <DetalleSolicitud
          solicitud={seleccionada}
          onCerrar={() => setSeleccionada(null)}
        />
      </div>
    )
  }

  return (
    <div className="contenedor">
      <header className="cabecera">
        <div>
          <h1>Evaluación psicolaboral</h1>
          <p>{visibles.length} de {solicitudes.length} solicitudes</p>
        </div>
        <button
          type="button"
          className="boton-primario"
          onClick={() => setMostrarFormulario((v) => !v)}
        >
          {mostrarFormulario ? 'Cerrar' : 'Nueva solicitud'}
        </button>
      </header>

      {error && <p className="vacio">{error}</p>}

      {mostrarFormulario && (
        <FormularioSolicitud
          onCrear={guardarSolicitud}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      <nav className="filtros">
        {FILTROS.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={opcion === filtro ? 'filtro filtro-activo' : 'filtro'}
            onClick={() => setFiltro(opcion)}
          >
            {opcion}
          </button>
        ))}
      </nav>

      {cargando ? (
        <p className="vacio">Cargando solicitudes…</p>
      ) : visibles.length === 0 ? (
        <p className="vacio">No hay solicitudes en este estado.</p>
      ) : (
        <section className="lista">
          {visibles.map((solicitud) => (
            <TarjetaSolicitud
              key={solicitud.id}
              solicitud={solicitud}
              onAbrir={() => setSeleccionada(solicitud)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

export default App