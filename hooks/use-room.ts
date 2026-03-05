'use client'
import { useUsername } from "@/hooks/use-username"
import { client } from "@/libs/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"

const useRoom = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error")
  const { username } = useUsername()

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.api.room.create.$post() // get the roomId from our backend

      if (res.ok) {
        const data = await res.json()
        router.push(`/room/${data?.roomId}`)
      } else {
        console.error('Error al crear la sala')
      }
    },
  })
  return { createRoom, username, wasDestroyed, error }
}

export default useRoom