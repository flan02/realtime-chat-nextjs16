'use client'
import useRoom from "@/hooks/use-room"
import { ArrowRight } from 'lucide-react';
import ChatErrors from "./ChatErrors";
import { ModeToggle } from "../reutilizable/ModeToggle";

import CardWhatDoWeOffer from "../reutilizable/CardWhatDoWeOffer";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Lobby() {
  const [mounted, setMounted] = useState(false);
  const { username, createRoom } = useRoom()
  const { resolvedTheme } = useTheme()

  // console.log("current theme", resolvedTheme);
  useEffect(() => {
    async function isMounted() {
      return setMounted(true);
    }
    isMounted();
  }, []);

  if (!mounted) {
    return <div className="size-8" />; // Placeholder del mismo tamaño
  }
  return (
    <div className="min-h-screen hero-patterns text-white selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-default">
          <Image src={resolvedTheme === "dark" ? "/darkmode-logo-trimmed.png" : "/lightmode-logo.png"} alt="gutout-logo" width={32} height={32} className="object-contain w-auto h-auto dark:w-auto dark:h-auto" priority />
          <span className="text-4xl text-red-500 font-black tracking-tighter italic">GUT OUT</span>

        </div>
        <div className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-400">
          <a href="#how" className="hover:text-red-500 transition-colors">HOW IT WORKS ?</a>
          <button className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all rounded-sm">
            JOIN AS GUEST
          </button>
          <ModeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          <span className="text-black dark:text-white">GUT OUT</span>
          <span className=" text-red-500"> THE NOISE.</span>
          <br />
          <span className="text-red-600">KEEP THE PRIVACY.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-600 text-lg mb-10">
          Anonymous, ephemeral, and crypto-powered chat sessions.
          No logs. No registration. No trace. Powered by Redis TTL.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => createRoom()}
            className="w-full md:w-auto px-8 py-4 bg-red-600 hover:opacity-80 text-white font-bold rounded-sm flex items-center justify-center gap-2 transition-transform active:scale-95">
            START PRIVATE CHAT <ArrowRight className="w-5 h-5" />
          </button>

          <div className="space-y-2 flex border border-zinc-800">

            <div className="flex items-center gap-3">
              <label className="text-zinc-500 pl-2 text-sm">Your Identity</label>
              <div className="flex-1 bg-red-100/50 border dark:bg-zinc-950 dark:border dark:border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                <span className="animate-pulse ">
                  {username}
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm underline underline-offset-4 text-red-500/90">An easy-to-use, private, secure and self-destructing chat room.</p>
        </div>

        {/* Error Messages */}
        <ChatErrors />

        {/* Features Grid */}
        <CardWhatDoWeOffer />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-zinc-600 text-sm lowercase">
        <p className="lowercase animate-pulse text-blue-500/40">GUTOUT.XYZ — BUILT FOR SURFING THE CLEAR WEB IN THE SHADOWS.</p>
      </footer>
    </div>
  );



}