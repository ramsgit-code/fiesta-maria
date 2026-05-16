import TareasClient from '@/components/TareasClient'
import PinGate from '@/components/PinGate'

export default function TareasPage() {
  return (
    <PinGate level="tasks">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Organización</p>
          <h1 className="font-serif text-3xl font-bold text-[#1a3a6b] mb-2">Lista de tareas</h1>
          <p className="text-gray-400 text-sm">Gestiona todo lo que hay que preparar para la fiesta.</p>
        </div>
        <TareasClient />
      </div>
    </PinGate>
  )
}
