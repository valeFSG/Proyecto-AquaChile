import { useState, useEffect } from 'react'
import { ETAPAS, TIPOS } from '../data/solicitudes'
import { obtenerSolicitudes, actualizarSolicitud } from '../lib/api'
import MetricaResumen from '../components/MetricaResumen'
import ColumnaKanban from '../components/ColumnaKanban'
import DetalleSolicitud from '../components/DetalleSolicitud'

const COLOR_COLUMNA = {
  [ETAPAS.RECIBIDA]: 'cian',
  [ETAPAS.AGENDADA]: 'ambar',
  [ETAPAS.REALIZADA]: 'violeta',
  [ETAPAS.ENVIADA]: 'esmeralda',
  [ETAPAS.JEFATURA]: 'rosa',
  [ETAPAS.CONTRATACION]: 'lima',
}

const ORDEN = Object.values(ETAPAS)
const posicion = (etapa) => ORDEN.indexOf(etapa)

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
      .then(setSolicitudes)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const activas = solicitudes.filter((s) => !s.descartada)
  const internos = activas.filter((s) => s.candidato?.tipo === TIPOS.INTERNO)
  const enviados = activas.filter(
  (s) => posicion(s.etapa) >= posicion(ETAPAS.ENVIADA),
)
  const area = areaConMasDemanda(activas)

  const porcentajeInternos =
    activas.length === 0 ? 0 : Math.round((internos.length / activas.length) * 100)

  function reemplazar(actualizada) {
    setSolicitudes((previas) =>
      previas.map((s) => (s.id === actualizada.id ? actualizada : s)),
    )
  }

  async function avanzar(id, etapa) {
    try {
      const actualizada = await actualizarSolicitud(id, { etapa })
      reemplazar(actualizada)
      setSeleccionada(actualizada)
    } catch (err) {
      setError(err.message)
    }
  }

  async function descartar(id) {
    try {
      const actualizada = await actualizarSolicitud(id, { descartada: true })
      reemplazar(actualizada)
      setSeleccionada(null)
    } catch (err) {
      setError(err.message)
    }
  }

  if (seleccionada) {
    return (
      <DetalleSolicitud
        solicitud={seleccionada}
        onCerrar={() => setSeleccionada(null)}
        onAvanzar={avanzar}
        onDescartar={descartar}
      />
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="titulo">Evaluaciones psicolaborales</h1>
          <p className="subtitulo">
            {activas.length} solicitudes activas
          </p>
        </div>
      </div>

      {error && <div className="mensaje-error mb-3">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <MetricaResumen
            etiqueta="En proceso"
            valor={activas.length}
            nota="Solicitudes sin descartar"
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
            etiqueta="Informes enviados"
            valor={enviados.length}
            nota="Evaluaciones completadas"
            color="lima"
          />
        </div>
        <div className="col-6 col-xl-3">
          <MetricaResumen
            etiqueta="Familia con más demanda"
            valor={area.nombre}
            nota={`${area.total} de ${activas.length} solicitudes`}
            color="ambar"
            pequeno
          />
        </div>
      </div>

      {cargando ? (
        <p className="subtitulo text-center py-5">Cargando solicitudes…</p>
      ) : (
        <div className="row g-3">
          {Object.values(ETAPAS).map((etapa) => (
              <div key={etapa} className="col-12 col-md-6 col-xl-4">
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