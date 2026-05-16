import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Fiesta de la Jura · María · Promoción 40',
  description: 'Celebración de la Jura de la Policía Nacional de María, Promoción 40. Sábado 30 de mayo en la Finca de Gemuño.',
  openGraph: {
    title: 'Fiesta de la Jura · María · Promoción 40',
    description: '¡Acompáñanos a celebrar la Jura de la Policía Nacional de María!',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-full flex flex-col bg-[#f8f5f0]`}>
        <main className="flex-1">{children}</main>
        <footer className="bg-[#1a3a6b] text-blue-200 text-center text-xs py-4 mt-12">
          <p>Jura de la Policía Nacional · Promoción 40 · María · 30 de mayo de 2026</p>
          <a href="/admin" className="inline-block mt-2 text-blue-300/50 hover:text-blue-200 transition-colors text-xs">
            🔒 Admin
          </a>
        </footer>
      </body>
    </html>
  )
}
