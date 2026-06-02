import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      __AI_BASE_URL__: JSON.stringify(env.AI_INTEGRATIONS_OPENAI_BASE_URL || ''),
      __AI_KEY__: JSON.stringify(env.AI_INTEGRATIONS_OPENAI_API_KEY || ''),
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
    },
  }
})
