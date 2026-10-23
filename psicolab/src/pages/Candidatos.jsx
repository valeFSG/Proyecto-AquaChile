import { useState, useEffect } from 'react'
import { TIPOS } from '../data/solicitudes'
import { obtenerSolicitudes, actualizarSolicitud } from '../lib/api'

const ESTADOS = ['Activos', 'Descartados', 'Todos']
const TIPO_FILTROS = ['Todos', TIPOS.EXTERNO, TIPOS.INTERNO]

function Candidatos() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [estado, setEstado] = useState('Activos')
  const [tipo, setTipo] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    obtenerSolicitudes()
      .then(setSolicitudes)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const visibles = solicitudes
    .filter((s) => {
      if (estado === 'Activos') return !s.descartada
      if (estado === 'Descartados') return s.descartada
      return true
    })
    .filter((s) => tipo === 'Todos' || s.tipo === tipo)
    .filter((s) => {
      const texto = busqueda.trim().toLowerCase()
      if (!texto) return true
      return (
        s.candidato.toLowerCase().includes(texto) ||
        s.cargo.toLowerCase().includes(texto)
      )
    })

  async function restaurar(id) {
    try {
      const actualizada = await actualizarSolicitud(id, { descartada: false })
      setSolicitudes((previas) =>
        previas.map((s) => (s.id === actualizada.id ? actualizada : s)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="titulo">Candidatos</h1>
        <p className="subtitulo">
          {visibles.length} de {solicitudes.length} registros
        </p>
      </div>

      {error && <div className="mensaje-error mb-3">{error}</div>}

      <div className="d-flex gap-4 flex-wrap align-items-end mb-4">
        <div>
          <span className="dato-label d-block mb-2">Estado</span>
          <div className="d-flex gap-2">
            {ESTADOS.map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={opcion === estado ? 'tipo-btn activo' : 'tipo-btn'}
                style={{ flex: 'none', padding: '.4rem .85rem' }}
                onClick={() => setEstado(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="dato-label d-block mb-2">Tipo</span>
          <div className="d-flex gap-2">
            {TIPO_FILTROS.map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={opcion === tipo ? 'tipo-btn activo' : 'tipo-btn'}
                style={{ flex: 'none', padding: '.4rem .85rem' }}
                onClick={() => setTipo(opcion)}
              >
                {opcion === 'Todos' ? 'Ambos' : opcion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow-1" style={{ maxWidth: '18rem' }}>
          <span className="dato-label d-block mb-2">Buscar</span>
          <input
            type="search"
            className="campo-input"
            placeholder="Nombre o cargo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {cargando ? (
        <p className="subtitulo text-center py-5">Cargando candidatos…</p>
      ) : visibles.length === 0 ? (
        <p className="subtitulo text-center py-5">
          No hay candidatos que coincidan.
        </p>
      ) : (
        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Cargo</th>
                <th>Tipo</th>
                <th>Etapa</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((s) => (
                <tr key={s.id} className={s.descartada ? 'fila-descartada' : ''}>
                  <td>{s.candidato}</td>
                  <td>{s.cargo}</td>
                  <td>
                    <span
                      className={
                        s.tipo === TIPOS.INTERNO ? 'pill pill-int' : 'pill pill-ext'
                      }
                    >
                      {s.tipo}
                    </span>
                  </td>
                  <td>{s.descartada ? 'Descartado' : s.etapa}</td>
                  <td className="text-end">
                    {s.descartada && (
                      <button
                        type="button"
                        className="btn-restaurar"
                        onClick={() => restaurar(s.id)}
                      >
                        Restaurar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Candidatos