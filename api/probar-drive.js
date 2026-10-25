import { carpetaDeCandidato, enlaceCarpeta, subirArchivo } from './drive.js'

const nombre = 'María Fernanda Soto'

const carpetaId = await carpetaDeCandidato(nombre)
console.log('Carpeta creada:', enlaceCarpeta(carpetaId))

const archivo = await subirArchivo({
  carpetaId,
  nombre: 'prueba.txt',
  tipo: 'text/plain',
  contenido: Buffer.from('Prueba de conexión del MVP psicolaboral.'),
})

console.log('Archivo subido:', archivo.webViewLink)