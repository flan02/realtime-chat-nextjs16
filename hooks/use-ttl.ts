'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  ttlData: {
    ttl: number
  }
}

const useTimeToLive = ({ ttlData }: Props) => {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ttlData?.ttl !== undefined) setTimeRemaining(ttlData.ttl)
  }, [ttlData])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return

    if (timeRemaining === 0) {
      router.push("/?destroyed=true")
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, router])

  return { timeRemaining }
}

export default useTimeToLive