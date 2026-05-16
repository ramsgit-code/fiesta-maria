'use client'

import { useState } from 'react'

const BEBIDAS = [
  { value: '', label: 'Selecciona...' },
  { value: 'cerveza', label: 'Cerveza' },
  { value: 'vino', label: 'Vino' },
  { value: 'whisky', label: 'Whisky' },
  { value: 'ron', label: 'Ron' },
  { value: 'ginebra', label: 'Ginebra' },
  { value: 'vodka', label: 'Vodka' },
  { value: 'refresco', label: 'Refresco / sin alcohol' },
  { value: 'de_todo', label: 'De todo un poco' },
]

function SelectBebida({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 text-sm"
    >
      {BEBIDAS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
    </select>
  )
}

export default function RsvpForm() {
  const [form, setForm] = useState({ nombre: '', email: '', num_acompanantes: 0, comentario: '', bebida: '' })
  const [bebidasAcomp, setBebidasAcomp] = useState<string[]>([])
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'duplicado' | 'error'>('idle')

  const setNumAcomp = (n: number) => {
    setForm((f) => ({ ...f, num_acompanantes: n }))
    setBebidasAcomp((prev) => {
      const arr = [...prev]
      while (arr.length < n) arr.push('')
      return arr.slice(0, n)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEstado('enviando')
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, bebidas_acompanantes: bebidasAcomp }),
    })
    if (res.ok) {
      setEstado('ok')
    } else {
      const data = await res.json()
      setEstado(data.error === 'ya_registrado' ? 'duplicado' : 'error')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="py-10 text-center border border-green-100 bg-green-50 rounded-2xl">
        <p className="text-3xl mb-3">🎉</p>
        <p className="font-serif text-xl font-bold text-[#1a3a6b] mb-1">¡Confirmado!</p>
        <p className="text-gray-500 text-sm">¡Nos vemos el 30 de mayo!</p>
      </div>
    )
  }

  return (
    <section>
      <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Asistencia</p>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a3a6b] mb-1">¿Vienes a la fiesta?</h2>
      <p className="text-gray-500 text-sm mb-6">Confirma tu asistencia y te enviaremos todos los detalles por email.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Nombre *</label>
            <input
              type="text"
              required
              placeholder="Tu nombre completo"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 placeholder-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Email *</label>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 placeholder-gray-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
            ¿Cuántos acompañantes traes?
          </label>
          <select
            value={form.num_acompanantes}
            onChange={(e) => setNumAcomp(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 text-sm"
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n === 0 ? 'Vengo solo/a' : `${n} acompañante${n > 1 ? 's' : ''}`}</option>
            ))}
          </select>
        </div>

        {/* Bebida principal */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
            ¿Qué bebes tú?
          </label>
          <SelectBebida value={form.bebida} onChange={(v) => setForm((f) => ({ ...f, bebida: v }))} />
        </div>

        {/* Bebidas acompañantes */}
        {bebidasAcomp.map((b, i) => (
          <div key={i}>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
              ¿Qué bebe el acompañante {i + 1}?
            </label>
            <SelectBebida
              value={b}
              onChange={(v) => setBebidasAcomp((arr) => arr.map((x, j) => j === i ? v : x))}
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
            Nota (opcional)
          </label>
          <input
            type="text"
            placeholder="Alergias, petición musical, lo que quieras..."
            value={form.comentario}
            onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 placeholder-gray-300 text-sm"
          />
        </div>

        {estado === 'duplicado' && (
          <p className="text-amber-500 text-sm bg-amber-50 px-4 py-2 rounded-xl">Ya tienes la asistencia confirmada con este email.</p>
        )}
        {estado === 'error' && (
          <p className="text-red-400 text-sm">Hubo un error. Inténtalo de nuevo.</p>
        )}

        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="w-full sm:w-auto bg-[#c9a84c] hover:bg-[#b8973b] disabled:opacity-50 text-white font-semibold py-3.5 px-10 rounded-full transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
        >
          {estado === 'enviando' ? 'Confirmando...' : '¡Confirmo mi asistencia!'}
        </button>
      </form>
    </section>
  )
}
