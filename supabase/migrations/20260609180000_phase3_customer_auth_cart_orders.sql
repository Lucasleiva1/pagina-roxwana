alter table public.profiles
  add column if not exists email text,
  add column if not exists avatar_url text,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

update public.profiles p
set email = u.email,
    updated_at = now()
from auth.users u
where p.user_id = u.id
  and p.email is null;

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_email_idx on public.profiles(email);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, name, phone, avatar_url, role, marketing_consent)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    'customer',
    coalesce((new.raw_user_meta_data ->> 'marketing_consent')::boolean, false)
  )
  on conflict (user_id) do update
  set email = coalesce(excluded.email, public.profiles.email),
      name = coalesce(public.profiles.name, excluded.name),
      phone = coalesce(public.profiles.phone, excluded.phone),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      marketing_consent = public.profiles.marketing_consent or excluded.marketing_consent,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'profile role cannot be changed by this user';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  model_code_snapshot text not null,
  selected_color text not null,
  selected_size text not null,
  quantity int not null default 1 check (quantity > 0 and quantity <= 20),
  sku text not null,
  price_snapshot numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  street text not null,
  street_number text not null,
  apartment text,
  city text not null,
  province text not null,
  postal_code text not null,
  delivery_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  address_id uuid references public.customer_addresses(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'contacted', 'payment_sent', 'paid', 'shipped', 'cancelled')),
  customer_name_snapshot text not null,
  customer_email_snapshot text,
  customer_phone_snapshot text not null,
  shipping_address_snapshot jsonb not null,
  whatsapp_message text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  model_code_snapshot text not null,
  selected_color text not null,
  selected_size text not null,
  quantity int not null check (quantity > 0 and quantity <= 20),
  sku text not null,
  price_snapshot numeric(12, 2),
  created_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  type text not null check (type in ('order_created', 'whatsapp_generated', 'admin_contacted', 'payment_link_sent', 'paid', 'shipped', 'cancelled', 'admin_note')),
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists carts_one_active_per_user_idx on public.carts(user_id) where status = 'active';
create index if not exists carts_user_status_idx on public.carts(user_id, status);
create unique index if not exists cart_items_variant_idx on public.cart_items(cart_id, product_id, selected_color, selected_size);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id, created_at);
create index if not exists customer_addresses_user_idx on public.customer_addresses(user_id, created_at desc);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_events_order_idx on public.order_events(order_id, created_at);

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

drop trigger if exists customer_addresses_set_updated_at on public.customer_addresses;
create trigger customer_addresses_set_updated_at
before update on public.customer_addresses
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.carts to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select, insert, update, delete on public.customer_addresses to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;
grant select, insert, update, delete on public.order_events to authenticated;

drop policy if exists "Users create own customer profile" on public.profiles;
create policy "Users create own customer profile"
on public.profiles for insert
with check (user_id = auth.uid() and role = 'customer');

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users read own carts" on public.carts;
create policy "Users read own carts"
on public.carts for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users create own carts" on public.carts;
create policy "Users create own carts"
on public.carts for insert
with check (user_id = auth.uid());

drop policy if exists "Users update own carts" on public.carts;
create policy "Users update own carts"
on public.carts for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users delete own carts" on public.carts;
create policy "Users delete own carts"
on public.carts for delete
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users read own cart items" on public.cart_items;
create policy "Users read own cart items"
on public.cart_items for select
using (exists (select 1 from public.carts c where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin())));

drop policy if exists "Users create own cart items" on public.cart_items;
create policy "Users create own cart items"
on public.cart_items for insert
with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid() and c.status = 'active'));

drop policy if exists "Users update own cart items" on public.cart_items;
create policy "Users update own cart items"
on public.cart_items for update
using (exists (select 1 from public.carts c where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin())))
with check (exists (select 1 from public.carts c where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin())));

drop policy if exists "Users delete own cart items" on public.cart_items;
create policy "Users delete own cart items"
on public.cart_items for delete
using (exists (select 1 from public.carts c where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin())));

drop policy if exists "Users read own addresses" on public.customer_addresses;
create policy "Users read own addresses"
on public.customer_addresses for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users create own addresses" on public.customer_addresses;
create policy "Users create own addresses"
on public.customer_addresses for insert
with check (user_id = auth.uid());

drop policy if exists "Users update own addresses" on public.customer_addresses;
create policy "Users update own addresses"
on public.customer_addresses for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users delete own addresses" on public.customer_addresses;
create policy "Users delete own addresses"
on public.customer_addresses for delete
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
on public.orders for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users create own orders" on public.orders;
create policy "Users create own orders"
on public.orders for insert
with check (user_id = auth.uid());

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
on public.orders for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users update own new orders" on public.orders;
create policy "Users update own new orders"
on public.orders for update
using (user_id = auth.uid() and status = 'new')
with check (user_id = auth.uid() and status = 'new');

drop policy if exists "Users read own order items" on public.order_items;
create policy "Users read own order items"
on public.order_items for select
using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));

drop policy if exists "Users create own order items" on public.order_items;
create policy "Users create own order items"
on public.order_items for insert
with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'new'));

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items"
on public.order_items for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users read own order events" on public.order_events;
create policy "Users read own order events"
on public.order_events for select
using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));

drop policy if exists "Users create generated order events" on public.order_events;
create policy "Users create generated order events"
on public.order_events for insert
with check (
  created_by = auth.uid()
  and type in ('order_created', 'whatsapp_generated')
  and exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'new')
);

drop policy if exists "Admins manage order events" on public.order_events;
create policy "Admins manage order events"
on public.order_events for all
using (public.is_admin())
with check (public.is_admin());
