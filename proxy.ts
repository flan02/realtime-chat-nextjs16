import { NextRequest, NextResponse } from "next/server"
import { redis } from "./libs/redis"
import { nanoid } from "nanoid"
import { Meta } from "./types"

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url))

  const roomId = roomMatch[1]

  // TODO: Modify this meta from a tokenlist to set of usernames
  // ? If the user joins to the chat from 20 different windows, redis will know that the user is the same and the counter remains the same
  const meta = await redis.hgetall<Meta>(`meta:${roomId}`)

  if (!meta) return NextResponse.redirect(new URL("/?error=room-not-found", req.url))

  const existingToken = req.cookies.get("x-auth-token")?.value

  // * USER IS ALLOWED TO JOIN ROOM
  if (existingToken && meta.connected.includes(existingToken)) return NextResponse.next()

  // ! USER IS NOT ALLOWED TO JOIN
  if (meta.connected.length >= 3) return NextResponse.redirect(new URL("/?error=room-full", req.url))

  const response = NextResponse.next()

  const token = nanoid()

  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // * "strict"
  })

  await redis.hset(`meta:${roomId}`, { connected: [...meta.connected, token] })

  return response
}

export const config = {
  matcher: "/room/:path*",
}
