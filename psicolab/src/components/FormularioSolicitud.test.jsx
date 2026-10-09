import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioSolicitud from './FormularioSolicitud'

const enviar = () => userEvent.click(screen.getByRole('button', { name: 'Crear solicitud' }))

describe('FormularioSolicitud', () => {
  it('muestra los errores si se envía vacío', async () => {
    render(<FormularioSolicitud onCrear={vi.fn()} onCancelar={vi.fn()} />)
    await enviar()
    expect(screen.getByText('Escribe el nombre.')).toBeInTheDocument()
    expect(screen.getByText('Escribe el RUT.')).toBeInTheDocument()
    expect(screen.getByText('Elige una familia de cargo.')).toBeInTheDocument()
    expect(screen.getByText('Escribe el cargo al que postula.')).toBeInTheDocument()
    expect(screen.getByText('Indica quién solicita.')).toBeInTheDocument()
    expect(screen.getByText('Adjunta el CV del candidato.')).toBeInTheDocument()
  })

  it('no llama a onCrear si hay errores', async () => {
    const onCrear = vi.fn()
    render(<FormularioSolicitud onCrear={onCrear} onCancelar={vi.fn()} />)
    await enviar()
    expect(onCrear).not.toHaveBeenCalled()
  })

  it('llama a onCrear con los datos cuando el formulario es válido', async () => {
    const onCrear = vi.fn()
    const usuario = userEvent.setup()
    const cv = new File(['contenido'], 'cv-maria.pdf', { type: 'application/pdf' })
    render(<FormularioSolicitud onCrear={onCrear} onCancelar={vi.fn()} />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'María Fernanda Soto')
    await usuario.type(screen.getByLabelText('RUT'), '18.452.339-1')
    await usuario.selectOptions(screen.getByLabelText('Familia de cargo'), 'Operaciones')
    await usuario.type(screen.getByLabelText('Cargo al que postula'), 'Jefe de Turno Planta')
    await usuario.type(screen.getByLabelText('Analista que solicita'), 'Camila Rojas')
    await usuario.upload(screen.getByLabelText('Curriculum vitae'), cv)
    await enviar()

    expect(onCrear).toHaveBeenCalledTimes(1)
    expect(onCrear).toHaveBeenCalledWith(
      expect.objectContaining({
        tipo: 'Externo',
        candidato: 'María Fernanda Soto',
        rut: '18.452.339-1',
        familiaCargo: 'Operaciones',
        cargo: 'Jefe de Turno Planta',
        analista: 'Camila Rojas',
        cv,
      }),
    )
  })

  it('muestra área y cargo actual solo al elegir movimiento interno', async () => {
    render(<FormularioSolicitud onCrear={vi.fn()} onCancelar={vi.fn()} />)
    expect(screen.queryByLabelText('Área actual')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Cargo actual')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Movimiento interno' }))

    expect(screen.getByLabelText('Área actual')).toBeInTheDocument()
    expect(screen.getByLabelText('Cargo actual')).toBeInTheDocument()
  })
})