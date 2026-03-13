'use client'
import { useEffect, useState } from "react";


const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function ClientSide() {

      return setMounted(true);
    }

    ClientSide()
  }, []);


  return { mounted }
}

export default useMounted