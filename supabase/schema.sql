create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.garment_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.colors (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  hex text,
  created_at timestamptz not null default now()
);

create table if not exists public.sizes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  sort_order int not null
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  model_code text unique not null,
  name text not null,
  slug text unique not null,
  garment_type_id uuid not null references public.garment_types(id),
  parent_product_id uuid references public.products(id) on delete cascade,
  family_color_id uuid references public.colors(id) on delete set null,
  gender text not null check (gender in ('hombre', 'mujer', 'unisex')),
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'sold_out')),
  featured boolean not null default false,
  price integer not null check (price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_colors (
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid not null references public.colors(id) on delete cascade,
  primary key (product_id, color_id)
);

create table if not exists public.product_sizes (
  product_id uuid not null references public.products(id) on delete cascade,
  size_id uuid not null references public.sizes(id) on delete cascade,
  primary key (product_id, size_id)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  path text,
  bucket text not null default 'product-images',
  alt text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  file_type text,
  size integer,
  image_role text check (image_role is null or image_role in ('cover', 'hover', 'gallery', 'detail', 'lifestyle', 'technical')),
  view_number text,
  color_code text,
  device_variant text check (device_variant is null or device_variant in ('desktop', 'mobile', 'base')),
  original_filename text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text,
  whatsapp_label text,
  whatsapp_enabled boolean not null default true,
  fallback_contact text,
  instagram_url text,
  tiktok_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id),
  product_name text,
  model_code text,
  sku text,
  selected_color text,
  selected_size text,
  quantity int not null default 1 check (quantity > 0),
  customer_name text,
  customer_phone text,
  source_url text,
  message text,
  status text not null default 'new' check (status in ('new', 'read', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_featured_idx on public.products(featured);
create index if not exists products_gender_idx on public.products(gender);
create index if not exists products_parent_product_idx on public.products(parent_product_id);
create index if not exists products_family_color_idx on public.products(family_color_id);
create unique index if not exists products_family_child_color_unique on public.products(parent_product_id, family_color_id) where parent_product_id is not null and family_color_id is not null;
create index if not exists product_images_product_idx on public.product_images(product_id, sort_order);
create index if not exists product_images_product_role_idx on public.product_images(product_id, image_role, sort_order);
create index if not exists product_images_product_color_idx on public.product_images(product_id, color_code, sort_order);
create index if not exists whatsapp_orders_created_idx on public.whatsapp_orders(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.garment_types enable row level security;
alter table public.colors enable row level security;
alter table public.sizes enable row level security;
alter table public.products enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.whatsapp_orders enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public reads garment types" on public.garment_types;
create policy "Public reads garment types" on public.garment_types for select using (true);
drop policy if exists "Public reads colors" on public.colors;
create policy "Public reads colors" on public.colors for select using (true);
drop policy if exists "Public reads sizes" on public.sizes;
create policy "Public reads sizes" on public.sizes for select using (true);

drop policy if exists "Admins manage garment types" on public.garment_types;
create policy "Admins manage garment types" on public.garment_types for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage colors" on public.colors;
create policy "Admins manage colors" on public.colors for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage sizes" on public.sizes;
create policy "Admins manage sizes" on public.sizes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads active products" on public.products;
create policy "Public reads active products"
on public.products for select
using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads active product colors" on public.product_colors;
create policy "Public reads active product colors"
on public.product_colors for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin())));

drop policy if exists "Public reads active product sizes" on public.product_sizes;
create policy "Public reads active product sizes"
on public.product_sizes for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin())));

drop policy if exists "Public reads active product images" on public.product_images;
create policy "Public reads active product images"
on public.product_images for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin())));

drop policy if exists "Admins manage product colors" on public.product_colors;
create policy "Admins manage product colors" on public.product_colors for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage product sizes" on public.product_sizes;
create policy "Admins manage product sizes" on public.product_sizes for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage product images" on public.product_images;
create policy "Admins manage product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public inserts whatsapp orders" on public.whatsapp_orders;
create policy "Public inserts whatsapp orders" on public.whatsapp_orders for insert with check (true);
drop policy if exists "Admins read whatsapp orders" on public.whatsapp_orders;
create policy "Admins read whatsapp orders" on public.whatsapp_orders for select using (public.is_admin());
drop policy if exists "Admins update whatsapp orders" on public.whatsapp_orders;
create policy "Admins update whatsapp orders" on public.whatsapp_orders for update using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads product images bucket" on storage.objects;
create policy "Public reads product images bucket"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins insert product images bucket" on storage.objects;
create policy "Admins insert product images bucket"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images bucket" on storage.objects;
create policy "Admins update product images bucket"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images bucket" on storage.objects;
create policy "Admins delete product images bucket"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin());
