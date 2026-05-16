'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'La Fiesta' },
  { href: '/tareas', label: 'Tareas' },
  { href: '/invitados', label: 'Invitados' },
]

const icons: Record<string, string> = {
  '/': '🎉',
  '/tareas': '✅',
  '/invitados': '👥',
}

export default function Nav() {
  const pathname = usePathname()

  return (
    <>
      <nav className="bg-[#1a3a6b] sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div>
            <p className="text-[#c9a84c] font-semibold text-sm tracking-wide leading-tight">Jura de la Policía Nacional</p>
            <p className="text-blue-300 text-xs leading-tight">María · Promoción 41 · 30 mayo 2026</p>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? 'bg-[#c9a84c] text-white'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom nav móvil */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#1a3a6b] border-t border-white/10 flex">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-all ${
              pathname === href ? 'text-[#c9a84c]' : 'text-blue-400'
            }`}
          >
            <span className="text-lg">{icons[href]}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="sm:hidden h-16" />
    </>
  )
}
