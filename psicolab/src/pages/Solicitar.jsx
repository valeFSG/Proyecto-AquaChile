import { useState } from 'react'
import { crearSolicitud } from '../lib/api'
import FormularioSolicitud from '../components/FormularioSolicitud'

function Solicitar() {
  const [enviada, setEnviada] = useState(null)
  const [error, setError] = useState(null)

  async function guardarSolicitud(datos) {
    try {
      const nueva = await crearSolicitud({
        candidato: datos.candidato,
        familiaCargo: datos.familiaCargo,
        cargo: datos.cargo,
        analista: datos.analista,
        nombreCv: datos.cv?.name ?? '',
      })
      setEnviada(nueva)
    } catch (err) {
      setError(err.message)
    }
  }

  if (enviada) {
    return (
      <div className="text-center py-5">
        <h1 className="h3 mb-3">Solicitud enviada</h1>
        <p className="text-secondary mb-4">
          La evaluación de <strong>{enviada.candidato}</strong> quedó
          registrada. El área de psicología será notificada.
        </p>
        <button
          type="button"
          className="btn btn-outline-secondary"
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
        <h1 className="h3 mb-1">Nueva solicitud de evaluación</h1>
        <p className="text-secondary mb-0">
          Completa los datos del candidato y adjunta su curriculum.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <FormularioSolicitud
        onCrear={guardarSolicitud}
        onCancelar={() => setError(null)}
      />
    </>
  )
}

export default Solicitar