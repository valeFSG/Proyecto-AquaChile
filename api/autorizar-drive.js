import http from 'node:http'
import { google } from 'googleapis'
import 'dotenv/config'

const PUERTO = 5566
const REDIRECCION = `http://localhost:${PUERTO}`

if (!process.env.DRIVE_CLIENT_ID || !process.env.DRIVE_CLIENT_SECRET) {
  console.error('\nFalta DRIVE_CLIENT_ID o DRIVE_CLIENT_SECRET en el archivo .env\n')
  process.exit(1)
}

const auth = new google.auth.OAuth2(
  process.env.DRIVE_CLIENT_ID,
  process.env.DRIVE_CLIENT_SECRET,
  REDIRECCION,
)

const url = auth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar.events',
  ],
})

const servidor = http.createServer(async (req, res) => {
  const peticion = new URL(req.url, REDIRECCION)

  if (peticion.pathname !== '/') {
    res.writeHead(404).end()
    return
  }

  const codigo = peticion.searchParams.get('code')

  // Primera visita: se redirige a Google. Así no hay que copiar un link
  // largo desde la terminal, que es donde se corta.
  if (!codigo) {
    res.writeHead(302, { Location: url }).end()
    return
  }

  try {
    const { tokens } = await auth.getToken(codigo)
    res.end('Listo. Vuelve a la terminal.')
    console.log('\nCopia esta linea en tu archivo .env:\n')
    console.log('DRIVE_REFRESH_TOKEN=' + tokens.refresh_token + '\n')
  } catch (error) {
    res.end('Error: ' + error.message)
    console.error('\nError:', error.message, '\n')
  } finally {
    servidor.close()
  }
})

servidor.listen(PUERTO, () => {
  console.log(`\nAbre en el navegador: ${REDIRECCION}\n`)
})