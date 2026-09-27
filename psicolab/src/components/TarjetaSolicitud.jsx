import { ESTADOS } from '../data/solicitudes'

const CLASE_POR_ESTADO = {
  [ESTADOS.RECIBIDA]: 'tarjeta-recibida',
  [ESTADOS.PREPARADA]: 'tarjeta-preparada',
  [ESTADOS.EN_ENTREVISTA]: 'tarjeta-proceso',
  [ESTADOS.EN_ANALISIS]: 'tarjeta-proceso',
  [ESTADOS.INFORME_LISTO]: 'tarjeta-listo',
  [ESTADOS.ENVIADA]: 'tarjeta-enviada',
}

function TarjetaSolicitud({ solicitud, onAbrir }) {
  const clase = CLASE_POR_ESTADO[solicitud.estado] ?? ''

  return (
    <article className={`tarjeta ${clase}`} onClick={onAbrir}>
      <div className="tarjeta-encabezado">
        <h3>{solicitud.candidato}</h3>
        <span className="estado">{solicitud.estado}</span>
      </div>

      <p className="cargo">{solicitud.cargo}</p>

      <dl className="detalle">
        <div>
          <dt>Familia</dt>
          <dd>{solicitud.familiaCargo}</dd>
        </div>
        <div>
          <dt>Solicitó</dt>
          <dd>{solicitud.analista}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{solicitud.fechaSolicitud}</dd>
        </div>
      </dl>
    </article>
  )
}

export default TarjetaSolicitud