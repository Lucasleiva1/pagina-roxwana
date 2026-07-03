insert into public.garment_types (code, name)
values
  ('REM', 'Remera'),
  ('BUZ', 'Buzo'),
  ('GOR', 'Gorra'),
  ('CAM', 'Campera')
on conflict (code) do update set name = excluded.name;

insert into public.categories (name, slug, description, sort_order)
values
  ('Remeras', 'remeras', 'Categoria para remeras ROXWANA.', 10),
  ('Buzos', 'buzos', 'Categoria para buzos ROXWANA.', 20),
  ('Gorras', 'gorras', 'Categoria para gorras ROXWANA.', 30),
  ('Camperas', 'camperas', 'Categoria para camperas ROXWANA.', 40)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;
