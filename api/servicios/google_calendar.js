import { google } from 'googleapis'
import 'dotenv/config'

const ZONA = 'America/Santiago'

let cliente = null

export function calendarioActivo() {
  return Boolean(
    process.env.DRIVE_CLIENT_ID &&
    process.env.DRIVE_CLIENT_SECRET &&
    process.env.DRIVE_REFRESH_TOKEN,
  )
}

function conectar() {
  if (cliente) return cliente

  if (!calendarioActivo()) {
    throw new Error('Faltan las credenciales de Google en el archivo .env.')
  }

  const auth = new google.auth.OAuth2(
    process.env.DRIVE_CLIENT_ID,
    process.env.DRIVE_CLIENT_SECRET,
  )

  auth.setCredentials({ refresh_token: process.env.DRIVE_REFRESH_TOKEN })

  cliente = google.calendar({ version: 'v3', auth })
  return cliente
}

const dosDigitos = (n) => String(n).padStart(2, '0')

// Suma minutos a una fecha y hora sin pasar por la zona horaria del
// servidor. Así la entrevista queda a la hora correcta aunque la
// aplicación se despliegue en un servidor que no esté en Chile.
function sumarMinutos(fecha, hora, minutos) {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const [hh, mm] = hora.split(':').map(Number)
  const fin = new Date(Date.UTC(anio, mes - 1, dia, hh, mm) + minutos * 60000)

  return `${fin.getUTCFullYear()}-${dosDigitos(fin.getUTCMonth() + 1)}`
    + `-${dosDigitos(fin.getUTCDate())}T${dosDigitos(fin.getUTCHours())}`
    + `:${dosDigitos(fin.getUTCMinutes())}:00`
}

// Crea el evento de la entrevista y devuelve su enlace.
export async function crearEntrevista({ solicitud, fecha, hora, duracionMin, entrevistador }) {
  const nombre = solicitud.candidato?.nombre ?? 'Candidato'

  const descripcion = [
    `Candidato: ${nombre}`,
    `Cargo: ${solicitud.cargo} · ${solicitud.familiaCargo}`,
    `Entrevistador: ${entrevistador}`,
    `Solicitada por: ${solicitud.analista}`,
    solicitud.carpetaUrl ? `\nDocumentos del candidato: ${solicitud.carpetaUrl}` : '',
  ].filter(Boolean).join('\n')

  const { data } = await conectar().events.insert({
    calendarId: 'primary',
    sendUpdates: 'none',
    requestBody: {
      summary: `Entrevista psicolaboral · ${nombre}`,
      description: descripcion,
      start: { dateTime: `${fecha}T${hora}:00`, timeZone: ZONA },
      end: { dateTime: sumarMinutos(fecha, hora, duracionMin), timeZone: ZONA },
      attendees: solicitud.candidato?.correo
        ? [{ email: solicitud.candidato.correo }]
        : [],
    },
  })

  return data.htmlLink
}