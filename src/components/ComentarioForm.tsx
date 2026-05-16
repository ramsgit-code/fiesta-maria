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
    <section>
      <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Contacto</p>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a3a6b] mb-2">Déjanos un mensaje</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-md">
        Peticiones musicales, alergias, o simplemente que nos digas que estás emocionado/a.
      </p>

      {estado === 'ok' ? (
        <div className="py-12 text-center border border-gray-200 rounded-2xl bg-white">
          <p className="font-serif text-2xl font-bold text-[#1a3a6b] mb-2">¡Mensaje enviado!</p>
          <p className="text-gray-500 text-sm">Nos vemos el 30 de mayo.</p>
          <button
            onClick={() => setEstado('idle')}
            className="mt-6 text-sm text-[#c9a84c] hover:underline transition-colors"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                Nombre *
              </label>
              <input
                type="text"
                required
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 placeholder-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                Email (opcional)
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 placeholder-gray-300 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
              Mensaje *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tu mensaje, petición musical, alergias..."
              value={form.mensaje}
              onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a3a6b] transition-colors bg-white text-gray-800 placeholder-gray-300 resize-none text-sm"
            />
          </div>
          {estado === 'error' && (
            <p className="text-red-400 text-sm">Hubo un error al enviar. Inténtalo de nuevo.</p>
          )}
          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-50 text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
          >
            {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      )}
    </section>
  )
}
