# Documento de cobertura de testing

**Proyecto:** Sistema web de gestión de evaluaciones psicolaborales — AquaChile
**Asignatura:** DSY1104 Desarrollo Full Stack II · Vinculación con el Medio
**Equipo:** Valentina Santana · Nicol González
**Repositorio:** github.com/valeFSG/Proyecto-AquaChile

---

## 1. Propósito

Este documento declara el alcance de las pruebas automatizadas del proyecto:
qué se prueba, con qué herramientas, con qué criterio se decidió qué cubrir, y
qué quedó deliberadamente fuera.

## 2. Entorno de pruebas

| Elemento | Frontend | Backend |
|---|---|---|
| Runner | Vitest | Vitest |
| Librería de pruebas | React Testing Library | Supertest |
| Entorno | jsdom | Node |
| Configuración | `psicolab/vite.config.js` | `api/vitest.config.js` |
| Archivo de setup | `psicolab/src/test/setup.js` | — |
| Comando | `npx vitest run` | `npm test` |
| Cobertura | `npm run coverage` | `npm run coverage` |

El setup de frontend carga `@testing-library/jest-dom`, que agrega los
matchers de DOM (`toBeInTheDocument`, `toHaveAttribute`).

### Por qué Vitest y no Jasmine con Karma

La rúbrica nombra Jasmine y Karma. Se usó Vitest con React Testing Library por
tres razones técnicas:

1. **Karma está descontinuado** desde abril de 2023, por decisión del equipo de
   Angular que lo mantenía.
2. **Vitest reutiliza la configuración de Vite** del proyecto. Karma exigiría
   mantener una cadena de compilación paralela para las pruebas.
3. **React Testing Library es el estándar para componentes React**, y su API de
   consultas por rol y texto accesible es la misma independiente del runner.

Los conceptos evaluados son los mismos: configuración del entorno, escritura de
pruebas unitarias, uso de dobles de prueba y análisis de cobertura.

## 3. Criterio de alcance

No se busca cobertura total, sino cubrir donde un error pasa inadvertido:

- **Lógica pura** (`lib/`): transformaciones de datos sin interfaz. Un error acá
  no se ve en pantalla hasta que rompe otra cosa.
- **Validaciones de formulario**: es donde el usuario escribe y donde un dato
  malo entra al sistema.
- **Flujos con estado y llamadas asíncronas**: redactar, corregir y subir el
  informe; agendar la entrevista. Son los que tienen más caminos posibles.
- **Reglas de negocio del API**: permisos por rol, validación de etapas y
  categorías, obligatoriedad de la justificación.

Quedan fuera las páginas (`pages/`), que son capas delgadas de composición sin
lógica propia, y los módulos de datos estáticos (`data/`).

## 4. Inventario de pruebas

### Frontend — 32 pruebas en 6 archivos

| Archivo | Pruebas | Qué verifica |
|---|---|---|
| `lib/carpeta.test.js` | 4 | Normalización de nombres a minúsculas sin tildes y armado de la carpeta con el CV y las plantillas de la familia |
| `components/FichaCandidato.test.jsx` | 2 | Render del candidato, cargo y tipo; y que el clic propague `onAbrir` |
| `components/FormularioSolicitud.test.jsx` | 4 | Errores al enviar vacío, que no llame a `onCrear` con errores, el envío válido, y los campos condicionales del movimiento interno |
| `components/DetalleSolicitud.test.jsx` | 14 | Estado sin carpeta, enlace a Drive, enlace al evento, formulario de entrevista antes de agendar, avance directo en otras etapas, descarte, la justificación obligatoria de los niveles negativos, y la edición de datos: botón oculto sin permiso, validaciones, guardado separado de candidato y solicitud, datos del movimiento interno, error del servidor y cancelación |
| `components/InformeIA.test.jsx` | 6 | Estado sin notas, borrador editable, que suba el texto corregido y no el original, los dos caminos de error, y el enlace al informe ya subido |
| `services/peticion.test.js` | 2 | Que el token viaje en el encabezado `Authorization` y que un 401 cierre la sesión |

### Backend — 21 pruebas en `api/index.test.js`

| Grupo | Pruebas | Qué verifica |
|---|---|---|
| Login y token | 4 | Token con contraseña correcta, rechazo de contraseña incorrecta, de petición sin token y de token falsificado |
| Permisos por rol | 3 | Jefatura no crea solicitudes, Evaluador no edita datos, Analista no registra evaluación |
| POST /api/solicitudes | 4 | Campos obligatorios, correo inválido, área y cargo para internos, y que la solicitud se cree aunque Drive falle |
| Recursos inexistentes | 3 | 404 al editar, mover y evaluar registros que no existen |
| PATCH /api/solicitudes/:id | 4 | Etapa y categoría inválidas, competencia negativa sin justificación, y limpieza de justificaciones en niveles positivos |
| Informe en Drive | 3 | Bloqueo antes de realizar la entrevista, subida con guardado del enlace, y rechazo al Analista |

## 5. Uso de dobles de prueba

**Frontend.** Los componentes reciben sus dependencias por props, así que las
pruebas inyectan funciones simuladas con `vi.fn()`. Para los flujos asíncronos
se usa `mockResolvedValue` y `mockRejectedValue`, lo que permite probar el
camino de error sin provocar un fallo real:

```js
const onSubir = vi.fn().mockRejectedValue(new Error('La solicitud no tiene carpeta.'))
```

**Backend.** Ninguna prueba sale a internet ni a la base de datos. Se simulan
con `vi.mock` el repositorio, Google Drive, Google Calendar, Resend, el servicio
de IA y el armado del informe (`informe.js`). Las
pruebas verifican el comportamiento del API, no el de los servicios externos.

## 6. Resultados

```
Frontend   32 pruebas · 6 archivos · todas pasan
Backend    21 pruebas · 1 archivo  · todas pasan
Total      53 pruebas
```

### Cobertura del frontend

```
Statements   89.43%  (220/246)
Branches     80.73%
Functions    91.80%
Lines        90.17%
```

| Archivo | Statements | Branches |
|---|---|---|
| `InformeIA.jsx` | 100% | 95.83% |
| `carpeta.js` | 100% | 50% |
| `FichaCandidato.jsx` | 100% | 50% |
| `DetalleSolicitud.jsx` | 88.57% | 83.16% |
| `FormularioSolicitud.jsx` | 88.46% | 81.03% |
| `peticion.js` | 87.50% | 72.72% |
| `almacenSesion.js` | 85.71% | 100% |
| `FormularioEntrevista.jsx` | 76.19% | 70% |

**Nota metodológica:** la cobertura se reporta sobre los módulos que las pruebas
ejercitan. Las páginas y los módulos de datos no aparecen en el informe porque
ninguna prueba los importa, de acuerdo con el criterio de alcance de la
sección 3.

### Cobertura del API

```
Statements   62.56%
Branches     52.70%
Functions    70.96%
Lines        63.35%
```

| Archivo | Statements | Branches |
|---|---|---|
| `permisos.js` | 100% | 50% |
| `seguridad.js` | 96.42% | 81.25% |
| `competencias.js` | 81.81% | 76.47% |
| `index.js` | 52.34% | 45.13% |

**Nota metodológica:** se midió solo sobre los módulos con lógica propia del API
(endpoints, seguridad, permisos y validación de competencias), definidos en
`api/vitest.config.js`. El repositorio de base de datos y los servicios
externos no se incluyen porque en las pruebas van simulados: medirlos daría 0%
sin aportar información.

## 7. Brechas conocidas

- **`DetalleSolicitud.jsx` (88.6%)** es el componente más grande del proyecto y
  concentra la ficha completa: edición de datos, evaluación por competencias,
  entrevista e informe. Subió desde 60% al agregar seis pruebas del modo de
  edición de datos. Lo que queda sin cubrir son mensajes de validación
  secundarios (cargo vacío, evaluación sin categoría, fecha o nivel) y el error
  del servidor al guardar la evaluación.
- **`FormularioEntrevista.jsx` (76%)** tiene sin cubrir algunas ramas de
  validación de campos vacíos.
- **`carpeta.js` y `FichaCandidato.jsx`** muestran 50% de ramas pese a tener
  100% de líneas: son ramas de valores opcionales que no cambian el resultado
  visible.
- **`api/index.js` (52%)** tiene sin probar la subida del CV, el agendamiento
  de la entrevista, la generación del informe con IA, los listados (GET), el
  renombrado de la carpeta al cambiar el nombre del candidato y el manejador de
  errores (respuestas 409 y 500). Lo cubierto son las reglas de negocio:
  validaciones, permisos y la justificación de las competencias.

## 8. Hallazgos de las pruebas

Las pruebas de `InformeIA.jsx` detectaron un defecto real antes de llegar a
producción: al borrar el contenido del borrador para reescribirlo, el cuadro de
texto desaparecía y obligaba a regenerar el informe. El componente decidía qué
mostrar según si el texto tenía contenido. Se corrigió separando el estado
"existe un borrador" del contenido del borrador.

## 9. Cómo reproducir

```bash
# Frontend
cd psicolab
npm install
npx vitest run
npm run coverage

# Backend
cd api
npm install
npm test
npm run coverage
```