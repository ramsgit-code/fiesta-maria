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
    <div className="space-y-4">
      {/* Cuenta atrás */}
      {countdown && (
        <div className="flex justify-center gap-3 sm:gap-6">
          {[
            { valor: countdown.dias, label: 'días' },
            { valor: countdown.horas, label: 'horas' },
            { valor: countdown.min, label: 'min' },
            { valor: countdown.seg, label: 'seg' },
          ].map(({ valor, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-[#1a3a6b] tabular-nums w-14 sm:w-16">
                {String(valor).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Confirmados */}
      {confirmados !== null && (
        <p className="text-sm text-gray-500">
          <span className="font-bold text-[#1a3a6b]">{confirmados}</span> persona{confirmados !== 1 ? 's' : ''} confirmada{confirmados !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
