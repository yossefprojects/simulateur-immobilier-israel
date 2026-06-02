import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

function stubNodeBuiltins(): Plugin {
  return {
    name: 'stub-node-builtins',
    enforce: 'pre',
    resolveId(id: string) {
      if (id.startsWith('node:')) return '\0node-stub:' + id
    },
    load(id: string) {
      if (id.startsWith('\0node-stub:')) {
        return `
const noop = () => undefined;
const noopAsync = async () => undefined;
const handler = { get: (t, k) => typeof k === 'string' ? noop : undefined };
const proxy = new Proxy({}, handler);
export default proxy;
export const randomUUID = () => (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2));
export const promisify = () => noopAsync;
export const pipeline = noopAsync;
export const Readable = class {};
export const execFile = noop;
export { noop as rename, noop as unlink, noop as readFile, noop as writeFile, noop as mkdir, noop as stat, noop as access };
`
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const anthropicBase = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL
    || env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL
    || 'https://api.anthropic.com'

  const anthropicKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY
    || env.AI_INTEGRATIONS_ANTHROPIC_API_KEY
    || ''

  return {
    plugins: [
      stubNodeBuiltins(),
      react(),
    ],
    define: {
      __AI_BASE_URL__:    JSON.stringify(process.env.AI_INTEGRATIONS_OPENAI_BASE_URL  || env.AI_INTEGRATIONS_OPENAI_BASE_URL  || ''),
      __AI_KEY__:         JSON.stringify(process.env.AI_INTEGRATIONS_OPENAI_API_KEY   || env.AI_INTEGRATIONS_OPENAI_API_KEY   || ''),
      __ANTHROPIC_KEY__:  JSON.stringify(anthropicKey),
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      proxy: {
        '/api/claude': {
          target: anthropicBase,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/claude/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-api-key', anthropicKey)
              proxyReq.setHeader('anthropic-version', '2023-06-01')
            })
          },
        },
      },
    },
  }
})
