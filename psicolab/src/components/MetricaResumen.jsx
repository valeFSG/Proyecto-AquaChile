function MetricaResumen({ etiqueta, valor, nota, color = 'cian', pequeno = false }) {
  return (
    <div className={`metrica m-${color}`}>
      <div className="metrica-label">{etiqueta}</div>
      <div
        className="metrica-valor"
        style={pequeno ? { fontSize: '1.25rem', paddingTop: '.5rem' } : undefined}
      >
        {valor}
      </div>
      {nota && <div className="metrica-nota">{nota}</div>}
    </div>
  )
}

export default MetricaResumen