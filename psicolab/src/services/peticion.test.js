import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pedir } from './peticion'
import { guardarSesion, leerSesion, EVENTO_EXPIRADA } from '../lib/almacenSesion'

const responder = (status, cuerpo) =>
  vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => cuerpo })

describe('pedir', () => {
  beforeEach(() => guardarSesion({ token: 'abc', usuario: { rol: 'Jefatura' } }))
  afterEach(() => {
    vi.unstubAllGlobals()
    sessionStorage.clear()
  })

  it('manda el token en el encabezado Authorization', async () => {
    const fetch = responder(200, [])
    vi.stubGlobal('fetch', fetch)

    await pedir('/solicitudes')

    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer abc')
  })

  it('cierra la sesión cuando el API responde 401', async () => {
    vi.stubGlobal('fetch', responder(401, { error: 'Tu sesión expiró. Vuelve a iniciar sesión.' }))
    const alExpirar = vi.fn()
    window.addEventListener(EVENTO_EXPIRADA, alExpirar)

    await expect(pedir('/solicitudes')).rejects.toThrow('Tu sesión expiró')

    expect(leerSesion()).toBeNull()
    expect(alExpirar).toHaveBeenCalledOnce()
    window.removeEventListener(EVENTO_EXPIRADA, alExpirar)
  })
})
