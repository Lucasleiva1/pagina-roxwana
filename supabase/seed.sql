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
  ('GRI', 'Gris', '#B8B8B2'),
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
insert into public.products (model_code, name, slug, garment_type_id, gender, description, status, featured, price)
values
  ('RXW-REM-STREET004', 'Remera Street 004', 'remera-street-004', (select id from rem), 'mujer', 'Pared de posters, textura rota y presencia de marca para uso diario.', 'active', false, 29000),
  ('RXW-REM-SKULL005', 'Remera Skull 005', 'remera-skull-005', (select id from rem), 'unisex', 'Drop oscuro con filo rockero, rojo medido y detalle dorado.', 'draft', false, 29000),
  ('RXW-BUZ-HEAVY001', 'Buzo Heavy 001', 'buzo-heavy-001', (select id from buz), 'unisex', 'Buzo pesado con identidad ROXWANA, pensado para la calle fria.', 'draft', false, 29000),
  ('RXW-REM-NEG001', 'Remera Boy Band Style 001', 'remera-boy-band-style-001', (select id from rem), 'hombre', 'Remera negra de hombre con grafica ROXWANA Boy Band Style, pensada para una primera prueba real de producto, color negro y galeria completa.', 'active', true, 29000),
  ('RXW-REM-FLM001', 'Remera Flame Fearless 001', 'remera-flame-fearless-001', (select id from rem), 'mujer', 'Remera blanca de mujer con grafica ROXWANA flame rosa y negro, galeria con vista producto, frente con modelo y espalda.', 'active', true, 29000),
  ('RXW-REM-LISAM001', 'Remera Lisa Mujer', 'remera-lisa-mujer-001', (select id from rem), 'mujer', 'Remera lisa ROXWANA para mujer, disponible en blanco, negro y gris con vista real por color.', 'active', true, 19000),
  ('RXW-REM-LISAH002', 'Remera Lisa Hombre 002', 'remera-lisa-hombre-002', (select id from rem), 'hombre', 'Remera lisa ROXWANA para hombre, disponible en blanco, negro y gris con vistas de producto y modelo.', 'active', true, 19000),
  ('RXW-REM-SRK001', 'Remera Street Rock 001', 'remera-street-rock-001', (select id from rem), 'hombre', 'Remera negra de hombre con grafica ROXWANA Street Rock, galeria completa con producto, calle, frente, espalda y lateral.', 'active', true, 29000),
  ('RXW-REM-LISA001', 'Remera Lisa', 'remera-lisa-001', (select id from rem), 'hombre', 'Remera lisa ROXWANA para hombre, pensada para elegir color con referencia visual clara antes de sumar al carrito.', 'active', true, 19000)
on conflict (model_code) do update set
  name = excluded.name,
  slug = excluded.slug,
  garment_type_id = excluded.garment_type_id,
  gender = excluded.gender,
  description = excluded.description,
  status = excluded.status,
  featured = excluded.featured,
  price = excluded.price;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code in ('NEG', 'BLA')
where p.model_code in ('RXW-REM-STREET004', 'RXW-REM-SKULL005', 'RXW-BUZ-HEAVY001')
on conflict do nothing;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code = 'NEG'
where p.model_code = 'RXW-REM-NEG001'
on conflict do nothing;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code = 'BLA'
where p.model_code = 'RXW-REM-FLM001'
on conflict do nothing;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code = 'NEG'
where p.model_code = 'RXW-REM-SRK001'
on conflict do nothing;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code in ('NEG', 'BLA', 'GRI')
where p.model_code = 'RXW-REM-LISA001'
on conflict do nothing;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code in ('BLA', 'NEG', 'GRI')
where p.model_code = 'RXW-REM-LISAM001'
on conflict do nothing;

insert into public.product_colors (product_id, color_id)
select p.id, c.id
from public.products p
join public.colors c on c.code in ('BLA', 'NEG', 'GRI')
where p.model_code = 'RXW-REM-LISAH002'
on conflict do nothing;

insert into public.product_sizes (product_id, size_id)
select p.id, s.id
from public.products p
join public.sizes s on s.code in ('S', 'M', 'L', 'XL', 'XXL')
where p.model_code in ('RXW-REM-STREET004', 'RXW-REM-SKULL005', 'RXW-BUZ-HEAVY001', 'RXW-REM-NEG001', 'RXW-REM-FLM001', 'RXW-REM-SRK001', 'RXW-REM-LISA001', 'RXW-REM-LISAM001', 'RXW-REM-LISAH002')
on conflict do nothing;

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, p.name, image.sort_order, true
from public.products p
join (
  values
    ('RXW-REM-STREET004', '/images/products/product-04.png', 4),
    ('RXW-REM-SKULL005', '/images/products/product-05.png', 5),
    ('RXW-BUZ-HEAVY001', '/images/products/product-06.png', 6),
    ('RXW-REM-NEG001', '/images/products/product-boyband-001-shirt.png', 1),
    ('RXW-REM-FLM001', '/images/products/product-flame-fearless-001-shirt-desktop.webp', 1),
    ('RXW-REM-SRK001', '/images/products/product-street-rock-001-shirt-desktop.webp', 1)
) as image(model_code, url, sort_order) on image.model_code = p.model_code
where not exists (
  select 1
  from public.product_images existing
  where existing.product_id = p.id
    and existing.url = image.url
);

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, image.alt, image.sort_order, false
from public.products p
join (
  values
    ('/images/products/product-boyband-001-street.png', 'Remera Boy Band Style 001 en pared urbana', 2),
    ('/images/products/product-boyband-001-front.png', 'Remera Boy Band Style 001 vista frontal hombre', 3),
    ('/images/products/product-boyband-001-back.png', 'Remera Boy Band Style 001 vista espalda hombre', 4),
    ('/images/products/product-boyband-001-side.png', 'Remera Boy Band Style 001 vista lateral hombre', 5)
) as image(url, alt, sort_order) on true
where p.model_code = 'RXW-REM-NEG001'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.url = image.url
  );

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, image.alt, image.sort_order, image.is_primary
from public.products p
join (
  values
    ('/images/products/remera-lisa-fb/neg-01-desktop.webp', 'Remera Lisa negra vista 1', 1, true),
    ('/images/products/remera-lisa-fb/neg-02-desktop.webp', 'Remera Lisa negra vista 2', 2, false),
    ('/images/products/remera-lisa-fb/neg-03-desktop.webp', 'Remera Lisa negra vista 3', 3, false),
    ('/images/products/remera-lisa-fb/neg-04-desktop.webp', 'Remera Lisa negra vista 4', 4, false),
    ('/images/products/remera-lisa-fb/neg-05-desktop.webp', 'Remera Lisa negra vista 5', 5, false),
    ('/images/products/remera-lisa-fb/neg-06-desktop.webp', 'Remera Lisa negra vista 6', 6, false),
    ('/images/products/remera-lisa-fb/bla-01-desktop.webp', 'Remera Lisa blanca vista 1', 11, false),
    ('/images/products/remera-lisa-fb/bla-02-desktop.webp', 'Remera Lisa blanca vista 2', 12, false),
    ('/images/products/remera-lisa-fb/bla-03-desktop.webp', 'Remera Lisa blanca vista 3', 13, false),
    ('/images/products/remera-lisa-fb/bla-04-desktop.webp', 'Remera Lisa blanca vista 4', 14, false),
    ('/images/products/remera-lisa-fb/bla-05-desktop.webp', 'Remera Lisa blanca vista 5', 15, false),
    ('/images/products/remera-lisa-fb/bla-06-desktop.webp', 'Remera Lisa blanca vista 6', 16, false),
    ('/images/products/remera-lisa-fb/gri-01-desktop.webp', 'Remera Lisa gris vista 1', 21, false),
    ('/images/products/remera-lisa-fb/gri-02-desktop.webp', 'Remera Lisa gris vista 2', 22, false),
    ('/images/products/remera-lisa-fb/gri-03-desktop.webp', 'Remera Lisa gris vista 3', 23, false),
    ('/images/products/remera-lisa-fb/gri-04-desktop.webp', 'Remera Lisa gris vista 4', 24, false),
    ('/images/products/remera-lisa-fb/gri-05-desktop.webp', 'Remera Lisa gris vista 5', 25, false),
    ('/images/products/remera-lisa-fb/gri-06-desktop.webp', 'Remera Lisa gris vista 6', 26, false)
) as image(url, alt, sort_order, is_primary) on true
where p.model_code = 'RXW-REM-LISA001'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.url = image.url
  );

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, image.alt, image.sort_order, image.is_primary
from public.products p
join (
  values
    ('/images/products/remera-lisa-mujer-fb/bla-01-desktop.webp', 'Remera Lisa Mujer blanca vista 1', 1, true),
    ('/images/products/remera-lisa-mujer-fb/bla-02-desktop.webp', 'Remera Lisa Mujer blanca vista 2', 2, false),
    ('/images/products/remera-lisa-mujer-fb/bla-03-desktop.webp', 'Remera Lisa Mujer blanca vista 3', 3, false),
    ('/images/products/remera-lisa-mujer-fb/bla-04-desktop.webp', 'Remera Lisa Mujer blanca vista 4', 4, false),
    ('/images/products/remera-lisa-mujer-fb/bla-05-desktop.webp', 'Remera Lisa Mujer blanca vista 5', 5, false),
    ('/images/products/remera-lisa-mujer-fb/bla-06-desktop.webp', 'Remera Lisa Mujer blanca vista 6', 6, false),
    ('/images/products/remera-lisa-mujer-fb/neg-01-desktop.webp', 'Remera Lisa Mujer negra vista 1', 11, false),
    ('/images/products/remera-lisa-mujer-fb/neg-02-desktop.webp', 'Remera Lisa Mujer negra vista 2', 12, false),
    ('/images/products/remera-lisa-mujer-fb/neg-03-desktop.webp', 'Remera Lisa Mujer negra vista 3', 13, false),
    ('/images/products/remera-lisa-mujer-fb/neg-04-desktop.webp', 'Remera Lisa Mujer negra vista 4', 14, false),
    ('/images/products/remera-lisa-mujer-fb/neg-05-desktop.webp', 'Remera Lisa Mujer negra vista 5', 15, false),
    ('/images/products/remera-lisa-mujer-fb/neg-06-desktop.webp', 'Remera Lisa Mujer negra vista 6', 16, false),
    ('/images/products/remera-lisa-mujer-fb/gri-01-desktop.webp', 'Remera Lisa Mujer gris vista 1', 21, false),
    ('/images/products/remera-lisa-mujer-fb/gri-02-desktop.webp', 'Remera Lisa Mujer gris vista 2', 22, false),
    ('/images/products/remera-lisa-mujer-fb/gri-03-desktop.webp', 'Remera Lisa Mujer gris vista 3', 23, false),
    ('/images/products/remera-lisa-mujer-fb/gri-04-desktop.webp', 'Remera Lisa Mujer gris vista 4', 24, false),
    ('/images/products/remera-lisa-mujer-fb/gri-05-desktop.webp', 'Remera Lisa Mujer gris vista 5', 25, false),
    ('/images/products/remera-lisa-mujer-fb/gri-06-desktop.webp', 'Remera Lisa Mujer gris vista 6', 26, false)
) as image(url, alt, sort_order, is_primary) on true
where p.model_code = 'RXW-REM-LISAM001'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.url = image.url
  );

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, image.alt, image.sort_order, image.is_primary
from public.products p
join (
  values
    ('/images/products/remera-lisa-hombre-002-fb/bla-01-desktop.webp', 'Remera Lisa Hombre 002 blanca vista 1', 1, true),
    ('/images/products/remera-lisa-hombre-002-fb/bla-02-desktop.webp', 'Remera Lisa Hombre 002 blanca vista 2', 2, false),
    ('/images/products/remera-lisa-hombre-002-fb/bla-03-desktop.webp', 'Remera Lisa Hombre 002 blanca vista 3', 3, false),
    ('/images/products/remera-lisa-hombre-002-fb/bla-04-desktop.webp', 'Remera Lisa Hombre 002 blanca vista 4', 4, false),
    ('/images/products/remera-lisa-hombre-002-fb/bla-05-desktop.webp', 'Remera Lisa Hombre 002 blanca vista 5', 5, false),
    ('/images/products/remera-lisa-hombre-002-fb/bla-06-desktop.webp', 'Remera Lisa Hombre 002 blanca vista 6', 6, false),
    ('/images/products/remera-lisa-hombre-002-fb/neg-01-desktop.webp', 'Remera Lisa Hombre 002 negra vista 1', 11, false),
    ('/images/products/remera-lisa-hombre-002-fb/neg-02-desktop.webp', 'Remera Lisa Hombre 002 negra vista 2', 12, false),
    ('/images/products/remera-lisa-hombre-002-fb/neg-03-desktop.webp', 'Remera Lisa Hombre 002 negra vista 3', 13, false),
    ('/images/products/remera-lisa-hombre-002-fb/neg-04-desktop.webp', 'Remera Lisa Hombre 002 negra vista 4', 14, false),
    ('/images/products/remera-lisa-hombre-002-fb/neg-05-desktop.webp', 'Remera Lisa Hombre 002 negra vista 5', 15, false),
    ('/images/products/remera-lisa-hombre-002-fb/neg-06-desktop.webp', 'Remera Lisa Hombre 002 negra vista 6', 16, false),
    ('/images/products/remera-lisa-hombre-002-fb/gri-01-desktop.webp', 'Remera Lisa Hombre 002 gris vista 1', 21, false),
    ('/images/products/remera-lisa-hombre-002-fb/gri-02-desktop.webp', 'Remera Lisa Hombre 002 gris vista 2', 22, false),
    ('/images/products/remera-lisa-hombre-002-fb/gri-03-desktop.webp', 'Remera Lisa Hombre 002 gris vista 3', 23, false),
    ('/images/products/remera-lisa-hombre-002-fb/gri-04-desktop.webp', 'Remera Lisa Hombre 002 gris vista 4', 24, false),
    ('/images/products/remera-lisa-hombre-002-fb/gri-05-desktop.webp', 'Remera Lisa Hombre 002 gris vista 5', 25, false),
    ('/images/products/remera-lisa-hombre-002-fb/gri-06-desktop.webp', 'Remera Lisa Hombre 002 gris vista 6', 26, false)
) as image(url, alt, sort_order, is_primary) on true
where p.model_code = 'RXW-REM-LISAH002'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.url = image.url
  );

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, image.alt, image.sort_order, false
from public.products p
join (
  values
    ('/images/products/product-flame-fearless-001-front-model-desktop.webp', 'Remera Flame Fearless 001 vista frontal con modelo', 2),
    ('/images/products/product-flame-fearless-001-back-model-desktop.webp', 'Remera Flame Fearless 001 vista espalda con modelo', 3)
) as image(url, alt, sort_order) on true
where p.model_code = 'RXW-REM-FLM001'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.url = image.url
  );

insert into public.product_images (product_id, url, alt, sort_order, is_primary)
select p.id, image.url, image.alt, image.sort_order, false
from public.products p
join (
  values
    ('/images/products/product-street-rock-001-street-desktop.webp', 'Remera Street Rock 001 en calle urbana', 2),
    ('/images/products/product-street-rock-001-front-model-desktop.webp', 'Remera Street Rock 001 vista frontal con modelo', 3),
    ('/images/products/product-street-rock-001-back-model-desktop.webp', 'Remera Street Rock 001 vista espalda con modelo', 4),
    ('/images/products/product-street-rock-001-side-model-desktop.webp', 'Remera Street Rock 001 vista lateral con modelo', 5)
) as image(url, alt, sort_order) on true
where p.model_code = 'RXW-REM-SRK001'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.url = image.url
  );
