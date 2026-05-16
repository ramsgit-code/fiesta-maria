import TareasClient from '@/components/TareasClient'

export default function TareasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-block bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
          Organización
        </div>
        <h1 className="text-3xl font-bold text-[#1a3a6b] mb-2">Lista de Tareas</h1>
        <p className="text-gray-500">
          Todo lo que hay que preparar para la fiesta. Marca las tareas como completadas cuando las termines.
        </p>
      </div>
      <TareasClient />
    </div>
  )
}
