'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tarea } from '@/types/database'

export default function TareasClient() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', descripcion: '', asignado_a: '' })
  const [guardando, setGuardando] = useState(false)
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'hechas'>('todas')

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, () => {
        cargarTareas()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const toggleCompletada = async (tarea: Tarea) => {
    await supabase
      .from('tareas')
      .update({ completada: !tarea.completada })
      .eq('id', tarea.id)
  }

  const eliminarTarea = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    await supabase.from('tareas').delete().eq('id', id)
  }

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevaTarea.titulo.trim()) return
    setGuardando(true)
    await supabase.from('tareas').insert({
      titulo: nuevaTarea.titulo.trim(),
      descripcion: nuevaTarea.descripcion.trim() || null,
      asignado_a: nuevaTarea.asignado_a.trim() || null,
      completada: false,
    })
    setNuevaTarea({ titulo: '', descripcion: '', asignado_a: '' })
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
        <div className="text-center">
          <div className="text-4xl mb-2 animate-spin">⚙️</div>
          <p className="text-gray-500">Cargando tareas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: tareas.length, color: 'text-[#1a3a6b]' },
          { label: 'Completadas', value: completadas, color: 'text-green-600' },
          { label: 'Pendientes', value: tareas.length - completadas, color: 'text-orange-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      {tareas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700">Progreso general</span>
            <span className="text-[#1a3a6b] font-bold">
              {Math.round((completadas / tareas.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#c9a84c] h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completadas / tareas.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Filtros + Añadir */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          {(['todas', 'pendientes', 'hechas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                filtro === f
                  ? 'bg-[#1a3a6b] text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a6b]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold py-2 px-5 rounded-lg shadow transition-all flex items-center gap-2 text-sm"
        >
          <span>+</span> Nueva tarea
        </button>
      </div>

      {/* Lista de tareas */}
      {tareasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-gray-500">
            {filtro === 'hechas' ? 'Todavía no hay tareas completadas.' : 'No hay tareas. ¡Añade la primera!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tareasFiltradas.map((tarea) => (
            <div
              key={tarea.id}
              className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 transition-all ${
                tarea.completada ? 'border-green-200 opacity-75' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => toggleCompletada(tarea)}
                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  tarea.completada
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 hover:border-[#1a3a6b]'
                }`}
              >
                {tarea.completada && <span className="text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-gray-800 ${tarea.completada ? 'line-through text-gray-400' : ''}`}>
                  {tarea.titulo}
                </p>
                {tarea.descripcion && (
                  <p className="text-sm text-gray-500 mt-0.5">{tarea.descripcion}</p>
                )}
                {tarea.asignado_a && (
                  <p className="text-xs text-[#1a3a6b] font-medium mt-1.5 flex items-center gap-1">
                    <span>👤</span> {tarea.asignado_a}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {tarea.completada ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Hecho</span>
                ) : (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Pendiente</span>
                )}
                <button
                  onClick={() => eliminarTarea(tarea.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  title="Eliminar tarea"
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
              <h3 className="text-xl font-bold text-[#1a3a6b]">Nueva tarea</h3>
            </div>
            <form onSubmit={crearTarea} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Tarea *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="¿Qué hay que hacer?"
                  value={nuevaTarea.titulo}
                  onChange={(e) => setNuevaTarea((f) => ({ ...f, titulo: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Más detalles..."
                  value={nuevaTarea.descripcion}
                  onChange={(e) => setNuevaTarea((f) => ({ ...f, descripcion: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Asignar a (email o nombre)
                </label>
                <input
                  type="text"
                  placeholder="nombre@email.com o nombre"
                  value={nuevaTarea.asignado_a}
                  onChange={(e) => setNuevaTarea((f) => ({ ...f, asignado_a: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all shadow"
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
