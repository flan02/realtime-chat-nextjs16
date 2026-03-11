'use client'

import { client } from "@/libs/client"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const useTimeToLive = () => {
  const params = useParams()
  const roomId = params.roomId as string
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)


  const { data, isLoading } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.api.room.ttl.$get({ query: { roomId } })
      if (!res.ok) {
        throw new Error("Failed to fetch TTL")
      }
      return await res.json()
    },
    refetchInterval: 10000, // Refetch every 10 seconds to keep the TTL updated
  })



  useEffect(() => {
    async function checkTTL() {
      if (data && typeof data.ttl === 'number') {
        setTimeRemaining(data.ttl)

      }
    }
    checkTTL()

  }, [data])


  useEffect(() => {
    if (timeRemaining !== null && timeRemaining < 0) return

    if (timeRemaining === 0) {
      router.replace("/splash-screen?destroyed=true")
      return
    }

  }, [timeRemaining, router])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : 0))
    }, 1000)

    // 👈 ESTO ES CLAVE: La limpieza debe estar aquí
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining === null])

  return { timeRemaining, isLoading }
}


export default useTimeToLive