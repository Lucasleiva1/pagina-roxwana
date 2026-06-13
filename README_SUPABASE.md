# ROXWANA Supabase Setup

Proyecto Supabase confirmado:

- Nombre: `roxwana-store`
- Project ref: `amdrfbppefqbdrxuolje`
- Project URL: `https://amdrfbppefqbdrxuolje.supabase.co`
- Region: `us-east-1`

## Estado De Seguridad

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son publicos. Pueden estar en cliente y Netlify.
- `SUPABASE_SERVICE_ROLE_KEY` es privado. Nunca va en componentes cliente, nunca se sube a GitHub y solo se guarda como variable secreta local/Netlify.
- `SUPABASE_DB_PASSWORD` es privado. Solo sirve para CLI o acceso directo a DB. No lo necesita el navegador ni Netlify para ejecutar la app.
- `SUPABASE_PROJECT_REF` no es secreto. Sirve para CLI y documentacion.

## Variables Locales

Crear `.env.local` desde `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://amdrfbppefqbdrxuolje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PEGAR_ANON_O_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=PEGAR_SERVICE_ROLE_O_SECRET_KEY
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=549...
SUPABASE_PROJECT_REF=amdrfbppefqbdrxuolje
SUPABASE_DB_PASSWORD=SOLO_SI_USAS_SUPABASE_CLI
```

`.env.local` no se sube a GitHub.

## Donde Encontrar Las Keys

En Supabase:

1. Entrar al proyecto `roxwana-store`.
2. Ir a **Project Settings**.
3. Ir a **API Keys** o abrir **Connect** y elegir framework Next.js.

Datos:

- Project URL: publico. Va en `NEXT_PUBLIC_SUPABASE_URL`.
- Publishable key o anon key: publica. Va en `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Secret key o service role key: privada. Va en `SUPABASE_SERVICE_ROLE_KEY`.
- Database password: privada. Solo para CLI/conexion directa; no va en Netlify salvo que una tarea explicita lo requiera.

## Netlify

En Netlify:

1. Site settings.
2. Environment variables.
3. Agregar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` como fallback temporal

No agregar `SUPABASE_DB_PASSWORD` en Netlify para esta app.

## Migraciones Y Seed

Las migraciones locales estan en:

```bash
supabase/migrations/20260608210706_initial_roxwana_store.sql
supabase/migrations/20260609180000_phase3_customer_auth_cart_orders.sql
```

El seed esta en:

```bash
supabase/seed.sql
```

## Primer Admin Manual

No hay registro publico de admins. Los clientes usan `/login`; el admin usa `/admin-login`.

Crear el usuario admin desde Supabase Dashboard:

1. Entrar a **Authentication**.
2. Entrar a **Users**.
3. Click en **Add user**.
4. Crear usuario con tu email y password.

Luego ir a **SQL Editor** y ejecutar, cambiando el email:

```sql
insert into public.profiles (user_id, name, role)
select id, 'Admin ROXWANA', 'admin'
from auth.users
where email = 'TU_EMAIL_ADMIN'
on conflict (user_id) do update
set name = excluded.name,
    role = 'admin';
```

## Como Probar

Con `.env.local` cargado:

```bash
npm.cmd run dev
```

Pruebas:

- `/productos` debe mostrar productos desde Supabase.
- `/producto/remera-rock-001` debe abrir producto real.
- `/login` permite entrar con Google o con email/password, y registrarse manualmente.
- `/admin-login` permite entrar al Command Center solo si `profiles.role = 'admin'`.
- `/command` bloquea usuarios sin profile admin.
- Agregar al carrito sin sesion redirige a `/login?returnUrl=...`.
- `/carrito` guarda pedido, items y eventos antes de abrir WhatsApp.
- `/command/consultas` queda como historico legacy de `whatsapp_orders`.

## Auth Cliente

En Supabase Auth:

1. Habilitar signup.
2. Desactivar confirmacion de email si se quiere que el registro manual entre directo.
3. Para Google OAuth, entrar a **Authentication > Providers > Google** y cargar el Client ID y Client Secret de Google Cloud.
4. Agregar redirect URL local:

```text
http://127.0.0.1:3000/auth/callback
```

Cuando exista el dominio final, agregar tambien:

```text
https://TU-SITIO.netlify.app/auth/callback
```

El Google Client Secret queda solo en Supabase/Google, nunca en el repo.

En Google Cloud Console, el Authorized redirect URI del OAuth client debe apuntar al callback de Supabase:

```text
https://amdrfbppefqbdrxuolje.supabase.co/auth/v1/callback
```

En Supabase, las Redirect URLs permitidas deben incluir:

```text
http://127.0.0.1:3000/auth/callback
```

Y cuando exista dominio final, tambien:

```text
https://TU-DOMINIO/auth/callback
```

## Storage

Bucket esperado:

- Nombre: `product-images`
- Publico: si, para lectura de imagenes.
- Limite: 3 MB.
- MIME permitidos: `image/jpeg`, `image/png`, `image/webp`.

Policies:

- Publico lee archivos del bucket.
- Admin autenticado puede insertar, actualizar y borrar.
