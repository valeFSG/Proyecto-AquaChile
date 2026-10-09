import { useState } from 'react'
import { planificarCarpeta } from '../lib/carpeta'
import { ETAPAS, TIPOS, PASOS_EVALUACION } from '../data/solicitudes'

const SIGUIENTE_ETAPA = {
  [ETAPAS.CANDIDATOS]: ETAPAS.EVALUACION,
  [ETAPAS.EVALUACION]: ETAPAS.CONTRATACION,
}

function DetalleSolicitud({ solicitud, onCerrar, onAvanzar, onDescartar, onCambiarPaso }) {
  const [guardando, setGuardando] = useState(false)
  const { carpeta, archivos } = planificarCarpeta(solicitud)

  const esInterno = solicitud.tipo === TIPOS.INTERNO
  const siguiente = SIGUIENTE_ETAPA[solicitud.etapa]

  async function accion(fn) {
    setGuardando(true)
    try {
      await fn()
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div style={{ maxWidth: '52rem' }}>

      <button type="button" className="btn-volver" onClick={onCerrar}>
        ← Volver al dashboard
      </button>

      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mt-3 mb-4">
        <div>
          <h1 className="titulo">{solicitud.candidato}</h1>
          <p className="subtitulo">
            Postula a {solicitud.cargo} · {solicitud.familiaCargo}
          </p>
        </div>
        <span className={esInterno ? 'pill pill-int' : 'pill pill-ext'}>
          {solicitud.tipo}
        </span>
      </div>

      <div className="bloque mb-3">
        <h2 className="bloque-titulo">Datos del candidato</h2>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="dato-label">RUT</div>
            <div className="dato-valor">{solicitud.rut}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="dato-label">Solicitó</div>
            <div className="dato-valor">{solicitud.analista}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="dato-label">Fecha</div>
            <div className="dato-valor">{solicitud.fechaSolicitud}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="dato-label">Etapa</div>
            <div className="dato-valor">{solicitud.etapa}</div>
          </div>
        </div>

        {esInterno && (
          <div className="row g-3 mt-1 pt-3" style={{ borderTop: '1px solid var(--linea)' }}>
            <div className="col-6 col-md-4">
              <div className="dato-label">Área actual</div>
              <div className="dato-valor">{solicitud.areaActual}</div>
            </div>
            <div className="col-6 col-md-5">
              <div className="dato-label">Cargo actual</div>
              <div className="dato-valor">{solicitud.cargoActual}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dato-label">Antigüedad</div>
              <div className="dato-valor">{solicitud.antiguedadAnios} años</div>
            </div>
          </div>
        )}
      </div>

      <div className="bloque mb-3">
        <h2 className="bloque-titulo">Carpeta de trabajo</h2>
        <p className="ruta">{carpeta}</p>

        <div className="archivos">
          {archivos.map((archivo) => (
            <div key={archivo.nombre} className="archivo">
              <span className="archivo-nombre">{archivo.nombre}</span>
              <span className="archivo-tipo">{archivo.tipo}</span>
              <span className="archivo-origen">{archivo.origen}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bloque mb-4">
        <h2 className="bloque-titulo">Avance de la evaluación</h2>
        <div className="pasos">
          {Object.values(PASOS_EVALUACION).map((paso) => (
            <button
              key={paso}
              type="button"
              className={paso === solicitud.paso ? 'paso activo' : 'paso'}
              disabled={guardando}
              onClick={() => accion(() => onCambiarPaso(solicitud.id, paso))}
            >
              {paso}
            </button>
          ))}
        </div>
      </div>

      <div className="d-flex gap-2 flex-wrap">
        {siguiente && (
          <button
            type="button"
            className="btn btn-nuevo"
            disabled={guardando}
            onClick={() => accion(() => onAvanzar(solicitud.id, siguiente))}
          >
            Avanzar a {siguiente}
          </button>
        )}
        <button
          type="button"
          className="btn-descartar"
          disabled={guardando}
          onClick={() => accion(() => onDescartar(solicitud.id))}
        >
          Descartar candidato
        </button>
      </div>
    </div>
  )
}

export default DetalleSolicitud