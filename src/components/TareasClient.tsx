'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tarea } from '@/types/database'

export default function TareasClient() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', descripcion: '', asignado_a: '', email_asignado: '' })
  const [guardando, setGuardando] = useState(false)
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'hechas'>('todas')
  const [toggling, setToggling] = useState<string | null>(null)

  const cargarTareas = async () => {
    const { data } = await supabase
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setTareas(data)
    setLoading(false)
  }

  useEffect(() => {
    cargarTareas()
    const channel = supabase
      .channel('tareas-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, cargarTareas)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const toggleCompletada = async (tarea: Tarea) => {
    setToggling(tarea.id)
    await fetch('/api/tarea/completar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tarea.id, completada: !tarea.completada }),
    })
    setToggling(null)
  }

  const eliminarTarea = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    await supabase.from('tareas').delete().eq('id', id)
  }

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevaTarea.titulo.trim()) return
    setGuardando(true)
    await fetch('/api/tarea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaTarea),
    })
    setNuevaTarea({ titulo: '', descripcion: '', asignado_a: '', email_asignado: '' })
    setModalAbierto(false)
    setGuardando(false)
  }

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'pendientes') return !t.completada
    if (filtro === 'hechas') return t.completada
    return true
  })

  const completadas = tareas.filter((t) => t.completada).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-400 text-sm">Cargando tareas...</p>
      </div>
    )
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: tareas.length, color: 'text-[#1a3a6b]' },
          { label: 'Completadas', value: completadas, color: 'text-green-600' },
          { label: 'Pendientes', value: tareas.length - completadas, color: 'text-orange-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progreso */}
      {tareas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-600">Progreso</span>
            <span className="text-[#1a3a6b] font-bold">{Math.round((completadas / tareas.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#c9a84c] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completadas / tareas.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Filtros + Añadir */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {(['todas', 'pendientes', 'hechas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                filtro === f ? 'bg-[#1a3a6b] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1a3a6b]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold py-2 px-5 rounded-full shadow transition-all flex items-center gap-1.5 text-sm"
        >
          + Nueva tarea
        </button>
      </div>

      {/* Lista */}
      {tareasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">
            {filtro === 'hechas' ? 'Todavía no hay tareas completadas.' : 'No hay tareas. ¡Añade la primera!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tareasFiltradas.map((tarea) => (
            <div
              key={tarea.id}
              className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 transition-all ${
                tarea.completada ? 'border-green-100 opacity-70' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => toggleCompletada(tarea)}
                disabled={toggling === tarea.id}
                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  tarea.completada
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 hover:border-[#1a3a6b]'
                } disabled:opacity-50`}
              >
                {tarea.completada && <span className="text-xs font-bold">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-gray-800 ${tarea.completada ? 'line-through text-gray-400' : ''}`}>
                  {tarea.titulo}
                </p>
                {tarea.descripcion && (
                  <p className="text-sm text-gray-500 mt-0.5">{tarea.descripcion}</p>
                )}
                {(tarea.asignado_a || tarea.email_asignado) && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {tarea.asignado_a && (
                      <span className="text-xs bg-blue-50 text-[#1a3a6b] font-medium px-2.5 py-0.5 rounded-full">
                        👤 {tarea.asignado_a}
                      </span>
                    )}
                    {tarea.email_asignado && (
                      <span className="text-xs bg-gray-50 text-gray-500 px-2.5 py-0.5 rounded-full">
                        ✉️ {tarea.email_asignado}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  tarea.completada ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                }`}>
                  {tarea.completada ? 'Hecho' : 'Pendiente'}
                </span>
                <button
                  onClick={() => eliminarTarea(tarea.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none"
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nueva tarea */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-[#1a3a6b]">Nueva tarea</h3>
            </div>
            <form onSubmit={crearTarea} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Tarea *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="¿Qué hay que hacer?"
                  value={nuevaTarea.titulo}
                  onChange={(e) => setNuevaTarea((f) => ({ ...f, titulo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] text-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Descripción (opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Más detalles..."
                  value={nuevaTarea.descripcion}
                  onChange={(e) => setNuevaTarea((f) => ({ ...f, descripcion: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] text-gray-800 resize-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre de la persona"
                    value={nuevaTarea.asignado_a}
                    onChange={(e) => setNuevaTarea((f) => ({ ...f, asignado_a: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    placeholder="para notificarle"
                    value={nuevaTarea.email_asignado}
                    onChange={(e) => setNuevaTarea((f) => ({ ...f, email_asignado: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] text-gray-800 text-sm"
                  />
                </div>
              </div>
              {nuevaTarea.email_asignado && (
                <p className="text-xs text-[#c9a84c] bg-amber-50 px-3 py-2 rounded-lg">
                  📧 Se enviará un email a {nuevaTarea.email_asignado} con los detalles de la tarea
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 py-3 rounded-full border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-all text-sm"
                >
                  {guardando ? 'Guardando...' : 'Crear tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
