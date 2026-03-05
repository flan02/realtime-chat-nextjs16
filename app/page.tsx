import { Lobby } from "@/components/main/lobby"
import { Suspense } from "react"

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  )
}

export default Page

