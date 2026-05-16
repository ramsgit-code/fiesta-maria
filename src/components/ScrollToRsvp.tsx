'use client'

export default function ScrollToRsvp() {
  return (
    <button
      onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
      className="mt-4 text-sm font-semibold text-[#c9a84c] hover:underline animate-pulse-glow"
    >
      ¿Vienes? Confirma tu asistencia →
    </button>
  )
}
