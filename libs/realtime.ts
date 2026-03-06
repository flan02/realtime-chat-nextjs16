import 'server-only'
import { redis } from "@/libs/redis"
import { InferRealtimeEvents, Realtime } from "@upstash/realtime"
import z from "zod"
import { chatSchema } from "@/zod/schema"

const message = z.object({
  id: z.string(),
  sender: z.string(),
  text: z.string(),
  timestamp: z.number(),
  roomId: z.string(),
  token: z.string().optional(),
})

const schema = {
  chat: {
    message,
    destroy: z.object({
      isDestroyed: z.literal(true),
    }),
  },
}

export const realtime = new Realtime({ schema: chatSchema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
export type MessageToRedis = z.infer<typeof message>