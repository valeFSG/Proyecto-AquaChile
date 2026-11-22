import { useState } from 'react'

function InformeIA({ solicitud, onRedactar, onSubir }) {
  const [texto, setTexto] = useState('')
  const [hayBorrador, setHayBorrador] = useState(false)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)

  const hayNotas = Boolean(solicitud.observaciones?.trim())

  async function generar() {
    setError(null)
    setCargando(true)
    try {
      const { texto: borrador } = await onRedactar(solicitud.id)
      setTexto(borrador)
      setHayBorrador(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function subir() {
    setError(null)
    setSubiendo(true)
    try {
      await onSubir(solicitud.id, texto)
      setTexto('')
      setHayBorrador(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="bloque mb-4">
      <h2 className="bloque-titulo">Informe psicolaboral</h2>

      {solicitud.informeUrl && (
        <p className="ruta">
          <a
            className="enlace-carpeta"
            href={solicitud.informeUrl}
            target="_blank"
            rel="noreferrer"
          >
            Abrir el informe en Drive
          </a>
        </p>
      )}

      {!hayNotas && (
        <p className="campo-ayuda mb-0">
          Para redactar el informe primero hay que registrar y guardar las
          observaciones de la entrevista.
        </p>
      )}

      {hayNotas && !hayBorrador && (
        <>
          <p className="campo-ayuda">
            Redacta un borrador a partir de las observaciones guardadas. Revísalo
            y corrígelo antes de subirlo a la carpeta del candidato.
          </p>
          <button
            type="button"
            className="btn btn-nuevo"
            disabled={cargando}
            onClick={generar}
          >
            {cargando ? 'Redactando…' : solicitud.informeUrl ? 'Redactar otra versión' : 'Redactar borrador'}
          </button>
        </>
      )}

      {hayBorrador && (
        <>
          <label className="campo-label" htmlFor="informe">
            Borrador — edítalo libremente antes de subirlo
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
              disabled={cargando || subiendo}
              onClick={generar}
            >
              {cargando ? 'Redactando…' : 'Volver a redactar'}
            </button>
            <button
              type="button"
              className="btn btn-nuevo"
              disabled={cargando || subiendo || !texto.trim()}
              onClick={subir}
            >
              {subiendo ? 'Subiendo…' : 'Guardar en Drive'}
            </button>
          </div>
        </>
      )}

      {error && <span className="campo-error d-block mt-2">{error}</span>}
    </div>
  )
}

export default InformeIA