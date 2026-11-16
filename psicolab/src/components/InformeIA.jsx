import { useState } from 'react'

function InformeIA({ solicitud, onRedactar }) {
  const [texto, setTexto] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const hayNotas = Boolean(solicitud.observaciones?.trim())

  async function generar() {
    setError(null)
    setCargando(true)
    try {
      const { texto: borrador } = await onRedactar(solicitud.id)
      setTexto(borrador)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bloque mb-4">
      <h2 className="bloque-titulo">Informe psicolaboral</h2>

      {!hayNotas && (
        <p className="campo-ayuda mb-0">
          Para redactar el informe primero hay que registrar y guardar las
          observaciones de la entrevista.
        </p>
      )}

      {hayNotas && !texto && (
        <>
          <p className="campo-ayuda">
            Redacta un borrador a partir de las observaciones guardadas. Revísalo
            y corrígelo antes de darlo por bueno.
          </p>
          <button
            type="button"
            className="btn btn-nuevo"
            disabled={cargando}
            onClick={generar}
          >
            {cargando ? 'Redactando…' : 'Redactar borrador'}
          </button>
        </>
      )}

      {texto && (
        <>
          <label className="campo-label" htmlFor="informe">
            Borrador — edítalo libremente
          </label>
          <textarea
            id="informe"
            className="campo-input campo-area"
            rows="18"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
          />

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn-descartar"
              disabled={cargando}
              onClick={generar}
            >
              {cargando ? 'Redactando…' : 'Volver a redactar'}
            </button>
          </div>
        </>
      )}

      {error && <span className="campo-error d-block mt-2">{error}</span>}
    </div>
  )
}

export default InformeIA