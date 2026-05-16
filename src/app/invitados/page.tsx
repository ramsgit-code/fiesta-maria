import Link from 'next/link'
import InvitadosClient from '@/components/InvitadosClient'
import PinGate from '@/components/PinGate'

export default function InvitadosPage() {
  return (
    <PinGate level="admin">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Invitados</p>
          <h1 className="font-serif text-3xl font-bold text-[#1a3a6b] mb-2">Lista de invitados</h1>
          <p className="text-gray-400 text-sm">Gestiona quién viene y confirma asistencias en tiempo real.</p>
        </div>
        <InvitadosClient />
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-semibold py-3 px-8 rounded-full transition-all text-sm shadow">
            ← Ir a la página principal
          </Link>
        </div>
      </div>
    </PinGate>
  )
}
