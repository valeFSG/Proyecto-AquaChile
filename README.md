# Sistema de Evaluaciones Psicolaborales — AquaChile

MVP web para la gestión del proceso de evaluación psicolaboral del área de
Reclutamiento y Selección. Centraliza candidatos, solicitudes y evaluaciones, y
automatiza la preparación de la carpeta documental de cada postulante en Google
Drive.

Proyecto de Vinculación con el Medio — DSY1104 Desarrollo Full Stack II, Duoc UC.

**Equipo:** Valentina Santana · Nicol González

---

## Qué hace

- Registro de solicitudes de evaluación para postulantes externos y para
  trabajadores que buscan cambiar de área o cargo.
- Tablero por etapas con el estado de cada proceso e indicadores generales.
- Ficha de candidato con edición de datos y registro de la evaluación.
- Vista de informes con filtro por resultado.
- Acceso diferenciado por rol: analista, evaluador y jefatura.
- Creación automática en Google Drive de la carpeta del candidato, con su
  currículum y las plantillas de informe y pauta según la familia del cargo.

## Estructura del repositorio

```
api/        Backend: Node.js + Express, base de datos e integración con Drive
psicolab/   Frontend: React + Vite + Bootstrap 5
docs/       Especificación de requisitos (ERS)
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

DRIVE_CLIENT_ID=
DRIVE_CLIENT_SECRET=
DRIVE_REFRESH_TOKEN=
DRIVE_CARPETA_RAIZ=
```

`DATABASE_URL` es obligatoria. Las cuatro variables de Drive son opcionales: sin
ellas la aplicación funciona igual, solo que no genera las carpetas.

Para crear las tablas y cargar los datos de ejemplo:

```bash
npm run bd:iniciar
```

> Este comando **borra todo** y deja únicamente los datos de ejemplo. No lo
> ejecutes sobre una base con información que quieras conservar.

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

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| analista@aquachile.demo | analista123 | Analista de Reclutamiento |
| evaluador@aquachile.demo | evaluador123 | Profesional Evaluador |
| jefatura@aquachile.demo | jefatura123 | Jefatura (solo lectura) |

La autenticación es simulada: no hay registro de usuarios ni validación contra
la base de datos. Está definida en `psicolab/src/lib/sesion.js`.

## Pruebas

```bash
cd psicolab
npm test          # modo interactivo
npx vitest run    # una ejecución
npm run coverage  # con reporte de cobertura
```

## Integración con Google Drive (opcional)

La aplicación puede crear automáticamente la carpeta de cada candidato. Para
activarla:

1. Crear un proyecto en Google Cloud y habilitar la API de Google Drive.
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

Para verificar la conexión:

```bash
node quien-soy.js     # muestra con qué cuenta quedó autorizado
node probar-drive.js  # crea una carpeta y sube un archivo de prueba
```

## Documentación

La especificación de requisitos, el alcance implementado y las funcionalidades
pendientes están en [`docs/ERS.md`](docs/ERS.md).

## Consideraciones

- Todos los datos del proyecto son ficticios. No se utilizan nombres, RUT,
  teléfonos, correos ni currículums reales de candidatos o trabajadores de
  AquaChile.
- Este MVP es un prototipo académico. No constituye un sistema productivo ni una
  herramienta oficial de reclutamiento de la empresa.