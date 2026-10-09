import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FichaCandidato from './FichaCandidato'
import { solicitudesIniciales } from '../data/solicitudes'

const externo = solicitudesIniciales[0]

describe('FichaCandidato', () => {
  it('muestra el candidato, el cargo y el tipo', () => {
    render(<FichaCandidato solicitud={externo} onAbrir={() => {}} />)
    expect(screen.getByText('María Fernanda Soto')).toBeInTheDocument()
    expect(screen.getByText('Jefe de Turno Planta')).toBeInTheDocument()
    expect(screen.getByText('Externo')).toBeInTheDocument()
  })

  it('llama a onAbrir al hacer clic en la ficha', async () => {
    const onAbrir = vi.fn()
    render(<FichaCandidato solicitud={externo} onAbrir={onAbrir} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onAbrir).toHaveBeenCalledTimes(1)
  })
})