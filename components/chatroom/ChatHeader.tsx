'use client'
import useCopy from '@/hooks/use-copy'
import { client } from '@/libs/client'
import { formatTimeRemaining } from '@/utils/functions'
import { useMutation } from '@tanstack/react-query'



type Props = {
  timeRemaining: number | null
  roomId: string
}

const ChatHeader = ({ timeRemaining, roomId }: Props) => {

  const { copyStatus, copyLink } = useCopy()
  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.api.room.delete.$post({ query: { roomId } })
      if (!res.ok) throw new Error("Failed to destroy the room")
      return res.json()
    },
    onSuccess: () => {
      console.log("Room destroyed");
      window.location.href = "/?destroyed=true" // Redirect to home after destroying the room
    }
  }
  )


  return (
    <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase">Room ID</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-500 truncate">{roomId.slice(0, 10) + "..."}</span>
            <button
              onClick={() => copyLink(window.location.href)}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {copyStatus}
            </button>
          </div>
        </div>

        <div className="h-8 w-px bg-zinc-800" />

        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
          <span
            className={`text-sm font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60
              ? "text-red-500"
              : "text-amber-500"
              }`}
          >
            {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
          </span>
        </div>
      </div>

      {/* SHOW A MODAL BEFORE WARNING THAT THE FOLLOWING ACTION WILL BE IRREVERSIBLE*/}
      <button
        onClick={() => destroyRoom()}
        className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
      >
        <span className="group-hover:animate-pulse">💣</span>
        DESTROY NOW
      </button>
    </header>
  )
}

export default ChatHeader