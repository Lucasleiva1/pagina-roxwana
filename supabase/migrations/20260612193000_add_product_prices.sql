alter table public.products
add column if not exists price integer;

update public.products
set price = case
  when model_code = 'RXW-REM-LISA001' then 19000
  else 29000
end
where price is null;

alter table public.products
alter column price set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_price_positive'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
    add constraint products_price_positive check (price > 0);
  end if;
end $$;

update public.cart_items ci
set price_snapshot = p.price
from public.products p
where ci.product_id = p.id
  and ci.price_snapshot is null;

update public.order_items oi
set price_snapshot = p.price
from public.products p
where oi.product_id = p.id
  and oi.price_snapshot is null;
