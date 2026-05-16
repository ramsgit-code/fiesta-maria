-- Ejecutar en el SQL Editor de Supabase

-- Tabla de comentarios / peticiones del formulario
create table if not exists public.comentarios (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text,
  mensaje text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Tabla de tareas de organización
create table if not exists public.tareas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  asignado_a text,
  completada boolean default false not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Tabla de invitados
create table if not exists public.invitados (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text,
  telefono text,
  confirmado boolean default false not null,
  num_acompanantes integer default 0 not null,
  comentario text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Políticas de acceso público (Row Level Security)
alter table public.comentarios enable row level security;
alter table public.tareas enable row level security;
alter table public.invitados enable row level security;

-- Permitir lectura y escritura pública (la web es pública)
create policy "Lectura pública comentarios" on public.comentarios for select using (true);
create policy "Escritura pública comentarios" on public.comentarios for insert with check (true);

create policy "Lectura pública tareas" on public.tareas for select using (true);
create policy "Escritura pública tareas" on public.tareas for insert with check (true);
create policy "Actualización pública tareas" on public.tareas for update using (true);
create policy "Borrado público tareas" on public.tareas for delete using (true);

create policy "Lectura pública invitados" on public.invitados for select using (true);
create policy "Escritura pública invitados" on public.invitados for insert with check (true);
create policy "Actualización pública invitados" on public.invitados for update using (true);
create policy "Borrado público invitados" on public.invitados for delete using (true);

-- Habilitar replicación en tiempo real
alter publication supabase_realtime add table public.tareas;
alter publication supabase_realtime add table public.invitados;

-- Datos de ejemplo (tareas iniciales)
insert into public.tareas (titulo, descripcion, asignado_a) values
  ('Confirmar el catering', 'Hablar con el proveedor de comida y confirmar el menú final', null),
  ('Decoración de la finca', 'Comprar flores, guirnaldas y decoración temática policial', null),
  ('Playlist de música', 'Preparar la playlist para la celebración', null),
  ('Reservar sillas y mesas', 'Asegurarse de que hay suficiente mobiliario para todos', null),
  ('Preparar el photocall', 'Montar el photocall con el logo de la promoción 41', null);
