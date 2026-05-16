'use client'

import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="bg-[#1a3a6b] sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div>
          <p className="text-[#c9a84c] font-semibold text-sm tracking-wide leading-tight">Jura de la Policía Nacional</p>
          <p className="text-blue-300 text-xs leading-tight hidden sm:block">María · Promoción 40 · 30 mayo 2026</p>
        </div>
        <Link
          href="/"
          className="text-blue-200 hover:text-white text-sm font-medium transition-colors"
        >
          La Fiesta
        </Link>
      </div>
    </nav>
  )
}
