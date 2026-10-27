-- Esquema de la base de datos del sistema psicolaboral.
-- Todos los datos de ejemplo son ficticios.

DROP TABLE IF EXISTS evaluacion;
DROP TABLE IF EXISTS solicitud;
DROP TABLE IF EXISTS candidato;

CREATE TABLE candidato (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre           TEXT NOT NULL,
  correo           TEXT NOT NULL UNIQUE,
  telefono         TEXT NOT NULL DEFAULT '',
  tipo             TEXT NOT NULL CHECK (tipo IN ('Externo', 'Interno')),
  area_actual      TEXT,
  cargo_actual     TEXT,
  antiguedad_anios INTEGER CHECK (antiguedad_anios >= 0)
);

CREATE TABLE solicitud (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  candidato_id    TEXT NOT NULL REFERENCES candidato (id),
  cargo           TEXT NOT NULL,
  familia_cargo   TEXT NOT NULL,
  analista        TEXT NOT NULL,
  nombre_cv       TEXT NOT NULL DEFAULT '',
  etapa           TEXT NOT NULL DEFAULT 'Evaluación recibida' CHECK (etapa IN (
                    'Evaluación recibida', 'Entrevista agendada', 'Entrevista realizada',
                    'Informe enviado', 'Entrevista con jefe de área', 'Contratación')),
  descartada      BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
  carpeta_id      TEXT,
  carpeta_url     TEXT
);

CREATE TABLE evaluacion (
  id            SERIAL PRIMARY KEY,
  solicitud_id  TEXT NOT NULL UNIQUE REFERENCES solicitud (id) ON DELETE CASCADE,
  fecha         DATE,
  categoria     TEXT CHECK (categoria IN (
                  'Recomendado', 'Recomendado con observaciones', 'No recomendado')),
  observaciones TEXT NOT NULL DEFAULT ''
);

INSERT INTO candidato (id, nombre, correo, telefono, tipo, area_actual, cargo_actual, antiguedad_anios) VALUES
  ('c1', 'María Fernanda Soto', 'maria.soto@correo.cl', '+56 9 8412 7730', 'Externo', NULL, NULL, NULL),
  ('c2', 'Juan Pablo Márquez', 'jp.marquez@correo.cl', '+56 9 7765 2214', 'Interno', 'Bodega', 'Auxiliar de Bodega', 4),
  ('c3', 'Ignacia Vera Muñoz', 'ignacia.vera@correo.cl', '+56 9 6238 9015', 'Externo', NULL, NULL, NULL),
  ('c4', 'Rodrigo Pinto Lagos', 'r.pinto@correo.cl', '+56 9 5590 4471', 'Interno', 'Planta 2', 'Operario de Proceso', 6);

INSERT INTO solicitud (id, candidato_id, cargo, familia_cargo, analista, nombre_cv, etapa, fecha_solicitud) VALUES
  ('1', 'c1', 'Jefe de Turno Planta', 'Operaciones', 'Camila Rojas', 'cv-maria-soto.pdf', 'Evaluación recibida', '2026-09-01'),
  ('2', 'c2', 'Analista de Compras', 'Administración', 'Camila Rojas', 'cv-jp-marquez.pdf', 'Entrevista realizada', '2026-08-28'),
  ('3', 'c3', 'Supervisor Eléctrico', 'Mantención', 'Diego Fuentes', 'cv-ignacia-vera.pdf', 'Informe enviado', '2026-08-25'),
  ('4', 'c4', 'Supervisor de Línea', 'Operaciones', 'Diego Fuentes', 'cv-rodrigo-pinto.pdf', 'Entrevista agendada', '2026-09-10');

INSERT INTO evaluacion (solicitud_id, fecha, categoria, observaciones) VALUES
  ('3', '2026-09-03', 'Recomendado', 'Buen manejo técnico y disposición al trabajo en equipo.');