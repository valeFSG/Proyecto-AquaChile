import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InformeIA from './InformeIA'

const SOLICITUD = {
  id: '1',
  observaciones: 'Llega puntual y responde con detalle.',
}

const renderizar = (props = {}) =>
  render(
    <InformeIA
      solicitud={SOLICITUD}
      onRedactar={vi.fn()}
      onSubir={vi.fn()}
      {...props}
    />,
  )

describe('InformeIA', () => {
  it('no ofrece redactar si no hay notas de la entrevista', () => {
    renderizar({ solicitud: { id: '1', observaciones: '   ' } })

    expect(
      screen.getByText(/primero hay que registrar y guardar las observaciones/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('muestra el borrador que devuelve el servicio y lo deja editable', async () => {
    const onRedactar = vi.fn().mockResolvedValue({ texto: 'INFORME DE PRUEBA' })
    renderizar({ onRedactar })

    await userEvent.click(screen.getByRole('button', { name: 'Redactar borrador' }))

    expect(onRedactar).toHaveBeenCalledWith('1')
    expect(await screen.findByDisplayValue('INFORME DE PRUEBA')).toBeInTheDocument()
  })

  it('sube el texto corregido, no el borrador original', async () => {
    const onRedactar = vi.fn().mockResolvedValue({ texto: 'BORRADOR' })
    const onSubir = vi.fn().mockResolvedValue({})
    renderizar({ onRedactar, onSubir })

    await userEvent.click(screen.getByRole('button', { name: 'Redactar borrador' }))

    const area = await screen.findByDisplayValue('BORRADOR')
    await userEvent.clear(area)
    await userEvent.type(area, 'TEXTO CORREGIDO')

    await userEvent.click(screen.getByRole('button', { name: 'Guardar en Drive' }))

    expect(onSubir).toHaveBeenCalledWith('1', 'TEXTO CORREGIDO')
  })

  it('muestra el error del servidor sin perder el borrador', async () => {
    const onRedactar = vi.fn().mockResolvedValue({ texto: 'BORRADOR' })
    const onSubir = vi.fn().mockRejectedValue(new Error('La solicitud no tiene carpeta.'))
    renderizar({ onRedactar, onSubir })

    await userEvent.click(screen.getByRole('button', { name: 'Redactar borrador' }))
    await screen.findByDisplayValue('BORRADOR')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar en Drive' }))

    expect(await screen.findByText('La solicitud no tiene carpeta.')).toBeInTheDocument()
    expect(screen.getByDisplayValue('BORRADOR')).toBeInTheDocument()
  })

  it('avisa cuando la redacción falla', async () => {
    const onRedactar = vi.fn().mockRejectedValue(new Error('El modelo no respondió.'))
    renderizar({ onRedactar })

    await userEvent.click(screen.getByRole('button', { name: 'Redactar borrador' }))

    expect(await screen.findByText('El modelo no respondió.')).toBeInTheDocument()
  })

  it('enlaza al informe ya subido y ofrece redactar otra versión', () => {
    renderizar({
      solicitud: { ...SOLICITUD, informeUrl: 'https://docs.google.com/document/d/xyz' },
    })

    expect(
      screen.getByRole('link', { name: 'Abrir el informe en Drive' }),
    ).toHaveAttribute('href', 'https://docs.google.com/document/d/xyz')
    expect(
      screen.getByRole('button', { name: 'Redactar otra versión' }),
    ).toBeInTheDocument()
  })
})