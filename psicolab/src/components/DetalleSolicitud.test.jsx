import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DetalleSolicitud from './DetalleSolicitud'
import { solicitudesIniciales, ETAPAS } from '../data/solicitudes'
import { candidatosIniciales } from '../data/candidatos'
import { COMPETENCIAS } from '../data/competencias'

const solicitud = { ...solicitudesIniciales[0], candidato: candidatosIniciales[0] }

const renderizar = (props = {}) =>
  render(
    <DetalleSolicitud
      solicitud={solicitud}
      onCerrar={vi.fn()}
      onAvanzar={vi.fn()}
      onAgendar={vi.fn()}
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

    it('muestra el enlace al evento cuando la entrevista está agendada', () => {
    renderizar({
      solicitud: {
        ...solicitud,
        fechaEntrevista: '2026-11-20 15:00:00',
        entrevistador: 'Camila Rojas',
        eventoUrl: 'https://calendar.google.com/event?eid=abc',
      },
    })
    expect(screen.getByText('2026-11-20 · 15:00')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Abrir el evento en Google Calendar' }),
    ).toHaveAttribute('href', 'https://calendar.google.com/event?eid=abc')
  })

  it('pide los datos de la entrevista antes de agendar', async () => {
    const onAvanzar = vi.fn()
    const onAgendar = vi.fn()
    renderizar({ onAvanzar, onAgendar })

    await userEvent.click(
      screen.getByRole('button', { name: `Avanzar a ${ETAPAS.AGENDADA}` }),
    )
    expect(onAvanzar).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Fecha'), '2026-11-20')
    await userEvent.type(screen.getByLabelText('Hora'), '15:00')
    await userEvent.type(screen.getByLabelText('Entrevistador'), 'Camila Rojas')
    await userEvent.click(
      screen.getByRole('button', { name: 'Agendar y crear evento' }),
    )

    expect(onAgendar).toHaveBeenCalledWith('1', {
      fecha: '2026-11-20',
      hora: '15:00',
      duracionMin: 60,
      entrevistador: 'Camila Rojas',
    })
  })

  it('avanza directo cuando la etapa siguiente no es la entrevista', async () => {
    const onAvanzar = vi.fn()
    renderizar({
      onAvanzar,
      solicitud: { ...solicitud, etapa: ETAPAS.REALIZADA },
    })
    await userEvent.click(
      screen.getByRole('button', { name: `Avanzar a ${ETAPAS.ENVIADA}` }),
    )
    expect(onAvanzar).toHaveBeenCalledWith('1', ETAPAS.ENVIADA)
  })

  it('llama a onDescartar con el id del candidato', async () => {
    const onDescartar = vi.fn()
    renderizar({ onDescartar })
    await userEvent.click(screen.getByRole('button', { name: 'Descartar candidato' }))
    expect(onDescartar).toHaveBeenCalledWith('1')
  })
})
describe('DetalleSolicitud · competencias', () => {
  const completar = async (nivelPrimera) => {
    fireEvent.change(screen.getByLabelText('Fecha de evaluación'), { target: { value: '2026-11-10' } })
    await userEvent.selectOptions(screen.getByLabelText('Categoría del evaluado'), 'Recomendado')
    const [primera, ...resto] = COMPETENCIAS.Operaciones
    await userEvent.selectOptions(screen.getByLabelText(primera), nivelPrimera)
    for (const nombre of resto) {
      await userEvent.selectOptions(screen.getByLabelText(nombre), 'Satisfactorio')
    }
    return primera
  }

  it('no deja guardar un nivel negativo sin justificación', async () => {
    const onGuardarEvaluacion = vi.fn()
    renderizar({ onGuardarEvaluacion })
    const primera = await completar('Por debajo de lo esperado')

    expect(screen.getByLabelText(`Justificación de ${primera}`)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Guardar evaluación' }))

    expect(screen.getByText(`Justifica el nivel de "${primera}".`)).toBeInTheDocument()
    expect(onGuardarEvaluacion).not.toHaveBeenCalled()
  })

  it('guarda sin justificación cuando los niveles son positivos', async () => {
    const onGuardarEvaluacion = vi.fn()
    renderizar({ onGuardarEvaluacion })
    const primera = await completar('Destacado')

    expect(screen.queryByLabelText(`Justificación de ${primera}`)).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Guardar evaluación' }))

    const [, datos] = onGuardarEvaluacion.mock.calls[0]
    expect(datos.competencias).toHaveLength(5)
    expect(datos.competencias[0]).toMatchObject({ competencia: primera, nivel: 'Destacado' })
  })
})
