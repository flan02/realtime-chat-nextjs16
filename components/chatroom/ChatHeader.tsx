'use client'
import useCopy from '@/hooks/use-copy'
import { formatTimeRemaining } from '@/utils/functions'



type Props = {
  timeRemaining: number | null
  destroyRoom: () => void
  roomId: string
}

const ChatHeader = ({ timeRemaining, destroyRoom, roomId }: Props) => {




  const { copyStatus, copyLink } = useCopy()



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