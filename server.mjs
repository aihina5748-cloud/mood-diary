import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const host = '127.0.0.1'
const port = 4173
const root = join(process.cwd(), 'dist')
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, `http://${host}:${port}`).pathname
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
    const filePath = normalize(join(root, relativePath))
    if (!filePath.startsWith(root)) throw new Error('Invalid path')
    const body = await readFile(filePath)
    response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream' })
    response.end(body)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  }
}).listen(port, host, () => {
  console.log(`Local URL: http://${host}:${port}`)
})
