# ROXWANA Web

Web Store ROXWANA con frontend visual premium y Fase 2 preparada para Supabase.

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
2. Ejecutar `supabase/schema.sql` en el SQL Editor.
3. Ejecutar `supabase/seed.sql`.
4. Crear un usuario admin desde Supabase Auth.
5. Insertar el profile admin manualmente:

```sql
insert into public.profiles (user_id, name, role)
values ('USER_ID_DEL_AUTH_USER', 'Admin ROXWANA', 'admin');
```

El bucket `product-images` se crea desde `schema.sql`. Las imagenes son publicas para lectura y solo admins pueden subir/editar/borrar.

## Fase 2

- Catalogo publico desde Supabase con fallback mock solo en desarrollo.
- `/productos` con filtros por genero, prenda, color, talle y busqueda.
- `/producto/[slug]` con selector de color/talle/cantidad, SKU y consulta WhatsApp registrada.
- `/login` y `/command` protegidos por sesion + profile admin.
- Command Center para productos, settings y consultas.
