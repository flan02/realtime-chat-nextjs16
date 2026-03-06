import { createMiddleware } from "hono/factory"
import { redis } from "@/libs/redis"
import { getCookie } from "hono/cookie"


export const authMiddleware = createMiddleware(async (c, next) => {
  // const roomId = c.req.param()
  const roomId = c.req.query('roomId') as string
  const token = getCookie(c, "x-auth-token")

  // Basic validation
  if (!roomId || !token) {
    return c.json({ error: "Missing roomId or token" }, 401)
  }

  // Redis validation
  const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected")

  if (!connected || !connected.includes(token)) {
    return c.json({ error: "Unauthorized: Invalid token" }, 401)
  }

  // Add data to context for downstream handlers
  c.set("auth", { roomId, token, connected }) // same that Elysia derive fc

  await next()

})

