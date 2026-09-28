import { describe, it, expect } from 'vitest'
import { normalizarNombre } from './carpeta'

describe('normalizarNombre', () => {
  it('convierte el nombre a minúsculas con guiones', () => {
    expect(normalizarNombre('Juan Pablo Márquez')).toBe('juan-pablo-marquez')
  })

  it('elimina las tildes', () => {
    expect(normalizarNombre('Ignacia Vera Muñoz')).toBe('ignacia-vera-munoz')
  })
})