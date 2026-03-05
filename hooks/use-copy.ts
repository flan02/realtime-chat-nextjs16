'use client'

import { useState } from "hono/jsx/dom"

type Props = {
  strToCopy: string
}

const useCopy = ({ strToCopy }: Props) => {
  const [copyStatus, setCopyStatus] = useState("COPY")

  const copyLink = () => {
    navigator.clipboard.writeText(strToCopy)
    setCopyStatus("COPIED!")
    setTimeout(() => setCopyStatus("COPY"), 2000)
  }

  return { copyStatus, copyLink }
}

export default useCopy