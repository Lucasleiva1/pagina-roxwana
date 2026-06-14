# ROXWANA Web

Web Store ROXWANA con frontend visual premium, Supabase Auth/Database/Storage, carrito persistente y Admin Backstage.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth, Database y Storage

## Desarrollo

```bash
npm.cmd install
npm.cmd run dev
```

Abrir `http://127.0.0.1:3000`.

## Validacion

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

## Configuracion

Copiar `.env.example` a `.env.local`.

Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=5491100000000
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` es solo fallback temporal. En produccion el numero real se lee desde `site_settings`.

## Supabase

1. Crear proyecto Supabase.
2. Ejecutar las migraciones de `supabase/migrations` en orden en el SQL Editor si no se usa Supabase CLI.
3. Ejecutar `supabase/seed.sql`.
4. Crear un usuario admin desde Supabase Auth.
5. Insertar el profile admin manualmente:

```sql
insert into public.profiles (user_id, name, role)
values ('USER_ID_DEL_AUTH_USER', 'Admin ROXWANA', 'admin');
```

Los buckets `product-images`, `site-images` y `brand-assets` se crean desde migraciones. Las imagenes son publicas para lectura y solo admins/editors pueden subir/editar/borrar.

## Fase 3

- Catalogo publico desde Supabase con fallback mock solo en desarrollo.
- `/productos` con filtros por genero, prenda, color, talle y busqueda.
- `/producto/[slug]` con selector de color/talle/cantidad, SKU y agregado al carrito con login requerido.
- `/login` para clientes con Google principal y registro manual minimo.
- `/admin/login` para admins/editors; `/admin` requiere `profiles.role in ('admin', 'editor')`.
- `/carrito` persistente, checkout con direccion y pedido enviado por WhatsApp.
- Admin Backstage para productos, categorias, drops, home, media, settings, usuarios, clientes, pedidos, carritos y consultas legacy.
- `/admin-login` y `/command/*` quedan como compatibilidad y redirigen a las rutas nuevas.
