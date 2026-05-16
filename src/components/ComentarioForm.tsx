'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ComentarioForm() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.mensaje.trim()) return

    setEstado('enviando')
    const { error } = await supabase.from('comentarios').insert({
      nombre: form.nombre.trim(),
      email: form.email.trim() || null,
      mensaje: form.mensaje.trim(),
    })

    if (error) {
      setEstado('error')
    } else {
      setEstado('ok')
      setForm({ nombre: '', email: '', mensaje: '' })
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1a3a6b] mb-2 flex items-center gap-2">
        <span>💬</span> ¿Tienes algo que decir?
      </h2>
      <p className="text-gray-500 text-sm mb-5">
        Déjanos un mensaje, petición o simplemente dinos que estás emocionado/a por la celebración.
      </p>

      {estado === 'ok' ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-bold text-[#1a3a6b] text-lg">¡Mensaje enviado!</p>
          <p className="text-gray-500 text-sm mt-1">Gracias por tu mensaje. ¡Nos vemos el 30 de mayo!</p>
          <button
            onClick={() => setEstado('idle')}
            className="mt-4 text-sm text-[#1a3a6b] underline hover:text-[#c9a84c] transition-colors"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Nombre *
              </label>
              <input
                type="text"
                required
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent transition-all bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Email (opcional)
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent transition-all bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Mensaje o petición *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Escribe tu mensaje, petición musical, alérgias alimentarias..."
              value={form.mensaje}
              onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent transition-all bg-white text-gray-800 placeholder-gray-400 resize-none"
            />
          </div>
          {estado === 'error' && (
            <p className="text-red-500 text-sm">Hubo un error al enviar. Inténtalo de nuevo.</p>
          )}
          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-60 text-white font-semibold py-2.5 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      )}
    </section>
  )
}
