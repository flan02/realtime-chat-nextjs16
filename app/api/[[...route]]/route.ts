import { Hono } from 'hono'
import { handle } from 'hono/vercel'

// Puedes forzar el runtime de Edge para mayor velocidad, similar a lo que buscamos con los streams de Upstash
export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .get('/welcome', (c) => {
    return c.json({ message: 'Welcome to the Realtime Chat API!' })
  })
  .post('/room/create', async (c) => {
    // Aquí iría la lógica para crear una sala, por ahora solo devolvemos un ID de sala simulado
    console.log('CREATE A NEW ROOM');
    const roomId = Math.random().toString(36).substring(2, 8) // Genera un ID de sala aleatorio
    return c.json({ roomId })
  })

// Export only the type not the actual instance
export type AppType = typeof routes

// Hono/Vercel se encarga de adaptar el servidor de Hono a los Route Handlers de Next.js
export const GET = handle(app)
export const POST = handle(app)