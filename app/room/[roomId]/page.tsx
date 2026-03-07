"use client"

import ChatHeader from "@/components/chatroom/ChatHeader"
import useTimeToLive from "@/hooks/use-ttl"
import { useUsername } from "@/hooks/use-username"
import { client } from "@/libs/client"
import { useRealtime } from "@/libs/realtime-client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { InferResponseType } from "hono/client"
// import { realtime } from "@/libs/realtime"

const Page = () => {
  const params = useParams()
  const roomId = params.roomId as string

  const router = useRouter()

  const { username } = useUsername()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient();
  // const { data: ttlData } = useQuery({
  //   queryKey: ["ttl", roomId],
  //   queryFn: async () => {
  //     const res = await client.api.room.ttl.get({ query: { roomId } })
  //     return res.data
  //   },
  // })

  const ttlData = { ttlData: { ttl: 600 } } // 10 min in seconds, same as the TTL we set when creating the room

  const { timeRemaining } = useTimeToLive(ttlData)

  type GetMessagesResponse = InferResponseType<typeof client.api.messages.$get>


  const { data: messages, refetch, isLoading } = useQuery<GetMessagesResponse>({
    queryKey: ["messages", roomId],
    queryFn: async () => {

      // request to hono api to get all messages of the room
      const res = await client.api.messages.$get({ query: { roomId } })

      if (!res.ok) {
        throw new Error("Failed to fetch messages")
      }
      return await res.json()
    }
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationKey: ["messages", roomId],
    mutationFn: async (text: string) => {
      const res = await client.api.messages.$post({
        query: { roomId },
        json: { sender: username, text }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error("error" in errorData ? errorData.error : "Failed to send messages")
      }
      return await res.json()
    },
    onSuccess: () => {
      setInput("") // Clean only if message was sent successfully to Redis
      queryClient.invalidateQueries({ queryKey: ["messages", roomId] })
    }

  })

  // const channel = realtime.channel(roomId)

  // ESCUCHAR EN TIEMPO REAL
  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch()
      }

      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
    },
  })

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      // await client.api.room.delete(null, { query: { roomId } })
    },
  })




  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-black">
      <ChatHeader timeRemaining={timeRemaining} destroyRoom={destroyRoom} roomId={roomId} />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
        {
          Array.isArray(messages) && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-600 text-sm font-mono">
                No messages yet, start the conversation.
              </p>
            </div>
          )
        }

        {isLoading && (
          <div className="space-y-2">
            {/* Dibujamos 4 esqueletos que imitan tus mensajes reales */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-start border border-red-900/20 bg-red-950/5 px-2 py-1.5 rounded-md animate-pulse">
                <div className="flex items-baseline gap-3 mb-2">
                  {/* El nombre (YOU o Sender) */}
                  <div className="h-2 w-12 bg-red-900/30 rounded" />
                  {/* La hora */}
                  <div className="h-2 w-8 bg-zinc-800 rounded" />
                </div>
                {/* El cuerpo del mensaje (simulamos 2 líneas de texto) */}
                <div className="space-y-2 w-full">
                  <div className="h-3 w-[90%] bg-red-900/10 rounded" />
                  <div className="h-3 w-[40%] bg-red-900/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {
          !isLoading && Array.isArray(messages) && messages.map((msg) => {
            const isMe = msg.sender === username;
            return (<div key={msg.id} className={`flex flex-col w-full px-2`}>
              <div
                className={`w-fit max-w-[80%] px-3 py-1.5 rounded-md border transition-all ${isMe
                  ? "items-end border-red-700/30 bg-red-800/10 ml-auto text-right"
                  : "items-start border-red-800/20 bg-red-950/15 mr-auto text-left"
                  }`}
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <p
                    className={`text-xs font-extrabold ${isMe ? "text-red-700/70" : "text-red-900/50"
                      }`}
                  >
                    {msg.sender === username ? username : msg.sender}
                  </p>

                  <span className="text-[10px] text-zinc-600">
                    {format(msg.timestamp, "HH:mm")}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed break-all tracking-wider ${isMe ? "text-red-200/80" : "text-zinc-300/30"}`}>{msg.text}</p>
              </div>
            </div>
            )
          }
          )}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>
            <input
              autoFocus
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage(input)
                  inputRef.current?.focus()
                }
              }}
              placeholder="Type message..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black border border-red-500/50 focus:border-red-500 focus:outline-none transition-colors text-red-200 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm tracking-wider"
            />
          </div>

          <button
            onClick={() => {
              sendMessage(input)
              inputRef.current?.focus()
            }}
            disabled={!input.trim() || isPending}
            className="border border-red-500/50 text-red-500 hover:bg-red-500/10 focus:border-red-500 transition-all px-6 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  )
}

export default Page