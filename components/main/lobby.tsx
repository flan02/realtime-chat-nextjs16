'use client'
import useRoom from "@/hooks/use-room"
import { Shield, Zap, Lock, ArrowRight, UtensilsCrossed } from 'lucide-react';

export function Lobby() {

  const { username, createRoom, wasDestroyed, error } = useRoom()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-default">
          <span className="text-2xl font-black tracking-tighter italic">GUTOUT</span>
          <UtensilsCrossed className="w-5 h-5 text-red-500 animate-pulse ml-1" />
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-400">
          <a href="#how" className="hover:text-red-500 transition-colors">HOW IT WORKS ?</a>
          <button className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all rounded-sm">
            JOIN AS GUEST
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          GUT OUT THE NOISE. <br />
          <span className="text-red-600">KEEP THE PRIVACY.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-500 text-lg mb-10">
          Anonymous, ephemeral, and crypto-powered chat sessions.
          No logs. No registration. No trace. Powered by Redis TTL.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => createRoom()}
            className="w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-sm flex items-center justify-center gap-2 transition-transform active:scale-95">
            {/* CREATE SECURE ROOM*/}
            START PRIVATE SESSION <ArrowRight className="w-5 h-5" />
          </button>
          {/* <button className="w-full md:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold rounded-sm transition-all">
            ENTER FREE LOBBY
          </button> */}

          <div className="space-y-2 flex border border-zinc-800">

            <div className="flex items-center gap-3">
              <label className="text-zinc-500 pl-2 text-sm">Your Identity</label>
              <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                <span className="animate-pulse">
                  {username}
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm underline underline-offset-4 text-red-500/90">A private, self-destructing chat room.</p>
        </div>

        {/* Error Messages */}
        <div className="mt-4">
          {wasDestroyed && (
            <div className="bg-red-950/50 border border-red-900 p-4 text-center">
              <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
              <p className="text-zinc-500 text-xs mt-1">
                All messages were permanently deleted.
              </p>
            </div>
          )}
          {error === "room-not-found" && (
            <div className="bg-red-950/50 border border-red-900 p-4 text-center">
              <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
              <p className="text-zinc-200 text-xs mt-1">
                This room may have expired or never existed.
              </p>
            </div>
          )}
          {error === "room-full" && (
            <div className="bg-red-950/50 border border-red-900 p-4 text-center">
              <p className="text-red-500 text-sm font-bold">ROOM FULL</p>
              <p className="text-zinc-500 text-xs mt-1">
                This room is at maximum capacity.
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div id="how" className="grid md:grid-cols-3 gap-12 mt-32 text-left">
          <div className="space-y-4 p-6 border border-white/5 bg-zinc-950/50 rounded-lg hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center rounded-sm text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Ephemeral Memory</h3>
            <p className="text-zinc-500 leading-relaxed">
              Conversations live exclusively in Redis RAM. When the TTL hits zero, the data is physically purged. Forever.
            </p>
          </div>

          <div className="space-y-4 p-6 border border-white/5 bg-zinc-950/50 rounded-lg hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center rounded-sm text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Crypto-Lock Access</h3>
            <p className="text-zinc-500 leading-relaxed">
              Unlock your session with USDT/ETH. Verified by Alchemy. No emails, no phone numbers, no identities.
            </p>
          </div>

          <div className="space-y-4 p-6 border border-white/5 bg-zinc-950/50 rounded-lg hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center rounded-sm text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Zero-Knowledge</h3>
            <p className="text-zinc-500 leading-relaxed">
              Client-side encryption means even we cant read your messages. Gutout is just the pipe; you hold the key.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-zinc-600 text-sm lowercase">
        <p className="lowercase animate-pulse text-blue-500/50">GUTOUT.XYZ — BUILT FOR SURFING THE CLEAR WEB IN THE SHADOWS.</p>
      </footer>
    </div>
  );



}