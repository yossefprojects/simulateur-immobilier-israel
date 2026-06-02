import express  from 'express'
import path     from 'path'
import https    from 'https'
import http     from 'http'
import { URL }  from 'url'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 5000

const ANTHROPIC_BASE = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL || 'https://api.anthropic.com'
const ANTHROPIC_KEY  = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY  || ''

app.post('/api/claude/v1/messages', (req, res) => {
  const target = new URL(ANTHROPIC_BASE + '/v1/messages')
  const isHttps = target.protocol === 'https:'
  const lib = isHttps ? https : http

  const options = {
    hostname: target.hostname,
    port:     target.port || (isHttps ? 443 : 80),
    path:     target.pathname + target.search,
    method:   'POST',
    headers: {
      'content-type':      'application/json',
      'x-api-key':         ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
  }

  const chunks = []
  req.on('data', c => chunks.push(c))
  req.on('end', () => {
    const body = Buffer.concat(chunks)
    options.headers['content-length'] = Buffer.byteLength(body)

    const proxyReq = lib.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        'content-type':  proxyRes.headers['content-type'] || 'text/event-stream',
        'cache-control': 'no-cache',
        'connection':    'keep-alive',
        'access-control-allow-origin': '*',
      })
      proxyRes.pipe(res)
    })

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err.message)
      if (!res.headersSent) res.status(502).json({ error: err.message })
    })

    proxyReq.write(body)
    proxyReq.end()
  })
})

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Anthropic proxy → ${ANTHROPIC_BASE}`)
})
