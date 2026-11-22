# Sistema de Evaluaciones Psicolaborales — AquaChile

MVP web para la gestión del proceso de evaluación psicolaboral del área de
Reclutamiento y Selección. Centraliza candidatos, solicitudes y evaluaciones, y
automatiza la preparación documental de cada postulante: la carpeta en Google
Drive, el agendamiento de la entrevista, los avisos por correo y la redacción
del informe.

Proyecto de Vinculación con el Medio — DSY1104 Desarrollo Full Stack II, Duoc UC.

**Equipo:** Valentina Santana · Nicol González

---

## Qué hace

- Registro de solicitudes de evaluación para postulantes externos y para
  trabajadores que buscan cambiar de área o cargo.
- Tablero por etapas con el estado de cada proceso e indicadores generales.
- Ficha de candidato con edición de datos y evaluación por competencias, con
  justificación obligatoria para los niveles negativos.
- Vista de informes con filtro por resultado.
- Acceso diferenciado por rol: analista, evaluador y jefatura, validado en la API.
- Creación automática en Google Drive de la carpeta del candidato, con su
  currículum y las plantillas de informe y pauta según la familia del cargo.
- Agendamiento de la entrevista con evento en Google Calendar, incluyendo los
  antecedentes y el enlace a la carpeta.
- Aviso automático por correo al candidato y al área de reclutamiento cuando
  ingresa una solicitud.
- Redacción asistida del informe psicolaboral: el sistema propone un borrador a
  partir de las notas y los niveles por competencia, la profesional lo revisa y
  corrige en pantalla, y al aprobarlo se publica como documento editable en la
  carpeta del candidato.

## Estructura del repositorio

```
api/        Backend: Node.js + Express, base de datos e integraciones externas
psicolab/   Frontend: React + Vite + Bootstrap 5
docs/       Especificación de requisitos y documento de cobertura de testing
```

## Requisitos previos

- Node.js 20 o superior
- Una base de datos PostgreSQL (el proyecto usa Neon, que tiene plan gratuito)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/valeFSG/Proyecto-AquaChile.git
cd Proyecto-AquaChile
```

### 2. Backend

```bash
cd api
npm install
```

Crea el archivo `api/.env` tomando como base `api/.env.example`:

```
DATABASE_URL=postgresql://usuario:clave@host/basededatos?sslmode=require

JWT_SECRET=

DRIVE_CLIENT_ID=
DRIVE_CLIENT_SECRET=
DRIVE_REFRESH_TOKEN=
DRIVE_CARPETA_RAIZ=

RESEND_API_KEY=
CORREO_RECLUTAMIENTO=

GEMINI_API_KEY=
```

`DATABASE_URL` es la única obligatoria. `JWT_SECRET` firma las sesiones; para
generarla al azar, dentro de `api`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

y pegar el resultado después del `=`. Si falta, la API arranca igual, pero las
sesiones se cierran cada vez que se reinicia.

Las variables de Drive, Calendar, correo e IA son **opcionales**. Sin ellas la
aplicación funciona igual: cada servicio verifica si sus credenciales existen y,
si no, simplemente no se ofrece esa automatización. Las de Drive y Calendar son
las mismas, porque comparten el cliente de OAuth.

Para crear las tablas y cargar los datos de ejemplo:

```bash
npm run bd:iniciar
```

> Este comando **borra todo** y deja únicamente los datos de ejemplo. No lo
> ejecutes sobre una base con información que quieras conservar.

Si la base ya existe, se actualiza sin perder datos con las migraciones:

```bash
node bd/migracion-entrevista.js
node bd/migracion-informe.js
node bd/migracion-competencias.js
node bd/migracion-usuarios.js
```

Levantar el servidor:

```bash
npm run dev
```

La API queda en `http://localhost:3000`. Al arrancar informa si Drive está
conectado o apagado.

### 3. Frontend

En otra terminal:

```bash
cd psicolab
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

Opcionalmente, `psicolab/.env` admite `VITE_CORREO_DEMO` con un correo que el
formulario de solicitud trae precargado. Sirve para las demostraciones y queda
vacío si no se define.

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| analista@aquachile.demo | analista123 | Analista de Reclutamiento |
| evaluador@aquachile.demo | evaluador123 | Profesional Evaluador |
| jefatura@aquachile.demo | jefatura123 | Jefatura (solo lectura) |

Los usuarios viven en la tabla `usuario` de la base, con la contraseña guardada
solo como hash bcrypt. El login (`POST /api/login`) entrega un token JWT que
dura 8 horas; el frontend lo manda en cada petición y, si vence, vuelve al login.

La API valida el token y el permiso del rol en cada endpoint: sin token responde
401 y con un rol sin permiso responde 403. Los permisos están en
`api/permisos.js` y `psicolab/src/lib/sesion.js`.

## Pruebas

El proyecto tiene **53 pruebas automatizadas**: 32 en el frontend y 21 en la API.
El alcance, el uso de mocks y la cobertura por archivo están documentados en
[`docs/COBERTURA.md`](docs/COBERTURA.md).

Backend (la base y los servicios externos van simulados):

```bash
cd api
npm test
```

Frontend:

```bash
cd psicolab
npm test          # modo interactivo
npx vitest run    # una ejecución
npm run coverage  # con reporte de cobertura
```

## Integraciones externas (opcionales)

Las cuatro integraciones están aisladas en `api/servicios/` y ninguna bloquea la
operación principal: si fallan, el registro se crea igual y el error queda en
consola.

### Google Drive y Google Calendar

Comparten el mismo cliente de OAuth 2.0.

1. Crear un proyecto en Google Cloud y habilitar las APIs de **Google Drive** y
   **Google Calendar**.
2. Configurar la pantalla de consentimiento de OAuth y crear un cliente de tipo
   **Aplicación de escritorio**.
3. Crear en Google Drive una carpeta raíz y, dentro de ella, una subcarpeta
   llamada `Plantillas` con los archivos `informe-<familia>.xlsx` y
   `pauta-<familia>.docx`.
4. Completar `DRIVE_CLIENT_ID`, `DRIVE_CLIENT_SECRET` y `DRIVE_CARPETA_RAIZ` en
   el `.env`.
5. Obtener el token de acceso:

```bash
cd api
node autorizar-drive.js
```

Abrir `http://localhost:5566`, autorizar con la cuenta dueña de la carpeta, y
copiar la línea `DRIVE_REFRESH_TOKEN=` que imprime la terminal al `.env`.

> Mientras la aplicación de OAuth esté en modo de prueba, Google caduca el
> refresh token cada 7 días. Para renovarlo basta con volver a ejecutar
> `node autorizar-drive.js`.

Para verificar la conexión:

```bash
node quien-soy.js     # muestra con qué cuenta quedó autorizado
node probar-drive.js  # crea una carpeta y sube un archivo de prueba
```

### Correo transaccional

Se usa Resend. Completar `RESEND_API_KEY` y `CORREO_RECLUTAMIENTO` en el `.env`.

> En el plan gratuito, Resend solo entrega correos a la dirección dueña de la
> cuenta. Para las demostraciones, tanto el correo del candidato como el de
> reclutamiento deben apuntar a esa dirección.

### Redacción asistida

Se usa la API de Gemini. Obtener una clave en Google AI Studio y completar
`GEMINI_API_KEY`. Opcionalmente, `GEMINI_MODELO` permite fijar otro modelo.

El servicio reintenta ante saturación y cambia a modelos de respaldo antes de
rendirse, de modo que una caída puntual del proveedor no interrumpa la
redacción.

Para probarlo sin pasar por la interfaz:

```bash
node probar-modelos.js  # lista qué modelos responden y en cuánto tiempo
node probar-llm.js      # redacta un informe de ejemplo en la terminal
```

## Documentación

- [`docs/ERS.md`](docs/ERS.md) — Especificación de requisitos, alcance
  implementado, desviaciones respecto del anexo y funcionalidades pendientes.
- [`docs/COBERTURA.md`](docs/COBERTURA.md) — Documento de cobertura de testing:
  entorno, alcance, inventario de pruebas, uso de mocks y resultados.

## Capturas

### Inicio de sesión
![Inicio de sesión](docs/capturas/login.png)

### Dashboard
![Dashboard](docs/capturas/dashboard.png)

### Candidatos
![Candidatos](docs/capturas/candidatos.png)

### Nueva solicitud
![Nueva solicitud](docs/capturas/solicitar.png)

### Detalle de la solicitud
![Detalle](docs/capturas/detalle.png)

### Informes
![Informes](docs/capturas/informes.png)

### Carpeta generada en Google Drive
![Carpeta en Drive](docs/capturas/drive.png)

### Pruebas unitarias
![Pruebas](docs/capturas/pruebas.png)

## Consideraciones

- Todos los datos del proyecto son ficticios. No se utilizan nombres, RUT,
  teléfonos, correos ni currículums reales de candidatos o trabajadores de
  AquaChile.
- Ninguna credencial se versiona en el repositorio. `api/.env.example` documenta
  las variables necesarias, vacías.
- Los informes redactados con apoyo de inteligencia artificial son borradores:
  ninguno se publica sin revisión y aprobación de la profesional evaluadora, y
  cada documento declara su origen.
- Este MVP es un prototipo académico. No constituye un sistema productivo ni una
  herramienta oficial de reclutamiento de la empresa.