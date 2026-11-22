import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      // Solo los módulos con lógica propia: la base y los servicios externos van simulados.
      include: ['index.js', 'seguridad.js', 'permisos.js', 'competencias.js'],
    },
  },
})