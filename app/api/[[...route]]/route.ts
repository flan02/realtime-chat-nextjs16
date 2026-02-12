import { Hono } from 'hono'
import { handle } from 'hono/vercel'

// Puedes forzar el runtime de Edge para mayor velocidad, similar a lo que 
// buscamos con los streams de Upstash
export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hola Dan, Hono está corriendo en Next.js'
  })
})

// Hono/Vercel se encarga de adaptar el servidor de Hono a los Route Handlers de Next.js
export const GET = handle(app)
export const POST = handle(app)