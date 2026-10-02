import FichaCandidato from './FichaCandidato'

function ColumnaKanban({ nombre, color, solicitudes, onAbrir }) {
  return (
    <div className="columna">
      <div className="columna-cab">
        <span className="punto" style={{ color: `var(--${color})` }} />
        <span className="columna-nombre">{nombre}</span>
        <span className="columna-conteo">{solicitudes.length}</span>
      </div>

      <div className="d-flex flex-column gap-2">
        {solicitudes.length === 0 ? (
          <p className="ficha-extra text-center py-3 mb-0">Sin candidatos</p>
        ) : (
          solicitudes.map((solicitud) => (
            <FichaCandidato
              key={solicitud.id}
              solicitud={solicitud}
              onAbrir={() => onAbrir(solicitud)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ColumnaKanban