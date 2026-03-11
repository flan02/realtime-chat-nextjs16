"use client"

import ChatErrors from "@/components/main/ChatErrors";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RoomDestroyed = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // 1. Animación de la barra (3 segundos)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 30); // 30ms * 100 = 3000ms (3 segundos)

    // 2. Redirección al terminar
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3500); // Un pelín más para que se vea la barra llena

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  useEffect(() => {
    async function ClientSide() {

      return setMounted(true);
    }

    ClientSide()
  }, []);

  if (!mounted) {
    return <div className="min-h-screen hero-patterns" />;
  }

  return (
    <div className="hero-patterns min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans space-y-12">
      {/* Contenedor del Logo */}
      <div className="flex items-center gap-2 md:gap-6 group cursor-default">
        <span className="text-2xl sm:text-6xl text-black dark:text-white font-black tracking-tighter italic">GUT OUT</span>
        <Image src={resolvedTheme === "dark" ? "/darkmode-logo-trimmed.png" : "/lightmode-logo.png"} alt="gutout-logo" width={40} height={40} className="sm:w-8 sm:h-8 lg:size-12 object-contain" priority />
      </div>

      {/* Mensaje de Seguridad */}
      {/* <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
        Room Destroyed
      </h1> */}
      {/* Error Messages */}
      <ChatErrors />


      <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
        All messages and keys have been permanently deleted from Redis.
      </p>

      {/* La Barra de Progreso (Loader) */}
      <div>
        <div className="w-full max-w-62.5 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-600">
          Redirecting to safe zone...
        </p>
      </div>
    </div>
  );
}

export default RoomDestroyed