import { describe, it, expect } from 'vitest'
import { valorar } from './valoracion'

const nivel = (nivel) => ({ competencia: 'X', nivel })

describe('valorar', () => {
  it('promedia los niveles asignados', () => {
    expect(valorar([
      nivel('Satisfactorio'),
      nivel('Por debajo de lo esperado'),
      nivel('Satisfactorio'),
      nivel('En desarrollo'),
      nivel('Destacado'),
    ])).toEqual({ porcentaje: 65, evaluadas: 5 })
  })

  it('da 100 cuando todas están destacadas', () => {
    expect(valorar([nivel('Destacado'), nivel('Destacado')]))
      .toEqual({ porcentaje: 100, evaluadas: 2 })
  })

  it('ignora las competencias sin nivel', () => {
    expect(valorar([nivel('Destacado'), nivel(''), nivel('Satisfactorio')]))
      .toEqual({ porcentaje: 88, evaluadas: 2 })
  })

  it('devuelve null si no hay ninguna evaluada', () => {
    expect(valorar([])).toBeNull()
    expect(valorar()).toBeNull()
    expect(valorar([nivel('')])).toBeNull()
  })
})