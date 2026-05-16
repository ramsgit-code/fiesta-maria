'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const FIESTA = new Date('2026-05-30T12:00:00')

function useCountdown() {
  const [diff, setDiff] = useState(() => FIESTA.getTime() - Date.now())

  useEffect(() => {
    const id = setInterval(() => setDiff(FIESTA.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (diff <= 0) return null

  const dias = Math.floor(diff / 86400000)
  const horas = Math.floor((diff % 86400000) / 3600000)
  const min = Math.floor((diff % 3600000) / 60000)
  const seg = Math.floor((diff % 60000) / 1000)
  return { dias, horas, min, seg }
}

export default function ContadorInvitados() {
  const [confirmados, setConfirmados] = useState<number | null>(null)
  const countdown = useCountdown()

  const cargar = async () => {
    const { data } = await supabase.from('invitados').select('num_acompanantes').eq('confirmado', true)
    if (data) {
      setConfirmados(data.reduce((sum, i) => sum + 1 + (i.num_acompanantes || 0), 0))
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

  return (
    <div className="flex justify-center items-center gap-5 sm:gap-8 flex-wrap">
      {/* Confirmados — grande */}
      {confirmados !== null && (
        <div className="text-center">
          <p className="text-5xl sm:text-6xl font-bold text-[#1a3a6b]">{confirmados}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">invitados confirmados</p>
        </div>
      )}

      {confirmados !== null && countdown && (
        <div className="w-px h-10 bg-gray-200 hidden sm:block" />
      )}

      {/* Cuenta atrás — pequeña */}
      {countdown && (
        <div className="flex items-end gap-2 sm:gap-3">
          {[
            { valor: countdown.dias, label: 'd' },
            { valor: countdown.horas, label: 'h' },
            { valor: countdown.min, label: 'm' },
            { valor: countdown.seg, label: 's' },
          ].map(({ valor, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg sm:text-xl font-bold text-[#1a3a6b] tabular-nums">{String(valor).padStart(2, '0')}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
