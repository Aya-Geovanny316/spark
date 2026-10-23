-- SPARK: aplicar en Supabase SQL Editor antes de ejecutar el seed de Prisma.
-- El backend usa Prisma con la conexión PostgreSQL; Supabase Auth gestiona las
-- credenciales del administrador y Storage gestiona las imágenes.

do $$ begin
  create type "Role" as enum ('ADMIN', 'EDITOR');
exception when duplicate_object then null;
end $$;

create table if not exists "User" (
  id text primary key,
  name text not null,
  email text not null unique,
  "passwordHash" text not null,
  role "Role" not null default 'ADMIN',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Account" (
  id text primary key,
  "userId" text not null references "User"(id) on delete cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique (provider, "providerAccountId")
);

create table if not exists "Session" (
  "sessionToken" text primary key,
  "userId" text not null references "User"(id) on delete cascade,
  expires timestamptz not null
);

create table if not exists "VerificationToken" (
  identifier text not null,
  token text not null unique,
  expires timestamptz not null,
  unique (identifier, token)
);

create table if not exists "Category" (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  "imageUrl" text,
  "sortOrder" integer not null default 0,
  "isActive" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Product" (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(10,2) not null,
  "imageUrl" text,
  "categoryId" text not null references "Category"(id) on delete restrict,
  "isAvailable" boolean not null default true,
  "isFeatured" boolean not null default false,
  "sortOrder" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "ProductVariant" (
  id text primary key,
  "productId" text not null references "Product"(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  "isAvailable" boolean not null default true,
  "sortOrder" integer not null default 0
);

create table if not exists "Setting" (
  id text primary key,
  key text not null unique,
  value text not null,
  "updatedAt" timestamptz not null default now()
);

create index if not exists category_active_order_idx on "Category" ("isActive", "sortOrder");
create index if not exists product_category_available_order_idx on "Product" ("categoryId", "isAvailable", "sortOrder");

alter table "User" enable row level security;
alter table "Category" enable row level security;
alter table "Product" enable row level security;
alter table "ProductVariant" enable row level security;
alter table "Setting" enable row level security;

-- Las consultas de Prisma usan la conexión de servidor y no exponen estas tablas
-- al navegador. No se crean políticas públicas de escritura.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public product images are readable" on storage.objects;
create policy "Public product images are readable"
on storage.objects for select
using (bucket_id = 'product-images');
