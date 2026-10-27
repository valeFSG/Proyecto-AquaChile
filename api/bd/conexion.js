import pg from 'pg'
import 'dotenv/config'

// Las columnas DATE se devuelven como texto 'AAAA-MM-DD', igual que antes.
pg.types.setTypeParser(1082, (valor) => valor)

const url = process.env.DATABASE_URL
const esLocal = /localhost|127\.0\.0\.1/.test(url ?? '')

export const pool = new pg.Pool({
  connectionString: url,
  ssl: esLocal ? false : { rejectUnauthorized: false },
})

export function bdConfigurada() {
  return Boolean(url)
}