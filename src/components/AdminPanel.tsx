'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPanel() {
  const [stats, setStats] = useState({ invitados: 0, personas: 0, confirmados: 0, tareasTotales: 0, tareasHechas: 0 })

  useEffect(() => {
    const cargar = async () => {
      const [{ data: inv }, { data: tar }] = await Promise.all([
        supabase.from('invitados').select('confirmado, num_acompanantes'),
        supabase.from('tareas').select('completada'),
      ])
      if (inv) {
        const personas = inv.reduce((s, i) => s + 1 + (i.num_acompanantes || 0), 0)
        const confirmados = inv.filter((i) => i.confirmado).reduce((s, i) => s + 1 + (i.num_acompanantes || 0), 0)
        setStats((s) => ({ ...s, invitados: inv.length, personas, confirmados }))
      }
      if (tar) {
        setStats((s) => ({ ...s, tareasTotales: tar.length, tareasHechas: tar.filter((t) => t.completada).length }))
      }
    }
    cargar()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Panel privado</p>
      <h1 className="font-serif text-3xl font-bold text-[#1a3a6b] mb-8">Admin · Fiesta de María</h1>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Personas', value: stats.personas, color: 'text-[#1a3a6b]' },
          { label: 'Confirmados', value: stats.confirmados, color: 'text-green-600' },
          { label: 'Tareas totales', value: stats.tareasTotales, color: 'text-[#1a3a6b]' },
          { label: 'Completadas', value: stats.tareasHechas, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Accesos */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/invitados"
          className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-[#1a3a6b] transition-all"
        >
          <div className="text-3xl mb-3">👥</div>
          <h2 className="font-serif text-xl font-bold text-[#1a3a6b] mb-1">Invitados</h2>
          <p className="text-gray-400 text-sm mb-4">Gestiona la lista, añade personas y confirma asistencias.</p>
          <p className="text-xs font-semibold text-[#c9a84c] group-hover:underline">{stats.confirmados} de {stats.personas} confirmados →</p>
        </Link>

        <Link
          href="/tareas"
          className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-[#1a3a6b] transition-all"
        >
          <div className="text-3xl mb-3">✅</div>
          <h2 className="font-serif text-xl font-bold text-[#1a3a6b] mb-1">Tareas</h2>
          <p className="text-gray-400 text-sm mb-4">Crea y asigna tareas a los responsables de la fiesta.</p>
          <p className="text-xs font-semibold text-[#c9a84c] group-hover:underline">{stats.tareasHechas} de {stats.tareasTotales} completadas →</p>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-block bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-semibold py-3 px-8 rounded-full transition-all text-sm shadow">
          ← Ir a la página principal
        </Link>
      </div>
    </div>
  )
}
