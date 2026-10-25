import { google } from 'googleapis'
import 'dotenv/config'

const auth = new google.auth.OAuth2(
  process.env.DRIVE_CLIENT_ID,
  process.env.DRIVE_CLIENT_SECRET,
)

auth.setCredentials({ refresh_token: process.env.DRIVE_REFRESH_TOKEN })

const drive = google.drive({ version: 'v3', auth })
const { data } = await drive.about.get({ fields: 'user, storageQuota' })

const gb = (bytes) => Math.round((Number(bytes) / 1e9) * 100) / 100

console.log('\nCuenta autorizada:', data.user.emailAddress)
console.log('Espacio usado:', gb(data.storageQuota.usage), 'GB')
console.log('Espacio total:', data.storageQuota.limit ? gb(data.storageQuota.limit) + ' GB' : 'sin límite', '\n')