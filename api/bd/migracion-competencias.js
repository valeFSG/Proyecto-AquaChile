import { pool, bdConfigurada } from './conexion.js'

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env')
  process.exit(1)
}

// Las competencias van dentro de evaluacion para mantener las tres entidades del anexo.
try {
  await pool.query(`
    ALTER TABLE evaluacion
      ADD COLUMN IF NOT EXISTS competencias JSONB NOT NULL DEFAULT '[]'
      CHECK (jsonb_typeof(competencias) = 'array')`)

  console.log('Columna competencias agregada.')
} catch (error) {
  console.error('No se pudo migrar:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
