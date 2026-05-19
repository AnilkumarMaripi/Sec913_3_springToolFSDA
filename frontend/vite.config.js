import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { spawn } from 'child_process'

// Spawn the Python gateway in the background
const gatewayProcess = spawn(
  '/home/anilkumar/Documents/WORKING SB/backend/gateway/venv/bin/python3',
  ['run.py'],
  {
    cwd: '/home/anilkumar/Documents/WORKING SB/backend/gateway',
    stdio: 'inherit',
    detached: true
  }
)
gatewayProcess.unref()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})

