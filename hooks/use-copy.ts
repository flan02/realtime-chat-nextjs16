'use client'

import { useState } from "react"





const useCopy = () => {
  const [copyStatus, setCopyStatus] = useState("COPY")

  // Ahora la función recibe el string en el momento del click
  const copyLink = (textToCopy: string) => {
    if (!textToCopy) {
      console.warn("No hay nada para copiar todavía.");
      return;
    }

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus("COPIED!")
        setTimeout(() => setCopyStatus("COPY"), 2000)
      })
      .catch((err) => console.error("Error al copiar:", err))
  }

  return { copyStatus, copyLink }
}

export default useCopy