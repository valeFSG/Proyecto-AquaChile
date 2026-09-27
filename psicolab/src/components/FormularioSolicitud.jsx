import { useState } from 'react'
import { FAMILIAS } from '../data/catalogo'

const VALORES_INICIALES = {
  candidato: '',
  familiaCargo: '',
  cargo: '',
  analista: '',
}

function FormularioSolicitud({ onCrear, onCancelar }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [cv, setCv] = useState(null)
  const [errores, setErrores] = useState({})

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((previos) => ({ ...previos, [name]: value }))
  }

  function validar() {
    const nuevos = {}
    if (!valores.candidato.trim()) nuevos.candidato = 'Escribe el nombre del candidato.'
    if (!valores.familiaCargo) nuevos.familiaCargo = 'Elige una familia de cargo.'
    if (!valores.cargo.trim()) nuevos.cargo = 'Escribe el nombre del cargo.'
    if (!valores.analista.trim()) nuevos.analista = 'Indica quién solicita.'
    if (!cv) nuevos.cv = 'Adjunta el CV del candidato.'
    return nuevos
  }

  function enviar(evento) {
    evento.preventDefault()

    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    onCrear({ ...valores, cv })
    setValores(VALORES_INICIALES)
    setCv(null)
    evento.target.reset()
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <h2>Nueva solicitud</h2>

      <div className="campo">
        <label htmlFor="candidato">Nombre del candidato</label>
        <input
          id="candidato"
          name="candidato"
          value={valores.candidato}
          onChange={cambiar}
          placeholder="Nombre y apellidos"
        />
        {errores.candidato && <span className="error">{errores.candidato}</span>}
      </div>

      <div className="fila">
        <div className="campo">
          <label htmlFor="familiaCargo">Familia de cargo</label>
          <select
            id="familiaCargo"
            name="familiaCargo"
            value={valores.familiaCargo}
            onChange={cambiar}
          >
            <option value="">Selecciona una familia</option>
            {FAMILIAS.map((familia) => (
              <option key={familia.id} value={familia.nombre}>
                {familia.nombre}
              </option>
            ))}
          </select>
          {errores.familiaCargo && <span className="error">{errores.familiaCargo}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cargo">Nombre del cargo</label>
          <input
            id="cargo"
            name="cargo"
            value={valores.cargo}
            onChange={cambiar}
            placeholder="Ej: Jefe de Turno Planta"
          />
          {errores.cargo && <span className="error">{errores.cargo}</span>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="analista">Analista que solicita</label>
        <input
          id="analista"
          name="analista"
          value={valores.analista}
          onChange={cambiar}
          placeholder="Tu nombre"
        />
        {errores.analista && <span className="error">{errores.analista}</span>}
      </div>

      <div className="campo">
        <label htmlFor="cv">Curriculum vitae</label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCv(e.target.files[0] ?? null)}
        />
        {cv && <span className="ayuda">{cv.name}</span>}
        {errores.cv && <span className="error">{errores.cv}</span>}
      </div>

      <div className="acciones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="boton-primario">
          Crear solicitud
        </button>
      </div>
    </form>
  )
}

export default FormularioSolicitud