import { TIPOS, ETAPAS } from '../data/solicitudes'

function FichaCandidato({ solicitud, onAbrir }) {
  const esInterno = solicitud.tipo === TIPOS.INTERNO
  const mostrarPaso = solicitud.etapa !== ETAPAS.CANDIDATOS

  return (
    <div className="ficha" role="button" onClick={onAbrir}>
      <div className="d-flex justify-content-between align-items-start gap-2">
        <span className="ficha-nombre">{solicitud.candidato}</span>
        <span className={esInterno ? 'pill pill-int' : 'pill pill-ext'}>
          {solicitud.tipo}
        </span>
      </div>

      <div className="ficha-cargo">{solicitud.cargo}</div>

      {esInterno && (
        <div className="ficha-extra">
          Hoy: {solicitud.cargoActual} · {solicitud.areaActual} ·{' '}
          {solicitud.antiguedadAnios} años
        </div>
      )}

      {mostrarPaso && <div className="ficha-paso">{solicitud.paso}</div>}
    </div>
  )
}

export default FichaCandidato