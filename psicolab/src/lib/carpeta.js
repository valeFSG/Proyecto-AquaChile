import { FAMILIAS } from '../data/catalogo'

// Convierte "María Fernanda Soto" en "maria-fernanda-soto"
export function normalizarNombre(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Dada una solicitud, devuelve la carpeta y los archivos
// que el sistema debe dejar preparados.
export function planificarCarpeta(solicitud) {
  const familia = FAMILIAS.find((f) => f.nombre === solicitud.familiaCargo)
  const carpeta = `/Evaluaciones/${solicitud.fechaSolicitud.slice(0, 7)}/${normalizarNombre(solicitud.candidato)}`

  const archivos = [
    {
      nombre: solicitud.nombreCv || 'cv.pdf',
      tipo: 'CV',
      origen: 'Adjunto en la solicitud',
    },
  ]

  if (familia) {
    archivos.push(
      {
        nombre: familia.plantillaInforme,
        tipo: 'Informe',
        origen: `Plantilla de ${familia.nombre}`,
      },
      {
        nombre: familia.pautaEntrevista,
        tipo: 'Pauta',
        origen: `Plantilla de ${familia.nombre}`,
      },
    )
  }

  return { carpeta, archivos }
}