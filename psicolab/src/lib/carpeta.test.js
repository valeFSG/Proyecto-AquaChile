import { describe, it, expect } from 'vitest'
import { normalizarNombre, planificarCarpeta } from './carpeta'

const solicitudBase = {
  candidato: 'María Fernanda Soto',
  familiaCargo: 'Operaciones',
  fechaSolicitud: '2026-09-01',
  nombreCv: 'cv-maria.pdf',
}

describe('normalizarNombre', () => {
  it('convierte el nombre a minúsculas con guiones', () => {
    expect(normalizarNombre('Juan Pablo Márquez')).toBe('juan-pablo-marquez')
  })

  it('elimina las tildes', () => {
    expect(normalizarNombre('Ignacia Vera Muñoz')).toBe('ignacia-vera-munoz')
  })
})

describe('planificarCarpeta', () => {
  it('arma la ruta con el mes de la solicitud y el nombre normalizado', () => {
    const { carpeta } = planificarCarpeta(solicitudBase)
    expect(carpeta).toBe('/Evaluaciones/2026-09/maria-fernanda-soto')
  })

  it('incluye el CV y las dos plantillas de la familia', () => {
    const { archivos } = planificarCarpeta(solicitudBase)
    expect(archivos.map((a) => a.nombre)).toEqual([
      'cv-maria.pdf',
      'informe-operaciones.xlsx',
      'pauta-operaciones.docx',
    ])
    expect(archivos.map((a) => a.tipo)).toEqual(['CV', 'Informe', 'Pauta'])
  })
})