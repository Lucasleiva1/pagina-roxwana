create extension if not exists pgcrypto;

alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check check (role in ('customer', 'editor', 'admin'));

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  hero_image_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.categories (name, slug, description, sort_order)
select gt.name, lower(regexp_replace(gt.code, '[^a-zA-Z0-9]+', '-', 'g')), 'Categoria migrada desde tipo de prenda.', row_number() over (order by gt.name)
from public.garment_types gt
where not exists (select 1 from public.categories c where c.slug = lower(regexp_replace(gt.code, '[^a-zA-Z0-9]+', '-', 'g')));

alter table public.products
add column if not exists description_short text,
add column if not exists description_long text,
add column if not exists compare_at_price numeric(12, 2),
add column if not exists category_id uuid references public.categories(id) on delete set null,
add column if not exists collection_id uuid references public.collections(id) on delete set null,
add column if not exists sort_order integer not null default 0,
add column if not exists main_image_path text,
add column if not exists whatsapp_message text;

update public.products p
set category_id = c.id
from public.garment_types gt
join public.categories c on c.slug = lower(regexp_replace(gt.code, '[^a-zA-Z0-9]+', '-', 'g'))
where p.garment_type_id = gt.id
  and p.category_id is null;

update public.products
set description_short = coalesce(description_short, description),
    description_long = coalesce(description_long, description)
where description is not null;

alter table public.products
drop constraint if exists products_status_check;

update public.products
set status = case
  when status = 'active' then 'published'
  when status = 'hidden' then 'draft'
  when status = 'sold_out' then 'sold_out'
  else 'draft'
end;

alter table public.products
add constraint products_status_check check (status in ('draft', 'published', 'sold_out'));

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text,
  color text,
  stock integer not null default 0 check (stock >= 0),
  sku text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_images
add column if not exists path text,
add column if not exists bucket text not null default 'product-images',
add column if not exists file_type text,
add column if not exists size integer;

update public.product_images
set bucket = 'product-images'
where bucket is null;

update public.products p
set main_image_path = i.path
from public.product_images i
where i.product_id = p.id
  and i.is_primary = true
  and i.path is not null
  and p.main_image_path is null;

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  type text not null,
  title text,
  subtitle text,
  body text,
  image_path text,
  cta_label text,
  cta_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  bucket text not null,
  alt_text text,
  file_type text,
  size integer,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings
add column if not exists contact_email text,
add column if not exists global_cta_label text,
add column if not exists global_cta_url text;

insert into public.site_sections (key, type, title, subtitle, body, image_path, cta_label, cta_url, is_visible, sort_order, metadata)
values
  ('hero', 'hero', 'ROXWANA', 'ESTILO URBANO', 'Explora modelos, colores y talles antes de armar tu pedido.', '/images/hero/hero-03.png', 'Ver catalogo', '#drop-01', true, 10, '{}'::jsonb),
  ('featured_drop', 'drop_banner', 'ENTRA POR ACTITUD', 'Colecciones', 'Dos accesos visuales al drop. Filtra los modelos abajo sin salir de esta pagina.', null, null, null, true, 20, '{}'::jsonb),
  ('featured_products', 'product_grid', 'ELEGI TU MODELO', null, 'Grilla clara para mirar modelos, recorrer imagenes y entrar al detalle sin distracciones.', null, null, null, true, 30, '{}'::jsonb),
  ('brand_statement', 'brand_statement', 'POSTERS, CALLE Y RUIDO VISUAL', 'Graphic wear', 'La marca se mueve entre textura urbana, contraste rockero y prendas directas para uso diario.', null, null, null, true, 40, '{}'::jsonb),
  ('how_to_order', 'how_to_order', 'DEL MODELO AL PEDIDO', 'Como ordenar', 'Elegis la prenda, armas el carrito y mandas el pedido por WhatsApp con tus datos de entrega.', null, null, null, true, 50, '{}'::jsonb),
  ('final_cta', 'final_cta', 'RULETA DE PRINTS', 'Random pick', 'Deja que ROXWANA elija un modelo para arrancar el pedido.', null, 'Probar suerte', '#random-print', true, 60, '{}'::jsonb)
on conflict (key) do nothing;

create index if not exists categories_slug_idx on public.categories(slug);
create index if not exists collections_slug_idx on public.collections(slug);
create index if not exists collections_active_idx on public.collections(is_active, sort_order);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_collection_idx on public.products(collection_id);
create index if not exists products_sort_idx on public.products(sort_order, created_at);
create index if not exists product_variants_product_idx on public.product_variants(product_id);
create index if not exists site_sections_key_idx on public.site_sections(key);
create index if not exists site_sections_visible_idx on public.site_sections(is_visible, sort_order);
create index if not exists media_assets_bucket_path_idx on public.media_assets(bucket, path);
create index if not exists settings_key_idx on public.settings(key);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

drop trigger if exists site_sections_set_updated_at on public.site_sections;
create trigger site_sections_set_updated_at
before update on public.site_sections
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.product_variants enable row level security;
alter table public.site_sections enable row level security;
alter table public.media_assets enable row level security;
alter table public.settings enable row level security;

grant select on public.categories, public.collections, public.site_sections, public.media_assets, public.settings to anon, authenticated;
grant select, insert, update, delete on public.categories, public.collections, public.product_variants, public.site_sections, public.media_assets, public.settings to authenticated;
grant select, insert, update, delete on public.products, public.product_images, public.product_colors, public.product_sizes to authenticated;
grant select on public.products, public.product_images, public.product_colors, public.product_sizes to anon;

drop policy if exists "Public reads active products" on public.products;
create policy "Public reads published products"
on public.products for select
using (
  status = 'published'
  or exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'editor')
  )
);

drop policy if exists "Admins manage products" on public.products;
create policy "Staff manage products"
on public.products for all
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'editor')
  )
);

drop policy if exists "Public reads active product colors" on public.product_colors;
create policy "Public reads published product colors"
on public.product_colors for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role in ('admin', 'editor')))));

drop policy if exists "Public reads active product sizes" on public.product_sizes;
create policy "Public reads published product sizes"
on public.product_sizes for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role in ('admin', 'editor')))));

drop policy if exists "Public reads active product images" on public.product_images;
create policy "Public reads published product images"
on public.product_images for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role in ('admin', 'editor')))));

drop policy if exists "Admins manage product colors" on public.product_colors;
create policy "Staff manage product colors" on public.product_colors for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

drop policy if exists "Admins manage product sizes" on public.product_sizes;
create policy "Staff manage product sizes" on public.product_sizes for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

drop policy if exists "Admins manage product images" on public.product_images;
create policy "Staff manage product images" on public.product_images for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

create policy "Public reads categories" on public.categories for select using (true);
create policy "Staff manage categories" on public.categories for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

create policy "Public reads active collections" on public.collections for select
using (is_active = true or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));
create policy "Staff manage collections" on public.collections for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

create policy "Public reads published product variants" on public.product_variants for select
using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role in ('admin', 'editor')))));
create policy "Staff manage product variants" on public.product_variants for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

create policy "Public reads visible site sections" on public.site_sections for select using (is_visible = true or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));
create policy "Staff manage site sections" on public.site_sections for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

create policy "Public reads media assets" on public.media_assets for select using (true);
create policy "Staff manage media assets" on public.media_assets for all
using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')))
with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor')));

create policy "Public reads settings" on public.settings for select using (true);
create policy "Admins manage settings" on public.settings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('site-images', 'site-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('brand-assets', 'brand-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads admin media buckets" on storage.objects;
create policy "Public reads admin media buckets"
on storage.objects for select
using (bucket_id in ('product-images', 'site-images', 'brand-assets'));

drop policy if exists "Staff insert admin media buckets" on storage.objects;
create policy "Staff insert admin media buckets"
on storage.objects for insert
with check (
  bucket_id in ('product-images', 'site-images', 'brand-assets')
  and exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor'))
);

drop policy if exists "Staff update admin media buckets" on storage.objects;
create policy "Staff update admin media buckets"
on storage.objects for update
using (
  bucket_id in ('product-images', 'site-images', 'brand-assets')
  and exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor'))
)
with check (
  bucket_id in ('product-images', 'site-images', 'brand-assets')
  and exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor'))
);

drop policy if exists "Staff delete admin media buckets" on storage.objects;
create policy "Staff delete admin media buckets"
on storage.objects for delete
using (
  bucket_id in ('product-images', 'site-images', 'brand-assets')
  and exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin', 'editor'))
);
