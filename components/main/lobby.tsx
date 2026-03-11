'use client'
import useRoom from "@/hooks/use-room"
import { ArrowRight, Menu, X } from 'lucide-react';
import ChatErrors from "./ChatErrors";
import { ModeToggle } from "../reutilizable/ModeToggle";

import CardWhatDoWeOffer from "../reutilizable/CardWhatDoWeOffer";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Lobby() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { username, createRoom } = useRoom()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    async function Check() {

      return setMounted(true);
    }

    Check()
  }, []);

  if (!mounted) {
    return <div className="min-h-screen hero-patterns" />;
  }

  return (
    <div className="min-h-screen hero-patterns text-white selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 max-w-7xl mx-auto relative">
        <div className="flex items-center gap-2 group cursor-default">
          <Image src={resolvedTheme === "dark" ? "/darkmode-logo-trimmed.png" : "/lightmode-logo.png"} alt="gutout-logo" width={32} height={32} className="sm:w-8 sm:h-8 lg:size-12 object-contain" priority />
          <span className="text-2xl sm:text-4xl text-black dark:text-white font-black tracking-tighter italic">GUT OUT</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-400">
          <a href="#how" className="hover:text-red-500 transition-colors">HOW IT WORKS ?</a>
          <button className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all rounded-sm">
            JOIN AS GUEST
          </button>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          <div className="flex items-center gap-1"> {/* Contenedor para separar los elementos */}

            {/* El Toggle ahora es independiente, no dispara el menú */}
            {!mobileMenuOpen && <ModeToggle />}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-1"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-black dark:text-red-500" />
              ) : (
                <Menu className="w-6 h-6 text-red-500 dark:text-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="absolute top-12 h-auto right-0 mt-2 w-48 md:hidden bg-red-50 dark:bg-[#111] backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-md shadow-lg z-40">
            <div className="flex flex-col items-start px-2 py-4 space-y-4">
              <button className="w-full text-left px-0 py-2 border-b border-b-red-500/50 rounded-none text-red-500 transition-all text-xs hover:underline">JOIN AS GUEST</button>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="dark:text-zinc-400 text-black hover:text-red-500 transition-colors text-[10px] hover:underline">HOW IT WORKS ?</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-24 pb-24 sm:pb-32 text-center">
        <h1 className="text-[52px] sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[1.05] lg:leading-[1.10] lg:tracking-tighter mb-6 sm:mb-8">
          <span className="text-black dark:text-white block lg:inline underline">GUT OUT</span>
          <span className="text-red-500"> THE NOISE.</span>
          <br />
          <span className="text-red-600">KEEP THE PRIVACY.</span>
        </h1>
        <p className="max-w-xl mx-auto text-zinc-600 text-sm sm:text-lg mb-8 sm:mb-10">
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

        {/* Error Messages */}
        <ChatErrors />

        {/* Features Grid */}
        <CardWhatDoWeOffer />
      </main>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-white/10 text-center text-zinc-600 text-xs sm:text-sm lowercase px-4">
        <p className="lowercase animate-pulse text-blue-500/40">GUTOUT.XYZ — BUILT FOR SURFING THE CLEAR WEB IN THE SHADOWS.</p>
      </footer>
    </div>
  );
}