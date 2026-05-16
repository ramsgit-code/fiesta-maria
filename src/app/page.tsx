import ContadorInvitados from '@/components/ContadorInvitados'
import RsvpForm from '@/components/RsvpForm'

const agenda = [
  { emoji: '🚗', hora: '12–13h', titulo: 'Llegada de invitados' },
  { emoji: '🥂', hora: '', titulo: 'Aperitivo' },
  { emoji: '🍽️', hora: '', titulo: 'Comida' },
  { emoji: '🎶', hora: '', titulo: 'Fiesta · Piscina · DJ' },
]

const menu = [
  { emoji: '🫙', categoria: 'Picoteo', item: 'Ensaladilla rusa, tortilla de patatas, embutido y más...' },
  { emoji: '🥘', categoria: 'Primero', item: 'Paella de marisco y carne' },
  { emoji: '🔥', categoria: 'Segundo', item: 'Barbacoa' },
  { emoji: '🤫', categoria: 'Postre', item: 'Sorpresa' },
  { emoji: '🍺', categoria: 'Bebida', item: 'Alcohol, cerveza, vino y refrescos — barra libre' },
]

const fotos = [
  'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto1.jpeg',
  'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto3.jpeg',
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">

      {/* Hero */}
      <section className="text-center">
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1a3a6b] leading-tight">
          La Jura de María
        </h1>
        <p className="text-gray-400 text-sm mt-2 mb-3">Promoción 40 · Policía Nacional Escala Básica</p>

        {/* Línea decorativa */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-12 bg-[#c9a84c]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          <div className="h-px w-12 bg-[#c9a84c]" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-sm mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#c9a84c]">📅</span>
            <span className="font-semibold text-[#1a3a6b]">Sábado, 30 de mayo de 2026</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-[#c9a84c]">📍</span>
            <span className="font-semibold text-[#1a3a6b]">Finca familiar · Gemuño, Ávila</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-[#c9a84c]">🕐</span>
            <span className="font-semibold text-[#1a3a6b]">12:00h</span>
          </div>
        </div>

        {/* Contador protagonista */}
        <div className="inline-block bg-[#1a3a6b] rounded-2xl px-8 py-5">
          <ContadorInvitados />
        </div>
      </section>

      {/* RSVP con fondo y borde */}
      <div data-section="rsvp" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <RsvpForm />
      </div>

      {/* Vídeo */}
      <section>
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">La finca</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a3a6b] mb-4">Vista desde el aire</h2>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <video controls autoPlay muted loop playsInline className="w-full" style={{ maxHeight: '420px', objectFit: 'cover' }}>
            <source src="https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/VideoFincaMery_web.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Galería — fotos más grandes */}
      <section>
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Galería</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a3a6b] mb-4">María</h2>
        <div className="grid grid-cols-2 gap-3">
          {fotos.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer">
              <img src={src} alt={`María ${i + 1}`} className="w-full h-56 sm:h-96 object-cover rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-zoom-in" />
            </a>
          ))}
        </div>
      </section>

      {/* Programa + Menú con iconos */}
      <div className="grid grid-cols-2 gap-4">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-1">Programa</p>
          <h2 className="font-serif text-lg font-bold text-[#1a3a6b] mb-3">El día</h2>
          <div className="space-y-2.5">
            {agenda.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="text-base leading-none mt-0.5">{item.emoji}</span>
                <div>
                  {item.hora && <p className="text-[#c9a84c] text-xs font-semibold">{item.hora}</p>}
                  <p className="text-xs text-gray-700">{item.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-1">Gastronomía</p>
          <h2 className="font-serif text-lg font-bold text-[#1a3a6b] mb-3">El menú</h2>
          <div className="space-y-2.5">
            {menu.map((cat) => (
              <div key={cat.categoria} className="flex items-start gap-2.5">
                <span className="text-base leading-none mt-0.5">{cat.emoji}</span>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold leading-tight">{cat.categoria}</p>
                  <p className="text-xs text-gray-700">{cat.item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Info en cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { emoji: '👗', titulo: 'Dress code', texto: 'Casual elegante. ¡Y no olvides el bañador!', link: null },
          { emoji: '🚗', titulo: 'Aparcamiento', texto: 'Disponible en la finca.', link: null },
          { emoji: '📍', titulo: 'Ubicación', texto: 'Ver en Google Maps →', link: 'https://maps.app.goo.gl/XSDpEvBDrP2LtbAY7' },
        ].map(({ emoji, titulo, texto, link }) => (
          <div key={titulo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className="text-2xl mb-2">{emoji}</div>
            <h3 className="font-semibold text-[#1a3a6b] text-xs uppercase tracking-wide mb-1">{titulo}</h3>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#c9a84c] font-semibold hover:underline">{texto}</a>
            ) : (
              <p className="text-xs text-gray-500">{texto}</p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
