# Proceso de construccion de ROXWANA Web

Fecha de documentacion: 2026-06-08  
Proyecto local: `C:\Users\jaell\Desktop\roxwana-web`  
Repositorio GitHub: `https://github.com/Lucasleiva1/pagina-roxwana.git`  
Commit inicial publicado: `ff8b7d90c50057e9796c8b0ff0d7066e163f2783`

## 1. Pedido inicial

El objetivo fue crear desde cero la primera version visual funcional de la web ecommerce ROXWANA.

La prioridad era que la home se sintiera:

- premium;
- fuerte;
- urbana;
- rockera;
- grafica;
- rebelde;
- comercial;
- no generica ni parecida a una plantilla ecommerce comun.

El pedido tambien aclaro que no se debia implementar backend real todavia. La arquitectura tenia que quedar preparada para conectar Supabase mas adelante, pero sin conectar Supabase en esta fase.

## 2. Material entregado

Se recibio un archivo de texto pegado con el brief completo y ocho imagenes para usar como referencia/asset visual del carrusel y del sitio.

Las imagenes venian desde:

`C:\Users\jaell\Downloads\carrusel-web`

Se verifico que todas tenian formato horizontal de campania, aproximadamente `1672x941`.

## 3. Estado inicial del proyecto

El directorio:

`C:\Users\jaell\Desktop\roxwana-web`

estaba vacio y no era un repositorio Git.

Se confirmo:

- no habia archivos fuente previos;
- no habia `.git`;
- habia Node instalado;
- habia `npm.cmd` disponible;
- las imagenes del carrusel estaban disponibles en la carpeta de descargas.

## 4. Plan definido antes de implementar

Antes de ejecutar la implementacion se preparo un plan con estas decisiones:

- usar Next.js App Router;
- usar React;
- usar TypeScript;
- usar Tailwind CSS;
- usar Framer Motion;
- no usar Zustand porque el estado del carrusel y del random podia quedar local;
- crear rutas para home, productos, detalle de producto, hombre, mujer y random;
- usar componentes reales de React/HTML para textos, botones y navegacion;
- evitar textos o botones quemados dentro de imagenes;
- usar las imagenes entregadas como assets estables dentro de `public/images`;
- crear productos mock;
- crear helpers para SKU y WhatsApp;
- dejar Supabase fuera de esta primera fase.

## 5. Estructura creada

Se creo una aplicacion Next con esta estructura principal:

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/productos/page.tsx`
- `app/producto/[slug]/page.tsx`
- `app/hombre/page.tsx`
- `app/mujer/page.tsx`
- `app/random/page.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/MobileMenu.tsx`
- `components/home/HeroCarousel.tsx`
- `components/home/GenderGateway.tsx`
- `components/home/FeaturedProducts.tsx`
- `components/home/KineticPrintWall.tsx`
- `components/home/RandomPrintTeaser.tsx`
- `components/home/HowToOrder.tsx`
- `components/product/ProductCard.tsx`
- `components/product/ProductGrid.tsx`
- `components/product/ProductGallery.tsx`
- `components/product/ProductDetailMock.tsx`
- `components/ui/RoxButton.tsx`
- `components/ui/SectionHeader.tsx`
- `components/ui/TextureOverlay.tsx`
- `data/heroSlides.ts`
- `data/mockProducts.ts`
- `lib/products/buildSku.ts`
- `lib/whatsapp/buildWhatsAppMessage.ts`
- `lib/whatsapp/buildWhatsAppUrl.ts`
- `types/product.ts`
- `types/hero.ts`

Tambien se agregaron:

- `README.md`
- `.env.example`
- `eslint.config.mjs`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `next.config.mjs`
- `package.json`
- `package-lock.json`
- `app/icon.svg`

## 6. Imagenes copiadas al proyecto

Las imagenes originales tenian nombres largos con espacios. Para que el codigo no dependiera de esos nombres se copiaron a rutas estables.

Hero:

- `public/images/hero/hero-01.png`
- `public/images/hero/hero-02.png`
- `public/images/hero/hero-03.png`

Productos y secciones visuales:

- `public/images/products/product-01.png`
- `public/images/products/product-02.png`
- `public/images/products/product-03.png`
- `public/images/products/product-04.png`
- `public/images/products/product-05.png`
- `public/images/products/product-06.png`

## 7. Home construida

La home quedo armada con este orden:

1. Header
2. HeroCarousel
3. GenderGateway
4. FeaturedProducts
5. KineticPrintWall
6. RandomPrintTeaser
7. HowToOrder
8. Footer

### Header

Se creo un header oscuro/transparente sobre el hero con:

- logo/wordmark ROXWANA;
- navegacion desktop;
- iconos de busqueda, usuario y bolsa;
- menu mobile hamburguesa.

### HeroCarousel

Se creo un carrusel de 3 slides con:

- imagen de fondo;
- overlay oscuro para legibilidad;
- texto real en HTML;
- CTAs reales;
- autoplay cada 6 segundos;
- controles laterales;
- indicador inferior tipo linea editorial;
- transicion con fade y leve zoom;
- posicionamiento adaptado para mobile.

Slides creados:

- `ROXWANA / SIN PEDIR PERMISO`
- `ESTILO URBANO / HECHO PARA LA CALLE`
- `VESTI FUERTE / SIN EXPLICARTE`

### GenderGateway

Se crearon dos bloques editoriales:

- Hombre
- Mujer

La intencion fue evitar cards comunes y usar imagen, textura, borde fino y hover con zoom.

### FeaturedProducts

Se creo una grilla con 6 productos mock.

Productos:

- `RXW-REM-ROCK001` - Remera Rock 001
- `RXW-REM-DRAGON002` - Remera Dragon 002
- `RXW-REM-MOTO003` - Remera Moto 003
- `RXW-REM-STREET004` - Remera Street 004
- `RXW-REM-SKULL005` - Remera Skull 005
- `RXW-BUZ-HEAVY001` - Buzo Heavy 001

Cada producto tiene:

- codigo de modelo;
- nombre;
- tipo de prenda;
- colores;
- talles;
- imagen;
- slug;
- historia/copy breve.

Colores:

- `NEG` - Negro
- `BLA` - Blanco / Hueso

Talles:

- S
- M
- L
- XL
- XXL

### KineticPrintWall

Se creo una seccion tipo pared de posters con movimiento horizontal lento.

La idea fue mostrar graficas y productos como material de campania, sin abusar de animacion.

### RandomPrintTeaser

Se creo un modulo interactivo que:

- rota productos/estampas;
- permite frenar con el boton `Frenar estampa`;
- muestra el producto elegido;
- permite consultar ese modelo por WhatsApp.

### HowToOrder

Se creo una seccion de 4 pasos:

1. Elegis modelo
2. Seleccionas talle/color
3. Mandas consulta por WhatsApp
4. Confirmamos precio y entrega

La estetica se planteo como etiqueta/sticker, no como seccion corporativa.

## 8. Helpers implementados

### SKU

Archivo:

`lib/products/buildSku.ts`

Formato:

`RXW-{PRENDA}-{MODELO}-{COLOR}-{TALLE}`

Ejemplo:

`RXW-REM-ROCK001-NEG-M`

### WhatsApp

Archivos:

- `lib/whatsapp/buildWhatsAppMessage.ts`
- `lib/whatsapp/buildWhatsAppUrl.ts`

El numero no se hardcodea en componentes. Se usa:

`NEXT_PUBLIC_WHATSAPP_NUMBER`

Si no existe, queda un fallback temporal:

`5491100000000`

El mensaje incluye:

- nombre del producto;
- codigo de modelo;
- SKU si hay color y talle;
- link del producto;
- pregunta por precio final, disponibilidad y forma de pago.

## 9. Decisiones visuales

Se definio una identidad con:

- fondo oscuro;
- mucho contraste;
- off-white/hueso;
- rojo como golpe visual;
- dorado como detalle fino;
- bordes rectangulares;
- botones ROXWANA con barrido sutil;
- textura/grano;
- composicion editorial;
- tipografia condensada segura del sistema.

La paleta usada:

- Negro carbon: `#111111`
- Hueso/off-white: `#F6F3EE`
- Rojo ROXWANA: `#B11226`
- Dorado: `#C8A46A`
- Gris acero: `#6F6F6F`

## 10. Problemas ocurridos durante la implementacion

### 10.1 Instalacion de dependencias colgada

El primer `npm.cmd install` dentro del sandbox se quedo colgado y corto por timeout.

Se verifico que no habia quedado `node_modules` ni `package-lock.json` parcial.

Despues se ejecuto `npm.cmd install` con permisos elevados para poder descargar dependencias desde npm. Esa ejecucion termino correctamente.

### 10.2 Next 14 tenia vulnerabilidades

Inicialmente se habia usado `next@14.2.18`.

`npm` aviso que esa version tenia vulnerabilidades.

Se consultaron versiones disponibles de Next 14 y se subio primero a `14.2.35`.

Luego `npm audit --omit=dev` siguio marcando vulnerabilidades de produccion asociadas a Next y PostCSS.

Para resolverlo se actualizo a:

- `next@16.2.7`
- `eslint-config-next@16.2.7`
- `eslint@9`

Finalmente se aplico override de PostCSS:

`postcss@8.5.10`

Resultado final:

`npm.cmd audit --omit=dev` reporto `found 0 vulnerabilities`.

### 10.3 Build fallaba por Google Fonts

Al principio se uso `next/font/google` con Bebas Neue, Oswald e Inter.

El build fallo porque el entorno no podia descargar fuentes desde Google.

Error:

- no podia hacer fetch a `fonts.googleapis.com`;
- el build de Next fallaba por `next/font`.

Solucion:

- se removio `next/font/google`;
- se uso una pila tipografica local/segura;
- la estetica condensada se mantuvo con fuentes del sistema como `Impact`, `Arial Narrow` y alternativas.

### 10.4 Cambio de contrato en rutas dinamicas con Next 16

Al pasar a Next 16, la ruta:

`/producto/remera-rock-001`

llego a fallar en dev porque `params` debia tratarse como una `Promise`.

Solucion:

En `app/producto/[slug]/page.tsx` se cambio la firma para esperar `params`:

```ts
type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = mockProducts.find((item) => item.slug === slug);
  ...
}
```

Despues de eso la ruta dinamica volvio a responder `200`.

### 10.5 Cards de producto recortaban mal las imagenes

Las imagenes entregadas eran horizontales, con composicion tipo campania.

Al principio las cards usaban formato demasiado vertical, lo que causaba:

- recortes feos;
- zonas negras grandes;
- perdida de impacto visual.

Solucion:

- se cambio la proporcion de cards y galeria a una composicion horizontal/editorial;
- se ajusto el scroll-margin en secciones con anclas.

### 10.6 Problemas al levantar servidor local

Hubo varios intentos de levantar el servidor Next en segundo plano.

Problemas encontrados:

- `Start-Process` con redireccion de logs fallo por conflicto `Path/PATH`;
- algunos jobs de PowerShell arrancaban el servidor pero morian cuando terminaba la sesion;
- `cmd start` no siempre dejaba vivo el proceso;
- en una ocasion se dijo que la pagina estaba abierta, pero el servidor ya se habia apagado.

Este fue el error operativo mas importante: abrir el navegador no era suficiente. Habia que verificar que el servidor siguiera vivo y que la pagina respondiera.

Solucion posterior:

- se levanto el servidor con `Start-Process` fuera del sandbox;
- se verifico con `Invoke-WebRequest`;
- se comprobo que `http://127.0.0.1:3000/` devolvia `200 OK`;
- despues se uso Playwright para verificar render e interacciones.

### 10.7 Playwright y archivos temporales

Para verificar la pagina se uso la skill de chequeo con Playwright.

Problemas:

- escribir JSON de acciones en `C:\tmp` dio acceso denegado;
- PowerShell escribio JSON con BOM y el script no lo pudo parsear.

Solucion:

- se guardaron los archivos de acciones dentro del workspace, en `.codex-checks`;
- se escribieron como UTF-8 sin BOM;
- `.codex-checks` se agrego a `.gitignore`.

### 10.8 Capturas de verificacion

Se generaron capturas para comprobar que el sitio renderizaba.

Algunas capturas fueron movidas a:

`.codex-checks/screenshots`

Despues quedaron dos capturas sueltas sin trackear:

- `live-verify-hero.png`
- `live-verify-products.png`

Esas capturas quedaron en la raiz del proyecto como artefactos de verificacion local y no fueron subidas al commit inicial.

### 10.9 GitHub dio problemas de permisos y ownership

El proyecto no era un repo Git. Se inicializo con:

`git init`

Luego hubo problemas porque `.git` fue creado desde el sandbox y al escalar comandos Git aparecio:

`dubious ownership`

Git indicaba que el repo pertenecia a `CodexSandboxOffline`, pero el comando elevado corria como `jaell`.

Solucion:

Se usaron comandos con:

`git -c safe.directory=C:/Users/jaell/Desktop/roxwana-web ...`

Tambien hubo que usar comandos elevados para:

- renombrar rama a `main`;
- agregar remoto;
- configurar autor local;
- stagear archivos;
- commitear;
- pushear.

## 11. Validaciones realizadas

Se ejecutaron y pasaron:

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

Resultados finales:

- lint sin errores;
- build exitoso con Next `16.2.7`;
- audit de produccion con `0 vulnerabilities`.

Tambien se verificaron rutas con servidor local:

- `/` -> `200`
- `/productos` -> `200`
- `/producto/remera-rock-001` -> `200`
- `/hombre` -> `200`
- `/mujer` -> `200`
- `/random` -> `200`

## 12. Verificacion real con navegador

Se uso Playwright/Chrome para abrir:

`http://127.0.0.1:3000/`

Se comprobo:

- la consola no mostraba errores;
- el hero renderizaba `ROXWANA`;
- el boton de siguiente slide funcionaba;
- despues del click el titulo cambio a `ESTILO URBANO`;
- la seccion de productos existia;
- habia 6 cards de producto renderizadas.

Tambien se verifico visualmente una captura del hero.

## 13. Guardado en GitHub

Se agrego el remoto:

`https://github.com/Lucasleiva1/pagina-roxwana.git`

Se hizo el commit inicial:

`ff8b7d9 Initial ROXWANA ecommerce frontend`

Hash completo:

`ff8b7d90c50057e9796c8b0ff0d7066e163f2783`

Se hizo push a:

`origin/main`

Se verifico que `origin/main` apuntaba al mismo commit:

`ff8b7d90c50057e9796c8b0ff0d7066e163f2783`

## 14. Estado actual conocido

El proyecto existe localmente en:

`C:\Users\jaell\Desktop\roxwana-web`

El repo remoto existe en:

`https://github.com/Lucasleiva1/pagina-roxwana.git`

La rama principal es:

`main`

El ultimo commit publicado hasta este documento es:

`ff8b7d90c50057e9796c8b0ff0d7066e163f2783`

Despues del commit inicial se generaron capturas locales de verificacion que quedaron sin trackear.

## 15. Comandos utiles para continuar

Instalar dependencias:

```bash
npm.cmd install
```

Levantar servidor:

```bash
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Abrir:

`http://127.0.0.1:3000/`

Validar:

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

Ver estado Git:

```bash
git status -sb
```

## 16. Pendientes posibles

Al cierre de la Fase 1 no se habia implementado todavia:

- Supabase;
- login;
- admin;
- pago online;
- stock real;
- carrito real;
- busqueda real;
- filtros reales;
- checkout;
- carga de productos desde base de datos.

Pendientes visuales/futuros posibles:

- agregar mas imagenes reales de producto;
- reemplazar fallback de WhatsApp por numero real;
- mejorar copy de marca;
- sumar seccion Nosotros real;
- preparar colecciones reales;
- agregar metadata SEO completa;
- conectar deploy en Netlify;
- crear variables de entorno reales.

## 17. Aprendizaje operativo

El punto mas importante del proceso fue que no alcanza con abrir una URL en el navegador.

Para decir que la pagina funciona hay que verificar:

- que el servidor esta vivo;
- que la URL responde `200 OK`;
- que las rutas internas responden;
- que no hay errores de consola;
- que el render visual aparece;
- que las interacciones clave funcionan.

Ese criterio queda como regla para las siguientes etapas de esta pagina.

## 18. Fase 2 - Pedido y objetivo

Fecha de implementacion: 2026-06-08

El nuevo pedido fue implementar la Fase 2 de ROXWANA Web Store.

El objetivo fue pasar de una primera version visual con productos mock a una tienda conectable a Supabase, con:

- catalogo real;
- productos configurables;
- imagenes desde storage;
- numero de WhatsApp configurable;
- registro de consultas;
- login;
- Command Center privado;
- SQL completo para base, seed, RLS y storage.

La condicion principal fue conservar la estetica ROXWANA ya lograda en la Fase 1. No se debia reemplazar la home por una plantilla ecommerce generica, ni agregar pagos online, stock complejo, carrito ni checkout.

## 19. Plan de Fase 2 implementado

Antes de editar se definio un plan con estas decisiones:

- agregar dependencias minimas para Supabase;
- separar cliente Supabase de browser, server y admin;
- mantener `SUPABASE_SERVICE_ROLE_KEY` solo del lado servidor;
- usar `server-only` para reforzar la frontera de codigo privado;
- crear SQL en archivos locales, sin intentar tocar una base real porque aun no habia credenciales;
- migrar catalogo publico a queries reales con fallback mock solo en desarrollo;
- mantener fallback mock para que el proyecto compile y funcione localmente sin Supabase configurado;
- proteger `/command` con sesion Supabase y chequeo server-side de `profiles.role = admin`;
- crear login oscuro alineado a ROXWANA;
- crear Command Center con estetica de marca, no admin blanco generico;
- registrar consultas de WhatsApp antes de abrir `wa.me`;
- validar con lint, build, audit, rutas HTTP y Playwright desktop/mobile.

## 20. Dependencias agregadas

Se instalaron:

- `@supabase/supabase-js`
- `@supabase/ssr`
- `server-only`

Comando usado:

```bash
npm.cmd install @supabase/supabase-js @supabase/ssr server-only
```

La instalacion se ejecuto con permisos elevados porque necesitaba descargar paquetes desde npm.

Resultado:

- paquetes instalados correctamente;
- `package.json` actualizado;
- `package-lock.json` actualizado;
- `npm audit` posterior siguio reportando `found 0 vulnerabilities`.

## 21. Variables de entorno actualizadas

Se actualizo `.env.example` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=5491100000000
```

Reglas documentadas:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son publicas y pueden ir al cliente;
- `SUPABASE_SERVICE_ROLE_KEY` es privada y solo debe usarse en servidor;
- `NEXT_PUBLIC_WHATSAPP_NUMBER` queda como fallback temporal;
- el numero real de WhatsApp debe leerse desde `site_settings`;
- `.env`, `.env.local` y `.env.production` no deben subirse al repo.

Tambien se actualizo `.gitignore` para ignorar:

- `.env`
- `.env.production`
- `.env*.local`

## 22. Clientes Supabase creados

Se creo esta estructura:

- `lib/supabase/config.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`

### `config.ts`

Centraliza:

- lectura de `NEXT_PUBLIC_SUPABASE_URL`;
- lectura de `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
- deteccion de Supabase configurado;
- fallback de `NEXT_PUBLIC_SITE_URL`.

Esto permite que el proyecto no rompa si todavia no existe `.env.local`.

### `client.ts`

Cliente de browser con `createBrowserClient`.

Regla:

- no contiene secretos;
- si faltan variables publicas, devuelve `null`;
- se usa para login desde el cliente.

### `server.ts`

Cliente server con `createServerClient`.

Regla:

- usa cookies de Next;
- sirve para lecturas publicas y auth server-side;
- soporta refresh de sesion con cookies.

### `admin.ts`

Cliente admin con service role.

Reglas:

- importa `server-only`;
- nunca debe importarse en componentes cliente;
- usa `SUPABASE_SERVICE_ROLE_KEY`;
- se usa para acciones privadas de Command Center y operaciones de storage.

## 23. Tipos creados y actualizados

Se actualizo:

- `types/product.ts`

Se crearon:

- `types/settings.ts`
- `types/supabase.ts`

### Cambios en `Product`

El producto dejo de ser solamente mock y paso a soportar:

- `id`;
- `modelCode`;
- `model`;
- `garmentType`;
- `garmentTypeId`;
- `garmentLabel`;
- `gender`;
- `status`;
- `featured`;
- `colors`;
- `sizes`;
- `image`;
- `images`;
- `slug`;
- `story`;
- `description`;
- fechas opcionales.

Tambien se agregaron:

- `ProductStatus`;
- `ProductGender`;
- `ProductImage`;
- `ProductOption`;
- `ProductFilters`.

### `types/settings.ts`

Define:

- `SiteSettings`;
- `WhatsAppOrder`;
- `WhatsAppOrderStatus`.

### `types/supabase.ts`

Define un tipo manual de base Supabase para las tablas de Fase 2.

Problema encontrado:

- al principio faltaba la propiedad `Relationships` por tabla;
- eso hizo que `supabase-js` infiriera algunas operaciones como `never`;
- se agrego `Relationships: []` en cada tabla para destrabar inserts/updates tipados.

## 24. SQL Supabase creado

Se creo:

- `supabase/schema.sql`
- `supabase/seed.sql`

### `schema.sql`

Incluye:

- extension `pgcrypto`;
- tablas;
- constraints;
- indices;
- triggers de `updated_at`;
- funcion `public.is_admin()`;
- Row Level Security;
- politicas RLS;
- bucket `product-images`;
- politicas de storage.

Tablas creadas:

- `profiles`
- `garment_types`
- `colors`
- `sizes`
- `products`
- `product_colors`
- `product_sizes`
- `product_images`
- `site_settings`
- `whatsapp_orders`

Indices principales:

- `products_slug_idx`;
- `products_status_idx`;
- `products_featured_idx`;
- `products_gender_idx`;
- `product_images_product_idx`;
- `whatsapp_orders_created_idx`.

### RLS

Reglas implementadas:

- publico puede leer productos `active`;
- admin puede leer y gestionar `draft`, `hidden` y `active`;
- publico puede leer `garment_types`, `colors` y `sizes`;
- publico puede leer `site_settings`;
- publico puede insertar `whatsapp_orders`;
- solo admin puede leer/actualizar consultas;
- solo admin puede crear/editar productos, relaciones, imagenes y settings.

### Storage

Bucket:

- `product-images`

Reglas:

- lectura publica;
- insert/update/delete solo admin;
- el uploader genera paths con `crypto.randomUUID()`;
- no se usan nombres de usuario como path.

### `seed.sql`

Incluye:

- `REM / Remera`;
- `BUZ / Buzo`;
- `MUS / Musculosa`;
- colores iniciales `NEG`, `BLA`, `ROJ`, `AZU`;
- talles `S`, `M`, `L`, `XL`, `XXL`;
- `site_settings` inicial;
- 6 productos equivalentes al mock;
- al menos 4 productos `active`;
- imagen primaria para cada producto usando rutas locales de `public/images/products`.

Productos seed:

- `RXW-REM-ROCK001` - Remera Rock 001
- `RXW-REM-DRAGON002` - Remera Dragon 002
- `RXW-REM-MOTO003` - Remera Moto 003
- `RXW-REM-STREET004` - Remera Street 004
- `RXW-REM-SKULL005` - Remera Skull 005
- `RXW-BUZ-HEAVY001` - Buzo Heavy 001

## 25. Capa de productos

Se crearon:

- `lib/products/normalizeProduct.ts`
- `lib/products/queries.ts`
- `lib/products/mutations.ts`

Se actualizo:

- `lib/products/buildSku.ts`

### Normalizacion

`normalizeProduct.ts` convierte la forma Supabase a la forma UI camelCase.

Hace:

- toma `garment_types`;
- toma `product_colors`;
- toma `product_sizes`;
- toma `product_images`;
- ordena talles por `sort_order`;
- ordena imagenes por `sort_order`;
- elige imagen primaria;
- deriva `model` desde `model_code`.

Ejemplo:

`RXW-REM-ROCK001` con prenda `REM` produce `model = ROCK001`.

### Queries

Funciones creadas:

- `getActiveProducts()`
- `getFeaturedProducts()`
- `getProductBySlug(slug)`
- `getProductById(id)`
- `getProductsForCommand()`
- `getProductOptions()`
- `searchProducts(filters)`

Regla importante:

- si Supabase no esta configurado y `NODE_ENV !== "production"`, usa `data/mockProducts.ts`;
- en produccion no usa mock si Supabase falta;
- si Supabase responde sin productos en desarrollo, tambien permite fallback para poder probar visualmente.

### Mutations

Server Actions creadas:

- `createProductAction`
- `updateProductAction`
- `changeProductStatusAction`
- `duplicateProductAction`

Validaciones:

- `model_code` requerido;
- `name` requerido;
- `slug` requerido;
- `garment_type_id` requerido;
- `status` requerido;
- productos no draft necesitan al menos color y talle;
- imagenes permitidas: jpg, jpeg, png, webp;
- limite recomendado: 3 MB por imagen.

Tambien se implemento:

- reemplazo de relaciones producto-color;
- reemplazo de relaciones producto-talle;
- subida de imagenes a storage;
- borrado de filas `product_images`;
- intento de borrado del objeto real en storage si la URL pertenece al bucket `product-images`;
- revalidacion de rutas publicas y privadas.

### SKU

`buildSku.ts` mantiene el formato:

```text
RXW-{PRENDA}-{MODELO}-{COLOR}-{TALLE}
```

Si falta color o talle, devuelve SKU parcial.

Ejemplo:

```text
RXW-REM-ROCK001-NEG-M
```

## 26. Catalogo publico migrado

Se actualizaron:

- `app/page.tsx`
- `app/productos/page.tsx`
- `app/producto/[slug]/page.tsx`
- `app/hombre/page.tsx`
- `app/mujer/page.tsx`
- `app/random/page.tsx`
- `components/home/FeaturedProducts.tsx`
- `components/home/RandomPrintTeaser.tsx`
- `components/product/ProductCard.tsx`
- `components/product/ProductGrid.tsx`
- `components/product/ProductGallery.tsx`

Se crearon:

- `components/product/ProductFilters.tsx`
- `components/product/ProductDetail.tsx`
- `components/product/ProductSelector.tsx`

Se elimino:

- `components/product/ProductDetailMock.tsx`

### Home

Antes:

- importaba productos mock desde `FeaturedProducts` y `RandomPrintTeaser`.

Ahora:

- `app/page.tsx` carga productos con `getFeaturedProducts()` y `getActiveProducts()`;
- los pasa como props a los componentes;
- mantiene `HeroCarousel`, `GenderGateway`, `KineticPrintWall` y `HowToOrder`.

### `/productos`

Ahora usa:

- `searchProducts(filters)`;
- `getProductOptions()`;
- `ProductFilters`;
- `ProductGrid`.

Filtros implementados por query string:

- `q`;
- `gender`;
- `garmentType`;
- `color`;
- `size`.

### `/producto/[slug]`

Antes:

- usaba `mockProducts.find`.

Ahora:

- usa `getProductBySlug(slug)`;
- carga `getSiteSettings()`;
- renderiza `ProductDetail`;
- si no hay producto, usa `notFound()`.

### `/hombre` y `/mujer`

Ahora usan:

- `searchProducts({ gender: "hombre" })`;
- `searchProducts({ gender: "mujer" })`.

Como regla comercial, `unisex` tambien aparece en filtros de genero.

### `/random`

Ahora usa productos reales/fallback desde `getActiveProducts()`.

### Cards de producto

Antes:

- tenian link directo a WhatsApp con talle/color fijos.

Ahora:

- llevan al detalle para elegir color, talle y cantidad;
- no generan consulta sin seleccion real.

## 27. WhatsApp configurado y consultas

Se reemplazaron/crearon:

- `lib/whatsapp/buildWhatsAppMessage.ts`
- `lib/whatsapp/buildWhatsAppUrl.ts`
- `lib/whatsapp/createWhatsAppOrder.ts`
- `lib/whatsapp/orders.ts`

### Mensaje

Incluye:

- producto;
- codigo de modelo;
- SKU;
- color;
- talle;
- cantidad;
- link del producto;
- pregunta por precio final, disponibilidad y forma de pago.

### URL

`buildWhatsAppUrl` normaliza el telefono y devuelve `null` si no hay numero valido.

### Registro de consulta

`createWhatsAppOrder`:

- vuelve a leer el producto en servidor;
- valida que exista;
- valida que color y talle pertenezcan al producto;
- limita cantidad entre 1 y 20;
- lee `site_settings`;
- genera SKU;
- genera mensaje;
- inserta `whatsapp_orders` si Supabase esta configurado;
- devuelve URL `wa.me` si WhatsApp esta habilitado y hay numero;
- devuelve fallback controlado si WhatsApp esta desactivado o no hay numero.

Esto evita confiar solamente en el cliente.

### Consultas admin

`orders.ts` agrega:

- `getWhatsAppOrders(limit)`;
- `updateWhatsAppOrderStatusAction`.

Estados:

- `new`;
- `read`;
- `done`.

## 28. Settings

Se crearon:

- `lib/settings/getSiteSettings.ts`
- `lib/settings/updateSiteSettings.ts`

### Lectura

`getSiteSettings()`:

- lee `site_settings`;
- si no hay Supabase, usa fallback local;
- no rompe build/dev si faltan credenciales.

### Escritura

`updateSiteSettingsAction()`:

- requiere admin;
- valida formato basico de WhatsApp;
- acepta solo URLs `https:` para Instagram y TikTok;
- actualiza o inserta settings;
- revalida home y `/command/settings`.

## 29. Auth y proteccion de Command Center

Se crearon:

- `lib/auth/requireAdmin.ts`
- `proxy.ts`
- `app/login/page.tsx`
- `app/login/LoginForm.tsx`

### `requireAdmin`

Hace:

- lee usuario con Supabase server client;
- busca profile con `user_id`;
- exige `role = admin`;
- si no hay admin, redirige a `/login`.

### `proxy.ts`

Hace:

- refresh de sesion Supabase;
- redireccion de `/command` a `/login` si no hay usuario;
- evita ejecutar sobre assets estaticos.

### Login

`/login`:

- mantiene estetica oscura ROXWANA;
- usa email/password;
- muestra error claro si Supabase no esta configurado;
- redirige a `/command` si login funciona.

No se implemento registro publico de admins.

El primer admin debe crearse manualmente en Supabase.

## 30. Command Center creado

Se crearon rutas:

- `app/command/layout.tsx`
- `app/command/page.tsx`
- `app/command/productos/page.tsx`
- `app/command/productos/nuevo/page.tsx`
- `app/command/productos/[id]/editar/page.tsx`
- `app/command/settings/page.tsx`
- `app/command/consultas/page.tsx`

Se crearon componentes:

- `components/command/CommandShell.tsx`
- `components/command/CommandHeader.tsx`
- `components/command/CommandStat.tsx`
- `components/command/ProductForm.tsx`
- `components/command/ProductTable.tsx`
- `components/command/ImageUploader.tsx`
- `components/command/SettingsForm.tsx`
- `components/command/WhatsAppOrdersTable.tsx`
- `components/command/StatusBadge.tsx`

### Dashboard `/command`

Muestra:

- total de productos;
- productos activos;
- borradores;
- ocultos;
- ultimas consultas;
- acceso rapido a nuevo producto;
- acceso rapido a settings;
- tabla corta de productos.

### Productos `/command/productos`

Incluye:

- busqueda por nombre/modelo;
- filtro por status;
- acciones editar, activar, ocultar y duplicar.

### Nuevo producto

Campos:

- codigo modelo;
- nombre;
- slug automatico editable;
- prenda;
- genero;
- estado;
- descripcion;
- destacado;
- colores;
- talles;
- imagenes.

### Editar producto

Permite:

- editar campos principales;
- editar relaciones;
- subir imagenes nuevas;
- marcar imagenes existentes para borrar;
- cambiar estado.

### Settings

Permite editar:

- `whatsapp_number`;
- `whatsapp_label`;
- `whatsapp_enabled`;
- `fallback_contact`;
- `instagram_url`;
- `tiktok_url`.

### Consultas

Permite:

- ver consultas WhatsApp;
- ver producto;
- ver SKU;
- ver color/talle/cantidad;
- ver fecha;
- cambiar estado `new/read/done`.

## 31. Diseno conservado

La Fase 2 mantuvo la direccion visual de Fase 1:

- fondo negro/carbon;
- hueso para texto;
- rojo como golpe visual;
- dorado en bordes/detalles;
- grillas editoriales;
- botones rectangulares;
- textura y sombra ya existentes;
- tipografia condensada del sistema;
- nada de panel admin blanco generico.

El Command Center se hizo oscuro, con paneles carbon, bordes finos, badges y tablas responsive.

## 32. Archivos principales creados

Nuevos archivos importantes:

- `app/login/page.tsx`
- `app/login/LoginForm.tsx`
- `app/command/layout.tsx`
- `app/command/page.tsx`
- `app/command/productos/page.tsx`
- `app/command/productos/nuevo/page.tsx`
- `app/command/productos/[id]/editar/page.tsx`
- `app/command/settings/page.tsx`
- `app/command/consultas/page.tsx`
- `components/command/*`
- `components/product/ProductDetail.tsx`
- `components/product/ProductFilters.tsx`
- `components/product/ProductSelector.tsx`
- `lib/auth/requireAdmin.ts`
- `lib/products/normalizeProduct.ts`
- `lib/products/queries.ts`
- `lib/products/mutations.ts`
- `lib/settings/getSiteSettings.ts`
- `lib/settings/updateSiteSettings.ts`
- `lib/supabase/*`
- `lib/whatsapp/createWhatsAppOrder.ts`
- `lib/whatsapp/orders.ts`
- `proxy.ts`
- `supabase/schema.sql`
- `supabase/seed.sql`
- `types/settings.ts`
- `types/supabase.ts`

Archivo eliminado:

- `components/product/ProductDetailMock.tsx`

## 33. Archivos modificados principales

Se modificaron:

- `.env.example`
- `.gitignore`
- `README.md`
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/productos/page.tsx`
- `app/producto/[slug]/page.tsx`
- `app/hombre/page.tsx`
- `app/mujer/page.tsx`
- `app/random/page.tsx`
- `components/home/FeaturedProducts.tsx`
- `components/home/RandomPrintTeaser.tsx`
- `components/layout/Footer.tsx`
- `components/product/ProductCard.tsx`
- `components/product/ProductGallery.tsx`
- `components/product/ProductGrid.tsx`
- `data/mockProducts.ts`
- `lib/products/buildSku.ts`
- `lib/whatsapp/buildWhatsAppMessage.ts`
- `lib/whatsapp/buildWhatsAppUrl.ts`
- `types/product.ts`

Tambien cambio `next-env.d.ts` de:

```ts
import "./.next/dev/types/routes.d.ts";
```

a:

```ts
import "./.next/types/routes.d.ts";
```

Ese archivo lo actualiza Next automaticamente durante build.

## 34. Problemas encontrados durante Fase 2

### 34.1 Instalacion de dependencias requirio red

Para instalar Supabase se necesito red.

El comando se ejecuto con permisos elevados:

```bash
npm.cmd install @supabase/supabase-js @supabase/ssr server-only
```

Resultado:

- instalacion correcta;
- audit limpio.

### 34.2 Reemplazo accidental de `buildSku.ts` durante patch

Durante un patch grande se intento reemplazar `lib/products/buildSku.ts`.

Problema:

- el patch lo marco como add/delete en la misma operacion;
- temporalmente el archivo quedo faltante.

Solucion:

- se verifico con `Test-Path`;
- se recreo inmediatamente `lib/products/buildSku.ts`;
- se continuo con la version correcta.

### 34.3 Reemplazo de helpers WhatsApp con add/delete

Ocurrio algo similar al reemplazar:

- `lib/whatsapp/buildWhatsAppMessage.ts`
- `lib/whatsapp/buildWhatsAppUrl.ts`

Problema:

- el patch mostro add/delete en la misma operacion.

Solucion:

- se verifico que ambos archivos existieran;
- se confirmo su contenido;
- no hizo falta recrearlos porque quedaron correctamente presentes.

### 34.4 TypeScript fallo por `color.hex` nullable

El nuevo tipo `ProductColor.hex` permite `null`.

Build fallo en:

```ts
style={{ backgroundColor: color.hex }}
```

Solucion:

```ts
style={{ backgroundColor: color.hex || "#111111" }}
```

### 34.5 TypeScript infirio `profiles` como `never`

Build fallo en `lib/auth/requireAdmin.ts`.

Problema:

- Supabase no estaba infiriendo bien el tipo de respuesta;
- `data` aparecia como `never`.

Solucion:

- se agrego tipo local `AdminProfileRow`;
- se castea la fila en ese borde controlado.

### 34.6 `supabase-js` infirio inserts como `never`

Build fallo en `lib/products/mutations.ts` al insertar `product_images`.

Causa:

- `types/supabase.ts` no tenia `Relationships` en las tablas;
- `supabase-js` necesita esa estructura para inferir correctamente.

Solucion:

- se agrego `Relationships: []` en cada tabla.

### 34.7 Supabase embed select no conocia relaciones

Build fallo en `lib/products/queries.ts`.

Problema:

- el tipo manual de Supabase no describe relaciones embebidas como `garment_types(...)`;
- TypeScript devolvia `SelectQueryError`.

Solucion:

- se hizo cast explicito `as unknown as ProductRecord[]` en el borde de normalizacion;
- el resto de la app sigue usando tipos UI seguros.

### 34.8 `maybeSingle()` estaba antes de terminar la query

Build fallo porque se hacia:

```ts
supabase.from("products").select(...).eq("slug", slug).maybeSingle()
```

y despues se intentaba aplicar:

```ts
query.eq("status", "active")
```

Problema:

- `maybeSingle()` cierra la cadena.

Solucion:

- mover `maybeSingle()` al final.

### 34.9 Rutas prerenderizadas cuando debian ser dinamicas

Build paso, pero el output mostro algunas rutas como estaticas.

Riesgo:

- con Supabase sin env durante build, las paginas podian quedar congeladas con fallback;
- catalogo/settings/admin necesitan datos runtime.

Solucion:

- agregar `export const dynamic = "force-dynamic"` en:
  - `app/layout.tsx`;
  - `app/page.tsx`;
  - `app/productos/page.tsx`;
  - `app/producto/[slug]/page.tsx`;
  - `app/hombre/page.tsx`;
  - `app/mujer/page.tsx`;
  - `app/random/page.tsx`;
  - `app/command/layout.tsx`.

### 34.10 `Start-Process` volvio a fallar por `Path/PATH`

Al levantar servidor con PowerShell:

```powershell
Start-Process -FilePath npm.cmd ...
```

fallo con:

```text
Ya se ha agregado el elemento. Clave en el diccionario: 'Path'  Clave agregada: 'PATH'
```

Se intento tambien con `node.exe` directo, pero dentro del sandbox seguia el mismo choque.

Solucion:

- se ejecuto el arranque fuera del sandbox con permisos elevados;
- se verifico la URL con `Invoke-WebRequest`;
- el servidor quedo vivo en `http://127.0.0.1:3000`.

### 34.11 Playwright desktop detecto warning de Next

Playwright mostro:

```text
Detected scroll-behavior: smooth on the <html> element.
```

Solucion:

- se agrego en `app/layout.tsx`:

```tsx
<html lang="es" data-scroll-behavior="smooth">
```

Despues se repitio Playwright y no hubo mensajes.

### 34.12 Playwright mobile clickeaba el link desktop oculto

La primera prueba mobile fallaba al clickear `Shop`.

Causa:

- el selector por texto elegia primero el link desktop oculto;
- ese link no era visible en viewport mobile.

Solucion:

- se cambio la accion a un selector especifico del overlay mobile:

```css
div.fixed.inset-0 nav a[href='/productos']
```

Despues la prueba mobile paso.

## 35. Validaciones de Fase 2

Se ejecutaron:

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

Resultados:

- lint paso;
- build paso;
- audit reporto `found 0 vulnerabilities`.

Build final:

- Next `16.2.7`;
- todas las rutas de app quedaron dinamicas excepto `/icon.svg`;
- Proxy/Middleware activo.

Rutas verificadas con servidor local:

- `/` -> `200`
- `/productos` -> `200`
- `/producto/remera-rock-001` -> `200`
- `/hombre` -> `200`
- `/mujer` -> `200`
- `/random` -> `200`
- `/login` -> `200`
- `/command` -> `307 /login`

Esto confirma que sin sesion el Command Center no queda abierto.

## 36. Verificacion con navegador

Se uso la skill de Playwright real.

Servidor:

```text
http://127.0.0.1:3000
```

### Desktop

Acciones:

- abrir home;
- screenshot home;
- click en `Shop`;
- screenshot productos;
- contar cards `article`;
- click en `Ver modelo`;
- screenshot detalle;
- contar botones.

Resultado:

- consola sin mensajes;
- `productArticles = 6`;
- navegacion al detalle correcta;
- `buttons = 15`.

Capturas guardadas:

- `.codex-checks/phase2-home.png`
- `.codex-checks/phase2-products.png`
- `.codex-checks/phase2-product-detail.png`

### Mobile

Acciones:

- abrir home mobile;
- screenshot home;
- abrir menu;
- click en Shop dentro del menu mobile;
- screenshot productos;
- contar productos.

Resultado:

- consola sin mensajes;
- menu mobile abre;
- navegacion a Shop funciona;
- `mobileProductArticles = 6`.

Capturas guardadas:

- `.codex-checks/phase2-mobile-home.png`
- `.codex-checks/phase2-mobile-products.png`

## 37. Estado actual despues de Fase 2

La app ya tiene implementado:

- Supabase clients;
- SQL de base;
- seed;
- RLS;
- storage;
- catalogo real conectable;
- fallback mock de desarrollo;
- filtros publicos;
- detalle con selector;
- SKU en vivo;
- WhatsApp configurable;
- registro de consultas;
- login;
- Command Center protegido;
- creacion/edicion/duplicacion/activacion/ocultamiento de productos;
- subida/borrado de imagenes;
- settings;
- listado de consultas.

Todavia no se pudo probar con una base Supabase real porque no hay credenciales `.env.local` cargadas.

## 38. Pasos para activar Supabase real

1. Crear proyecto Supabase.
2. Copiar variables a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

3. Ejecutar `supabase/schema.sql` en SQL Editor.
4. Ejecutar `supabase/seed.sql`.
5. Crear usuario admin desde Supabase Auth.
6. Copiar el `user.id`.
7. Insertar profile admin:

```sql
insert into public.profiles (user_id, name, role)
values ('USER_ID_DEL_AUTH_USER', 'Admin ROXWANA', 'admin');
```

8. Iniciar dev server:

```bash
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

9. Entrar a:

```text
http://127.0.0.1:3000/login
```

10. Acceder a `/command`.

## 39. Pendientes recomendados para Fase 3

Pendientes tecnicos:

- probar todo contra Supabase real;
- confirmar politicas RLS desde usuarios anon y admin;
- revisar subida real de imagenes al bucket;
- decidir si se agregan previews/reordenamiento mas fino de imagenes;
- mejorar manejo de errores de Server Actions en formularios admin;
- agregar confirmacion visual antes de borrar imagenes;
- agregar paginacion si crece el catalogo;
- agregar busqueda mas avanzada si se cargan muchos productos;
- agregar metadata SEO por producto;
- preparar deploy Netlify con variables reales;
- documentar procedure de backup/export de productos.

Pendientes comerciales:

- cargar numero real de WhatsApp desde `site_settings`;
- cargar redes reales;
- cargar imagenes definitivas de producto;
- revisar textos de producto;
- decidir si `unisex` debe aparecer siempre en hombre/mujer o tener filtro separado;
- definir flujo de consultas cuando WhatsApp esta desactivado.

No se implemento:

- pago online;
- stock complejo;
- carrito;
- checkout;
- registro publico de admins.
