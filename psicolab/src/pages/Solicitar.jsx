import { useState } from 'react'
import { crearSolicitud, subirCv } from '../lib/api'
import { TIPOS } from '../data/solicitudes'
import FormularioSolicitud from '../components/FormularioSolicitud'

function Solicitar() {
  const [enviada, setEnviada] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [error, setError] = useState(null)

  async function guardarSolicitud(datos) {
    try {
      const payload = {
        tipo: datos.tipo,
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: datos.telefono,
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

      // El CV se sube aparte: si falla, la solicitud igual queda registrada.
      let problemaCv = null
      if (datos.cv) {
        try {
          await subirCv(nueva.id, datos.cv)
        } catch (err) {
          problemaCv = `La solicitud quedó registrada, pero el CV no se subió: ${err.message}`
        }
      }

      setEnviada(nueva)
      setAviso(problemaCv)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  function reiniciar() {
    setEnviada(null)
    setAviso(null)
  }

  if (enviada) {
    return (
      <div style={{ maxWidth: '36rem' }}>
        <h1 className="titulo mb-3">Solicitud enviada</h1>
        <div className="confirmacion">
          <p className="mb-2">
            La evaluación de <strong>{enviada.candidato?.nombre}</strong> quedó
            registrada como <strong>{enviada.candidato?.tipo.toLowerCase()}</strong>.
          </p>
          <p className="subtitulo mb-0">
            Postula a {enviada.cargo}, familia {enviada.familiaCargo}.
            El área de psicología será notificada.
          </p>

          {enviada.carpetaUrl && (
            <p className="mt-3 mb-0">
              <a
                className="enlace-carpeta"
                href={enviada.carpetaUrl}
                target="_blank"
                rel="noreferrer"
              >
                Abrir la carpeta en Drive
              </a>
            </p>
          )}
        </div>

        {aviso && <div className="mensaje-error mt-3">{aviso}</div>}

        <button type="button" className="btn-cancelar mt-4" onClick={reiniciar}>
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