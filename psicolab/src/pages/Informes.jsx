import { useState, useEffect } from 'react'
import { CATEGORIAS } from '../data/solicitudes'
import { obtenerSolicitudes } from '../lib/api'

const FILTROS = ['Todas', ...Object.values(CATEGORIAS)]

const CLASE_PILL = {
  [CATEGORIAS.RECOMENDADO]: 'pill pill-ok',
  [CATEGORIAS.CON_OBSERVACIONES]: 'pill pill-obs',
  [CATEGORIAS.NO_RECOMENDADO]: 'pill pill-no',
}

function Informes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    obtenerSolicitudes()
      .then(setSolicitudes)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const evaluadas = solicitudes.filter((s) => s.categoria)

  const visibles = evaluadas
    .filter((s) => categoria === 'Todas' || s.categoria === categoria)
    .filter((s) => {
      const texto = busqueda.trim().toLowerCase()
      if (!texto) return true
      return (
        (s.candidato?.nombre ?? '').toLowerCase().includes(texto) ||
        s.cargo.toLowerCase().includes(texto)
      )
    })

  const contar = (valor) => evaluadas.filter((s) => s.categoria === valor).length

  return (
    <>
      <div className="mb-4">
        <h1 className="titulo">Informes</h1>
        <p className="subtitulo">
          {visibles.length} de {evaluadas.length} evaluaciones registradas
        </p>
      </div>

      {error && <div className="mensaje-error mb-3">{error}</div>}

      <div className="d-flex gap-4 flex-wrap align-items-end mb-4">
        <div>
          <span className="dato-label d-block mb-2">Resultado</span>
          <div className="d-flex gap-2 flex-wrap">
            {FILTROS.map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={opcion === categoria ? 'tipo-btn activo' : 'tipo-btn'}
                style={{ flex: 'none', padding: '.4rem .85rem' }}
                onClick={() => setCategoria(opcion)}
              >
                {opcion}
                {opcion !== 'Todas' && ` (${contar(opcion)})`}
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
        <p className="subtitulo text-center py-5">Cargando informes…</p>
      ) : visibles.length === 0 ? (
        <p className="subtitulo text-center py-5">
          No hay informes que coincidan.
        </p>
      ) : (
        visibles.map((s) => (
          <article key={s.id} className="bloque mb-3">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <div className="ficha-nombre">{s.candidato?.nombre ?? '—'}</div>
                <div className="ficha-cargo">
                  {s.cargo} · {s.familiaCargo}
                </div>
              </div>
              <span className={CLASE_PILL[s.categoria] ?? 'pill'}>
                {s.categoria}
              </span>
            </div>

            <p className="observaciones">
              {s.observaciones || 'Sin observaciones registradas.'}
            </p>

            <div className="d-flex gap-4 flex-wrap mt-3">
              <div>
                <div className="dato-label">Evaluado el</div>
                {s.fechaEvaluacion ?? '—'}
              </div>
              <div>
                <div className="dato-label">Analista</div>
                {s.analista}
              </div>
              <div>
                <div className="dato-label">Etapa actual</div>
                {s.descartada ? 'Descartado' : s.etapa}
              </div>
              {s.carpetaUrl && (
                <div>
                  <div className="dato-label">Documentos</div>
                  <a
                    className="enlace-carpeta"
                    href={s.carpetaUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir carpeta en Drive
                  </a>
                </div>
              )}
            </div>
          </article>
        ))
      )}
    </>
  )
}

export default Informes