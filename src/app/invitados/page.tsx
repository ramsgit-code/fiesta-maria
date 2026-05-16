import InvitadosClient from '@/components/InvitadosClient'

export default function InvitadosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-block bg-[#1a3a6b] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
          Lista de invitados
        </div>
        <h1 className="text-3xl font-bold text-[#1a3a6b] mb-2">¿Quién viene? 👥</h1>
        <p className="text-gray-500">
          Gestiona la lista de invitados. Añade personas y confirma quién ha confirmado asistencia.
          Los datos se actualizan en tiempo real.
        </p>
      </div>
      <InvitadosClient />
    </div>
  )
}
