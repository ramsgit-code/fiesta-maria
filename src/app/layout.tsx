import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fiesta de la Jura · María · Promoción 41',
  description: 'Celebración de la Jura de la Policía Nacional de María, Promoción 41. Sábado 30 de mayo en la Finca de Gemuño.',
  openGraph: {
    title: 'Fiesta de la Jura · María · Promoción 41',
    description: '¡Acompáñanos a celebrar la Jura de la Policía Nacional de María!',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#fdf8f0]`}>
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#1a3a6b] text-blue-200 text-center text-xs py-4 mt-12">
          <p>Jura de la Policía Nacional · Promoción 41 · María · 30 de mayo de 2026</p>
        </footer>
      </body>
    </html>
  )
}
