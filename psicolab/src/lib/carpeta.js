import { FAMILIAS } from '../data/catalogo'

// Convierte "María Fernanda Soto" en "maria-fernanda-soto".
// Sirve para nombrar archivos; las carpetas de Drive usan el nombre real.
export function normalizarNombre(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Nombre de la carpeta en Drive y documentos que debe contener
// según la familia del cargo.
export function planificarCarpeta(solicitud) {
  const familia = FAMILIAS.find((f) => f.nombre === solicitud.familiaCargo)
  const nombre = solicitud.candidato?.nombre ?? 'Sin nombre'

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

  return { nombre, archivos }
}