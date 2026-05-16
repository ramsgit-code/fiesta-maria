'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContadorInvitados() {
  const [total, setTotal] = useState<number | null>(null)
  const [confirmados, setConfirmados] = useState<number | null>(null)

  const cargar = async () => {
    const { data } = await supabase.from('invitados').select('confirmado, num_acompanantes')
    if (data) {
      // Cada persona cuenta como 1 + sus acompañantes
      const totalPersonas = data.reduce((sum, i) => sum + 1 + (i.num_acompanantes || 0), 0)
      const confirmadosPersonas = data
        .filter((i) => i.confirmado)
        .reduce((sum, i) => sum + 1 + (i.num_acompanantes || 0), 0)
      setTotal(totalPersonas)
      setConfirmados(confirmadosPersonas)
    }
  }

  useEffect(() => {
    cargar()
    const channel = supabase
      .channel('invitados-counter')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitados' }, cargar)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  if (total === null) return null

  return (
    <div className="inline-flex items-center gap-6 py-3 px-6 bg-[#1a3a6b]/5 rounded-2xl">
      <div className="text-center">
        <p className="text-2xl font-bold text-[#1a3a6b]">{total}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Invitados</p>
      </div>
      <div className="w-px h-8 bg-gray-200" />
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{confirmados}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Confirmados</p>
      </div>
      <div className="w-px h-8 bg-gray-200" />
      <div className="text-center">
        <p className="text-2xl font-bold text-orange-400">{(total ?? 0) - (confirmados ?? 0)}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Pendientes</p>
      </div>
    </div>
  )
}
