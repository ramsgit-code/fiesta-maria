import ComentarioForm from '@/components/ComentarioForm'

const agenda = [
  { hora: '12:00', titulo: 'Llegada de invitados', desc: 'Recepción en la finca de Gemuño' },
  { hora: '12:30', titulo: 'Ceremonia de Jura', desc: 'Acto oficial de la Policía Nacional' },
  { hora: '14:00', titulo: 'Aperitivo', desc: 'Bienvenida y brindis de celebración' },
  { hora: '15:00', titulo: 'Comida', desc: 'Comida campestre en la finca' },
  { hora: '18:00', titulo: 'Sobremesa y fiesta', desc: 'Música, baile y celebración' },
]

const menu = [
  { categoria: 'Aperitivos', items: ['Jamón ibérico y embutidos', 'Quesos variados', 'Croquetas caseras', 'Pinchos y tostas'] },
  { categoria: 'Primeros', items: ['Ensalada de la huerta', 'Gazpacho andaluz'] },
  { categoria: 'Segundos', items: ['Cordero asado al horno', 'Pollo al chilindrón'] },
  { categoria: 'Postres', items: ['Tarta de celebración', 'Frutas de temporada', 'Café e infusiones'] },
]

const fotos = [
  'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto1.jpeg',
  'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto2.jpeg',
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-20">

      {/* Hero */}
      <section className="text-center">
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-6">
          Policía Nacional · Promoción 41
        </p>
        <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#1a3a6b] leading-tight mb-6">
          La Jura de María
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Acompáñanos a celebrar este momento tan especial con toda la familia y amigos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-sm">
          <div className="text-center">
            <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase mb-1">Fecha</p>
            <p className="text-[#1a3a6b] font-semibold text-base">Sábado, 30 de mayo de 2026</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase mb-1">Lugar</p>
            <p className="text-[#1a3a6b] font-semibold text-base">Finca familiar · Gemuño, Ávila</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase mb-1">Hora</p>
            <p className="text-[#1a3a6b] font-semibold text-base">12:00h</p>
          </div>
        </div>
      </section>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Vídeo */}
      <section>
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">La finca</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a3a6b] mb-6">Vista desde el aire</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <video
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          >
            <source src="https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/VideoFincaMery_web.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Galería */}
      <section>
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Galería</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a3a6b] mb-6">María</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {fotos.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer">
              <img
                src={src}
                alt={`María ${i + 1}`}
                className="w-full h-52 sm:h-80 object-cover rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-zoom-in"
              />
            </a>
          ))}
        </div>
      </section>

      {/* Agenda + Menú */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
        <section>
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Programa</p>
          <h2 className="font-serif text-3xl font-bold text-[#1a3a6b] mb-8">El día</h2>
          <div className="space-y-6">
            {agenda.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#c9a84c] mt-1.5 flex-shrink-0" />
                  {i < agenda.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
                </div>
                <div className="pb-4">
                  <p className="text-[#c9a84c] text-xs font-semibold tracking-wide mb-0.5">{item.hora}h</p>
                  <p className="font-semibold text-[#1a3a6b]">{item.titulo}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Gastronomía</p>
          <h2 className="font-serif text-3xl font-bold text-[#1a3a6b] mb-8">El menú</h2>
          <div className="space-y-6">
            {menu.map((cat) => (
              <div key={cat.categoria}>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">{cat.categoria}</p>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <span className="w-1 h-1 rounded-full bg-[#c9a84c] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Cómo llegar */}
      <section className="text-center">
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Ubicación</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a3a6b] mb-3">Cómo llegar</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          Finca familiar en Gemuño, Ávila. A pocos kilómetros de la capital abulense.
        </p>
        <a
          href="https://maps.app.goo.gl/XSDpEvBDrP2LtbAY7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-sm tracking-wide"
        >
          Ver en Google Maps
        </a>
      </section>

      {/* Info práctica */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { titulo: 'Dress code', desc: 'Casual elegante. Un toque de azul o dorado en honor a María.' },
          { titulo: 'Aparcamiento', desc: 'Disponible en la finca. Si venís en grupo, mejor compartir coche.' },
          { titulo: '¿Dudas?', desc: 'Déjanos un mensaje en el formulario de abajo.' },
        ].map((card) => (
          <div key={card.titulo} className="text-center">
            <div className="w-8 h-px bg-[#c9a84c] mx-auto mb-4" />
            <h3 className="font-semibold text-[#1a3a6b] mb-2 text-sm tracking-wide uppercase">{card.titulo}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Formulario */}
      <ComentarioForm />

    </div>
  )
}
