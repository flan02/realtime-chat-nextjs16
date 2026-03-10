"use client"

import ChatHeader from "@/components/chatroom/ChatHeader"
import useTimeToLive from "@/hooks/use-ttl"
import { useUsername } from "@/hooks/use-username"
import { client } from "@/libs/client"
import { useRealtime } from "@/libs/realtime-client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { InferResponseType } from "hono/client"
import { Zap } from "lucide-react"

const Page = () => {
  const params = useParams()
  const roomId = params.roomId as string

  const router = useRouter()

  const { username, isLoading: userLoading } = useUsername()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();




  const { timeRemaining } = useTimeToLive()

  type GetMessagesResponse = InferResponseType<typeof client.api.messages.$get>


  const { data: messages, isLoading } = useQuery<GetMessagesResponse>({
    queryKey: ["messages", roomId],
    enabled: !!roomId && !userLoading,
    queryFn: async () => {
      const res = await client.api.messages.$get({
        query: { roomId }
      })

      if (!res.ok) {
        if (res.status === 403) router.push("/?error=room-full")
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

  // * realtime listens to messages in that channel
  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        // refetch()
        queryClient.invalidateQueries({ queryKey: ["messages", roomId] });
      }

      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
    },
  })


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages && Object.keys(messages).length > 0) {
      // console.log("Messages metadata updated", messages);
      scrollToBottom();
    }

  }, [messages]);


  return (
    <main className="flex flex-col h-screen max-h-dvh overflow-hidden bg-red-50 dark:bg-black">
      <ChatHeader timeRemaining={timeRemaining} roomId={roomId} />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 my-2 space-y-1 scrollbar-thin border border-red-600/30 w-full md:w-[90%] lg:w-[80%] mx-auto rounded-md hero-patterns">
        {
          Array.isArray(messages) && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-600 text-sm font-mono tracking-wider text-center">
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
                  ? "items-end bg-red-200 border border-red-200/50 dark:border-red-700/30 dark:bg-red-800/10 ml-auto text-right"
                  : "items-start bg-white dark:border-red-800/20 dark:bg-zinc-900/80 mr-auto text-left"
                  }`}
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <p
                    className={`text-xs font-extrabold ${isMe ? "dark:text-red-700/70 text-red-600" : "text-zinc-400 dark:text-red-800/60"
                      }`}
                  >
                    {msg.sender === username ? username : msg.sender}
                  </p>

                  <span className="text-[10px] text-zinc-600">
                    {format(msg.timestamp, "HH:mm")}
                  </span>
                </div>
                <p className={`text-[10px] lg:text-[13px] leading-relaxed break-all tracking-wider ${isMe ? "dark:text-red-200" : "dark:text-red-200 text-zinc-950"}`}>{msg.text}</p>
              </div>
            </div>
            )
          }
          )}

        {
          Array.isArray(messages) && messages.length > 0 ? <div ref={messagesEndRef} /> : null
        }
      </div>

      <div className="lg:p-4 px-1 py-2 border-tborder-zinc-200 bg-red-100/30 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="flex gap-1 lg:gap-4 lg:w-[80%] lg:mx-auto">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 animate-pulse">
              {">"}
            </span>
            <input
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
              className="w-full rounded-2xl bg-white dark:bg-black border border-red-500/50 focus:border-red-500 focus:outline-none transition-colors dark:text-red-200 text-zinc-950 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm tracking-wider"
            />
          </div>

          <button
            onClick={() => {
              sendMessage(input)
              inputRef.current?.focus()
            }}
            disabled={!input.trim() || isPending}
            className="w-11 h-11 lg:w-12 lg:h-12 bg-red-600/80 text-white rounded-full border border-red-500/50 dark:text-zinc-300 hover:bg-red-600 dark:bg-red-800 hover:dark:bg-red-700/70 focus:border-red-500 transition-all px-2.5 lg:px-3 text-sm font-bold disabled:bg-gray-700 disabled:dark:bg-[#111] disabled:cursor-not-allowed cursor-pointer"
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  )
}

export default Page