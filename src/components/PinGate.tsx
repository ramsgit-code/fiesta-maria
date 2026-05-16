'use client'

import { useState, useEffect } from 'react'

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '9999'
const TASKS_PIN = process.env.NEXT_PUBLIC_TASKS_PIN || '1234'

const SESSION_ADMIN = 'acceso_admin'
const SESSION_TASKS = 'acceso_tareas'

type Level = 'admin' | 'tasks'

export function hasAdminAccess() {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_ADMIN) === 'true'
}

export default function PinGate({ children, level }: { children: React.ReactNode; level: Level }) {
  const [acceso, setAcceso] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (level === 'admin' && sessionStorage.getItem(SESSION_ADMIN) === 'true') setAcceso(true)
    if (level === 'tasks' && (
      sessionStorage.getItem(SESSION_TASKS) === 'true' ||
      sessionStorage.getItem(SESSION_ADMIN) === 'true'
    )) setAcceso(true)
    setChecking(false)
  }, [level])

  const verificar = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_ADMIN, 'true')
      sessionStorage.setItem(SESSION_TASKS, 'true')
      setAcceso(true)
    } else if (level === 'tasks' && pin === TASKS_PIN) {
      sessionStorage.setItem(SESSION_TASKS, 'true')
      setAcceso(true)
    } else {
      setError(true)
      setPin('')
    }
  }

  if (checking) return null
  if (acceso) return <>{children}</>

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="font-serif text-2xl font-bold text-[#1a3a6b] mb-1">Acceso privado</h2>
        <p className="text-gray-400 text-sm mb-8">Introduce el código para continuar</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          placeholder="····"
          autoFocus
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && verificar()}
          className={`w-full text-center text-2xl tracking-[0.5em] px-4 py-3 border rounded-xl focus:outline-none focus:border-[#1a3a6b] mb-2 transition-colors ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        />
        {error && <p className="text-red-400 text-xs mb-2">Código incorrecto</p>}
        <button
          onClick={verificar}
          className="w-full mt-4 bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-semibold py-3 rounded-full transition-all text-sm"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}
