'use client'
import useRoom from "@/hooks/use-room"
import { ArrowRight } from 'lucide-react';

import CardWhatDoWeOffer from "../reutilizable/CardWhatDoWeOffer";
import Image from "next/image";
import { useTheme } from "next-themes";


const Hero = () => {
  const { username, createRoom } = useRoom()
  const { resolvedTheme } = useTheme()

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-24 pb-24 sm:pb-32 text-center">
      <h1 className="text-[52px] sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[1.05] lg:leading-[1.10] lg:tracking-tighter mb-6 sm:mb-8">
        <span className="text-black dark:text-white block lg:inline underline">GUT OUT</span>
        <span className="text-red-500"> THE NOISE.</span>
        <br />
        <span className="text-red-600">KEEP THE PRIVACY.</span>
      </h1>
      <p className="max-w-xl mx-auto text-zinc-600 text-sm sm:text-lg mb-8 sm:mb-10 tracking-tight">
        Anonymous, ephemeral, and crypto-powered chat sessions.
        No logs. No registration. No trace. Powered by Redis TTL.
      </p>

      <div className="flex justify-center mx-auto">
        <div className="flex flex-col gap-2 max-w-md">
          <button
            onClick={() => createRoom()}
            className="w-full px-6 py-4 bg-red-600 hover:opacity-80 text-white font-bold rounded-sm flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm sm:text-base">
            START PRIVATE CHAT <ArrowRight className="w-5 h-5" />
          </button>

          <div className="w-full flex items-center border border-zinc-800 bg-zinc-950/90 rounded-sm">
            <label className="text-zinc-500 pl-3 pt-0.5 text-xs sm:text-sm">Your Identity:</label>
            <div className="flex-1 p-3 text-sm text-zinc-400 font-mono truncate">
              <span className="animate-pulse">
                {username}
              </span>
            </div>
          </div>
        </div>

        <div className="gap-2">
          <Image src={resolvedTheme === "dark" ? "/darkmode-logo-trimmed.png" : "/lightmode-logo.png"} alt="gutout-logo" width={112} height={112} className="hidden lg:block lg:size-28 object-contain animate-levitate" priority />
          {/* <span className="text-2xl sm:text-4xl text-red-500 font-black tracking-tighter italic">GUT OUT</span> */}
        </div>

      </div>

      <div className="pt-6 lg:pt-8">
        <p className="text-xs lg:text-sm underline underline-offset-4 text-red-500/90">An easy-to-use, private, secure and self-destructing chat room.</p>
      </div>
      {/* Features Grid */}
      <CardWhatDoWeOffer />
    </main>
  )
}

export default Hero