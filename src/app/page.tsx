import ComentarioForm from '@/components/ComentarioForm'

const agenda = [
  { hora: '12:00', titulo: 'Llegada de invitados', desc: 'Recepción en la finca de Gemuño' },
  { hora: '12:30', titulo: 'Ceremonia de Jura', desc: 'Acto oficial de la Jura de la Policía Nacional' },
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

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-10">

      {/* Hero */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1a3a6b] text-white shadow-2xl">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative p-6 sm:p-10 md:p-14 text-center">
          <div className="text-5xl sm:text-6xl mb-3">👮‍♀️🎖️</div>
          <div className="inline-block bg-[#c9a84c] text-white text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 sm:mb-4">
            Promoción 41 · Policía Nacional
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-3 leading-tight">
            ¡La Jura de María!
          </h1>
          <p className="text-blue-200 text-base sm:text-xl mb-6 sm:mb-8 max-w-xl mx-auto">
            Únete a nosotros para celebrar este momento tan especial con toda la familia y amigos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div className="text-left">
                <p className="text-blue-200 text-xs">Fecha</p>
                <p className="font-bold">Sábado, 30 de mayo de 2026</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div className="text-left">
                <p className="text-blue-200 text-xs">Lugar</p>
                <p className="font-bold">Finca familiar · Gemuño, Ávila</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3">
              <span className="text-2xl">🕐</span>
              <div className="text-left">
                <p className="text-blue-200 text-xs">Hora de inicio</p>
                <p className="font-bold">12:00h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vídeo de la finca */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a6b] flex items-center gap-2">
            <span>🎥</span> La Finca desde el aire
          </h2>
          <p className="text-gray-500 text-sm mt-1">Así es el lugar donde celebraremos este día tan especial.</p>
        </div>
        <video
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full"
          style={{ maxHeight: '480px', objectFit: 'cover' }}
        >
          <source src="https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/VideoFincaMery_web.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Agenda y Menú */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Agenda */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a6b] mb-4 sm:mb-5 flex items-center gap-2">
            <span>🗓️</span> El Plan del Día
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {agenda.map((item, i) => (
              <div key={i} className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-14 sm:w-16 text-right">
                  <span className="text-sm font-bold text-[#c9a84c]">{item.hora}</span>
                </div>
                <div className="flex gap-2 sm:gap-3 flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#1a3a6b] mt-1 flex-shrink-0" />
                    {i < agenda.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-3 sm:pb-4">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{item.titulo}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Menú */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a6b] mb-4 sm:mb-5 flex items-center gap-2">
            <span>🍽️</span> El Menú
          </h2>
          <div className="space-y-4 sm:space-y-5">
            {menu.map((cat) => (
              <div key={cat.categoria}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] mb-2">
                  {cat.categoria}
                </h3>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a6b] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Galería de fotos */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a6b] mb-4 flex items-center gap-2">
          <span>📸</span> Fotos de María
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto1.jpeg',
            'https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/foto2.jpeg',
          ].map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={src}
                alt={`Foto de María ${i + 1}`}
                className="w-full h-48 sm:h-72 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-zoom-in"
              />
            </a>
          ))}
        </div>
      </section>

      {/* Cómo llegar */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a6b] mb-3 flex items-center gap-2">
          <span>📍</span> Cómo Llegar
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          La fiesta se celebra en la finca familiar en <strong>Gemuño, Ávila</strong>. Municipio a pocos kilómetros de la capital abulense.
        </p>
        <a
          href="https://maps.app.goo.gl/XSDpEvBDrP2LtbAY7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full rounded-xl bg-[#1a3a6b] text-white font-semibold py-4 hover:bg-[#c9a84c] transition-colors text-sm sm:text-base"
        >
          <span>🗺️</span> Abrir ubicación en Google Maps
        </a>
      </section>

      {/* Info práctica */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: '👗', titulo: 'Dress code', desc: 'Casual elegante. ¡Pon un toque de azul o dorado en honor a María!' },
          { icon: '🅿️', titulo: 'Aparcamiento', desc: 'Hay parking en la finca. Si venís en grupo, mejor compartir coche.' },
          { icon: '📞', titulo: '¿Dudas?', desc: 'Escríbenos en el formulario de abajo o contacta directamente con la familia.' },
        ].map((card) => (
          <div key={card.titulo} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 text-center">
            <div className="text-3xl mb-2">{card.icon}</div>
            <h3 className="font-bold text-[#1a3a6b] mb-1 text-sm sm:text-base">{card.titulo}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Formulario de comentarios */}
      <ComentarioForm />
    </div>
  )
}
