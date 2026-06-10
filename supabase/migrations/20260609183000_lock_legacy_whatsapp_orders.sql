drop policy if exists "Public inserts whatsapp orders" on public.whatsapp_orders;

drop policy if exists "Authenticated inserts legacy whatsapp orders" on public.whatsapp_orders;
create policy "Authenticated inserts legacy whatsapp orders"
on public.whatsapp_orders for insert
with check (auth.uid() is not null);
