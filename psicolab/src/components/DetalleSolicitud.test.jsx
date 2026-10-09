import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DetalleSolicitud from './DetalleSolicitud'
import { solicitudesIniciales } from '../data/solicitudes'

const solicitud = solicitudesIniciales[0]

const renderizar = (props = {}) =>
  render(
    <DetalleSolicitud
      solicitud={solicitud}
      onCerrar={vi.fn()}
      onAvanzar={vi.fn()}
      onDescartar={vi.fn()}
      onCambiarPaso={vi.fn()}
      {...props}
    />,
  )

describe('DetalleSolicitud', () => {
  it('muestra la ruta y los tres archivos de la carpeta', () => {
    renderizar()
    expect(screen.getByText('/Evaluaciones/2026-09/maria-fernanda-soto')).toBeInTheDocument()
    expect(screen.getByText('cv-maria-soto.pdf')).toBeInTheDocument()
    expect(screen.getByText('informe-operaciones.xlsx')).toBeInTheDocument()
    expect(screen.getByText('pauta-operaciones.docx')).toBeInTheDocument()
  })

  it('llama a onAvanzar con la siguiente etapa', async () => {
    const onAvanzar = vi.fn()
    renderizar({ onAvanzar })
    await userEvent.click(screen.getByRole('button', { name: 'Avanzar a Evaluación' }))
    expect(onAvanzar).toHaveBeenCalledWith('1', 'Evaluación')
  })

  it('llama a onDescartar con el id del candidato', async () => {
    const onDescartar = vi.fn()
    renderizar({ onDescartar })
    await userEvent.click(screen.getByRole('button', { name: 'Descartar candidato' }))
    expect(onDescartar).toHaveBeenCalledWith('1')
  })
})