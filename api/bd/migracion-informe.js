import { pool, bdConfigurada } from './conexion.js'

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env')
  process.exit(1)
}

try {
  await pool.query(`
    ALTER TABLE solicitud
      ADD COLUMN IF NOT EXISTS informe_url TEXT`)

  console.log('Columna informe_url agregada.')
} catch (error) {
  console.error('No se pudo migrar:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}