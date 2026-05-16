'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'La Fiesta', icon: '🎉' },
  { href: '/tareas', label: 'Tareas', icon: '✅' },
  { href: '/invitados', label: 'Invitados', icon: '👥' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <>
      {/* Nav escritorio (top) */}
      <nav className="bg-[#1a3a6b] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">👮‍♀️</span>
            <div>
              <p className="font-bold text-xs sm:text-sm leading-tight text-[#c9a84c]">Jura de la Policía</p>
              <p className="text-xs text-blue-200 leading-tight hidden sm:block">María · Promoción 41</p>
            </div>
          </div>
          {/* Links ocultos en móvil (se usa bottom nav) */}
          <div className="hidden sm:flex gap-1">
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? 'bg-[#c9a84c] text-white shadow-md'
                    : 'text-blue-100 hover:bg-blue-700/50'
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom nav solo en móvil */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#1a3a6b] border-t border-blue-800 flex">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-all ${
              pathname === href
                ? 'text-[#c9a84c]'
                : 'text-blue-300'
            }`}
          >
            <span className="text-xl">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Espaciado para que el bottom nav no tape contenido */}
      <div className="sm:hidden h-16" />
    </>
  )
}
