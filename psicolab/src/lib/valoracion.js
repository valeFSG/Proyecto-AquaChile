const PUNTAJE = {
  Destacado: 100,
  Satisfactorio: 75,
  'En desarrollo': 50,
  'Por debajo de lo esperado': 25,
}

// Promedio de los niveles que asignó la profesional evaluadora. No lo decide
// la IA: es aritmética sobre su propia pauta, así que dos consultas al mismo
// candidato dan siempre el mismo número.
export function valorar(competencias = []) {
  const puntajes = competencias
    .map((evaluada) => PUNTAJE[evaluada.nivel])
    .filter((puntaje) => puntaje !== undefined)

  if (puntajes.length === 0) return null

  const suma = puntajes.reduce((total, puntaje) => total + puntaje, 0)
  return { porcentaje: Math.round(suma / puntajes.length), evaluadas: puntajes.length }
}