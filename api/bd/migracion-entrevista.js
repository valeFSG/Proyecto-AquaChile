import { pool, bdConfigurada } from './conexion.js'

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env')
  process.exit(1)
}

try {
    await pool.query(`
    ALTER TABLE solicitud
      ADD COLUMN IF NOT EXISTS fecha_entrevista TIMESTAMP,
      ADD COLUMN IF NOT EXISTS entrevistador    TEXT,
      ADD COLUMN IF NOT EXISTS evento_url       TEXT`)

  await pool.query(`
    ALTER TABLE solicitud
      ALTER COLUMN fecha_entrevista TYPE TIMESTAMP`)

  console.log('Columnas de entrevista agregadas.')
} catch (error) {
  console.error('No se pudo migrar:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}