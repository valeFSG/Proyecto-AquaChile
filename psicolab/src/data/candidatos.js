import { TIPOS } from './solicitudes'

export const candidatosIniciales = [
  {
    id: 'c1',
    nombre: 'María Fernanda Soto',
    correo: 'maria.soto@correo.cl',
    telefono: '+56 9 8412 7730',
    tipo: TIPOS.EXTERNO,
  },
  {
    id: 'c2',
    nombre: 'Juan Pablo Márquez',
    correo: 'jp.marquez@correo.cl',
    telefono: '+56 9 7765 2214',
    tipo: TIPOS.INTERNO,
    areaActual: 'Bodega',
    cargoActual: 'Auxiliar de Bodega',
    antiguedadAnios: 4,
  },
  {
    id: 'c3',
    nombre: 'Ignacia Vera Muñoz',
    correo: 'ignacia.vera@correo.cl',
    telefono: '+56 9 6238 9015',
    tipo: TIPOS.EXTERNO,
  },
  {
    id: 'c4',
    nombre: 'Rodrigo Pinto Lagos',
    correo: 'r.pinto@correo.cl',
    telefono: '+56 9 5590 4471',
    tipo: TIPOS.INTERNO,
    areaActual: 'Planta 2',
    cargoActual: 'Operario de Proceso',
    antiguedadAnios: 6,
  },
]