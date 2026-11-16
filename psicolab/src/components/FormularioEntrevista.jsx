import { useState } from 'react'

const DURACIONES = [30, 45, 60, 90]

function FormularioEntrevista({ onConfirmar, onCancelar }) {
  const [datos, setDatos] = useState({
    fecha: '',
    hora: '',
    duracionMin: 60,
    entrevistador: '',
  })
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos((previos) => ({ ...previos, [name]: value }))
  }

  async function confirmar() {
    if (!datos.fecha || !datos.hora) {
      setError('Indica la fecha y la hora de la entrevista.')
      return
    }
    if (!datos.entrevistador.trim()) {
      setError('Indica quién realizará la entrevista.')
      return
    }

    setError(null)
    setGuardando(true)
    try {
      await onConfirmar({ ...datos, entrevistador: datos.entrevistador.trim() })
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bloque mb-4">
      <h2 className="bloque-titulo">Agendar entrevista</h2>

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <label className="campo-label" htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            className="campo-input"
            value={datos.fecha}
            onChange={cambiar}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="campo-label" htmlFor="hora">Hora</label>
          <input
            id="hora"
            name="hora"
            type="time"
            className="campo-input"
            value={datos.hora}
            onChange={cambiar}
          />
        </div>

        <div className="col-6 col-md-2">
          <label className="campo-label" htmlFor="duracionMin">Duración</label>
          <select
            id="duracionMin"
            name="duracionMin"
            className="campo-input"
            value={datos.duracionMin}
            onChange={cambiar}
          >
            {DURACIONES.map((minutos) => (
              <option key={minutos} value={minutos}>{minutos} min</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="campo-label" htmlFor="entrevistador">
            Entrevistador
          </label>
          <input
            id="entrevistador"
            name="entrevistador"
            type="text"
            className="campo-input"
            value={datos.entrevistador}
            onChange={cambiar}
            placeholder="Nombre de quien evalúa"
          />
        </div>
      </div>

      {error && <span className="campo-error d-block mt-2">{error}</span>}

      <p className="campo-ayuda mt-2 mb-0">
        Se creará el evento en Google Calendar con el enlace a la carpeta del
        candidato.
      </p>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn-descartar"
          disabled={guardando}
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-nuevo"
          disabled={guardando}
          onClick={confirmar}
        >
          {guardando ? 'Agendando…' : 'Agendar y crear evento'}
        </button>
      </div>
    </div>
  )
}

export default FormularioEntrevista