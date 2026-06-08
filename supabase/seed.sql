insert into public.garment_types (code, name)
values
  ('REM', 'Remera'),
  ('BUZ', 'Buzo'),
  ('MUS', 'Musculosa')
on conflict (code) do update set name = excluded.name;

insert into public.colors (code, name, hex)
values
  ('NEG', 'Negro', '#111111'),
  ('BLA', 'Blanco Hueso', '#F6F3EE'),
  ('ROJ', 'Rojo', '#B11226'),
  ('AZU', 'Azul', '#1E3A8A')
on conflict (code) do update set name = excluded.name, hex = excluded.hex;

insert into public.sizes (code, name, sort_order)
values
  ('S', 'S', 1),
  ('M', 'M', 2),
  ('L', 'L', 3),
  ('XL', 'XL', 4),
  ('XXL', 'XXL', 5)
on conflict (code) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.site_settings (whatsapp_number, whatsapp_label, whatsapp_enabled, fallback_contact, instagram_url, tiktok_url)
select null, 'WhatsApp ROXWANA', true, 'Escribinos por Instagram y te respondemos con disponibilidad.', 'https://instagram.com', 'https://tiktok.com'
where not exists (select 1 from public.site_settings);

with rem as (select id from public.garment_types where code = 'REM'),
     buz as (select id from public.garment_types where code = 'BUZ')
insert into public.products (model_code, name, slug, garment_type_id, gender, description, status, featured)
values
  ('RXW-REM-ROCK001', 'Remera Rock 001', 'remera-rock-001', (select id from rem), 'unisex', 'Logo circular ROXWANA con energia de escenario, calle mojada y noche urbana.', 'active', true),
  ('RXW-REM-DRAGON002', 'Remera Dragon 002', 'remera-dragon-002', (select id from rem), 'hombre', 'Grafica pesada para drops de alto contraste, pensada para vestir fuerte.', 'active', true),
  ('RXW-REM-MOTO003', 'Remera Moto 003', 'remera-moto-003', (select id from rem), 'hombre', 'Actitud de ruta, metal y asfalto en una composicion grafica premium.', 'active', true),
  ('RXW-REM-STREET004', 'Remera Street 004', 'remera-street-004', (select id from rem), 'mujer', 'Pared de posters, textura rota y presencia de marca para uso diario.', 'active', false),
  ('RXW-REM-SKULL005', 'Remera Skull 005', 'remera-skull-005', (select id from rem), 'unisex', 'Drop oscuro con filo rockero, rojo medido y detalle dorado.', 'draft', false),
  ('RXW-BUZ-HEAVY001', 'Buzo Heavy 001', 'buzo-heavy-001', (select id from buz), 'unisex', 'Buzo pesado con identidad ROXWANA, pensado para la calle fria.', 'draft', false)
on conflict (model_code) do update set
  name = excluded.name,
  slug = excluded.slug,
  garment_type_id = excluded.garment_type_id,
  gender = excluded.gender,
  description = excluded.description,
  status = excluded.status,
  featured = excluded.featured;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code in ('NEG', 'BLA')
where p.model_code in ('RXW-REM-ROCK001', 'RXW-REM-DRAGON002', 'RXW-REM-MOTO003', 'RXW-REM-STREET004', 'RXW-REM-SKULL005', 'RXW-BUZ-HEAVY001')
on conflict do nothing;

insert into public.product_sizes (product_id, size_id)
select p.id, s.id
from public.products p
join public.sizes s on s.code in ('S', 'M', 'L', 'XL', 'XXL')
where p.model_code in ('RXW-REM-ROCK001', 'RXW-REM-DRAGON002', 'RXW-REM-MOTO003', 'RXW-REM-STREET004', 'RXW-REM-SKULL005', 'RXW-BUZ-HEAVY001')
on conflict do nothing;

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, p.name, image.sort_order, true
from public.products p
join (
  values
    ('RXW-REM-ROCK001', '/images/products/product-01.png', 1),
    ('RXW-REM-DRAGON002', '/images/products/product-02.png', 2),
    ('RXW-REM-MOTO003', '/images/products/product-03.png', 3),
    ('RXW-REM-STREET004', '/images/products/product-04.png', 4),
    ('RXW-REM-SKULL005', '/images/products/product-05.png', 5),
    ('RXW-BUZ-HEAVY001', '/images/products/product-06.png', 6)
) as image(model_code, url, sort_order) on image.model_code = p.model_code
where not exists (
  select 1
  from public.product_images existing
  where existing.product_id = p.id
    and existing.url = image.url
);
