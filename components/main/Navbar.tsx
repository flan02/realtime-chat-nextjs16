'use client'

import { Menu, X } from 'lucide-react';
import { ModeToggle } from "../reutilizable/ModeToggle";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from 'react';


const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme()


  return (
    <nav className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 max-w-7xl mx-auto relative">
      <div className="flex items-center gap-2 md:gap-1 group cursor-default">
        <Image src={resolvedTheme === "dark" ? "/darkmode-logo-trimmed.png" : "/lightmode-logo.png"} alt="gutout-logo" width={16} height={16} className="sm:w-8 sm:h-8 lg:size-12 object-contain" priority />

        <span className="text-lg sm:text-2xl text-black dark:text-white font-black tracking-tighter italic">GUT OUT</span>
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
  )
}

export default Navbar