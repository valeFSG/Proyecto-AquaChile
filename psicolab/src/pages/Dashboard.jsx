import { useState, useEffect } from 'react'
import { ETAPAS, TIPOS, PASOS_EVALUACION } from '../data/solicitudes'
import { obtenerSolicitudes } from '../lib/api'
import MetricaResumen from '../components/MetricaResumen'
import ColumnaKanban from '../components/ColumnaKanban'
import DetalleSolicitud from '../components/DetalleSolicitud'

const COLOR_COLUMNA = {
  [ETAPAS.CANDIDATOS]: 'cian',
  [ETAPAS.EVALUACION]: 'ambar',
  [ETAPAS.CONTRATACION]: 'lima',
}

function areaConMasDemanda(solicitudes) {
  if (solicitudes.length === 0) return { nombre: '—', total: 0 }

  const conteo = {}
  for (const s of solicitudes) {
    conteo[s.familiaCargo] = (conteo[s.familiaCargo] ?? 0) + 1
  }

  const [nombre, total] = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]
  return { nombre, total }
}

function Dashboard() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    obtenerSolicitudes()
      .then((datos) => setSolicitudes(datos))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const activas = solicitudes.filter((s) => !s.descartada)
  const internos = activas.filter((s) => s.tipo === TIPOS.INTERNO)
  const aprobados = activas.filter((s) => s.paso === PASOS_EVALUACION.APROBADO)
  const area = areaConMasDemanda(activas)

  const porcentajeInternos =
    activas.length === 0 ? 0 : Math.round((internos.length / activas.length) * 100)

  if (seleccionada) {
    return (
      <DetalleSolicitud
        solicitud={seleccionada}
        onCerrar={() => setSeleccionada(null)}
      />
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="titulo">Proceso de selección</h1>
          <p className="subtitulo">
            {activas.length} candidatos activos en el pipeline
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <MetricaResumen
            etiqueta="En proceso"
            valor={activas.length}
            nota="Candidatos sin descartar"
            color="cian"
          />
        </div>
        <div className="col-6 col-xl-3">
          <MetricaResumen
            etiqueta="Movimientos internos"
            valor={internos.length}
            nota={`${porcentajeInternos}% del total`}
            color="violeta"
          />
        </div>
        <div className="col-6 col-xl-3">
          <MetricaResumen
            etiqueta="Informes aprobados"
            valor={aprobados.length}
            nota="Listos para contratación"
            color="lima"
          />
        </div>
        <div className="col-6 col-xl-3">
          <MetricaResumen
            etiqueta="Área con más demanda"
            valor={area.nombre}
            nota={`${area.total} de ${activas.length} solicitudes`}
            color="ambar"
            pequeno
          />
        </div>
      </div>

      {cargando ? (
        <p className="subtitulo text-center py-5">Cargando candidatos…</p>
      ) : (
        <div className="row g-3">
          {Object.values(ETAPAS).map((etapa) => (
            <div key={etapa} className="col-12 col-lg-4">
              <ColumnaKanban
                nombre={etapa}
                color={COLOR_COLUMNA[etapa]}
                solicitudes={activas.filter((s) => s.etapa === etapa)}
                onAbrir={setSeleccionada}
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Dashboard