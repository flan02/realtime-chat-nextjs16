import z from "zod";
import type { InferRealtimeEvents } from "@upstash/realtime";

export const MessageSchema = z.object({
  sender: z.string().min(5, "Sender name is required").max(30),
  text: z.string().min(1, "Message cannot be empty").max(100)
})

export const RoomIdSchema = z.object({
  roomId: z.string().min(1)
})


export const messageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  text: z.string(),
  timestamp: z.number(),
  roomId: z.string(),
  token: z.string().optional(),
});

export const chatSchema = {
  chat: {
    message: messageSchema,
    destroy: z.object({ isDestroyed: z.literal(true) }),
  },
};

export type RealtimeEvents = InferRealtimeEvents<{ schema: typeof chatSchema }>;