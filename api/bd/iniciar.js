import { readFile } from 'node:fs/promises'
import { pool, bdConfigurada } from './conexion.js'

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env')
  process.exit(1)
}

const sql = await readFile(new URL('./esquema.sql', import.meta.url), 'utf8')

try {
  await pool.query(sql)
  const { rows } = await pool.query(`
    SELECT
      (SELECT count(*) FROM candidato)  AS candidatos,
      (SELECT count(*) FROM solicitud)  AS solicitudes,
      (SELECT count(*) FROM evaluacion) AS evaluaciones`)
  console.log('Base de datos lista:', rows[0])
} catch (error) {
  console.error('No se pudo crear la base de datos:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}