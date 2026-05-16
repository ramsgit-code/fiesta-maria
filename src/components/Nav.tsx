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
    <nav className="bg-[#1a3a6b] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👮‍♀️</span>
          <div>
            <p className="font-bold text-sm leading-tight text-[#c9a84c]">Jura de la Policía</p>
            <p className="text-xs text-blue-200 leading-tight">María · Promoción 41</p>
          </div>
        </div>
        <div className="flex gap-1">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === href
                  ? 'bg-[#c9a84c] text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <span className="hidden sm:inline">{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
