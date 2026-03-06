import { redis } from '@/libs/redis'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { nanoid } from 'nanoid'
import { authMiddleware } from './auth'
import { Env, StreamEntry } from '@/types'
import { zValidator } from '@hono/zod-validator'
import { MessageSchema, RoomIdSchema } from '@/zod/schema'
import { realtime, MessageToRedis } from '@/libs/realtime'

// Puedes forzar el runtime de Edge para mayor velocidad, similar a lo que buscamos con los streams de Upstash
export const runtime = 'edge'

// ? const app = new Hono().basePath('/api') 
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
    const roomId = c.req.query('roomId')
    // 1. Validación temprana (Fail Fast)
    if (!roomId) return c.json({ error: 'Missing roomId' }, 400);

    const stream = await redis.xrange(roomId, '-', '+')

    if (!stream || typeof stream !== 'object') {
      return c.json([])
    }

    const typedStream = stream as unknown as Record<string, StreamEntry> // * double cast

    // 3. Manejo de stream vacío
    const messages = Object.values(typedStream).map((entry) => {
      // Extraemos el 'data' que es donde está tu mensaje de Zod
      return entry.data
    })

    // 3. Devolvemos el array limpio al frontend
    return c.json(messages)
  })
  .post('/messages', authMiddleware, zValidator('query', RoomIdSchema), zValidator('json', MessageSchema), async (c) => {
    // Get custom data from context set by authMiddleware

    // const auth = c.get('auth')
    // const { sender, text } = await c.req.json()
    const { roomId } = c.req.valid('query')  // * Hono zodValidator solution
    const { sender, text } = c.req.valid('json')

    const roomExists = await redis.exists(`meta:${roomId}`)
    if (!roomExists) throw Error("Room does not exist")

    const message: MessageToRedis = {
      id: nanoid(),
      sender,
      text,
      timestamp: Date.now(),
      roomId
    }

    // add message to history
    // await redis.rpush(`messages:${roomId}`, { ...message, token: auth.token }) // push the message to an ordered list in Redis

    // add to redis stream for real-time updates
    await realtime.channel(roomId).emit("chat.message", message)

    const roomTtl = await redis.ttl(`meta:${roomId}`);

    // only if the room is still alive, we sync all other keys TTLs
    if (roomTtl > 0) {
      await redis.pipeline()
        // .expire(`messages:${roomId}`, roomTtl)
        // .expire(`history:${roomId}`, roomTtl)
        .expire(roomId, roomTtl)
        .exec();
    } else {
      console.warn(`Attempted to message a dead room: ${roomId}`)
    }


    return c.json({ success: true })
  })

// Export only the type not the actual instance
export type AppType = typeof routes

// Hono/Vercel se encarga de adaptar el servidor de Hono a los Route Handlers de Next.js
export const GET = handle(app)
export const POST = handle(app)