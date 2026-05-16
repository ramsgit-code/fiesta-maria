import ContadorInvitados from '@/components/ContadorInvitados'
import RsvpForm from '@/components/RsvpForm'
import ScrollToRsvp from '@/components/ScrollToRsvp'

const agenda = [
  { hora: '12–13h', titulo: 'Llegada de invitados' },
  { hora: '', titulo: 'Aperitivo' },
  { hora: '', titulo: 'Comida' },
  { hora: '', titulo: 'Fiesta · Piscina · DJ · Cohetes' },
]

const menu = [
  { categoria: 'Picoteo', item: 'Ensaladilla rusa, tortilla de patatas, embutido y más...' },
  { categoria: 'Primero', item: 'Paella de marisco y carne' },
  { categoria: 'Segundo', item: 'Barbacoa' },
  { categoria: 'Postre', item: 'Sorpresa 🤫' },
  { categoria: 'Bebida', item: 'Alcohol, cerveza, vino y refrescos — barra libre' },
]

const fotos = [
  'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto1.jpeg',
  'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto2.jpeg',
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">

      {/* Hero compacto */}
      <section className="text-center">
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1a3a6b] leading-tight mb-1">
          La Jura de María
        </h1>
        <p className="text-gray-400 text-sm mb-4">Promoción 40 · Policía Nacional Escala Básica</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-sm mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-[#c9a84c]">📅</span>
            <span className="font-semibold text-[#1a3a6b]">Sábado, 30 de mayo de 2026</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-[#c9a84c]">📍</span>
            <span className="font-semibold text-[#1a3a6b]">Finca familiar · Gemuño, Ávila</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-[#c9a84c]">🕐</span>
            <span className="font-semibold text-[#1a3a6b]">12:00h</span>
          </div>
        </div>
        <ContadorInvitados />
        <ScrollToRsvp />
      </section>

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

      {/* Galería */}
      <section>
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Galería</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a3a6b] mb-4">María</h2>
        <div className="grid grid-cols-2 gap-3">
          {fotos.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer">
              <img src={src} alt={`María ${i + 1}`} className="w-full h-44 sm:h-72 object-cover rounded-xl shadow hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-zoom-in" />
            </a>
          ))}
        </div>
      </section>

      {/* Agenda + Menú en grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-1">Programa</p>
          <h2 className="font-serif text-xl font-bold text-[#1a3a6b] mb-4">El día</h2>
          <div className="space-y-3">
            {agenda.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center pt-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#c9a84c] flex-shrink-0" />
                  {i < agenda.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[12px]" />}
                </div>
                <div className="pb-1">
                  {item.hora && <p className="text-[#c9a84c] text-xs font-semibold">{item.hora}</p>}
                  <p className="font-medium text-gray-800 text-sm">{item.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-1">Gastronomía</p>
          <h2 className="font-serif text-xl font-bold text-[#1a3a6b] mb-4">El menú</h2>
          <div className="space-y-3">
            {menu.map((cat) => (
              <div key={cat.categoria} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c] flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{cat.categoria}</p>
                  <p className="text-sm text-gray-700">{cat.item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Info + Mapa en grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-6 h-px bg-[#c9a84c] mx-auto mb-3" />
          <h3 className="font-semibold text-[#1a3a6b] text-xs uppercase tracking-wide mb-1">Dress code</h3>
          <p className="text-xs text-gray-500">Casual elegante. Un toque de azul o dorado. ¡Y no olvides el bañador!</p>
        </div>
        <div className="text-center">
          <div className="w-6 h-px bg-[#c9a84c] mx-auto mb-3" />
          <h3 className="font-semibold text-[#1a3a6b] text-xs uppercase tracking-wide mb-1">Aparcamiento</h3>
          <p className="text-xs text-gray-500">Disponible en la finca. Compartir coche si podéis.</p>
        </div>
        <div className="text-center sm:col-span-1">
          <div className="w-6 h-px bg-[#c9a84c] mx-auto mb-3" />
          <h3 className="font-semibold text-[#1a3a6b] text-xs uppercase tracking-wide mb-1">Ubicación</h3>
          <a href="https://maps.app.goo.gl/XSDpEvBDrP2LtbAY7" target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#c9a84c] font-semibold hover:underline">
            Ver en Google Maps →
          </a>
        </div>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* RSVP */}
      <div data-section="rsvp">
        <RsvpForm />
      </div>


    </div>
  )
}
