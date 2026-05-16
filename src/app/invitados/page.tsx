import InvitadosClient from '@/components/InvitadosClient'
import PinGate from '@/components/PinGate'

export default function InvitadosPage() {
  return (
    <PinGate>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Invitados</p>
          <h1 className="font-serif text-3xl font-bold text-[#1a3a6b] mb-2">Lista de invitados</h1>
          <p className="text-gray-400 text-sm">Gestiona quién viene y confirma asistencias en tiempo real.</p>
        </div>
        <InvitadosClient />
      </div>
    </PinGate>
  )
}
