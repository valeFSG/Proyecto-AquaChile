import { planificarCarpeta } from '../lib/carpeta'

function DetalleSolicitud({ solicitud, onCerrar }) {
  const { carpeta, archivos } = planificarCarpeta(solicitud)

  return (
    <div className="panel">
      <div className="panel-cabecera">
        <div>
          <h2>{solicitud.candidato}</h2>
          <p className="cargo">{solicitud.cargo} · {solicitud.familiaCargo}</p>
        </div>
        <button type="button" className="boton-secundario" onClick={onCerrar}>
          Volver
        </button>
      </div>

      <section className="bloque">
        <h3>Carpeta de trabajo</h3>
        <p className="ruta">{carpeta}</p>

        <ul className="archivos">
          {archivos.map((archivo) => (
            <li key={archivo.nombre}>
              <span className="archivo-nombre">{archivo.nombre}</span>
              <span className="archivo-tipo">{archivo.tipo}</span>
              <span className="archivo-origen">{archivo.origen}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default DetalleSolicitud