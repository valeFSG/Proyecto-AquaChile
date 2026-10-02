import { useState } from 'react'
import { crearSolicitud } from '../lib/api'
import { TIPOS } from '../data/solicitudes'
import FormularioSolicitud from '../components/FormularioSolicitud'

function Solicitar() {
  const [enviada, setEnviada] = useState(null)
  const [error, setError] = useState(null)

  async function guardarSolicitud(datos) {
    try {
      const payload = {
        tipo: datos.tipo,
        candidato: datos.candidato,
        rut: datos.rut,
        familiaCargo: datos.familiaCargo,
        cargo: datos.cargo,
        analista: datos.analista,
        nombreCv: datos.cv?.name ?? '',
      }

      if (datos.tipo === TIPOS.INTERNO) {
        payload.areaActual = datos.areaActual
        payload.cargoActual = datos.cargoActual
        payload.antiguedadAnios = datos.antiguedadAnios
      }

      const nueva = await crearSolicitud(payload)
      setEnviada(nueva)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  if (enviada) {
    return (
      <div style={{ maxWidth: '36rem' }}>
        <h1 className="titulo mb-3">Solicitud enviada</h1>
        <div className="confirmacion">
          <p className="mb-2">
            La evaluación de <strong>{enviada.candidato}</strong> quedó
            registrada como <strong>{enviada.tipo.toLowerCase()}</strong>.
          </p>
          <p className="subtitulo mb-0">
            Postula a {enviada.cargo}, familia {enviada.familiaCargo}.
            El área de psicología será notificada.
          </p>
        </div>
        <button
          type="button"
          className="btn-cancelar mt-4"
          onClick={() => setEnviada(null)}
        >
          Crear otra solicitud
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="titulo">Nueva solicitud de evaluación</h1>
        <p className="subtitulo">
          Indica si es un postulante externo o un movimiento interno.
        </p>
      </div>

      {error && <div className="mensaje-error mb-3">{error}</div>}

      <FormularioSolicitud
        onCrear={guardarSolicitud}
        onCancelar={() => setError(null)}
      />
    </>
  )
}

export default Solicitar