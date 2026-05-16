'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Invitado } from '@/types/database'

export default function InvitadosClient() {
  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAnadir, setModalAnadir] = useState(false)
  const [modalConfirmar, setModalConfirmar] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'confirmados' | 'pendientes'>('todos')

  const [nuevoInvitado, setNuevoInvitado] = useState({
    nombre: '', email: '', telefono: '', num_acompanantes: 0, comentario: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [nombreConfirmar, setNombreConfirmar] = useState('')
  const [resultadoBusqueda, setResultadoBusqueda] = useState<Invitado[]>([])
  const [invitadoEditando, setInvitadoEditando] = useState<Invitado | null>(null)
  const [editForm, setEditForm] = useState({ nombre: '', email: '', telefono: '', num_acompanantes: 0, comentario: '', bebida: '', confirmado: false })
  const [guardandoEdit, setGuardandoEdit] = useState(false)

  const cargarInvitados = async () => {
    const { data } = await supabase
      .from('invitados')
      .select('*')
      .order('nombre', { ascending: true })
    if (data) setInvitados(data)
    setLoading(false)
  }

  useEffect(() => {
    cargarInvitados()

    const channel = supabase
      .channel('invitados-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitados' }, () => {
        cargarInvitados()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const añadirInvitado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoInvitado.nombre.trim()) return
    setGuardando(true)
    await supabase.from('invitados').insert({
      nombre: nuevoInvitado.nombre.trim(),
      email: nuevoInvitado.email.trim() || null,
      telefono: nuevoInvitado.telefono.trim() || null,
      num_acompanantes: nuevoInvitado.num_acompanantes,
      comentario: nuevoInvitado.comentario.trim() || null,
      confirmado: false,
    })
    setNuevoInvitado({ nombre: '', email: '', telefono: '', num_acompanantes: 0, comentario: '' })
    setModalAnadir(false)
    setGuardando(false)
  }

  const toggleConfirmado = async (invitado: Invitado) => {
    await supabase
      .from('invitados')
      .update({ confirmado: !invitado.confirmado })
      .eq('id', invitado.id)
  }

  const eliminarInvitado = async (id: string) => {
    if (!confirm('¿Eliminar este invitado?')) return
    await supabase.from('invitados').delete().eq('id', id)
  }

  const abrirEditar = (inv: Invitado) => {
    setInvitadoEditando(inv)
    setEditForm({
      nombre: inv.nombre,
      email: inv.email || '',
      telefono: inv.telefono || '',
      num_acompanantes: inv.num_acompanantes,
      comentario: inv.comentario || '',
      bebida: inv.bebida || '',
      confirmado: inv.confirmado,
    })
  }

  const guardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitadoEditando) return
    setGuardandoEdit(true)
    await supabase.from('invitados').update({
      nombre: editForm.nombre.trim(),
      email: editForm.email.trim() || null,
      telefono: editForm.telefono.trim() || null,
      num_acompanantes: editForm.num_acompanantes,
      comentario: editForm.comentario.trim() || null,
      bebida: editForm.bebida.trim() || null,
      confirmado: editForm.confirmado,
    }).eq('id', invitadoEditando.id)
    setInvitadoEditando(null)
    setGuardandoEdit(false)
  }

  const buscarParaConfirmar = () => {
    const nombre = nombreConfirmar.trim().toLowerCase()
    if (!nombre) return
    const resultados = invitados.filter((i) =>
      i.nombre.toLowerCase().includes(nombre)
    )
    setResultadoBusqueda(resultados)
  }

  const invitadosFiltrados = invitados
    .filter((i) => {
      if (filtro === 'confirmados') return i.confirmado
      if (filtro === 'pendientes') return !i.confirmado
      return true
    })
    .filter((i) => {
      if (!busqueda.trim()) return true
      return i.nombre.toLowerCase().includes(busqueda.toLowerCase())
    })

  const confirmados = invitados.filter((i) => i.confirmado)
  const totalPersonas = confirmados.reduce((acc, i) => acc + 1 + i.num_acompanantes, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-spin">⚙️</div>
          <p className="text-gray-500">Cargando invitados...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Invitados', value: invitados.length, icon: '👥', color: 'text-[#1a3a6b]' },
          { label: 'Confirmados', value: confirmados.length, icon: '✅', color: 'text-green-600' },
          { label: 'Sin confirmar', value: invitados.length - confirmados.length, icon: '⏳', color: 'text-orange-500' },
          { label: 'Total asistentes', value: totalPersonas, icon: '🎉', color: 'text-[#c9a84c]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setModalAnadir(true)}
          className="bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-semibold py-2 px-5 rounded-lg shadow transition-all flex items-center gap-2 text-sm"
        >
          <span>+</span> Añadir invitado
        </button>
        <button
          onClick={() => { setModalConfirmar(true); setResultadoBusqueda([]); setNombreConfirmar('') }}
          className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold py-2 px-5 rounded-lg shadow transition-all flex items-center gap-2 text-sm"
        >
          <span>✅</span> Confirmar asistencia
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800 text-sm bg-white"
        />
        <div className="flex gap-2">
          {(['todos', 'confirmados', 'pendientes'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filtro === f
                  ? 'bg-[#1a3a6b] text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a6b]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de invitados */}
      {invitadosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-gray-500">
            {invitados.length === 0 ? 'Todavía no hay invitados. ¡Añade el primero!' : 'No hay resultados.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {invitadosFiltrados.map((inv) => (
            <div
              key={inv.id}
              className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 transition-all ${
                inv.confirmado ? 'border-green-200' : 'border-gray-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  inv.confirmado ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                {inv.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800">{inv.nombre}</p>
                  {inv.num_acompanantes > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      +{inv.num_acompanantes} acompañante{inv.num_acompanantes > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
                  {inv.email && <span>✉️ {inv.email}</span>}
                  {inv.telefono && <span>📱 {inv.telefono}</span>}
                  {inv.bebida && <span>🥃 {inv.bebida}</span>}
                </div>
                {inv.comentario && (
                  <p className="text-xs text-gray-500 mt-1 italic">"{inv.comentario}"</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleConfirmado(inv)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    inv.confirmado
                      ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600'
                      : 'bg-orange-100 text-orange-600 hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  {inv.confirmado ? '✅ Confirmado' : '⏳ Pendiente'}
                </button>
                <button
                  onClick={() => abrirEditar(inv)}
                  className="text-gray-300 hover:text-[#1a3a6b] transition-colors text-sm"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => eliminarInvitado(inv.id)}
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

      {/* Modal añadir invitado */}
      {modalAnadir && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-[#1a3a6b]">Añadir invitado</h3>
            </div>
            <form onSubmit={añadirInvitado} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Nombre del invitado"
                  value={nuevoInvitado.nombre}
                  onChange={(e) => setNuevoInvitado((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="opcional"
                    value={nuevoInvitado.email}
                    onChange={(e) => setNuevoInvitado((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="opcional"
                    value={nuevoInvitado.telefono}
                    onChange={(e) => setNuevoInvitado((f) => ({ ...f, telefono: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Acompañantes adicionales
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={nuevoInvitado.num_acompanantes}
                  onChange={(e) => setNuevoInvitado((f) => ({ ...f, num_acompanantes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Notas
                </label>
                <textarea
                  rows={2}
                  placeholder="Alergias, restricciones, etc."
                  value={nuevoInvitado.comentario}
                  onChange={(e) => setNuevoInvitado((f) => ({ ...f, comentario: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAnadir(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all shadow"
                >
                  {guardando ? 'Guardando...' : 'Añadir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar invitado */}
      {invitadoEditando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-[#1a3a6b]">Editar invitado</h3>
            </div>
            <form onSubmit={guardarEdicion} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nombre *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={editForm.nombre}
                  onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.telefono}
                    onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Acompañantes adicionales</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={editForm.num_acompanantes}
                  onChange={(e) => setEditForm((f) => ({ ...f, num_acompanantes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Bebida</label>
                <select
                  value={editForm.bebida}
                  onChange={(e) => setEditForm((f) => ({ ...f, bebida: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                >
                  <option value="">Sin especificar</option>
                  <option value="cerveza">Cerveza</option>
                  <option value="vino">Vino</option>
                  <option value="whisky">Whisky</option>
                  <option value="ron">Ron</option>
                  <option value="ginebra">Ginebra</option>
                  <option value="vodka">Vodka</option>
                  <option value="refresco">Refresco / sin alcohol</option>
                  <option value="de_todo">De todo un poco</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notas</label>
                <textarea
                  rows={2}
                  value={editForm.comentario}
                  onChange={(e) => setEditForm((f) => ({ ...f, comentario: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, confirmado: !f.confirmado }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    editForm.confirmado ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {editForm.confirmado ? '✅ Confirmado' : '⏳ Pendiente'}
                </button>
                <span className="text-xs text-gray-400">Pulsa para cambiar</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInvitadoEditando(null)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoEdit}
                  className="flex-1 bg-[#1a3a6b] hover:bg-[#0f2347] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all shadow"
                >
                  {guardandoEdit ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar asistencia */}
      {modalConfirmar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1a3a6b]">Confirmar asistencia</h3>
              <p className="text-sm text-gray-500 mt-1">Busca tu nombre y confirma que vas a venir.</p>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  autoFocus
                  placeholder="Tu nombre..."
                  value={nombreConfirmar}
                  onChange={(e) => setNombreConfirmar(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarParaConfirmar()}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-800"
                />
                <button
                  onClick={buscarParaConfirmar}
                  className="bg-[#1a3a6b] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#0f2347] transition-all"
                >
                  Buscar
                </button>
              </div>

              {resultadoBusqueda.length > 0 && (
                <div className="space-y-2">
                  {resultadoBusqueda.map((inv) => (
                    <div
                      key={inv.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        inv.confirmado ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{inv.nombre}</p>
                        {inv.num_acompanantes > 0 && (
                          <p className="text-xs text-gray-500">+{inv.num_acompanantes} acompañante(s)</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleConfirmado(inv)}
                        className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                          inv.confirmado
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-[#c9a84c] text-white hover:bg-[#b8973b]'
                        }`}
                      >
                        {inv.confirmado ? '✅ ¡Confirmado!' : 'Confirmar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {resultadoBusqueda.length === 0 && nombreConfirmar && (
                <p className="text-center text-gray-500 text-sm py-4">
                  No se encontró ningún invitado con ese nombre. Pide que te añadan a la lista.
                </p>
              )}

              <button
                onClick={() => setModalConfirmar(false)}
                className="w-full mt-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
