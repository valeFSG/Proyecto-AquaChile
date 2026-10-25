import http from 'node:http'
import { google } from 'googleapis'
import 'dotenv/config'

const PUERTO = 5566
const REDIRECCION = `http://localhost:${PUERTO}`

const auth = new google.auth.OAuth2(
  process.env.DRIVE_CLIENT_ID,
  process.env.DRIVE_CLIENT_SECRET,
  REDIRECCION,
)

const url = auth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive'],
})

const servidor = http.createServer(async (req, res) => {
  const codigo = new URL(req.url, REDIRECCION).searchParams.get('code')

  if (!codigo) {
    res.end('Falta el codigo.')
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
  console.log('\nAbre este link en el navegador:\n')
  console.log(url + '\n')
})