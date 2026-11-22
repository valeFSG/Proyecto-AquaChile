# Especificación de Requisitos de Software

**Sistema Web para la Gestión de Evaluaciones Psicolaborales**

| | |
|---|---|
| Contraparte | AquaChile — Área de Reclutamiento y Selección |
| Asignatura | DSY1104 Desarrollo Full Stack II — Vinculación con el Medio |
| Equipo | Valentina Santana · Nicol González |
| Versión | 2.0 — 21 de noviembre de 2026 |
| Estado | Hito 2 — Integración con backend, base de datos y servicios externos |

---

## 1. Problemática

El proceso de evaluación psicolaboral del área de Reclutamiento y Selección se
apoya hoy en registros y tareas distribuidas entre distintas herramientas. Esto
obliga a repetir manualmente la creación de carpetas por candidato, la descarga
del currículum, la copia de plantillas según la familia del cargo y el traspaso
de información al informe final.

La consecuencia operativa es la falta de una visión centralizada del estado de
cada solicitud: no existe un lugar único donde consultar en qué etapa está cada
candidato, quién lo está evaluando y con qué resultado.

## 2. Objetivo

Desarrollar un MVP de aplicación web Full Stack que centralice la gestión de
candidatos, solicitudes y evaluaciones psicolaborales, y que automatice la
preparación documental asociada a cada proceso.

## 3. Alcance de esta entrega

Esta versión corresponde al **Hito 2** de la carta Gantt del anexo: frontend en
React integrado con una API REST propia, persistencia en base de datos
PostgreSQL, autenticación real por rol y pruebas automatizadas en ambas capas.

Sobre ese alcance mínimo se incorporaron cuatro integraciones con servicios
externos —Google Drive, Google Calendar, correo transaccional y un modelo de
lenguaje— descritas en la sección 6.

El despliegue en un servicio gratuito corresponde al Hito 3 (30 de noviembre al
5 de diciembre).

## 4. Usuarios del sistema

| Rol | Responsabilidad | Permisos implementados |
|---|---|---|
| Analista de Reclutamiento | Registra candidatos y genera solicitudes de evaluación | Crear solicitud, editar datos, mover etapa |
| Profesional Evaluador | Revisa antecedentes, registra la evaluación y elabora el informe | Mover etapa, registrar evaluación, redactar y subir el informe |
| Jefatura | Consulta el estado del proceso | Solo lectura |

La autenticación es real: los usuarios se guardan en la base con la contraseña
en hash (bcrypt), el inicio de sesión entrega un token firmado (JWT) y la API
valida el token y el permiso del rol en cada operación. Ver sección 7.

## 5. Requisitos funcionales

Los requisitos RF-01 a RF-13 corresponden a las operaciones mínimas definidas en
la sección 6 del anexo de requerimiento.

| ID | Requisito | Estado | Dónde se implementa |
|---|---|---|---|
| RF-01 | Registrar un candidato | Parcial | Vista Solicitar |
| RF-02 | Editar y consultar los datos principales de un candidato | Implementado | Detalle de solicitud |
| RF-03 | Visualizar un listado de candidatos | Implementado | Vista Candidatos |
| RF-04 | Crear una solicitud de evaluación asociada a un candidato | Implementado | Vista Solicitar |
| RF-05 | Registrar el cargo y la familia de cargo de la solicitud | Implementado | Vista Solicitar |
| RF-06 | Visualizar el listado de solicitudes de evaluación | Implementado | Vista Candidatos |
| RF-07 | Buscar o filtrar solicitudes mediante criterios básicos | Implementado | Candidatos e Informes |
| RF-08 | Consultar el detalle de una solicitud | Implementado | Detalle de solicitud |
| RF-09 | Asignar o registrar un profesional responsable | Implementado | Solicitar y edición |
| RF-10 | Actualizar el estado de la solicitud | Implementado | Dashboard y Candidatos |
| RF-11 | Registrar la fecha de evaluación | Implementado | Detalle de solicitud |
| RF-12 | Registrar observaciones o resultados de la evaluación | Implementado | Detalle de solicitud |
| RF-13 | Visualizar un dashboard con indicadores del proceso | Implementado | Vista Dashboard |

### RF-01: alcance parcial

Actualmente un candidato se crea únicamente como parte del registro de una
solicitud de evaluación. No existe un alta independiente de candidato sin
proceso asociado. Se implementará en la siguiente iteración.

## 6. Funcionalidades adicionales implementadas

Las siguientes capacidades exceden el alcance mínimo del anexo y se
incorporaron por su aporte directo a la problemática levantada.

| Funcionalidad | Justificación |
|---|---|
| Control de acceso por rol y por acción, validado en la API | Separa la responsabilidad del analista y la del evaluador, tal como ocurre en el proceso real, y evita que alguien opere la API sin iniciar sesión |
| Evaluación por competencias con justificación obligatoria | Cada competencia lleva un nivel; los niveles negativos exigen una justificación, para que toda evaluación desfavorable quede fundamentada |
| Distinción entre postulante externo y movimiento interno | El proceso real contempla trabajadores que postulan a otra área, con antecedentes distintos |
| Creación automática de la carpeta del candidato en Google Drive | Elimina la tarea manual descrita en la problemática |
| Carga del currículum a la carpeta del candidato | Elimina la descarga y copia manual del archivo |
| Copia automática de las plantillas según la familia del cargo | Elimina la selección y copia manual de los documentos de trabajo |
| Agendamiento de la entrevista con evento en Google Calendar | Registra la entrevista en el calendario con los antecedentes y el enlace a la carpeta del candidato, evitando coordinar por fuera del sistema |
| Notificación automática por correo al ingresar una solicitud | El candidato recibe confirmación y el área de reclutamiento queda avisada sin que nadie escriba el correo a mano |
| Redacción asistida del informe psicolaboral con inteligencia artificial | A partir de las notas de entrevista y los niveles por competencia registrados por la profesional, el sistema redacta un borrador que ella revisa y corrige en pantalla antes de subirlo como documento editable a la carpeta del candidato |
| Vista de Informes con filtro por resultado | Entrega a Jefatura una consulta propia del estado de las evaluaciones cerradas |
| Persistencia en base de datos PostgreSQL | Alcance del Hito 2 |

## 7. Desviaciones respecto del anexo

### Estados de la solicitud

El anexo sugiere Pendiente → En proceso → Finalizada. Se implementaron las seis
etapas reales utilizadas por el área: Evaluación recibida, Entrevista agendada,
Entrevista realizada, Informe enviado, Entrevista con jefe de área y
Contratación. La decisión se tomó tras revisar la captura del Planner entregada
por la contraparte, con el fin de que el tablero refleje el proceso real y no un
modelo genérico.

### Identificación del candidato

Se reemplazó el RUT por el correo electrónico como identificador único, para
reducir el tratamiento de datos personales sensibles en un prototipo académico.

### Autenticación real

El anexo permite una autenticación simulada. Se optó por una real (usuarios en
la base con contraseña en hash, token JWT y validación de permisos en la API),
porque con roles solo en el frontend cualquiera podía crear o modificar
registros llamando a la API directamente. Esto agrega la tabla `usuario`, que
es de soporte y no una entidad del negocio.

### Competencias dentro de la evaluación

Los niveles por competencia y sus justificaciones se guardan dentro de la
entidad Evaluación (columna JSONB `competencias`), para mantener las tres
entidades que pide el anexo.

El anexo no define un catálogo de competencias. Las cinco competencias por
familia de cargo fueron definidas por el equipo a partir del tipo de funciones
de cada familia, y son sustituibles si la contraparte entrega las suyas. Están
declaradas en un solo lugar por capa: `api/competencias.js` y
`psicolab/src/data/competencias.js`.

### Uso de inteligencia artificial en el informe

El anexo no contempla el uso de modelos de lenguaje. Se incorporó como apoyo a
la redacción del informe, con tres resguardos:

1. El modelo solo recibe lo que la profesional registró, y tiene prohibido
   inventar antecedentes, pruebas aplicadas o puntajes.
2. Los niveles por competencia los asigna ella; el modelo los comenta pero no
   puede modificarlos ni reinterpretarlos.
3. Ningún documento llega a la carpeta del candidato sin que ella lo revise y
   lo apruebe en pantalla.

Cada informe generado incluye al cierre una nota que declara su origen y la
necesidad de validación profesional.

### Datos de prueba

Todos los datos de candidatos, currículums y plantillas son ficticios, conforme
a la restricción del caso.

## 8. Funcionalidades pendientes

| Pendiente | Etapa prevista |
|---|---|
| Alta independiente de candidato (RF-01 completo) | Hito 3 |
| Despliegue en servicio gratuito | Hito 3 — 30 de noviembre al 5 de diciembre |
| Asistente de entrevista | Fuera del alcance obligatorio (anexo, sección 13) |

## 9. Arquitectura

React + Bootstrap 5 → API REST (Node.js + Express) → PostgreSQL, con
integraciones a Google Drive, Google Calendar, un servicio de correo
transaccional y un modelo de lenguaje, todas invocadas desde el backend.

Aplicación monolítica, conforme a la sección 11 del anexo. No se implementan
microservicios ni infraestructura distribuida.

Cada integración externa está aislada en su propio módulo dentro de
`api/servicios/` y envuelta en manejo de errores: si una falla, la operación
principal se completa igual y el fallo queda registrado en consola. Cada módulo
expone además una función que verifica si sus credenciales existen, de modo que
el sistema arranca y opera sin ninguna de ellas.

| Componente | Tecnología |
|---|---|
| Frontend | React 19 + Vite, Bootstrap 5, React Router |
| Backend | Node.js + Express (aplicación monolítica) |
| Base de datos | PostgreSQL |
| Seguridad | Contraseñas con bcrypt, sesiones con JWT |
| Pruebas | Vitest + React Testing Library (frontend), Vitest + Supertest (API) |
| Automatización documental | Google Drive API mediante OAuth 2.0 |
| Agendamiento | Google Calendar API mediante OAuth 2.0 |
| Correo transaccional | Resend |
| Redacción asistida | Modelo de lenguaje Gemini vía API REST |

## 10. Modelo de datos

Tres entidades del negocio, conforme a la sección 7 del anexo, más una tabla de
usuarios para la autenticación.

| Entidad | Atributos principales |
|---|---|
| Candidato | Nombre, correo, teléfono, tipo, área y cargo actual, antigüedad |
| Solicitud | Candidato asociado, cargo, familia de cargo, analista, CV, etapa, fecha, carpeta en Drive, fecha y entrevistador de la entrevista, evento de calendario, informe en Drive |
| Evaluación | Solicitud asociada, fecha, categoría del resultado, notas de la entrevista (columna `observaciones`), competencias con su nivel y justificación |
| Usuario (soporte) | Correo, nombre, rol, hash de la contraseña |

## 11. Flujo principal

Registro de candidato → Creación de solicitud → Preparación automática de la
carpeta y aviso por correo → Agendamiento de la entrevista con evento en
calendario → Registro de la evaluación por competencias → Redacción, revisión y
publicación del informe → Actualización de estado → Consulta de información.

Este flujo es demostrable de principio a fin en la versión actual.

## 12. Correspondencia con la problemática

| Problema levantado | Solución implementada |
|---|---|
| Información dispersa entre herramientas | Sistema único con candidatos, solicitudes y evaluaciones centralizados |
| Sin visión del estado de cada solicitud | Tablero por etapas con indicadores y filtros |
| Creación manual de la carpeta del candidato | Carpeta generada automáticamente al registrar la solicitud |
| Descarga y copia manual del currículum | CV cargado automáticamente en la carpeta |
| Copia manual de plantillas según el cargo | Informe y pauta copiados según la familia del cargo |
| Coordinación de la entrevista por fuera del sistema | Evento creado en Google Calendar al agendar, con los antecedentes y el enlace a la carpeta |
| Avisos manuales al candidato y a reclutamiento | Correos enviados automáticamente al ingresar la solicitud |
| Traspaso manual al informe final | Borrador redactado desde las notas y los niveles por competencia, revisado por la profesional y publicado en la carpeta del candidato |

## 13. Restricciones

- Todos los datos utilizados son ficticios. No se emplean nombres, RUT,
  teléfonos, correos ni currículums reales de candidatos o trabajadores de
  AquaChile.
- El MVP es un prototipo académico. No constituye un sistema productivo ni una
  herramienta oficial de reclutamiento de la empresa.
- El proyecto se desarrolla exclusivamente con herramientas gratuitas, sin
  contratación de servicios ni licencias.
- Ninguna credencial de los servicios externos se versiona en el repositorio.
  Las variables de entorno se documentan vacías en `api/.env.example`.