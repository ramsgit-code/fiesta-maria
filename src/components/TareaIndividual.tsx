'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tarea } from '@/types/database'

export default function TareaIndividual({ id }: { id: string }) {
  const [tarea, setTarea] = useState<Tarea | null>(null)
  const [loading, setLoading] = useState(true)
  const [marcando, setMarcando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('tareas').select('*').eq('id', id).single()
      setTarea(data)
      setLoading(false)
    }
    cargar()
  }, [id])

  const marcarHecha = async () => {
    if (!tarea) return
    setMarcando(true)
    await fetch('/api/tarea/completar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tarea.id, completada: true }),
    })
    setTarea({ ...tarea, completada: true })
    setMarcando(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    )
  }

  if (!tarea) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-serif text-xl font-bold text-[#1a3a6b] mb-1">Tarea no encontrada</p>
          <p className="text-gray-400 text-sm">El enlace puede haber expirado o ser incorrecto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Fiesta de la Jura · María · 30 mayo 2026</p>
          <h1 className="font-serif text-2xl font-bold text-[#1a3a6b]">Tu tarea asignada</h1>
        </div>

        <div className={`bg-white rounded-2xl shadow-lg border p-6 mb-6 ${tarea.completada ? 'border-green-200' : 'border-gray-100'}`}>
          {tarea.completada && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-2 mb-4 text-sm font-medium">
              <span>✓</span> Marcada como completada
            </div>
          )}
          <h2 className={`font-serif text-xl font-bold mb-2 ${tarea.completada ? 'text-gray-400 line-through' : 'text-[#1a3a6b]'}`}>
            {tarea.titulo}
          </h2>
          {tarea.descripcion && (
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{tarea.descripcion}</p>
          )}
          {tarea.asignado_a && (
            <p className="text-xs text-gray-400">
              Asignada a: <span className="font-semibold text-[#1a3a6b]">{tarea.asignado_a}</span>
            </p>
          )}
        </div>

        {!tarea.completada ? (
          <button
            onClick={marcarHecha}
            disabled={marcando}
            className="w-full bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-50 text-white font-semibold py-4 rounded-full transition-all text-sm tracking-wide shadow-lg hover:shadow-xl"
          >
            {marcando ? 'Guardando...' : '✓ Marcar como completada'}
          </button>
        ) : (
          <div className="text-center text-gray-400 text-sm">
            ¡Gracias por tu ayuda! 🎉
          </div>
        )}
      </div>
    </div>
  )
}
