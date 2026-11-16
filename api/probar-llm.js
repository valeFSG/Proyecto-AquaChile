import 'dotenv/config'
import { redactarInforme } from './informe.js'

const solicitud = {
  cargo: 'Supervisor de Línea',
  familiaCargo: 'Operaciones',
  entrevistador: 'Nicol González',
  fechaEntrevista: '2026-11-18 17:30',
  fechaEvaluacion: '2026-11-19',
  categoria: 'Recomendable con observaciones',
  observaciones: `Se presenta puntual y con buena disposición. Relata seis años
en planta, dos de ellos liderando un turno de ocho personas. Explica con claridad
cómo resolvió un atraso de producción coordinando con mantención. Le cuesta dar
retroalimentación negativa a sus pares y lo reconoce. Manejo técnico sólido del
proceso. Muestra interés genuino en crecer dentro de la empresa.`,
  candidato: {
    nombre: 'Rodrigo Pinto Lagos',
    tipo: 'Interno',
    areaActual: 'Planta 2',
    cargoActual: 'Operario de Proceso',
    antiguedadAnios: 6,
  },
}

try {
  console.log(await redactarInforme(solicitud))
} catch (error) {
  console.error('No se pudo redactar:', error.message)
  process.exitCode = 1
}