import pg from 'pg'
import 'dotenv/config'

// Las columnas DATE se devuelven como texto 'AAAA-MM-DD', igual que antes.
pg.types.setTypeParser(1082, (valor) => valor)
// Las columnas TIMESTAMP también, así la hora de la entrevista llega tal
// como se guardó y no cambia según la zona horaria del servidor.
pg.types.setTypeParser(1114, (valor) => valor)

const url = process.env.DATABASE_URL
const esLocal = /localhost|127\.0\.0\.1/.test(url ?? '')

// El SSL se configura abajo; se quitan estos parámetros para evitar el aviso de pg.
function sinParametrosSsl(direccion) {
  if (!direccion) return direccion
  const limpia = new URL(direccion)
  limpia.searchParams.delete('sslmode')
  limpia.searchParams.delete('channel_binding')
  return limpia.toString()
}

export const pool = new pg.Pool({
  connectionString: sinParametrosSsl(url),
  ssl: esLocal ? false : { rejectUnauthorized: false },
})

export function bdConfigurada() {
  return Boolean(url)
}