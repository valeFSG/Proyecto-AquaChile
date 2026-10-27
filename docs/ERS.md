# Especificación de Requisitos de Software

**Sistema Web para la Gestión de Evaluaciones Psicolaborales**

| | |
|---|---|
| Contraparte | AquaChile — Área de Reclutamiento y Selección |
| Asignatura | DSY1104 Desarrollo Full Stack II — Vinculación con el Medio |
| Equipo | Valentina Santana · Nicol González |
| Versión | 1.0 — 27 de octubre de 2026 |
| Estado | Entrega Evaluación Parcial 2 (Hito 1 — Frontend funcional) |

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

Esta versión corresponde al **Hito 1 — Frontend funcional** definido en la carta
Gantt del anexo de requerimiento. La integración con backend y base de datos
corresponde al Hito 2 (23 al 28 de noviembre) y el despliegue al Hito 3 (30 de
noviembre al 5 de diciembre).

## 4. Usuarios del sistema

| Rol | Responsabilidad | Permisos implementados |
|---|---|---|
| Analista de Reclutamiento | Registra candidatos y genera solicitudes de evaluación | Crear solicitud, editar datos, mover etapa |
| Profesional Evaluador | Revisa antecedentes y registra el resultado de la evaluación | Mover etapa, registrar evaluación |
| Jefatura | Consulta el estado del proceso | Solo lectura |

La autenticación es simulada, conforme al anexo, que permite simplificar la
administración de identidad dentro del alcance académico.

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
| Control de acceso por rol y por acción | Separa la responsabilidad del analista y la del evaluador, tal como ocurre en el proceso real |
| Distinción entre postulante externo y movimiento interno | El proceso real contempla trabajadores que postulan a otra área, con antecedentes distintos |
| Creación automática de la carpeta del candidato en Google Drive | Elimina la tarea manual descrita en la problemática |
| Carga del currículum a la carpeta del candidato | Elimina la descarga y copia manual del archivo |
| Copia automática de las plantillas según la familia del cargo | Elimina la selección y copia manual de los documentos de trabajo |
| Vista de Informes con filtro por resultado | Entrega a Jefatura una consulta propia del estado de las evaluaciones cerradas |
| Persistencia en base de datos PostgreSQL | Adelanto del Hito 2 |

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

### Datos de prueba

Todos los datos de candidatos, currículums y plantillas son ficticios, conforme
a la restricción del caso.

## 8. Funcionalidades pendientes

| Pendiente | Etapa prevista |
|---|---|
| Alta independiente de candidato (RF-01 completo) | Hito 2 |
| Despliegue en servicio gratuito | Hito 3 — 30 de noviembre al 5 de diciembre |
| Generación automática del informe de evaluación | Fuera del alcance obligatorio (anexo, sección 13) |
| Asistente de entrevista | Fuera del alcance obligatorio (anexo, sección 13) |

## 9. Arquitectura

React + Bootstrap 5 → API REST (Node.js + Express) → PostgreSQL, con
integración a Google Drive API desde el backend.

Aplicación monolítica, conforme a la sección 11 del anexo. No se implementan
microservicios ni infraestructura distribuida.

| Componente | Tecnología |
|---|---|
| Frontend | React 19 + Vite, Bootstrap 5, React Router |
| Backend | Node.js + Express (aplicación monolítica) |
| Base de datos | PostgreSQL |
| Pruebas | Vitest + React Testing Library |
| Automatización documental | Google Drive API mediante OAuth |

## 10. Modelo de datos

Tres entidades, conforme a la sección 7 del anexo.

| Entidad | Atributos principales |
|---|---|
| Candidato | Nombre, correo, teléfono, tipo, área y cargo actual, antigüedad |
| Solicitud | Candidato asociado, cargo, familia de cargo, analista, CV, etapa, fecha, carpeta en Drive |
| Evaluación | Solicitud asociada, fecha, categoría del resultado, observaciones |

## 11. Flujo principal

Registro de candidato → Creación de solicitud → Preparación automática de la
carpeta → Gestión de la evaluación → Actualización de estado → Consulta de
información.

Este flujo es demostrable de principio a fin en la versión actual.

## 12. Correspondencia con la problemática

| Problema levantado | Solución implementada |
|---|---|
| Información dispersa entre herramientas | Sistema único con candidatos, solicitudes y evaluaciones centralizados |
| Sin visión del estado de cada solicitud | Tablero por etapas con indicadores y filtros |
| Creación manual de la carpeta del candidato | Carpeta generada automáticamente al registrar la solicitud |
| Descarga y copia manual del currículum | CV cargado automáticamente en la carpeta |
| Copia manual de plantillas según el cargo | Informe y pauta copiados según la familia del cargo |
| Traspaso manual al informe final | Pendiente: corresponde a una etapa posterior |

## 13. Restricciones

- Todos los datos utilizados son ficticios. No se emplean nombres, RUT,
  teléfonos, correos ni currículums reales de candidatos o trabajadores de
  AquaChile.
- El MVP es un prototipo académico. No constituye un sistema productivo ni una
  herramienta oficial de reclutamiento de la empresa.
- El proyecto se desarrolla exclusivamente con herramientas gratuitas, sin
  contratación de servicios ni licencias.