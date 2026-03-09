'use client'

import useRoom from "@/hooks/use-room"



const ChatErrors = () => {
  const { wasDestroyed, error } = useRoom()

  return (
    <div className="mt-4">
      {wasDestroyed && (
        <div className="dark:bg-red-950/50 border dark:border-red-900 bg-red-500 p-4 text-center">
          <p className="dark:text-red-500 text-white text-sm font-bold">ROOM DESTROYED</p>
          <p className="text-zinc-500 text-xs mt-1">
            All messages were permanently deleted.
          </p>
        </div>
      )}
      {error === "room-not-found" && (
        <div className="dark:bg-red-950/50 border dark:border-red-900 p-4 text-center">
          <p className="dark:text-red-500 text-white text-sm font-bold">ROOM NOT FOUND</p>
          <p className="text-zinc-500 text-xs mt-1">
            This room may have expired or never existed.
          </p>
        </div>
      )}
      {error === "room-full" && (
        <div className="dark:bg-red-950/50 border dark:border-red-900 p-4 text-center">
          <p className="dark:text-red-500 text-white text-sm font-bold">ROOM FULL</p>
          <p className="text-zinc-500 text-xs mt-1">
            This room is at maximum capacity.
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatErrors