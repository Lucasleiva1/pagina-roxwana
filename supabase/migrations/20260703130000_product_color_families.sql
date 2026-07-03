alter table public.products
  add column if not exists parent_product_id uuid references public.products(id) on delete cascade,
  add column if not exists family_color_id uuid references public.colors(id) on delete set null;

create index if not exists products_parent_product_idx on public.products(parent_product_id);
create index if not exists products_family_color_idx on public.products(family_color_id);

create unique index if not exists products_family_child_color_unique
  on public.products(parent_product_id, family_color_id)
  where parent_product_id is not null and family_color_id is not null;
