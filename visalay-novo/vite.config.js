import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toda vez que o React tentar acessar '/listar', o Vite joga para a API escondido
      '/listar': 'http://localhost:3000',
      '/registrar': 'http://localhost:3000'
    }
  }
})
