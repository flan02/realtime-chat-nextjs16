"use client"

import ChatHeader from "@/components/chatroom/ChatHeader"
import useTimeToLive from "@/hooks/use-ttl"
import { useUsername } from "@/hooks/use-username"
import { client } from "@/libs/client"
import { useRealtime } from "@/libs/realtime-client"
import { MessagesType } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useRef, useState } from "react"


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




  const { data: messages, refetch } = useQuery<{ messages: MessagesType }>({
    queryKey: ["messages", roomId],
    queryFn: async () => {
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
    // mutationFn: async () => {
    //   await client.room.delete(null, { query: { roomId } })
    // },
  })



  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-black">
      <ChatHeader timeRemaining={timeRemaining} destroyRoom={destroyRoom} roomId={roomId} />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-sm font-mono">
              No messages yet, start the conversation.
            </p>
          </div>
        )}

        {messages?.messages.map((msg: { id: string; sender: string; text: string; timestamp: number }) => (
          <div key={msg.id} className="flex flex-col items-start">
            <div className="max-w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className={`text-xs font-bold ${msg.sender === username ? "text-green-500" : "text-blue-500"
                    }`}
                >
                  {msg.sender === username ? "YOU" : msg.sender}
                </span>

                <span className="text-[10px] text-zinc-600">
                  {format(msg.timestamp, "HH:mm")}
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed break-all">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
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
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>

          <button
            onClick={() => {
              sendMessage(input)
              inputRef.current?.focus()
            }}
            disabled={!input.trim() || isPending}
            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  )
}

export default Page