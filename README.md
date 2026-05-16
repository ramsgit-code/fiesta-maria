# 👮‍♀️ Fiesta de la Jura de María · Promoción 41

Web de la celebración de la Jura de la Policía Nacional de María, Promoción 41.
**Sábado 30 de mayo de 2026 · Finca familiar en Gemuño, Ávila.**

## Páginas

- **`/`** — Info del evento: agenda, menú, mapa y formulario de comentarios
- **`/tareas`** — Gestión de tareas de organización con asignación y progreso en tiempo real
- **`/invitados`** — Lista de invitados con confirmación de asistencia en tiempo real

## Stack técnico

- **Next.js 14** (App Router) — Framework
- **Supabase** — Base de datos PostgreSQL + tiempo real + hosting de API
- **Tailwind CSS** — Estilos
- **Vercel** — Despliegue

---

## Configuración paso a paso

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. En el **SQL Editor**, ejecuta el contenido de `supabase/schema.sql`
4. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public` key

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Despliegue en Vercel

1. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub
2. Importa el repositorio `ramsgit-code/fiesta-maria`
3. En **Environment Variables**, añade las mismas variables de `.env.local`
4. Despliega

### 4. Dominio personalizado (opcional)

En Vercel → tu proyecto → **Settings → Domains**, puedes añadir un dominio como:
- `fiestapoliciamaria.es` (comprar en Namecheap, GoDaddy, etc.)
- `juramaria.com`

---

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local
# Rellena las variables de entorno
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).
