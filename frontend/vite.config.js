import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [
      'all',
      'sunny-caring-production-4f3c.up.railway.app'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})