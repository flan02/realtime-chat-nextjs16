import { redis } from '@/libs/redis'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { nanoid } from 'nanoid'
import { authMiddleware } from './auth'
import { Env } from '@/types'
import { zValidator } from '@hono/zod-validator'
import { MessageSchema, RoomIdSchema } from '@/zod/schema'

// Puedes forzar el runtime de Edge para mayor velocidad, similar a lo que buscamos con los streams de Upstash
export const runtime = 'edge'



// const app = new Hono().basePath('/api') 
const app = new Hono<Env>().basePath('/api')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .get('/welcome', (res) => {
    return res.json({ message: 'Welcome to the Realtime Chat API!' })
  })
  .get('/room/ttl', authMiddleware, async (c) => {
    const auth = c.get('auth')

    const secondsToLive = await redis.ttl(`meta:${auth.roomId}`)

    return c.json({ secondsToLive })
  })
  .post('/room/create', async (c) => {
    const ROOM_TTL_SECONDS = 60 * 10 // 10 min
    const roomId = nanoid()

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now()
    })

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS)

    return c.json({ roomId })
  })
  .get('/messages', authMiddleware, async (c) => {
    const roomId = c.req.query('roomId') as string

    if (!roomId) {
      return c.json({ error: 'Missing roomId' }, 400)
    }

    // ? LRANGE 'key' 0 -1 para obtener todos los mensajes de la lista de Redis
    const messages = await redis.lrange<string>(`chat:${roomId}`, 0, -1)

    const parsedMessages = messages.map((msg) => {
      try {
        return JSON.parse(msg);
      } catch {
        return msg; // Fallback por si hay algún string plano viejo
      }
    })
    return c.json({ messages: parsedMessages })
  })
  .post('/messages', authMiddleware, zValidator('query', RoomIdSchema), zValidator('json', MessageSchema), async (c) => {
    // Get custom data from context set by authMiddleware

    const auth = c.get('auth')
    // const { sender, text } = await c.req.json()
    const { roomId } = c.req.valid('query')  // * Hono zodValidator solution
    const { sender, text } = c.req.valid('json')

    const roomExists = await redis.exists(`meta:${roomId}`)
    if (!roomExists) return c.json({ error: 'Room not found' }, 404)


    await redis.rpush(`chat:${roomId}`, JSON.stringify({
      sender,
      text
    })) // Guardamos el mensaje como string en Redis, luego lo parseamos al obtenerlo

    await redis.publish(roomId, JSON.stringify({
      event: "chat.message",
      token: auth.token
    }))

    const roomTtl = await redis.ttl(`meta:${roomId}`);
    if (roomTtl > 0) await redis.expire(`chat:${roomId}`, roomTtl);

    return c.json({ success: true })
  })

// Export only the type not the actual instance
export type AppType = typeof routes

// Hono/Vercel se encarga de adaptar el servidor de Hono a los Route Handlers de Next.js
export const GET = handle(app)
export const POST = handle(app)