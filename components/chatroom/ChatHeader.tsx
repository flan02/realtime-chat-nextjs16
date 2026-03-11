'use client'
import useCopy from '@/hooks/use-copy'
import { client } from '@/libs/client'
import { formatTimeRemaining } from '@/utils/functions'
import { useMutation } from '@tanstack/react-query'
import { ModeToggle } from '../reutilizable/ModeToggle'
import { Bomb } from 'lucide-react'



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
      window.location.href = "/splash-screen?destroyed=true" // Redirect to home after destroying the room
    }
  }
  )


  return (
    <header className="border-b border-zinc-300 dark:border-zinc-800 p-2 sm:p-4 flex items-center justify-between bg-red-100/30 dark:bg-zinc-900/30">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-500 truncate w-24 sm:w-auto">{roomId}</span>
              <button
                onClick={() => copyLink(window.location.href)}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {copyStatus}
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-300 dark:bg-zinc-800 sm:hidden" />

          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-500 dark:text-red-200 uppercase">Self-Destruct in:</span>
            <span
              className={`tracking-widest text-sm font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60
                ? "text-red-500"
                : "text-amber-500"
                }`}
            >
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* SHOW A MODAL BEFORE WARNING THAT THE FOLLOWING ACTION WILL BE IRREVERSIBLE*/}
        <button
          onClick={() => destroyRoom()}
          className="text-xs border border-red-500 bg-white dark:bg-[#111] hover:dark:bg-[#222] hover:bg-red-200 px-3 py-1.5 rounded text-red-500 dark:text-red-200 hover:text-red-400 font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
        >
          <span className="hidden sm:inline">DESTROY ROOM</span>
          {/* <span className="sm:hidden">💣</span> */}
          <Bomb size={14} className='text-red-600/80' />
        </button>

        <ModeToggle />
      </div>
    </header>
  )
}

export default ChatHeader