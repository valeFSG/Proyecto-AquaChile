import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DetalleSolicitud from './DetalleSolicitud'
import { solicitudesIniciales, ETAPAS } from '../data/solicitudes'
import { candidatosIniciales } from '../data/candidatos'

const solicitud = { ...solicitudesIniciales[0], candidato: candidatosIniciales[0] }

const renderizar = (props = {}) =>
  render(
    <DetalleSolicitud
      solicitud={solicitud}
      onCerrar={vi.fn()}
      onAvanzar={vi.fn()}
      onDescartar={vi.fn()}
      onGuardarEvaluacion={vi.fn()}
      onGuardarDatos={vi.fn()}
      {...props}
    />,
  )

describe('DetalleSolicitud', () => {
  it('avisa cuando la solicitud todavía no tiene carpeta', () => {
    renderizar()
    expect(
      screen.getByText('Sin carpeta. Se crea al registrar la solicitud.'),
    ).toBeInTheDocument()
    expect(screen.getByText('cv-maria-soto.pdf')).toBeInTheDocument()
    expect(screen.getByText('informe-operaciones.xlsx')).toBeInTheDocument()
    expect(screen.getByText('pauta-operaciones.docx')).toBeInTheDocument()
  })

  it('muestra el enlace a Drive cuando la carpeta existe', () => {
    renderizar({
      solicitud: {
        ...solicitud,
        carpetaUrl: 'https://drive.google.com/drive/folders/abc123',
      },
    })
    const enlace = screen.getByRole('link', { name: 'María Fernanda Soto' })
    expect(enlace).toHaveAttribute(
      'href',
      'https://drive.google.com/drive/folders/abc123',
    )
  })

  it('llama a onAvanzar con la siguiente etapa', async () => {
    const onAvanzar = vi.fn()
    renderizar({ onAvanzar })
    await userEvent.click(screen.getByRole('button', { name: `Avanzar a ${ETAPAS.AGENDADA}` }))
    expect(onAvanzar).toHaveBeenCalledWith('1', ETAPAS.AGENDADA)
  })

  it('llama a onDescartar con el id del candidato', async () => {
    const onDescartar = vi.fn()
    renderizar({ onDescartar })
    await userEvent.click(screen.getByRole('button', { name: 'Descartar candidato' }))
    expect(onDescartar).toHaveBeenCalledWith('1')
  })
})