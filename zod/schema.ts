import z from "zod";

export const MessageSchema = z.object({
  sender: z.string().min(5, "Sender name is required").max(30),
  text: z.string().min(1, "Message cannot be empty").max(100)
})

export const RoomIdSchema = z.object({
  roomId: z.string().min(1)
})