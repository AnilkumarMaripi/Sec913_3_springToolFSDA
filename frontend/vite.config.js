import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// NOTE: Python gateway is started separately in local dev
// Do NOT spawn processes here — breaks CI/CD

export default defineConfig({
  base: '/Sec913_3_springToolFSDA/',   // 👈 add this
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    port: 5173,
    allowedHosts: true
  }
})
