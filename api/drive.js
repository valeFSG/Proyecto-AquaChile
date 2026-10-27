import { Readable } from 'node:stream'
import { google } from 'googleapis'
import 'dotenv/config'

const CARPETA_RAIZ = process.env.DRIVE_CARPETA_RAIZ

let cliente = null

export function driveActivo() {
  return Boolean(
    process.env.DRIVE_CLIENT_ID &&
    process.env.DRIVE_CLIENT_SECRET &&
    process.env.DRIVE_REFRESH_TOKEN &&
    CARPETA_RAIZ,
  )
}

function conectar() {
  if (cliente) return cliente

  if (!driveActivo()) {
    throw new Error('Faltan variables de Drive en el archivo .env.')
  }

  const auth = new google.auth.OAuth2(
    process.env.DRIVE_CLIENT_ID,
    process.env.DRIVE_CLIENT_SECRET,
  )

  auth.setCredentials({ refresh_token: process.env.DRIVE_REFRESH_TOKEN })

  cliente = google.drive({ version: 'v3', auth })
  return cliente
}

async function buscarCarpeta(nombre, padre) {
  const seguro = nombre.replace(/'/g, "\\'")
  const { data } = await conectar().files.list({
    q: `name='${seguro}' and '${padre}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
    pageSize: 1,
  })
  return data.files?.[0]?.id ?? null
}

export async function carpetaDeCandidato(nombre) {
  const existente = await buscarCarpeta(nombre, CARPETA_RAIZ)
  if (existente) return existente

  const { data } = await conectar().files.create({
    requestBody: {
      name: nombre,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [CARPETA_RAIZ],
    },
    fields: 'id',
  })

  return data.id
}

export async function subirArchivo({ carpetaId, nombre, tipo, contenido }) {
  const { data } = await conectar().files.create({
    requestBody: { name: nombre, parents: [carpetaId] },
    media: { mimeType: tipo, body: Readable.from(contenido) },
    fields: 'id, name, webViewLink',
  })
  return data
}

export function enlaceCarpeta(id) {
  return `https://drive.google.com/drive/folders/${id}`
}

async function buscarArchivo(nombre, padre) {
  const seguro = nombre.replace(/'/g, "\\'")
  const { data } = await conectar().files.list({
    q: `name='${seguro}' and '${padre}' in parents and trashed=false`,
    fields: 'files(id)',
    pageSize: 1,
  })
  return data.files?.[0]?.id ?? null
}

// Copia las plantillas de la familia dentro de la carpeta del candidato.
export async function copiarPlantillas(nombres, carpetaId) {
  const plantillasId = await buscarCarpeta('Plantillas', CARPETA_RAIZ)
  if (!plantillasId) return []

  const copiadas = []

  for (const nombre of nombres) {
    const origen = await buscarArchivo(nombre, plantillasId)
    if (!origen) continue

    const { data } = await conectar().files.copy({
      fileId: origen,
      requestBody: { name: nombre, parents: [carpetaId] },
      fields: 'name',
    })

    copiadas.push(data.name)
  }

  return copiadas
}