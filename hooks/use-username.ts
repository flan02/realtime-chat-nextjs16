import { nanoid } from "nanoid"
import { useEffect, useState } from "react"

const ANIMALS = ["wolf", "hawk", "bear", "shark"]
const STORAGE_KEY = "chat_username"

const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `anonymous-${word}-${nanoid(5)}`
}

export const useUsername = () => {
  const [username, setUsername] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateUser = () => {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (stored) {
        setUsername(stored)

      } else {
        const generated = generateUsername()
        localStorage.setItem(STORAGE_KEY, generated)
        setUsername(generated)

      }
      setIsLoading(false)

    }

    validateUser()
  }, [])

  return { username, isLoading }
}