# Admin local ROXWANA - notas para continuar

Fecha: 2026-07-01

Este archivo es una nota interna del proyecto. No es un commit y no se subio a GitHub.
La pagina original en Netlify no debe tocarse hasta que Jael confirme que quiere publicar los cambios.

## Estado actual

- El admin local ya puede abrirse en modo desarrollo.
- URL local: `http://127.0.0.1:3000/admin`
- Acceso local: entrar desde `http://127.0.0.1:3000/admin/login` y usar el boton `Entrar local`.
- El acceso local sirve para revisar y cambiar el panel en desarrollo.
- Para guardar productos reales en Supabase hay que usar `Entrar con Google` con la cuenta admin/editor real.
- El acceso local muestra un aviso porque no debe usarse para operar productos reales.

## Como levantar el servidor local

Desde la carpeta del proyecto:

```powershell
cd "C:\Users\jaell\Desktop\PAGINAS WEB Y APP\roxwana-web"
npm run dev -- --webpack --hostname 127.0.0.1 --port 3000
```

Usar `--webpack` porque el servidor local estaba titilando/recargando con el modo rapido. Con webpack quedo estable.

Despues abrir:

```text
http://127.0.0.1:3000/admin/login
```

Y tocar:

```text
Entrar local
```

## Si el admin vuelve a titilar o no carga

1. Confirmar que hay un solo servidor escuchando en el puerto 3000:

```powershell
cmd /c "netstat -ano | findstr LISTENING | findstr :3000"
```

2. Si aparece un proceso viejo escuchando en `127.0.0.1:3000`, detener solo ese PID:

```powershell
Stop-Process -Id NUMERO_DEL_PID -Force
```

3. Volver a levantar:

```powershell
npm run dev -- --webpack --hostname 127.0.0.1 --port 3000
```

No matar procesos de Adobe, Codex u otros programas. Solo detener el PID que aparece escuchando en el puerto 3000.

## Que se corrigio

### Acceso local al admin

- Se agrego la ruta `app/admin/dev-login/route.ts`.
- Esa ruta solo funciona en desarrollo, porque depende de `NODE_ENV !== "production"`.
- Crea la cookie local `roxwana_dev_admin`.
- Redirige a `/admin` usando el mismo host real de la request.
- Esto corrigio el salto incorrecto de `127.0.0.1` a `localhost`, que hacia que la cookie se perdiera.

### Proteccion del admin

- Se ajusto `proxy.ts`.
- Antes, `/admin/dev-login` quedaba atrapado por la proteccion del admin antes de poder crear la cookie.
- Ahora `/admin/login` y `/admin/dev-login` son rutas publicas dentro del flujo local.
- El resto del admin sigue protegido.

### Google / Netlify

- Se ajusto el callback de auth para que en produccion respete el origen real.
- La idea es no romper Netlify.
- En local se puede usar `127.0.0.1`.
- En produccion el login de Google debe seguir usando la URL real publicada.

### Guardado de productos

- Se aumento el limite de Server Actions en `next.config.mjs`.
- Se agregaron validaciones de imagenes en el cliente.
- Se agregaron mensajes de error mas claros al crear/editar productos.
- Antes, cuando fallaba el guardado, Next podia mostrar una pantalla negra generica de error.
- Ahora el formulario debe volver con un mensaje mas entendible.

## Archivos tocados en esta etapa

- `app/admin/dev-login/route.ts`
- `app/admin/login/page.tsx`
- `app/auth/callback/route.ts`
- `app/login/LoginForm.tsx`
- `components/admin/AdminLoginForm.tsx`
- `components/admin/AdminShell.tsx`
- `components/admin/ProductForm.tsx`
- `components/admin/product-studio/ProductStudio.tsx`
- `lib/auth/redirects.ts`
- `lib/products/mutations.ts`
- `next.config.mjs`
- `proxy.ts`
- Paginas de producto dentro de `app/admin/(panel)/productos/...`

## Verificaciones hechas

- `npm run build` paso correctamente.
- `http://127.0.0.1:3000/admin/dev-login?returnUrl=%2Fadmin` redirige a `http://127.0.0.1:3000/admin`.
- Con cookie local, `/admin` responde 200.
- En el navegador de Codex se pudo abrir una pestaña nueva en `/admin`.
- El panel quedo estable y sin errores de consola.

## Importante para continuar

- No hacer commit ni push todavia.
- No publicar en Netlify hasta revisar todos los cambios pendientes del admin.
- Cuando se vuelva a trabajar, abrir esta nota y continuar desde el admin local.
- Jael quiere hacer varios cambios en el admin antes de tocar la pagina original.

## Etapa Product Studio tipo Product Manager

Fecha: 2026-07-01

Objetivo de esta etapa: acercar el admin web al flujo del proyecto `roxwana-product-manager`, especialmente la pantalla de crear producto.

Lo que se hizo:

- Se redisenio `components/admin/product-studio/ProductStudio.tsx`.
- La pantalla ahora queda mas parecida al Product Manager:
  - tablero de imagenes grande a la izquierda;
  - ficha tecnica debajo del tablero;
  - auditoria compacta;
  - datos del producto en panel derecho;
  - preview en panel derecho;
  - zona manual de productos hermanos.
- Se saco cualquier idea de IA de esta pantalla. La IA queda solo como concepto del Product Manager, no de la web.
- Se conservaron los mismos `name` del formulario que ya usa Supabase:
  - `model_code`
  - `name`
  - `slug`
  - `garment_type_id`
  - `gender`
  - `status`
  - `price`
  - `compare_at_price`
  - `category_id`
  - `collection_id`
  - `sort_order`
  - `featured`
  - `description_short`
  - `description_long`
  - `whatsapp_message`
  - `variants`
  - metadata de imagenes nuevas y existentes
- No se cambio el esquema de Supabase.
- No se cambio la logica de guardado real en esta etapa, porque Jael confirmo que en Netlify el guardado real esta funcionando bien.

Verificaciones hechas:

- `cmd /c npm run build` paso correctamente.
- Se abrio `http://127.0.0.1:3000/admin/productos/nuevo/studio` en el navegador de Codex.
- La pagina local no redirigio al login.
- No aparecieron errores de consola.
- Se audito el formulario en el navegador: hay un solo `model_code`, un solo `name`, un solo `slug`, un solo `price`, un solo `variants` y un solo input `images`.

## Plan para productos hermanos

Caso que pidio Jael: remera lisa negra, blanca y gris deben ser productos separados, cada uno con codigo propio. Cuando el cliente cambie de color en la pagina publica, el codigo/producto visible tiene que cambiar tambien.

Decision segura por ahora:

- En esta etapa NO se migra base de datos.
- En esta etapa NO se cambia el guardado Supabase.
- El admin solo muestra una zona manual de `Productos hermanos` para pensar los codigos por color.
- La forma correcta final va a ser una relacion de familia entre productos separados.

Modelo futuro recomendado:

- Cada color importante se guarda como producto real independiente.
- Cada producto mantiene su propio:
  - `model_code`
  - slug
  - imagenes
  - stock/variantes
  - estado
- Se agrega una relacion de familia o grupo, por ejemplo:
  - `product_family_id`
  - `family_color_code`
  - `family_sort_order`
- En la pagina publica, el selector de color no cambiaria solo una variante interna: navegaria o resolveria al producto hermano correcto.

Orden recomendado para hacerlo bien:

1. Terminar y aprobar la interfaz manual del Studio.
2. Confirmar como van a ser los codigos reales de las lisas por color.
3. Disenar la migracion Supabase de familias.
4. Crear una pantalla/panel para asociar productos hermanos.
5. Cambiar la pagina publica para que el selector de color apunte al producto hermano correcto.
6. Recien ahi probar con productos reales y publicar.

## Ajustes posteriores del Studio

Fecha: 2026-07-01

Cambios hechos despues de revisar la interfaz:

- El tablero de imagenes ahora acepta arrastrar archivos desde una carpeta.
- Tambien intenta leer carpetas completas arrastradas al tablero, tomando las imagenes JPG, PNG y WEBP que encuentre.
- Las imagenes arrastradas se conectan a un input real del formulario para que despues viajen en el guardado normal.
- Si se arrastra algo que no es imagen, se ignora y se muestra aviso.
- La ficha tecnica se movio arriba del tablero y quedo mas compacta, solo para pegar/importar.
- Se saco la ficha duplicada que habia quedado abajo.
- La auditoria quedo como bloque compacto debajo del tablero.
- Los colores ahora muestran swatch, codigo y nombre para que se entiendan mejor.
- El campo `Tipo de prenda` ahora se ve como `Prenda`.
- El campo `Categoria` ya no se muestra como selector duplicado.
- `category_id` queda oculto y se intenta sincronizar automaticamente con la prenda cuando hay una categoria equivalente.

Verificacion:

- `cmd /c npm run build` paso correctamente despues de estos cambios.

## Ajuste de duplicacion y tablero de imagenes

Fecha: 2026-07-01

Problema detectado:

- Al arrastrar imagenes, el drop se procesaba dos veces.
- Eso duplicaba las tarjetas en el tablero.
- React mostraba error de keys repetidas en `ProductStudio.tsx` porque entraban dos imagenes con el mismo identificador.

Correccion:

- Se dejo un solo manejador real de drop para el tablero.
- El drop ahora corta la propagacion del evento.
- Se agrego filtro para ignorar imagenes repetidas por nombre, peso y fecha de modificacion.
- Cada lote de imagenes ahora genera identificadores internos unicos.
- Las keys de metadata quedaron reforzadas para evitar errores durante hot reload.

Vista del tablero:

- La portada queda destacada mas grande.
- Las demas imagenes quedan en tarjetas mas compactas.
- Las imagenes usan `object-contain` para no verse recortadas ni estiradas.
- El tablero tiene scroll interno cuando hay muchas imagenes.
- Se agrego boton `Ampliar` para abrir el tablero en pantalla grande y `Cerrar` para volver.

Verificacion:

- `cmd /c npm run build` paso correctamente despues del ajuste.

## Ajuste responsive del tablero

Fecha: 2026-07-01

Cambios hechos:

- Se redujo la ficha tecnica superior para que no deje tanto espacio vacio antes del tablero.
- El tablero ya no usa columnas fijas por breakpoint.
- Ahora usa columnas automaticas con ancho minimo para evitar tarjetas demasiado flacas en monitores de baja resolucion.
- En vista normal el tablero ya no tiene scroll interno; la pagina completa maneja la rueda.
- En vista ampliada las tarjetas usan un ancho minimo mayor para poder editar rol, device, numero, color y orden con mas comodidad.
- La portada solo se expande a doble columna en pantallas grandes, para no romper la grilla en resoluciones chicas.
- Las proporciones de imagen cambiaron a formatos mas compactos:
  - portada: `16/10`;
  - otras imagenes: `4/3`.
- Los controles internos de cada tarjeta tambien usan columnas automaticas para que los labels no se peguen.

Verificacion:

- `cmd /c npm run build` paso correctamente.

## Ajuste de scroll independiente

Fecha: 2026-07-01

Problema detectado:

- En baja resolucion, el tablero normal tenia scroll interno.
- Al usar la rueda del mouse en zonas del admin, ese scroll interno podia capturar el movimiento y no bajaba la pagina general.

Correccion:

- Se saco el scroll interno del tablero en vista normal.
- En vista normal, la pagina completa vuelve a manejar la rueda y permite llegar a los campos de abajo.
- El scroll propio queda solo para el modo `Ampliar`, donde el tablero es una capa fija y debe moverse independiente.

Correccion final:

- Se elimino el control de rueda por JavaScript porque podia quedar pegado.
- En vista normal, la grilla de imagenes queda con `overflow-y-hidden`.
- Solo cuando el mouse esta realmente encima de la grilla se activa `hover:overflow-y-auto`.
- Si el mouse esta sobre el menu, Productos, Categorias o cualquier zona externa, el tablero no es scrolleable y la rueda mueve la pagina general.
- El modo `Ampliar` mantiene su scroll propio porque funciona como capa fija.

Verificacion:

- `cmd /c npm run build` paso correctamente.

## Aviso local del menu admin

Fecha: 2026-07-01

Problema detectado:

- El cartel rojo de acceso local ocupaba demasiado alto en el sidebar.
- En monitores chicos tapaba opciones del menu como pedidos, carritos, consultas, settings y usuarios.

Correccion:

- El aviso rojo ahora es un desplegable chico `Acceso local`.
- Queda cerrado por defecto.
- Si hace falta leer el aviso completo, se abre tocando ese boton.
- El menu queda con mas espacio vertical visible.

Verificacion:

- `cmd /c npm run build` paso correctamente.
