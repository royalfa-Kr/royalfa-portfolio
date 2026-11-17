-- 1. Crear tabla bg_profiles
create table if not exists public.bg_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  borough text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Función y trigger para actualizar updated_at automáticamente
create or replace function public.handle_bg_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_bg_profiles_updated on public.bg_profiles;
create trigger on_bg_profiles_updated
  before update on public.bg_profiles
  for each row
  execute function public.handle_bg_profiles_updated_at();

-- 3. Habilitar Row Level Security (RLS)
alter table public.bg_profiles enable row level security;

-- 4. Políticas RLS para Sprint 1
-- Permitir a usuarios autenticados leer perfiles (necesario para perfil propio y futuras publicaciones)
create policy "bg_profiles_select_authenticated"
  on public.bg_profiles
  for select
  to authenticated
  using (true);

-- Permitir a cada usuario insertar únicamente su propio perfil
create policy "bg_profiles_insert_own"
  on public.bg_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Permitir a cada usuario actualizar únicamente su propio perfil
create policy "bg_profiles_update_own"
  on public.bg_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);