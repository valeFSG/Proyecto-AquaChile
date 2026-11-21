import { pool, bdConfigurada } from './conexion.js'

if (!bdConfigurada()) {
  console.error('Falta DATABASE_URL en api/.env')
  process.exit(1)
}

// Usuarios ficticios de demostración. Solo se guarda el hash bcrypt, nunca la contraseña.
try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuario (
      id         SERIAL PRIMARY KEY,
      correo     TEXT NOT NULL UNIQUE,
      nombre     TEXT NOT NULL,
      rol        TEXT NOT NULL CHECK (rol IN (
                   'Analista de Reclutamiento', 'Profesional Evaluador', 'Jefatura')),
      clave_hash TEXT NOT NULL
    )`)

  await pool.query(`
    INSERT INTO usuario (correo, nombre, rol, clave_hash) VALUES
      ('analista@aquachile.demo', 'Camila Rojas', 'Analista de Reclutamiento',
       '$2b$10$VaoxuGLr.O3/4tMgX9oOa.TJV/JhF8IxfKPonMaZSo3jv4aDhpLPi'),
      ('evaluador@aquachile.demo', 'Paula Herrera', 'Profesional Evaluador',
       '$2b$10$WnPDMLomxavbpTu1vN137uGeEgf2zTDXWk.FIj3Th0Z3oho35OzJe'),
      ('jefatura@aquachile.demo', 'Andrés Muñoz', 'Jefatura',
       '$2b$10$85zVxDA2ttoaKIlHDelvAe5fk/BdybgLT6e.VxVDqo2UPm60odHLW')
    ON CONFLICT (correo) DO NOTHING`)

  console.log('Tabla usuario lista.')
} catch (error) {
  console.error('No se pudo migrar:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
