import { useState } from 'react'
import { FAMILIAS } from '../data/catalogo'
import { TIPOS } from '../data/solicitudes'

const VALORES_INICIALES = {
  tipo: TIPOS.EXTERNO,
  candidato: '',
  rut: '',
  familiaCargo: '',
  cargo: '',
  analista: '',
  areaActual: '',
  cargoActual: '',
  antiguedadAnios: '',
}

function FormularioSolicitud({ onCrear, onCancelar }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [cv, setCv] = useState(null)
  const [errores, setErrores] = useState({})

  const esInterno = valores.tipo === TIPOS.INTERNO

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((previos) => ({ ...previos, [name]: value }))
  }

  function validar() {
    const nuevos = {}
    if (!valores.candidato.trim()) nuevos.candidato = 'Escribe el nombre.'
    if (!valores.rut.trim()) nuevos.rut = 'Escribe el RUT.'
    if (!valores.familiaCargo) nuevos.familiaCargo = 'Elige una familia de cargo.'
    if (!valores.cargo.trim()) nuevos.cargo = 'Escribe el cargo al que postula.'
    if (!valores.analista.trim()) nuevos.analista = 'Indica quién solicita.'

    if (esInterno) {
      if (!valores.areaActual.trim()) nuevos.areaActual = 'Indica el área actual.'
      if (!valores.cargoActual.trim()) nuevos.cargoActual = 'Indica el cargo actual.'
    } else if (!cv) {
      nuevos.cv = 'Adjunta el CV del candidato.'
    }

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
    <form onSubmit={enviar} noValidate style={{ maxWidth: '46rem' }}>

      <div className="selector-tipo">
        {Object.values(TIPOS).map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={valores.tipo === opcion ? 'tipo-btn activo' : 'tipo-btn'}
            onClick={() => setValores((p) => ({ ...p, tipo: opcion }))}
          >
            {opcion === TIPOS.EXTERNO ? 'Postulante externo' : 'Movimiento interno'}
          </button>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-7">
          <label className="campo-label" htmlFor="candidato">Nombre completo</label>
          <input
            id="candidato" name="candidato" className="campo-input"
            value={valores.candidato} onChange={cambiar}
            placeholder="Nombre y apellidos"
          />
          {errores.candidato && <span className="campo-error">{errores.candidato}</span>}
        </div>

        <div className="col-12 col-md-5">
          <label className="campo-label" htmlFor="rut">RUT</label>
          <input
            id="rut" name="rut" className="campo-input"
            value={valores.rut} onChange={cambiar}
            placeholder="12.345.678-9"
          />
          {errores.rut && <span className="campo-error">{errores.rut}</span>}
        </div>

        {esInterno && (
          <>
            <div className="col-12 col-md-4">
              <label className="campo-label" htmlFor="areaActual">Área actual</label>
              <input
                id="areaActual" name="areaActual" className="campo-input"
                value={valores.areaActual} onChange={cambiar}
                placeholder="Ej: Planta 2"
              />
              {errores.areaActual && <span className="campo-error">{errores.areaActual}</span>}
            </div>

            <div className="col-12 col-md-5">
              <label className="campo-label" htmlFor="cargoActual">Cargo actual</label>
              <input
                id="cargoActual" name="cargoActual" className="campo-input"
                value={valores.cargoActual} onChange={cambiar}
                placeholder="Ej: Operario de Proceso"
              />
              {errores.cargoActual && <span className="campo-error">{errores.cargoActual}</span>}
            </div>

            <div className="col-12 col-md-3">
              <label className="campo-label" htmlFor="antiguedadAnios">Años en la empresa</label>
              <input
                id="antiguedadAnios" name="antiguedadAnios" type="number" min="0"
                className="campo-input"
                value={valores.antiguedadAnios} onChange={cambiar}
                placeholder="0"
              />
            </div>
          </>
        )}

        <div className="col-12 col-md-5">
          <label className="campo-label" htmlFor="familiaCargo">Familia de cargo</label>
          <select
            id="familiaCargo" name="familiaCargo" className="campo-input"
            value={valores.familiaCargo} onChange={cambiar}
          >
            <option value="">Selecciona una familia</option>
            {FAMILIAS.map((familia) => (
              <option key={familia.id} value={familia.nombre}>{familia.nombre}</option>
            ))}
          </select>
          {errores.familiaCargo && <span className="campo-error">{errores.familiaCargo}</span>}
        </div>

        <div className="col-12 col-md-7">
          <label className="campo-label" htmlFor="cargo">Cargo al que postula</label>
          <input
            id="cargo" name="cargo" className="campo-input"
            value={valores.cargo} onChange={cambiar}
            placeholder="Ej: Jefe de Turno Planta"
          />
          {errores.cargo && <span className="campo-error">{errores.cargo}</span>}
        </div>

        <div className="col-12 col-md-6">
          <label className="campo-label" htmlFor="analista">Analista que solicita</label>
          <input
            id="analista" name="analista" className="campo-input"
            value={valores.analista} onChange={cambiar}
            placeholder="Tu nombre"
          />
          {errores.analista && <span className="campo-error">{errores.analista}</span>}
        </div>

        <div className="col-12 col-md-6">
          <label className="campo-label" htmlFor="cv">
            Curriculum vitae {esInterno && <span className="campo-opcional">opcional</span>}
          </label>
          <input
            id="cv" name="cv" type="file" accept=".pdf,.doc,.docx"
            className="campo-input"
            onChange={(e) => setCv(e.target.files[0] ?? null)}
          />
          {cv && <span className="campo-ayuda">{cv.name}</span>}
          {errores.cv && <span className="campo-error">{errores.cv}</span>}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn-cancelar" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-nuevo">
          Crear solicitud
        </button>
      </div>
    </form>
  )
}

export default FormularioSolicitud