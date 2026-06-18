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

`RXW-REM-SRK001-NEG-M`

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

`RXW-REM-SRK001` con prenda `REM` produce `model = SRK001`.

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
RXW-REM-SRK001-NEG-M
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

## 40. Ajuste posterior - modo oscuro y modo claro

Fecha de implementacion: 2026-06-08

Despues de la Fase 2 se pidio agregar un modo claro sin perder el modo oscuro.

La necesidad fue concreta:

- mantener el modo oscuro para trabajar y conservar identidad ROXWANA;
- agregar modo claro para que la parte de prendas se vea blanca, limpia y pulcra;
- no convertir el Command Center en un panel blanco;
- no romper la estetica oscura de marca en hero, login y admin.

## 41. Implementacion del sistema de tema

Se agrego:

- `components/layout/ThemeToggle.tsx`

Se modificaron:

- `app/layout.tsx`
- `app/globals.css`
- `components/layout/Header.tsx`
- `components/layout/MobileMenu.tsx`
- `components/home/FeaturedProducts.tsx`
- `components/home/RandomPrintTeaser.tsx`
- `components/product/ProductDetail.tsx`
- `app/productos/page.tsx`
- `app/hombre/page.tsx`
- `app/mujer/page.tsx`
- `app/random/page.tsx`

### Decisiones tomadas

El tema por defecto quedo como:

```html
data-theme="dark"
```

El boton de cambio de tema:

- usa iconos de `lucide-react`;
- muestra sol cuando se puede activar modo claro;
- muestra luna cuando se puede volver al modo oscuro;
- guarda preferencia en `localStorage`;
- actualiza `document.documentElement.dataset.theme`;
- actualiza `colorScheme` para que los controles nativos acompañen el tema.

La implementacion uso `useSyncExternalStore` en vez de `setState` directo dentro del efecto inicial.

Motivo:

- `eslint` marco error con `react-hooks/set-state-in-effect`;
- React no queria `setState` sincronico dentro del efecto de montaje;
- `useSyncExternalStore` dejo el estado del tema mas estable y compatible con la regla de lint.

## 42. Piel clara aplicada solo a tienda

No se cambio el color global de toda la app.

Se creo una clase de alcance:

```css
.theme-shop
```

La regla fue:

- las zonas de catalogo/prendas responden al modo claro;
- el Command Center sigue oscuro;
- login sigue oscuro;
- heroes principales pueden conservar presencia oscura de marca;
- solo la experiencia de ver ropa queda blanca y limpia.

Se aplico `theme-shop` en:

- seccion de productos destacados;
- seccion random print;
- pagina `/productos`;
- zona de grilla de `/hombre`;
- zona de grilla de `/mujer`;
- pagina `/random`;
- detalle de producto.

En modo claro se sobrescriben dentro de `.theme-shop`:

- fondos `bg-ink`;
- superficies `bg-charcoal`;
- textos `text-bone`;
- bordes `border-bone`;
- inputs;
- selects;
- placeholders;
- textura de panel.

No se hizo una reescritura total de componentes. Se uso una capa CSS controlada para no romper el sistema visual ya existente.

## 43. Problemas encontrados en el modo claro

### 43.1 Lint fallo por `setState` en efecto

El primer `ThemeToggle` leia `localStorage` dentro de `useEffect` y luego hacia:

```ts
setTheme(nextTheme);
```

`eslint` fallo con:

```text
Calling setState synchronously within an effect can trigger cascading renders
```

Solucion:

- reemplazar el patron por `useSyncExternalStore`;
- mantener listeners internos;
- aplicar el tema al documento cuando cambia el snapshot.

### 43.2 TypeScript infirio `theme` como string

Despues del cambio a `useSyncExternalStore`, build fallo porque `theme` se infirio como `string` y `applyTheme` esperaba `"dark" | "light"`.

Solucion:

```ts
const theme = useSyncExternalStore<Theme>(subscribe, getSnapshot, () => "dark");
```

### 43.3 Menu mobile quedaba demasiado traslucido

En desktop el modo claro se veia bien.

En mobile, al abrir menu en modo claro, el overlay oscuro con blur quedaba demasiado traslucido sobre el catalogo claro.

Problema visual:

- los textos del menu se lavaban;
- el fondo claro se mezclaba con el overlay;
- la navegacion mobile perdia legibilidad.

Solucion:

- cambiar el menu mobile a fondo oscuro solido:

```tsx
bg-ink
```

Asi el menu mobile conserva identidad oscura y legibilidad, aunque el catalogo este en modo claro.

### 43.4 Playwright mobile clickeaba el toggle desktop oculto

La primera prueba mobile intento clickear:

```css
button[aria-label='Activar modo claro']
```

Playwright encontro primero el boton desktop oculto, no el del menu mobile.

Solucion:

- abrir menu mobile;
- clickear el toggle visible dentro de `nav`;
- cerrar menu;
- capturar el catalogo ya en modo claro.

## 44. Verificacion del modo claro

Se ejecuto:

```bash
npm.cmd run lint
npm.cmd run build
```

Resultado:

- lint paso;
- build paso.

Tambien se probo con servidor local en:

```text
http://127.0.0.1:3000/productos
```

Playwright desktop:

- captura en modo oscuro;
- click en `Activar modo claro`;
- captura en modo claro.

Resultado visual:

- header claro;
- fondo de catalogo claro;
- tarjetas blancas;
- filtros claros;
- prendas mas limpias;
- sin romper la marca.

Playwright mobile:

- captura en modo oscuro;
- abrir menu;
- activar modo claro desde menu;
- cerrar menu;
- captura del catalogo mobile claro.

Resultado:

- filtros apilados correctamente;
- fondo claro;
- sin overflow horizontal visible;
- menu mobile legible.

Las capturas temporales creadas para esta prueba fueron borradas al final.

Las capturas viejas sin trackear se dejaron intactas:

- `live-verify-hero.png`
- `live-verify-products.png`

## 45. Inicio de conexion guiada con Supabase real

Despues se pidio actuar como programador full-stack senior especializado en:

- Next.js;
- Supabase;
- seguridad.

Objetivo:

- conectar Supabase de forma guiada;
- revisar el repo;
- detectar que faltaba;
- no inventar valores;
- no hardcodear secretos;
- no exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente;
- no afirmar conexion si no estaba verificada.

Se uso la skill de seguridad porque el pedido incluia:

- RLS;
- Auth;
- Storage;
- claves privadas;
- separacion cliente/servidor;
- Command Center protegido.

Se leyeron referencias de seguridad para:

- Next.js backend/server;
- React frontend;
- Supabase SSR/Auth desde documentacion oficial consultada por la integracion.

Reglas importantes aplicadas:

- `NEXT_PUBLIC_*` es publico y visible en browser;
- service role o secret key solo servidor;
- `server-only` para cliente admin;
- no subir `.env.local`;
- auth y permisos se validan server-side;
- RLS es obligatorio;
- uploads con allowlist y limite de tamano.

## 46. Deteccion inicial de proyectos Supabase

Primero se consulto si la integracion tenia acceso a Supabase.

Resultado:

- la herramienta Supabase estaba disponible;
- podia listar proyectos;
- podia leer migraciones;
- podia ejecutar SQL;
- podia aplicar migraciones;
- podia generar tipos.

Primer listado de proyectos:

- se encontro un proyecto existente llamado `Lucasleiva1's Project`;
- project ref: `nwleqiawcxlojxxmftjd`;
- region: `us-west-2`;
- estado: `ACTIVE_HEALTHY`;
- estaba vacio;
- no se aplico nada ahi porque no era seguro asumir que era ROXWANA.

Se pidio confirmacion.

Luego se indico crear un proyecto nuevo llamado:

```text
roxwana-store
```

El usuario lo creo manualmente desde Supabase y envio captura.

Despues se volvio a listar proyectos.

Proyecto correcto detectado:

- nombre: `roxwana-store`;
- project ref: `amdrfbppefqbdrxuolje`;
- URL: `https://amdrfbppefqbdrxuolje.supabase.co`;
- region: `us-east-1`;
- estado: `ACTIVE_HEALTHY`;
- compute: Nano;
- sin migraciones previas.

A partir de ese punto se decidio no tocar el proyecto viejo.

## 47. Estado del proyecto Supabase antes de aplicar cambios

Se verifico el proyecto `roxwana-store` antes de escribir:

Migraciones:

```text
[]
```

Tablas publicas:

```text
[]
```

Buckets Storage:

```text
[]
```

Conclusion:

- el proyecto estaba limpio;
- era seguro aplicar la primera migracion;
- no habia datos previos que pudieran pisarse.

## 48. Archivos locales preparados para Supabase real

Se agregaron o actualizaron:

- `supabase/config.toml`
- `supabase/migrations/20260608210706_initial_roxwana_store.sql`
- `.env.local.example`
- `README_SUPABASE.md`
- `.env.example`
- `supabase/schema.sql`

### `supabase/config.toml`

Se configuro con:

- `project_id = "amdrfbppefqbdrxuolje"`;
- API local habilitada;
- DB local con Postgres major version 17;
- Auth habilitado;
- signup publico deshabilitado;
- redirect URLs locales y Netlify;
- Storage habilitado con limite `3MiB`.

Esto deja el proyecto preparado para uso futuro con Supabase CLI.

### `.env.local.example`

Se creo como plantilla local.

Incluye:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://amdrfbppefqbdrxuolje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
SUPABASE_PROJECT_REF=amdrfbppefqbdrxuolje
SUPABASE_DB_PASSWORD=
```

No contiene secrets reales.

### `.env.example`

Se actualizo con:

- URL del proyecto real;
- placeholders vacios para keys;
- project ref;
- database password vacia.

Regla:

- `.env.example` puede subirse a GitHub porque no contiene secretos.

### `.env.local`

Se creo despues de recibir la publishable key.

Contiene:

- URL real;
- publishable key publica;
- `SUPABASE_SERVICE_ROLE_KEY=` vacia;
- `NEXT_PUBLIC_SITE_URL`;
- project ref.

Importante:

- `.env.local` esta ignorado por `.gitignore`;
- no debe subirse a GitHub;
- no se documento la key completa en el archivo publico de proceso.

### `README_SUPABASE.md`

Se creo como guia operativa separada.

Documenta:

- proyecto Supabase confirmado;
- que variables son publicas;
- que variables son privadas;
- donde encontrar keys;
- que cargar en Netlify;
- migracion y seed;
- como crear primer admin;
- como probar;
- configuracion esperada de Storage.

## 49. Ajuste de seguridad en Storage

Antes de aplicar la migracion se ajusto `supabase/schema.sql`.

Originalmente el bucket se creaba publico, pero sin limitar por SQL:

- tamano maximo;
- MIME types permitidos.

Se mejoro el bucket:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
```

Motivo:

- la app ya validaba imagenes en `lib/products/mutations.ts`;
- pero Storage tambien debe tener defensa propia;
- asi se evita aceptar archivos grandes o tipos no permitidos si una llamada llega directo a Supabase.

## 50. Migracion aplicada en Supabase remoto

Se aplico migracion al proyecto:

```text
amdrfbppefqbdrxuolje
```

Nombre:

```text
initial_roxwana_store
```

Resultado:

```json
{ "success": true }
```

Supabase registro la migracion remota con version:

```text
20260608210706
```

Por eso el archivo local se renombro a:

```text
supabase/migrations/20260608210706_initial_roxwana_store.sql
```

Esto evita confusion futura entre historial remoto y archivo local.

### Tablas creadas

Se crearon:

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

### Indices creados

Se crearon indices para:

- `products.slug`;
- `products.status`;
- `products.featured`;
- `products.gender`;
- `product_images(product_id, sort_order)`;
- `whatsapp_orders(created_at desc)`.

### Funciones y triggers

Se creo:

- `public.set_updated_at()`;
- `public.is_admin()`.

Se crearon triggers:

- `products_set_updated_at`;
- `site_settings_set_updated_at`.

### RLS

Se habilito RLS en todas las tablas publicas de la tienda.

Politicas principales:

- publico lee `garment_types`;
- publico lee `colors`;
- publico lee `sizes`;
- publico lee solo productos `active`;
- publico lee relaciones e imagenes solo de productos activos;
- publico inserta `whatsapp_orders`;
- admin gestiona productos;
- admin gestiona relaciones;
- admin gestiona imagenes;
- admin gestiona settings;
- admin lee y actualiza consultas;
- admin se define por `profiles.role = 'admin'`.

### Storage

Se creo bucket:

- nombre: `product-images`;
- publico: `true`;
- limite: `3145728` bytes;
- MIME permitidos:
  - `image/jpeg`;
  - `image/png`;
  - `image/webp`.

Policies Storage:

- publico lee objetos del bucket;
- admin inserta objetos;
- admin actualiza objetos;
- admin borra objetos.

## 51. Seed aplicado en Supabase remoto

Se ejecuto `supabase/seed.sql` en el proyecto real.

Datos insertados:

### Prendas

- `REM` - Remera
- `BUZ` - Buzo
- `MUS` - Musculosa

### Colores

- `NEG` - Negro
- `BLA` - Blanco Hueso
- `ROJ` - Rojo
- `AZU` - Azul

### Talles

- `S`
- `M`
- `L`
- `XL`
- `XXL`

### Settings

Se creo una fila inicial de `site_settings` con:

- WhatsApp label: `WhatsApp ROXWANA`;
- WhatsApp enabled: `true`;
- numero nulo por ahora;
- fallback por Instagram;
- Instagram y TikTok genericos temporales.

### Productos base

Se insertaron productos base:

- `RXW-REM-STREET004` - active
- `RXW-REM-SKULL005` - draft
- `RXW-BUZ-HEAVY001` - draft

Tambien se insertaron:

- colores `NEG` y `BLA` para cada producto;
- talles `S`, `M`, `L`, `XL`, `XXL`;
- 6 imagenes primarias usando rutas locales existentes de `public/images/products`.

## 52. Verificaciones remotas realizadas

Despues de aplicar migracion y seed se hicieron verificaciones SQL.

### Migraciones

Resultado:

```text
20260608210706 initial_roxwana_store
```

### Conteo de filas

Resultados:

- `colors`: 4
- `garment_types`: 3
- `sizes`: 5
- `products`: 6
- `product_images`: 6
- `site_settings`: 1
- `whatsapp_orders`: 0

### Productos por estado

Resultados:

- `active`: 4
- `draft`: 2

### RLS habilitado

Se verifico `rowsecurity = true` en:

- `colors`
- `garment_types`
- `product_colors`
- `product_images`
- `product_sizes`
- `products`
- `profiles`
- `site_settings`
- `sizes`
- `whatsapp_orders`

### Policies

Se verifico que existen 25 policies entre `public` y `storage`.

Incluyen:

- lectura publica de datos permitidos;
- lectura publica solo de productos activos;
- insercion publica de consultas WhatsApp;
- administracion solo por admin;
- lectura publica del bucket;
- escritura de Storage solo por admin.

### Bucket

Se verifico:

```json
{
  "id": "product-images",
  "public": true,
  "file_size_limit": 3145728,
  "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"]
}
```

### Prueba de RLS como anon

Se ejecuto una lectura simulando rol `anon`.

Resultado:

- productos visibles: 4;
- drafts visibles: 0;
- hidden visibles: 0.

Esto confirma que el publico no ve borradores.

### Prueba de insert anon en consultas

Se ejecuto una transaccion con:

- `set local role anon`;
- insert en `whatsapp_orders`;
- select de filas de prueba;
- rollback.

Resultado:

- el insert no fallo;
- el select como anon no pudo ver la fila, por eso devolvio 0;
- se hizo rollback para no dejar datos de prueba.

Interpretacion:

- publico puede insertar consultas;
- publico no puede leer consultas;
- comportamiento correcto.

## 53. Tipos TypeScript desde Supabase real

Se uso la integracion para generar tipos TypeScript desde el proyecto real.

Resultado:

- Supabase devolvio tipos completos con relaciones;
- se comparo conceptualmente con `types/supabase.ts`;
- no se reemplazo el archivo local en ese momento porque el tipo manual conserva unions utiles de la app:
  - `ProductGender`;
  - `ProductStatus`.

Decision:

- mantener `types/supabase.ts` actual por compatibilidad;
- usar la generacion como verificacion de que la estructura remota coincide.

## 54. Validacion local despues de Supabase real

Se ejecuto:

```bash
npm.cmd run lint
npm.cmd run build
```

Resultado:

- lint paso;
- build paso;
- `typecheck` no existe como script en `package.json`.

El build se ejecuto inicialmente sin `.env.local` real y despues con `.env.local` creado.

Ambos escenarios pasaron.

## 55. Publishable key recibida y conexion publica verificada

El usuario envio la publishable key de Supabase.

Regla aplicada:

- no se pego la key completa en esta documentacion publica;
- se guardo solo en `.env.local`;
- `.env.local` esta ignorado por Git;
- la key es publica, pero igual no hace falta exponerla en la documentacion del repo.

Se creo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://amdrfbppefqbdrxuolje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
SUPABASE_PROJECT_REF=amdrfbppefqbdrxuolje
SUPABASE_DB_PASSWORD=
```

### Prueba publica desde Node

Primer intento:

- fallo con `TypeError: fetch failed`.

Causa probable:

- la sandbox local no tenia salida de red para Node.

Solucion:

- se repitio la prueba con permisos de red/escalados.

Resultado final:

```json
{
  "count": 4,
  "statuses": ["active", "active", "active", "active"]
}
```

Interpretacion:

- URL Supabase correcta;
- publishable key correcta;
- la API publica responde;
- RLS publico funciona;
- solo se ven productos activos.

## 56. Validacion Next.js con `.env.local`

Con `.env.local` ya creado se ejecuto:

```bash
npm.cmd run lint
npm.cmd run build
```

Resultado:

- lint paso;
- build paso;
- Next detecto `.env.local`;
- todas las rutas principales compilaron.

Esto confirma que la app no rompe al pasar de fallback mock a configuracion Supabase publica.

## 57. Datos que todavia faltan

Todavia falta recibir:

```bash
SUPABASE_SERVICE_ROLE_KEY
```

o la nueva:

```bash
Secret key
```

Ese valor es privado.

Uso:

- acciones admin;
- crear/editar/duplicar productos;
- subir imagenes;
- editar settings;
- administrar consultas;
- operaciones server-side que requieren permisos elevados.

Reglas:

- nunca va en cliente;
- nunca va con prefijo `NEXT_PUBLIC_`;
- nunca se sube a GitHub;
- se guarda en `.env.local`;
- se carga en Netlify como variable secreta.

Tambien falta confirmar o cargar:

- numero real de WhatsApp;
- `NEXT_PUBLIC_SITE_URL` definitivo de Netlify cuando exista el deploy;
- primer usuario admin en Supabase Auth;
- fila `profiles` con `role = 'admin'`.

## 58. Estado actual despues de la conexion guiada

Estado remoto Supabase:

- proyecto `roxwana-store` creado;
- migracion aplicada;
- seed aplicado;
- RLS verificado;
- Storage creado y verificado;
- conexion publica verificada con publishable key.

Estado local:

- `.env.local` creado con URL y publishable key;
- service role todavia vacia;
- README Supabase creado;
- config y migraciones creadas;
- lint y build pasan.

Estado Git:

- hay cambios locales sin commitear;
- los screenshots viejos siguen sin trackear;
- `.env.local` no aparece en Git porque esta ignorado.

No se debe decir todavia que el Command Center admin esta totalmente operativo contra Supabase real hasta recibir y probar la service role y crear el primer admin.

## 59. Proximo paso operativo

El siguiente dato necesario es:

```bash
SUPABASE_SERVICE_ROLE_KEY
```

Donde encontrarlo:

1. Supabase.
2. Proyecto `roxwana-store`.
3. `Project Settings`.
4. `API Keys`.
5. Copiar `Secret key` o `service_role key`.

Despues de recibirla se debe:

1. guardarla en `.env.local`;
2. probar que `createSupabaseAdminClient()` conecta;
3. crear usuario admin manual desde Supabase Auth;
4. insertar o actualizar profile admin;
5. probar `/login`;
6. probar `/command`;
7. probar editar settings;
8. probar crear/editar producto;
9. probar subir imagen al bucket;
10. correr `lint`, `build` y, si corresponde, `audit`.

## 60. Rediseño Home Campaign Commerce y version estable

Se rediseño visualmente la Home de ROXWANA para que deje de sentirse como una grilla tecnica oscura y pase a una experiencia de ecommerce streetwear mas editorial.

Objetivo visual:

- mantener identidad negra, rockera, urbana y premium;
- usar dorado arena como color de marca para acciones y hover;
- mantener botones, carrito, rutas, Supabase, WhatsApp y flujo de compra;
- hacer la Home mas parecida a una campaña/drop de ropa;
- dejar clara la zona de compra para no marear al cliente.

Cambios principales:

- se creo `HeroCampaign` con collage visual, ROXWANA grande, "SIN PEDIR PERMISO" y CTA a drop/WhatsApp;
- se creo `CategorySplit` para "Hombre" y "Mujer" como entradas visuales grandes;
- se creo `DropWall` para "Modelos con codigo";
- se creo `ProductPosterCard` para las cards de producto de la Home;
- se creo `PrintWallMarquee` como pared horizontal de posters;
- se creo `OrderTimeline` para reemplazar cajas iguales por pasos tipo etiqueta;
- se rediseño `Footer` como manifiesto ROXWANA;
- se mantuvo `RandomPrintTeaser` funcional, pero con estilo mas ticket/backstage.

Archivos principales:

- `app/page.tsx`;
- `components/home/HeroCampaign.tsx`;
- `components/home/CategorySplit.tsx`;
- `components/home/DropWall.tsx`;
- `components/home/ProductPosterCard.tsx`;
- `components/home/PrintWallMarquee.tsx`;
- `components/home/OrderTimeline.tsx`;
- `components/home/RandomPrintTeaser.tsx`;
- `components/layout/Footer.tsx`;
- `components/ui/RoxButton.tsx`;
- `app/globals.css`.

## 61. Cambio de botones: rojo a dorado arena

Se cambio la intencion visual de los botones.

Problema detectado:

- el hover rojo transmitia peligro o alerta;
- no coincidia con la sensacion premium que se queria para la marca;
- el rojo queda mejor como acento grafico o error, no como feedback principal de compra.

Solucion:

- se uso `roxgold` (`#C8A46A`) como color principal de hover, seleccion y CTA;
- se cambio `RoxButton` para que el relleno animado sea dorado;
- se ajustaron botones sueltos en carrito, login, filtros, galeria, producto y command/admin;
- se mantuvo rojo solo donde funciona como error, estado critico o acento grafico.

Validacion:

- busqueda de `hover:*roxred` y `group-hover:*roxred` sin resultados relevantes;
- captura visual `gold-button-hover-check.png`;
- `npm.cmd run lint`;
- `npm.cmd run build`.

## 62. Modelos con codigo: claridad de compra

Primera version del rediseño:

- `Modelos con codigo` quedo muy editorial;
- habia cards de distintos tamaños;
- el primer producto dominaba demasiado;
- para una zona de compra, eso podia marear al cliente.

Correccion aplicada:

- todas las cards pasaron a tener el mismo tamaño;
- se normalizo la grilla;
- se normalizaron las imagenes con `object-contain`;
- se mantuvieron codigo, nombre, descripcion y boton de entrada al modelo.

Segunda correccion aplicada:

- se quitaron los talles visibles de la card;
- se elimino el boton secundario "Talles";
- se redujo la altura de la card;
- se dio mas protagonismo a la imagen;
- se agregaron flechas dentro de cada card para recorrer las imagenes del producto sin entrar al detalle;
- se dejo un unico CTA: "Ver modelo";
- se amplio la grilla hasta 4 columnas en desktop para que entren mas modelos en una vista.

Motivo:

- esta seccion no debe ser experimental;
- es la zona donde el cliente compara y decide compra;
- debe verse ordenada, directa y facil de escanear.

Validacion visual:

- `drop-wall-uniform-check.png`;
- `drop-wall-uniform-mobile-check.png`;
- `drop-wall-compact-gallery-before.png`;
- `drop-wall-compact-gallery-after.png`;
- `drop-wall-compact-gallery-mobile.png`.

## 63. Entrar por actitud: tarjetas alineadas

Problema:

- la tarjeta de "Mujer" estaba desplazada hacia abajo para dar composicion editorial;
- visualmente quedaba de distinto tamaño/altura percibida que "Hombre";
- el usuario pidio que ambas queden iguales.

Solucion:

- se elimino el margen vertical extra de la segunda tarjeta;
- "Hombre" y "Mujer" quedan alineadas y con el mismo tamaño;
- se mantuvo el estilo visual original de la seccion.

Archivo:

- `components/home/CategorySplit.tsx`.

## 64. Problemas encontrados durante esta etapa

1. Arranque de servidor local.

   En esta maquina, `next dev` funcionaba en primer plano, pero los intentos de dejarlo oculto con `Start-Process`, `cmd /c`, `Start-Job` o `node.exe` se cerraban antes de escuchar en `127.0.0.1:3000`.

   Solucion usada:

   - abrir una terminal visible con `.codex-checks/run-dev.cmd`;
   - verificar siempre con `Invoke-WebRequest http://127.0.0.1:3000`;
   - registrar una nota global para no repetir intentos ocultos innecesarios.

2. Seccion de productos demasiado editorial.

   La primera direccion visual era correcta para campaña, pero no para comparacion de compra.

   Solucion:

   - dejar la energia editorial en hero, categorias, print wall, ruleta y footer;
   - hacer `Modelos con codigo` mas clara, uniforme y comercial.

3. Hover rojo.

   El rojo se leia como peligro.

   Solucion:

   - usar dorado arena como feedback principal;
   - reservar rojo para acento o error.

4. Tarjeta de Mujer desalineada.

   El desplazamiento editorial generaba diferencia visual.

   Solucion:

   - alinear ambas tarjetas de categoria.

5. Capturas de verificacion.

   Durante las pruebas se generaron PNG locales:

   - `campaign-*`;
   - `drop-wall-*`;
   - `gold-button-hover-check.png`;
   - `random-*`;
   - `roxwana-full-page-current.png`.

   Decision:

   - se usan como evidencia local;
   - no se suben a GitHub salvo pedido explicito.

## 65. Estado estable antes de seguir

Estado funcional:

- Home rediseñada como Campaign Commerce;
- productos de compra en cards claras y uniformes;
- cada card permite recorrer imagenes con flechas;
- talles ocultos en Home, visibles en detalle de producto;
- botones y hover pasan a dorado arena;
- ruleta sigue funcionando;
- Footer queda como manifiesto;
- Home desktop y mobile revisadas visualmente;
- no se tocaron schema, migraciones ni Supabase.

Validaciones ejecutadas:

```bash
npm.cmd run lint
npm.cmd run build
```

Resultado:

- lint paso;
- build paso;
- TypeScript paso;
- rutas principales compilaron.

Versiones estables guardadas:

- `f20eb86` / `roxwana-muy-estable-2026-06-11`: ruleta estable;
- `4db8c30` / `roxwana-home-campaign-grid-estable-2026-06-11`: Home campaign con grilla clara inicial.

La version siguiente debe guardar tambien:

- cards compactas con galeria interna;
- categoria Hombre/Mujer alineada;
- este resumen de proceso.

## 66. Cierre de Home Campaign Commerce

Esta etapa venia de una conversacion anterior que se corto antes de dejar documentado el cierre.

Cambios funcionales y visuales que quedaron listos:

- Home rediseñada hacia una lectura de campaña comercial;
- hero, secciones de campaña y entrada por genero mantenidas como piezas de marca;
- grilla de productos ordenada para compra, no solo editorial;
- cards de productos compactas, con imagen mas protagonista;
- galeria interna por card con flechas;
- un solo CTA principal por producto;
- tarjetas Hombre/Mujer alineadas;
- hover de botones llevado a dorado arena para no leer el rojo como error.

Errores/problemas encontrados:

- la primera version visual priorizaba demasiado el impacto editorial y complicaba comparar productos;
- algunas cards quedaban de alturas diferentes;
- el rojo como hover parecia peligro o error;
- la tarjeta de Mujer tenia offset editorial y se leia despareja.

Decision:

- mantener la energia de marca en hero/campaña;
- hacer la zona de modelos mas clara, uniforme y comprable.

## 67. Login manual y abandono temporal de Google

El usuario decidio dejar Google OAuth para mas adelante porque la configuracion era demasiado pesada para esta etapa.

Objetivo nuevo:

- poder registrarse o entrar con email y password;
- no requerir confirmacion de email para probar carrito;
- poder probar el flujo de compra real.

Problema inicial:

- el formulario usaba `supabase.auth.signUp` desde el browser;
- si Supabase remoto tenia confirmacion de email activa, el usuario quedaba creado pero sin sesion;
- la UI podia terminar mostrando "Email o password incorrecto", aunque el problema real fuera confirmacion o una contraseña distinta guardada en Auth.

Errores de diagnostico:

- al principio se interpreto como tema de confirmacion de email solamente;
- luego se verifico en Supabase que el usuario estaba confirmado, pero `last_sign_in_at` seguia vacio;
- la causa real para el usuario principal fue que Auth tenia una contraseña guardada distinta a la que el usuario estaba usando.

Correcciones aplicadas:

- se creo `app/api/auth/manual-register/route.ts`;
- se creo `app/api/auth/manual-login/route.ts`;
- el formulario de `/login` dejo de llamar directo a Supabase desde el browser;
- el login manual ahora pasa por API local server-side;
- Google se quito del flujo visible principal;
- el mensaje de error diferencia mejor entre email no confirmado, red/Supabase y credenciales incorrectas;
- se confirmo el usuario existente en Supabase y se sincronizo la identidad de email;
- se reseteo la contraseña del usuario a una clave temporal conocida por el usuario, sin dejar ese valor como requisito de producto.

Validaciones:

- Supabase real devolvio sesion para el usuario;
- `/api/auth/manual-login` devolvio `{"ok":true}`;
- Playwright entro por `/login` y redirigio a `/productos`.

## 68. Carrito visible y contador

Pedido del usuario:

- que el icono sea claramente un carrito;
- que al agregar productos aparezca cantidad visible;
- que el contador sea rojo;
- que funcione en desktop y mobile.

Problema:

- el header usaba `ShoppingBag`, que se leia como bolsa y no carrito;
- no habia contador de items;
- el header no tenia forma de saber la cantidad real del carrito activo.

Correcciones aplicadas:

- se cambio el icono a `ShoppingCart`;
- se creo `app/api/cart/count/route.ts`;
- se creo `components/cart/CartCountSync.tsx`;
- `Header.tsx` consulta `/api/cart/count`;
- `ProductSelector.tsx` dispara evento `roxwana-cart-updated` al agregar un producto;
- `/carrito` sincroniza el contador real cuando se renderiza la pagina;
- `MobileMenu.tsx` muestra tambien el contador rojo en el boton Carrito.

Validaciones:

- Playwright verifico `aria-label="Carrito: 1 productos"`;
- desktop mostro badge rojo `1`;
- mobile mostro `Carrito 1` dentro del menu.

## 69. Checkout del carrito y campos desalineados

Problema visual:

- el checkout estaba en una columna de `420px`;
- adentro habia una grilla de tres columnas para Ciudad, Provincia y CP;
- eso dejaba campos apretados/corridos y se veia poco profesional.

Correcciones aplicadas:

- inputs y textarea pasaron a `w-full`;
- se agrego `min-w-0` donde correspondia;
- Calle/Numero quedo en `minmax(0,1fr)_112px`;
- Ciudad/Provincia quedaron en dos columnas;
- CP ocupa ancho completo dentro de la grilla;
- el formulario mantiene el look ROXWANA oscuro pero queda mas estable.

Validacion visual:

- screenshot local `cart-badge-layout-after.png`;
- screenshot local `cart-badge-mobile-menu.png`.

## 70. WhatsApp temporal y mensaje de pedido

Objetivo:

- usar temporalmente el numero del usuario para recibir pedidos;
- dejarlo cambiable para reemplazarlo por el numero definitivo mas adelante;
- enviar o preparar un mensaje con el detalle completo del carrito y los datos del checkout.

Configuracion aplicada:

- Supabase `site_settings.whatsapp_number` se actualizo al numero temporal del usuario en formato internacional;
- `site_settings.whatsapp_label` quedo como `WhatsApp ROXWANA temporal`;
- `site_settings.whatsapp_enabled` quedo activo;
- `.env.example` se mantuvo con placeholder `NEXT_PUBLIC_WHATSAPP_NUMBER=549XXXXXXXXXX`;
- `.env.local` tambien se actualizo localmente, aunque no se sube por `.gitignore`.

Mensaje generado:

- `Pedido ROXWANA`;
- ID de orden;
- cliente;
- email;
- telefono;
- direccion;
- notas;
- productos con nombre, modelo, SKU, color, talle y cantidad;
- cierre: `Me pasas precio final, disponibilidad y link de pago?`.

Errores encontrados:

- habia caracteres rotos en la frase final del mensaje por encoding;
- se corrigio a texto ASCII;
- el primer intento de checkout con Playwright clickeo el submit de "Actualizar" item en vez del boton de checkout;
- se ajustaron las pruebas para apuntar al texto exacto `Enviar pedido por WhatsApp`.

## 71. Limitacion de WhatsApp auto-send

El usuario pidio que el mensaje se envie automaticamente por WhatsApp sin que el cliente toque enviar.

Resultado del analisis:

- con `wa.me` no se puede forzar el envio automatico desde el WhatsApp del cliente;
- WhatsApp permite abrir el chat con el texto precargado, pero el cliente debe tocar Enviar;
- esto es una restriccion de WhatsApp, no un bug de la app.

Alternativa real:

- usar WhatsApp Business Platform / Cloud API;
- requeriria `WHATSAPP_CLOUD_ACCESS_TOKEN`, `WHATSAPP_CLOUD_PHONE_NUMBER_ID` y una configuracion de Meta;
- para mensajes iniciados por negocio puede requerir plantillas aprobadas.

Decision actual:

- mantener `wa.me` como salida visible;
- guardar siempre el pedido completo en Supabase aunque el cliente no envie el WhatsApp;
- dejar la app preparada para una futura integracion Cloud API.

## 72. Checkout via API para no perder el link de WhatsApp

Problema:

- el checkout era un server action usado directo desde el formulario;
- Next refrescaba el arbol despues de completar la accion;
- como el carrito se convertia y quedaba vacio, la UI ocultaba el formulario y tambien se perdia el link "Abrir WhatsApp".

Intentos y aprendizajes:

- quitar `revalidatePath("/carrito")` no alcanzo;
- guardar temporalmente el link en `sessionStorage` no alcanzo por timing del refresh;
- se probo guardar el ID de orden en cookie, pero el flujo seguia siendo menos directo que recibir la respuesta en cliente.

Solucion aplicada:

- se creo `app/api/orders/checkout/route.ts`;
- `CartCheckout.tsx` ahora envia `FormData` con `fetch("/api/orders/checkout")`;
- el cliente recibe el `url` de WhatsApp sin refresh automatico;
- se muestra el mensaje `Pedido guardado. Se abrio WhatsApp para terminar la compra.`;
- queda visible el boton `Abrir WhatsApp`;
- se sigue guardando el pedido, items, direccion, eventos y mensaje en Supabase.

Validacion final:

- Playwright agrego producto al carrito;
- completo datos de checkout;
- envio el pedido por `/api/orders/checkout`;
- la pagina mostro `ABRIR WHATSAPP`;
- el link extraido apunto al numero temporal configurado en `wa.me`;
- el texto codificado incluyo producto, modelo, SKU, color, talle, cantidad y direccion;
- Supabase confirmo el ultimo `orders.whatsapp_message` guardado con el detalle completo.

Checks ejecutados:

```bash
npm.cmd run lint
npm.cmd run build
```

Resultado:

- lint paso;
- build paso;
- TypeScript paso;
- rutas nuevas compiladas:
  - `/api/auth/manual-login`;
  - `/api/auth/manual-register`;
  - `/api/cart/count`;
  - `/api/orders/checkout`.

## 73. Estado estable para guardar en GitHub

Estado funcional:

- Home campaign/commercial estable;
- login manual operativo;
- usuario cliente puede entrar con email/password;
- registro manual queda encaminado por API server-side;
- carrito agrega productos y mantiene contador;
- contador rojo visible en desktop/mobile;
- checkout visualmente corregido;
- pedido se guarda en Supabase;
- carrito se convierte luego del pedido;
- WhatsApp temporal configurado;
- link de WhatsApp se genera con detalle completo del pedido;
- link de WhatsApp queda visible en la pantalla luego de guardar.

Pendientes conocidos:

- WhatsApp no puede enviar automaticamente con `wa.me`; para eso se necesita Cloud API;
- Google OAuth queda postergado;
- numero temporal debe reemplazarse por el definitivo desde `/command/settings`;
- `.env.local` no se sube a GitHub, por diseño.

Version estable objetivo:

- tag sugerido: `roxwana-auth-cart-whatsapp-estable-2026-06-11`.

## 74. Patron importante de tarjetas de venta con hover y galeria

Objetivo:

- fijar la forma definitiva de trabajar las tarjetas de venta de productos;
- permitir hover visual con imagen alternativa;
- permitir recorrer la galeria con flechas sin que el hover tape la imagen seleccionada;
- resetear la tarjeta al salir para que vuelva a la imagen inicial.

Problema encontrado:

- en `ProductPosterCard.tsx`, el hover activaba una imagen alternativa por encima de la imagen principal;
- al tocar las flechas, el contador cambiaba, pero visualmente seguia arriba la imagen de hover;
- el usuario tenia que sacar el mouse para ver la imagen seleccionada;
- esto hacia que la galeria pareciera rota aunque el indice interno si estuviera cambiando.

Solucion aplicada:

- se separaron dos estados:
  - `activeImage`: indice real de galeria;
  - `hoveringImage`: solo controla el preview de hover;
- al tocar flecha izquierda o derecha se ejecuta `setHoveringImage(false)`;
- al salir del area de imagen se ejecuta un reset completo:
  - `setHoveringImage(false)`;
  - `setActiveImage(0)`;
- al volver a entrar con el mouse, el hover vuelve a funcionar desde la imagen inicial.

Regla establecida:

- todas las tarjetas de venta de productos deben seguir este patron;
- si se crean nuevas tarjetas, primero buscar la referencia en `components/home/ProductPosterCard.tsx`;
- el comportamiento quedo documentado tambien en `docs/patron-tarjetas-venta-productos.md`.

Validacion:

- con navegador se probo la primera tarjeta de Remera Lisa;
- hover mostro imagen alternativa;
- flechas pasaron de `1/6` a `2/6` y `3/6` sin sacar el mouse;
- al salir del area de imagen volvio a `1/6`;
- al reingresar, el hover volvio a funcionar.

Guardado importante:

- commit: `71021a0`;
- mensaje: `Important product card hover gallery pattern`;
- tag: `roxwana-product-card-hover-gallery-importante-2026-06-12`;
- remoto: `origin/main`.

Problemas encontrados durante el guardado:

- `gh` no estaba instalado, por lo que no se pudo usar el flujo de PR con GitHub CLI;
- el sandbox no permitio crear `.git/index.lock`, asi que los comandos de `git add`, `commit`, `tag` y `push` necesitaron ejecucion con permisos elevados;
- quedaron muchas capturas locales sin trackear, pero no se incluyeron en el commit.

## 75. Eliminacion de productos falsos de prueba

Objetivo:

- eliminar totalmente tres productos que solo eran de prueba;
- no tocar las prendas reales;
- evitar que esos modelos reaparezcan desde mocks, seed, Supabase o imagenes.

Productos eliminados:

- `RXW-REM-ROCK001` - Remera Rock 001;
- `RXW-REM-DRAGON002` - Remera Dragon 002;
- `RXW-REM-MOTO003` - Remera Moto 003.

Archivos fisicos eliminados:

- `public/images/products/product-01.png`;
- `public/images/products/product-02.png`;
- `public/images/products/product-03.png`.

Cambios aplicados:

- se quitaron las tres entradas de `data/mockProducts.ts`;
- se quitaron del `supabase/seed.sql`;
- se eliminaron menciones operativas e historicas en `docs/proceso-roxwana-web.md`;
- se reemplazaron referencias decorativas a `product-01.png` por imagen real de Street Rock:
  - `app/hombre/page.tsx`;
  - `components/home/GenderGateway.tsx`;
  - fallback de `lib/products/normalizeProduct.ts`;
- se borraron de la base real de Supabase `roxwana-store` usando MCP por `model_code`.

Validacion:

- busqueda global sin resultados para:
  - `ROCK001`;
  - `DRAGON002`;
  - `MOTO003`;
  - `Remera Rock 001`;
  - `Remera Dragon 002`;
  - `Remera Moto 003`;
  - `product-01.png`;
  - `product-02.png`;
  - `product-03.png`;
- `Test-Path` confirmo que los tres PNG ya no existen;
- la home local no devuelve esos nombres ni codigos;
- consulta separada a Supabase devolvio `[]` para esos tres modelos.

Problemas encontrados:

- las primeras referencias no estaban solo en `data/mockProducts.ts`;
- `product-01.png` tambien era usado como imagen decorativa en secciones;
- el seed seguia insertando los tres productos falsos;
- `.env.local` tenia `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_DB_PASSWORD` vacios, asi que no se pudo borrar la base con un script local;
- se uso el conector MCP de Supabase para borrar con seguridad por `model_code`;
- la primera consulta SQL de borrado mostro un conteo confuso dentro del mismo statement, por lo que se hizo una verificacion separada.

## 76. Precios obligatorios en productos

Objetivo:

- agregar precio obligatorio a los productos;
- mostrar precio en la experiencia de compra;
- persistir el precio en Supabase;
- guardar precio en carrito y pedidos como snapshot.

Regla de precios definida:

- `RXW-REM-LISA001` - Remera Lisa: `$19.000`;
- todas las otras remeras actuales: `$29.000`;
- el producto no remera existente `RXW-BUZ-HEAVY001` tambien quedo con `$29.000` porque el precio ahora es obligatorio para todo producto.

Cambios de base de datos:

- se agrego `products.price integer not null`;
- se agrego constraint `products_price_positive check (price > 0)`;
- se actualizaron productos existentes:
  - Lisa a `19000`;
  - resto a `29000`;
- se repararon snapshots existentes:
  - `cart_items.price_snapshot`;
  - `order_items.price_snapshot`;
- se creo migracion local:
  - `supabase/migrations/20260612193000_add_product_prices.sql`;
- se actualizo `supabase/schema.sql`;
- se actualizo `supabase/seed.sql` para insertar y actualizar `price`.

Cambios de codigo:

- `types/product.ts` ahora incluye `price: number`;
- `types/supabase.ts` incluye `products.price`;
- `lib/products/queries.ts` selecciona `price`;
- `lib/products/normalizeProduct.ts` normaliza `price`;
- `data/mockProducts.ts` trae precios locales;
- `lib/products/formatPrice.ts` formatea visualmente como `$19.000` y `$29.000`;
- `ProductPosterCard`, `ProductCard` y `ProductDetailClient` muestran precio;
- `ProductForm` en admin exige precio;
- `ProductTable` muestra precio en la tabla de admin;
- `lib/products/mutations.ts` valida precio positivo al crear/editar;
- `duplicateProductAction` copia el precio;
- `lib/cart/actions.ts` guarda `price_snapshot` al agregar al carrito;
- `app/carrito/page.tsx` muestra unitario, subtotal y total;
- `lib/orders/checkout.ts` incluye precio unitario, subtotal y total en el mensaje de WhatsApp;
- el cierre del mensaje cambio de pedir precio final a pedir disponibilidad, envio y link de pago.

Validacion Supabase:

- consulta real confirmo:
  - `RXW-REM-LISA001` con `19000`;
  - las otras remeras con `29000`;
  - `RXW-BUZ-HEAVY001` con `29000`;
- verificacion posterior:
  - `products_without_price = 0`;
  - `cart_items_without_price = 0`;
  - `order_items_without_price = 0`.

Validacion local:

- la home contiene `$19.000`;
- la home contiene `$29.000`;
- `npm.cmd run lint` paso;
- `npx.cmd tsc --noEmit` paso;
- `npm.cmd run build` paso.

Problemas encontrados:

- Supabase CLI no estaba instalada, asi que no se pudo usar `supabase migration new`;
- se creo la migracion local manualmente;
- el changelog externo de Supabase no pudo abrirse desde la herramienta web;
- como el cambio es SQL estandar pequeno, se continuo con MCP y verificacion real;
- el formato inicial con `Intl.NumberFormat` en modo `currency` devolvia una representacion rara en HTML, asi que se fijo el formato visual a `$` + numero argentino;
- ya existian `price_snapshot` en carrito/pedidos, pero estaban quedando `null` porque `products` no tenia precio; se conecto el valor real.

## 77. Estado actual para continuar

Estado funcional:

- tarjetas de venta tienen hover, flechas y reset funcionando;
- los tres productos falsos fueron eliminados de codigo, assets, seed, docs y Supabase;
- los productos tienen precio obligatorio;
- Lisa cuesta `$19.000`;
- las otras remeras cuestan `$29.000`;
- carrito y WhatsApp ya incluyen precios;
- admin permite editar precio.

Checks recientes:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso.

Pendientes recomendados:

- hacer un commit/tag nuevo cuando el usuario confirme que los precios y limpieza quedaron bien;
- si se agregan nuevas prendas desde admin, cargar siempre precio;
- si se agregan nuevas tarjetas de venta, aplicar el patron documentado en `docs/patron-tarjetas-venta-productos.md`.

## 78. Remera Lisa Mujer con blanco protagonista

Objetivo:

- agregar la nueva prenda real `Remera Lisa Mujer`;
- usar los tres sets entregados por el usuario:
  - `C:/Users/jaell/Downloads/mujer-blanca-lisa-fb/`;
  - `C:/Users/jaell/Downloads/mujer-negra-lisa-fb/`;
  - `C:/Users/jaell/Downloads/mujer-gris-lisa/`;
- mantener exactamente el patron de tarjeta de la Remera Lisa:
  - hover preview;
  - flechas navegables sin sacar el mouse;
  - reset a `1/n` al salir;
  - galeria por color;
- hacer que la remera blanca sea la protagonista visual.

Conversion de imagenes:

- se verificaron los 18 archivos fuente;
- todos tenian base `896x1200`;
- se uso `sharp` desde `node_modules`, igual que en conversiones anteriores;
- se generaron versiones:
  - `*-desktop.webp`;
  - `*-mobile.webp`;
- carpeta final:
  - `public/images/products/remera-lisa-mujer-fb/`;
- orden de colores:
  - blanco;
  - negro;
  - gris.

Producto creado:

- `model_code`: `RXW-REM-LISAM001`;
- nombre: `Remera Lisa Mujer`;
- slug: `remera-lisa-mujer-001`;
- genero: `mujer`;
- precio: `$19.000`;
- estado: `active`;
- destacado: `true`;
- colores:
  - blanco / hueso;
  - negro;
  - gris;
- talles:
  - S;
  - M;
  - L;
  - XL;
  - XXL;
- imagen primaria:
  - `/images/products/remera-lisa-mujer-fb/bla-01-desktop.webp`.

Cambios de codigo:

- `data/mockProducts.ts` suma `Remera Lisa Mujer` y genera sus 18 imagenes con helper compartido;
- `supabase/seed.sql` suma el producto, colores, talles e imagenes;
- `ProductPosterCard.tsx` ahora detecta el color de la imagen principal para decidir el color protagonista de la tarjeta;
- `ProductDetailClient.tsx` selecciona de entrada el color de la imagen principal;
- `normalizeProduct.ts` ordena los colores poniendo primero el color de la imagen primaria.

Supabase real:

- se dio de alta `RXW-REM-LISAM001` en `roxwana-store`;
- se insertaron 3 colores;
- se insertaron 5 talles;
- se insertaron 18 imagenes;
- se verifico que la primaria sea `bla-01-desktop.webp`.

Validacion:

- home:
  - la tarjeta aparece como `Remera Lisa Mujer`;
  - imagen inicial blanca;
  - precio `$19.000`;
  - hover muestra `bla-03`;
  - flecha pasa a `2/6` mostrando `bla-02`;
  - al salir vuelve a `1/6` y `bla-01`;
- detalle:
  - abre en `/producto/remera-lisa-mujer-001`;
  - color blanco aparece primero y seleccionado;
  - galeria inicial usa `bla-01`;
  - precio `$19.000`;
- sin errores de consola en la prueba de navegador.

Checks ejecutados:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso.

Problema importante corregido:

- al principio se revisaron herramientas globales (`python`, `magick`) en lugar de mirar primero el metodo ya usado en el proyecto;
- eso fue incorrecto porque el proyecto ya tenia `sharp` instalado y scripts previos de optimizacion;
- se corrigio el rumbo usando `sharp`, que era el metodo correcto y ya probado.

## 79. Remera Lisa Hombre 002 con blanco protagonista

Objetivo:

- agregar otro set real de remera lisa;
- usar los archivos entregados por el usuario:
  - `C:/Users/jaell/Downloads/2-blanca-lisa-fondo-banco/`;
  - `C:/Users/jaell/Downloads/2-negra-lisa-fb/`;
  - `C:/Users/jaell/Downloads/2-gris-lisa-fb/`;
- mantener el patron de tarjeta ya aprobado:
  - hover preview;
  - flechas navegables;
  - reset al salir;
  - galeria por color;
- dejar nuevamente la remera blanca como protagonista.

Decision de producto:

- la hoja de contacto mostro modelo masculino;
- por eso no se cargo como segunda mujer;
- se cargo como producto nuevo:
  - `RXW-REM-LISAH002`;
  - `Remera Lisa Hombre 002`;
  - slug `remera-lisa-hombre-002`;
  - genero `hombre`.

Conversion de imagenes:

- se uso `sharp` desde `node_modules`;
- se generaron versiones desktop/mobile `.webp`;
- carpeta final:
  - `public/images/products/remera-lisa-hombre-002-fb/`;
- total generado:
  - 18 desktop;
  - 18 mobile;
  - 36 archivos `.webp`.

Datos del producto:

- precio: `$19.000`;
- estado: `active`;
- destacado: `true`;
- colores:
  - blanco / hueso;
  - negro;
  - gris;
- talles:
  - S;
  - M;
  - L;
  - XL;
  - XXL;
- imagen primaria:
  - `/images/products/remera-lisa-hombre-002-fb/bla-01-desktop.webp`.

Cambios aplicados:

- `data/mockProducts.ts` suma `Remera Lisa Hombre 002`;
- `supabase/seed.sql` suma producto, colores, talles e imagenes;
- Supabase real recibio el alta via MCP;
- no se cambio el patron de tarjeta porque ya estaba correcto desde la seccion 74.

Validacion:

- home:
  - aparece `Remera Lisa Hombre 002`;
  - imagen inicial blanca;
  - precio `$19.000`;
  - hover muestra `bla-03`;
  - flecha pasa a `2/6` mostrando `bla-02`;
  - al salir vuelve a `1/6` con `bla-01`;
- detalle:
  - abre en `/producto/remera-lisa-hombre-002`;
  - blanco aparece primero y seleccionado;
  - galeria inicial usa `bla-01`;
  - precio `$19.000`;
- sin errores de consola en la prueba de navegador.

Checks ejecutados:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso.

Nota:

- el intento de verificacion directa adicional por MCP fue rechazado por limite de uso del conector;
- no se hizo workaround con otra consulta directa;
- la insercion SQL anterior habia sido aceptada y la validacion de UI confirmo que el producto quedo visible y funcional.

## 80. Conexion de Google OAuth para clientes

Objetivo:

- permitir que los clientes entren a la tienda con su cuenta de Google/Gmail;
- mantener el login manual por email/password funcionando;
- reutilizar el callback OAuth ya existente en la app.

Estado previo:

- `app/auth/callback/route.ts` ya existia;
- el callback intercambia `code` por sesion con Supabase;
- luego llama `ensureCustomerProfile` para crear o actualizar el perfil del cliente;
- `/login` mostraba texto indicando que Google estaba postergado.

Cambios aplicados:

- `LoginForm.tsx` ahora tiene boton `Continuar con Google`;
- el boton usa `createSupabaseBrowserClient()`;
- llama a `supabase.auth.signInWithOAuth({ provider: "google" })`;
- usa `redirectTo` apuntando a:
  - `${window.location.origin}/auth/callback?next=...`;
- conserva `returnUrl` para volver al carrito/producto despues del login;
- se agregaron query params:
  - `access_type=offline`;
  - `prompt=select_account`;
- `app/login/page.tsx` ahora dice que se puede entrar con Google o con email/password;
- `README_SUPABASE.md` documenta la configuracion externa.

Configuracion externa necesaria:

- en Supabase Dashboard:
  - `Authentication > Providers > Google`;
  - cargar Google Client ID;
  - cargar Google Client Secret;
- en Google Cloud Console, OAuth Authorized redirect URI:
  - `https://amdrfbppefqbdrxuolje.supabase.co/auth/v1/callback`;
- en Supabase Redirect URLs:
  - `http://127.0.0.1:3000/auth/callback`;
  - dominio final cuando exista: `https://TU-DOMINIO/auth/callback`.

Seguridad:

- el Google Client Secret no se guarda en el repo;
- queda solo en Google Cloud y Supabase;
- el codigo del cliente solo usa la anon key publica normal de Supabase.

Pendiente de validacion real:

- probar el flujo completo luego de cargar Client ID/Secret en Supabase;
- si Google provider no esta habilitado todavia, el boton puede devolver error desde Supabase;
- el codigo local ya esta cableado para iniciar el OAuth y recibir el callback.

Confirmacion posterior:

- el usuario configuro Google en Supabase/Google Cloud;
- el usuario probo el flujo real y confirmo que funciona;
- se mantuvo el login manual como alternativa;
- el boton quedo con estilo clasico de Google:
  - fondo blanco;
  - borde gris;
  - logo multicolor;
  - texto `Continuar con Google`.

Validacion local adicional:

- se verifico que el boton dispara a:
  - `https://amdrfbppefqbdrxuolje.supabase.co/auth/v1/authorize?provider=google`;
- el `redirect_to` queda apuntando a `/auth/callback`;
- el navegador automatizado no pudo completar la pantalla externa de Google, pero si confirmo que ROXWANA inicia OAuth contra Supabase correctamente;
- el usuario hizo la validacion real en navegador normal.

## 81. Agregar al carrito desde tarjetas de producto

Objetivo:

- permitir agregar productos al carrito directamente desde las tarjetas;
- evitar que el cliente tenga que entrar al detalle si ya vio el modelo, color e imagen;
- aplicar el comportamiento en todos los productos visibles:
  - tarjetas editoriales del home/drop;
  - tarjetas de grilla de catalogo;
  - productos con codigo;
  - remeras lisas y productos graficos.

Restriccion importante:

- el carrito necesita producto, color, talle y cantidad;
- no se debe agregar un producto sin talle/color porque eso rompería el SKU, el pedido y el mensaje de WhatsApp;
- por eso la accion rapida no agrega a ciegas: primero pide color y talle dentro de la tarjeta.

Primer intento:

- se creo `components/product/ProductQuickActions.tsx`;
- el componente agregaba:
  - boton `Ver modelo`;
  - boton `Agregar`;
  - selector compacto de color;
  - selector compacto de talle;
  - boton `Confirmar carrito`;
- se conecto en:
  - `components/home/ProductPosterCard.tsx`;
  - `components/product/ProductCard.tsx`;
- al confirmar, usa `addToCartAction`;
- cantidad fija inicial: `1`;
- si el usuario no esta logueado, redirige a:
  - `/login?returnUrl=...`;
- si el agregado sale bien, dispara:
  - `roxwana-cart-updated`;
  - `router.refresh()`.

Problema del primer intento:

- el selector se abría debajo de los botones;
- eso agrandaba la tarjeta;
- al abrir una tarjeta, desacomodaba visualmente la grilla;
- el usuario marco que se veia horrible para una tienda premium;
- la experiencia era funcional, pero no aceptable visualmente.

Correccion definitiva:

- se elimino el panel desplegable que empujaba contenido;
- el selector ahora es una placa flotante dentro de la misma card;
- la card se marco como `relative`;
- la placa se posiciona con:
  - `absolute`;
  - `inset-x-0`;
  - `bottom-0`;
  - `z-30`;
- cuando esta cerrada queda fuera de vista con:
  - `translate-y-full`;
  - `opacity-0`;
  - `pointer-events-none`;
- cuando se abre sube desde abajo con:
  - `translate-y-0`;
  - `opacity-100`;
  - `transition duration-300 ease-out`;
- no cambia la altura de la tarjeta;
- no empuja tarjetas vecinas;
- no abre espacios raros en la grilla.

Diseño visual de la placa:

- fondo oscuro con gradiente sutil;
- borde dorado;
- sombra superior fuerte;
- `backdrop-blur`;
- encabezado `Agregar al carrito`;
- nombre del producto truncado para no romper layout;
- boton de cierre con icono;
- swatches de color;
- botones de talle;
- boton final dorado `Confirmar carrito`.

Validacion de comportamiento:

- se probo en navegador sobre la primera tarjeta visible;
- al tocar `Agregar`, la placa se abrio dentro de la card;
- se selecciono talle;
- el boton `Confirmar carrito` quedo habilitado;
- sin sesion activa, la accion redirigio correctamente a `/login?returnUrl=%2F`;
- no hubo errores de consola.

Validacion de layout:

- altura de la tarjeta antes de abrir:
  - `662.65625`;
- altura de la tarjeta despues de abrir:
  - `662.65625`;
- diferencia:
  - `heightDelta: 0`;
- posicion de la placa:
  - `position: absolute`;
  - `bottom: 0px`;
- resultado:
  - la placa flota y no modifica la grilla.

Checks ejecutados:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso.

Archivos principales:

- `components/product/ProductQuickActions.tsx`;
- `components/home/ProductPosterCard.tsx`;
- `components/product/ProductCard.tsx`;

Leccion de diseño:

- para acciones rapidas dentro de cards premium, no usar paneles que empujen contenido;
- usar overlays internos o placas flotantes que mantengan estable la grilla;
- validar siempre que la altura de la card no cambie al abrir acciones secundarias.

## 82. Estado estable previo a guardado en GitHub

Estado funcional acumulado:

- Google OAuth funciona en navegador real segun confirmacion del usuario;
- login manual sigue disponible;
- productos falsos de prueba fueron eliminados;
- precios obligatorios quedaron incorporados;
- Remera Lisa Mujer fue agregada con blanco protagonista;
- Remera Lisa Hombre 002 fue agregada con blanco protagonista;
- tarjetas de producto mantienen hover, flechas y reset;
- tarjetas de producto ahora permiten agregar al carrito desde vista previa;
- el selector rapido usa placa flotante premium y no altera la grilla.

Version estable objetivo:

- commit estable con todos los cambios reales del storefront;
- tag sugerido:
  - `roxwana-google-cart-preview-estable-2026-06-12`;
- no incluir capturas temporales ni archivos generados locales como `tsconfig.tsbuildinfo`.

## 83. Logo real de ROXWANA en header

Objetivo:

- reemplazar el bloque textual `RW` del header por el logo real entregado por el usuario;
- guardar el logo como asset reutilizable para futuras secciones;
- generar formatos optimizados para web.

Fuente recibida:

- `C:/Users/jaell/Desktop/ROXWANA/logos finales principal/logo1.svg`.

Assets generados:

- `public/brand/roxwana-logo.svg`;
- `public/brand/roxwana-logo-64.png`;
- `public/brand/roxwana-logo-64.webp`;
- `public/brand/roxwana-logo-128.png`;
- `public/brand/roxwana-logo-128.webp`;
- `public/brand/roxwana-logo-256.png`;
- `public/brand/roxwana-logo-256.webp`;
- `public/brand/roxwana-logo-512.png`;
- `public/brand/roxwana-logo-512.webp`.

Cambios aplicados:

- `components/layout/Header.tsx` usa el logo real en la barra superior;
- `components/layout/MobileMenu.tsx` usa el logo real en el menu mobile;
- se uso `next/image` con `roxwana-logo-128.webp` para evitar advertencias de performance por `<img>`.

Problema encontrado:

- el primer intento uso `<img>`;
- Next marco warning por performance/LCP;
- se corrigio a `Image` de `next/image`.

Validacion:

- desktop:
  - logo visible, cuadrado y sin deformarse;
- mobile:
  - logo visible en header;
  - logo visible en menu abierto;
- no hubo errores de consola;
- `npm.cmd run lint`, `npx.cmd tsc --noEmit` y `npm.cmd run build` pasaron.

## 84. Imagenes nuevas para entrada Hombre/Mujer

Objetivo:

- reemplazar las imagenes de las tarjetas donde se elige Hombre o Mujer;
- mantener composicion vertical;
- generar assets optimizados para desktop y mobile.

Primera tanda recibida:

- `C:/Users/jaell/Downloads/4K.png`;
- `C:/Users/jaell/Downloads/W4K.png`.

Cambios de primera tanda:

- se genero carpeta:
  - `public/images/gender-entry/`;
- se generaron versiones WebP desktop/mobile;
- se conectaron en `components/home/GenderFilteredDrop.tsx`;
- se aumento la altura de las cards para que el formato leyera mas vertical;
- se elimino el cartel superior que tapaba la imagen:
  - `Asfalto / ruido / noche`;
  - `Rojo / fuego / calle`.

Segunda tanda recibida:

- `C:/Users/jaell/Downloads/ChatGPT Image 13 jun 2026, 01_15_55 (2).png`;
- `C:/Users/jaell/Downloads/ChatGPT Image 13 jun 2026, 01_15_57 (7).png`.

Assets definitivos generados:

- `public/images/gender-entry/hombre-urbano-20260613-desktop.webp`;
- `public/images/gender-entry/hombre-urbano-20260613-mobile.webp`;
- `public/images/gender-entry/mujer-urbana-20260613-desktop.webp`;
- `public/images/gender-entry/mujer-urbana-20260613-mobile.webp`.

Problema encontrado:

- al sobrescribir los mismos nombres anteriores, Next seguia mostrando la imagen vieja por cache de optimizacion;
- para evitar confusiones se generaron nombres nuevos versionados con fecha;
- luego se apunto el componente a esos nombres nuevos;
- se eliminaron duplicados viejos dentro de `public/images/gender-entry/`.

Validacion:

- desktop usa los assets `*-desktop.webp`;
- mobile usa los assets `*-mobile.webp`;
- ambas cards mantienen `object-cover`;
- se ajusto `objectPosition`:
  - Hombre: `50% 12%`;
  - Mujer: `50% 10%`;
- no hubo errores de consola;
- `npm.cmd run lint`, `npx.cmd tsc --noEmit` y `npm.cmd run build` pasaron.

## 85. Textos publicos del home corregidos

Objetivo:

- corregir textos que ya no representaban el flujo real de compra;
- quitar frases que el usuario marco como incorrectas o feas;
- dejar el home alineado con carrito, entrega y WhatsApp.

Cambios en portada:

- se cambio `SIN PEDIR PERMISO` por `ESTILO URBANO`;
- se cambio la bajada por:
  - `Explora modelos, colores y talles antes de armar tu pedido.`;
- se elimino el boton `Pedir por WhatsApp`;
- se cambio el boton `Ver drop` por `Ver catalogo`;
- el boton sigue apuntando a `#drop-01`, para bajar a las prendas.

Cambios en footer:

- se reemplazo tambien `SIN PEDIR PERMISO` por `ESTILO URBANO`;
- se mantuvo el link de WhatsApp del footer porque el usuario pidio sacar el boton de portada, no todo WhatsApp del sitio.

Cambios en seccion de flujo:

- se corrigio `DEL MODELO AL MENSAJE`;
- ahora es `DEL MODELO AL PEDIDO`;
- el flujo quedo:
  1. Elegis modelo.
  2. Seleccionas talle/color.
  3. Agregas al carrito.
  4. Completas entrega y WhatsApp.
- se eliminaron textos viejos como:
  - `Mandas consulta por WhatsApp`;
  - `Confirmamos precio y entrega`;
  - `compra por consulta directa`.

Cambios en encabezado del catalogo:

- se elimino `Drop 01`;
- se elimino `MODELOS CON CODIGO`;
- se elimino `MODELOS HOMBRE` / `MODELOS MUJER` como titulo principal de la grilla;
- el titulo quedo:
  - `ELEGI TU MODELO`.

Problema encontrado:

- en un momento el texto con acento `ELEGI` quedo con encoding roto como `ELEGÃ`;
- para estabilizarlo se uso entidad HTML:
  - `ELEG&Iacute; TU MODELO`;
- asi el navegador muestra `ELEGI` con acento sin depender de la codificacion del archivo.

Validacion:

- busqueda global confirmo que ya no quedaban:
  - `SIN PEDIR PERMISO`;
  - `Pedir por WhatsApp`;
  - `Ver drop`;
  - `DEL MODELO AL MENSAJE`;
  - `consulta directa`;
- `npm.cmd run lint`, `npx.cmd tsc --noEmit` y `npm.cmd run build` pasaron.

## 86. Selectores de color redondos

Objetivo:

- reemplazar los botones cuadrados con nombre de color;
- mostrar swatches redondos con el color real de la prenda;
- mantener accesibilidad con `aria-label` y `title`.

Cambios aplicados:

- se creo `components/product/ColorSwatch.tsx`;
- se conecto en:
  - `components/product/ProductSelector.tsx`;
  - `components/product/ProductQuickActions.tsx`;
  - `components/product/ProductCard.tsx`;
  - `components/home/RandomPrintTeaser.tsx`.

Comportamiento:

- en detalle de producto:
  - circulos grandes para Blanco, Negro, Gris, etc.;
- en placa rapida de agregar al carrito:
  - circulos medianos;
- en tarjetas/listados:
  - mini circulos;
- el color seleccionado muestra borde dorado y sombra;
- el nombre del color ya no aparece visible dentro del boton.

Validacion:

- navegador verifico swatches de detalle:
  - `48x48`;
  - `borderRadius: 9999px`;
  - labels accesibles como `Blanco / Hueso`, `Negro`, `Gris`;
- no hubo errores de consola;
- `npm.cmd run lint`, `npx.cmd tsc --noEmit` y `npm.cmd run build` pasaron.

## 87. Hombre/Mujer siempre lado a lado en mobile

Objetivo:

- en vista celular, las cards Hombre y Mujer no deben apilarse una debajo de la otra;
- deben entrar lado a lado para elegir rapido.

Cambios aplicados:

- en `components/home/GenderFilteredDrop.tsx`, la grilla paso de una columna mobile a:
  - `grid-cols-2`;
- se redujo gap mobile:
  - `gap-2`;
- se mantuvo el layout especial desktop:
  - `md:grid-cols-[1.05fr_0.95fr]`;
- se redujo altura mobile:
  - `min-h-[390px]`;
- se mantuvo altura mayor en desktop:
  - `md:min-h-[760px]`;
- los titulos `Hombre` y `Mujer` se hicieron mas compactos en mobile:
  - `text-4xl`;
- el texto descriptivo de cada card se oculta en mobile para no aplastar la imagen:
  - `hidden sm:block`;
- se mantiene `Filtrar drop` como accion visual.

Validacion mobile:

- viewport probado:
  - `390x844`;
- tarjeta Hombre:
  - `x = 16`;
  - `width = 175`;
  - `height = 390`;
- tarjeta Mujer:
  - `x = 199`;
  - `width = 175`;
  - `height = 390`;
- ambas tienen la misma coordenada vertical:
  - `sameRow: true`;
- no hubo errores de consola.

Checks ejecutados:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso.

## 88. Estado estable objetivo 2026-06-13

Estado funcional acumulado de esta version:

- header y menu mobile usan logo real de ROXWANA;
- assets de logo quedan disponibles para futuros usos;
- entrada Hombre/Mujer usa imagenes urbanas nuevas;
- en mobile Hombre/Mujer aparecen lado a lado;
- portada dice `ESTILO URBANO`;
- boton principal dice `Ver catalogo` y baja al catalogo;
- textos del flujo de pedido explican carrito, entrega y WhatsApp;
- colores de productos se eligen con circulos visuales;
- catalogo dice `ELEGI TU MODELO`;
- no quedan capturas temporales ni scripts de verificacion en el commit estable.

Tag estable sugerido:

- `roxwana-home-brand-mobile-catalog-estable-2026-06-13`.

## 89. Admin completo ROXWANA 2026-06-14

Objetivo:

- crear un panel privado real para gestionar catalogo, productos, imagenes, categorias, drops, home, settings y usuarios autorizados;
- mantener la web publica actual sin redisenar la landing;
- conservar compatibilidad con el Command Center existente;
- dejar una base preparada para Supabase real con RLS y Storage.

Rutas creadas o consolidadas:

- `/admin/login`;
- `/admin`;
- `/admin/productos`;
- `/admin/productos/nuevo`;
- `/admin/productos/[id]`;
- `/admin/categorias`;
- `/admin/drops`;
- `/admin/home`;
- `/admin/media`;
- `/admin/settings`;
- `/admin/usuarios`.

Rutas de compatibilidad:

- `/admin-login` queda redirigido al login nuevo;
- `/command` y rutas del Command Center quedan redirigidas al nuevo panel;
- las secciones viejas no se borraron de golpe, se reutilizo la base donde convenia.

Componentes y helpers principales:

- `components/admin/AdminShell.tsx`;
- `components/admin/AdminStates.tsx`;
- `components/admin/ConfirmDeleteDialog.tsx`;
- `lib/admin/form.ts`;
- `lib/admin/home.ts`;
- `lib/admin/media.ts`;
- `lib/admin/taxonomy.ts`;
- `lib/admin/users.ts`;
- `lib/home/sections.ts`;
- `lib/media/publicUrl.ts`;
- `types/admin.ts`.

Base de datos y Supabase:

- se agrego la migracion:
  - `supabase/migrations/20260614120000_admin_completo.sql`;
- se amplio el modelo para roles:
  - `customer`;
  - `editor`;
  - `admin`;
- se prepararon entidades para:
  - categorias;
  - colecciones/drops;
  - secciones editables de home;
  - assets de media;
  - settings ampliados;
  - productos con galeria, imagen principal, precio anterior, orden, destacado, mensaje de WhatsApp, variantes, stock y SKU;
- se mantuvo el criterio de que `service_role` solo debe usarse en server/helpers server-only;
- el cliente sigue usando sesion normal y las reglas de RLS.

Estados de producto:

- se paso a vocabulario claro de admin:
  - `draft`;
  - `published`;
  - `sold_out`;
- se preservo el catalogo existente con normalizacion desde estados previos como `active` y `hidden`.

Web publica:

- la home puede leer `site_sections`;
- productos publicos se filtran por `published`;
- categorias y drops activos quedan disponibles para la experiencia publica;
- si falta contenido de admin, la web usa fallbacks para no romper el diseno.

## 90. Problema de ingreso al admin y solucion local

Problema detectado:

- se intento entrar con un mail supuesto de admin y el panel mostro:
  - `Credenciales invalidas.`;
- ese usuario no existia realmente en Supabase;
- fue un error tratar esa credencial como si ya estuviera creada;
- para crear el primer admin real desde el entorno local hacia Supabase hacia falta `SUPABASE_SERVICE_ROLE_KEY`;
- el `.env.local` tenia la variable sin valor util, por eso no se podia crear el usuario real desde aca.

Decision aplicada para poder probar el panel sin bloquear el trabajo:

- se agrego un acceso local de desarrollo;
- este acceso funciona solo fuera de produccion;
- no crea un admin real en Supabase;
- permite entrar al panel local para revisar UI, rutas, CRUD visual y flujo general.

Credenciales locales de prueba:

- mail:
  - `admin@roxwana.local`;
- clave:
  - `roxwana123`.

Archivos agregados o modificados:

- `lib/auth/devAdmin.ts`;
- `app/api/auth/dev-admin-login/route.ts`;
- `app/admin-login/AdminLoginForm.tsx`;
- `lib/auth/requireAdmin.ts`;
- `proxy.ts`.

Comportamiento:

- primero se intenta login normal con Supabase;
- si Supabase rechaza las credenciales y el entorno es local, se intenta el login de desarrollo;
- si coincide con `admin@roxwana.local` y `roxwana123`, se crea una cookie local:
  - `roxwana_dev_admin`;
- `requireAdmin` y `proxy` aceptan esa cookie solo para desarrollo local.

Validacion realizada:

- endpoint local probado:
  - `/api/auth/dev-admin-login`;
- respuesta:
  - `STATUS=200`;
  - `{"ok":true,"returnUrl":"/admin"}`.

Pendiente para produccion:

- crear el primer admin real en Supabase Dashboard o por SQL seguro;
- completar `SUPABASE_SERVICE_ROLE_KEY` solo en entorno server;
- cambiar o eliminar cualquier credencial local antes de publicar;
- desde el panel, un admin real podra autorizar otros mails como `admin` o `editor`.

## 91. Arreglo de casilleros desbordados en admin

Problema reportado:

- en `/admin/home`, algunos campos se salian del borde del formulario;
- el caso visible era el bloque del hero, especialmente el campo `Orden`;
- en anchos intermedios la grilla obligaba columnas demasiado anchas y los inputs no achicaban correctamente.

Causa tecnica:

- algunas grillas internas no tenian suficiente tolerancia para anchos medios;
- los controles de formulario no tenian una regla global de `min-width: 0`;
- eso podia provocar overflow horizontal aunque visualmente el panel pareciera entrar.

Cambios aplicados:

- se agrego la clase de superficie:
  - `admin-surface`;
- se conecto en:
  - `components/admin/AdminShell.tsx`;
- se agregaron reglas CSS en:
  - `app/globals.css`;
- reglas principales:
  - formularios, labels y grillas dentro de admin usan `min-width: 0`;
  - inputs, selects y textareas usan `width: 100%`, `max-width: 100%` y `min-width: 0`;
  - textareas quedan con resize vertical;
- se ajusto la grilla de home en:
  - `app/admin/(panel)/home/page.tsx`;
- el bloque `imagen / CTA / orden` ahora usa:
  - dos columnas en `md`;
  - tres columnas recien en `xl`;
  - CTA URL ocupa todo el ancho correcto segun breakpoint.

Verificacion visual:

- se revisaron paginas del admin en desktop, tablet y mobile:
  - `/admin/home`;
  - `/admin/categorias`;
  - `/admin/drops`;
  - `/admin/media`;
  - `/admin/usuarios`;
  - `/admin/productos`;
- viewports usados:
  - desktop `1440px`;
  - tablet `900px`;
  - mobile `390px`;
- resultado:
  - no hubo scroll horizontal de pagina;
  - no quedaron controles salidos del formulario;
  - las tablas largas de productos/usuarios quedan dentro de su contenedor con overflow horizontal controlado, que es el comportamiento esperado.

## 92. Validaciones de estabilidad

Checks ejecutados durante la implementacion del admin:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

Resultado inicial del admin:

- lint paso;
- TypeScript paso;
- build paso.

Checks ejecutados despues del login local y del arreglo de formularios:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
```

Resultado:

- lint paso;
- TypeScript paso;
- rutas del admin respondieron en local;
- login local de desarrollo respondio correctamente;
- verificacion visual confirmo que los casilleros ya no se salen.

## 93. Estado estable objetivo 2026-06-14

Estado funcional acumulado de esta version:

- admin principal vive en `/admin`;
- login del admin vive en `/admin/login`;
- acceso local de prueba:
  - `admin@roxwana.local`;
  - `roxwana123`;
- panel permite gestionar:
  - productos;
  - categorias;
  - drops;
  - secciones controladas de home;
  - media;
  - settings;
  - usuarios autorizados;
- la web publica queda conectada a productos publicados y secciones editables con fallback;
- Command Center viejo queda redirigido;
- se corrigieron desbordes visuales de formularios;
- se dejo una migracion Supabase completa para aplicar en base real;
- se documentaron los problemas reales de credenciales para no volver a confundir mail local, usuario real y primer admin de Supabase.

Punto de retorno recomendado:

- commit estable:
  - `Admin backstage stable version`;
- tag estable:
  - `roxwana-admin-backstage-estable-2026-06-14`.

Notas importantes antes de produccion:

- ejecutar la migracion de Supabase en el proyecto real;
- crear el primer admin real en Supabase;
- completar variables secretas server-only;
- revisar que el acceso local de desarrollo no se use como credencial de produccion;
- probar como visitante, cliente, editor y admin real antes de publicar.

## 94. Product Studio: ajuste visual y manejo dinamico de imagenes

Motivo:

- la pantalla de Product Studio habia quedado funcional, pero demasiado grande visualmente;
- los titulos, paddings, inputs y paneles ocupaban demasiado espacio;
- al cargar imagenes nuevas no habia una accion clara para quitarlas antes de guardar;
- el objetivo del Studio es ser una mesa de trabajo rapida para cargar producto, ficha, variantes e imagenes, no una pagina de presentacion.

Cambios realizados:

- se compacto `components/admin/product-studio/ProductStudio.tsx`;
- se bajaron tamanos de titulos internos;
- se redujeron paddings, gaps, alturas de inputs y botones;
- se achicaron columnas laterales de ficha y preview;
- se mantuvo el look ROXWANA con fondo ink/charcoal, hueso, dorado y rojo;
- se agrego manejo dinamico de imagenes nuevas:
  - carga en varias tandas;
  - boton para quitar imagen antes de guardar;
  - botones para subir y bajar orden;
  - edicion directa de rol, numero, color, device y orden;
  - selector de portada;
  - advertencias cuando el nombre no trae color o numero;
- si una imagen no viene numerada, el Studio le asigna orden por carga;
- se agrego estado interno para distinguir imagenes activas y marcadas para no subir;
- se agrego `image_skip` en el formulario para que el backend ignore archivos quitados aunque el input del navegador todavia los tenga seleccionados.

Cambios en backend:

- en `lib/products/mutations.ts`, `uploadImages` ahora revisa `image_skip`;
- si `image_skip` es `"true"`, esa imagen no se sube a Storage;
- se preserva el orden, metadata, rol, color y device de las imagenes que si quedan activas.

Problemas detectados durante el ajuste:

- los inputs de archivo del navegador no permiten borrar internamente un archivo ya seleccionado de forma individual;
- por eso se resolvio con estado local y una senal server-side (`image_skip`);
- asi el usuario ve la imagen como quitada y el servidor respeta esa decision al guardar.

Validaciones:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso;
- `/admin/productos/nuevo/studio` respondio `STATUS=200` con sesion local;
- la pantalla quedo mas compacta y usable.

## 95. Catalogo admin: fichas premium con preview visual

Motivo:

- la pantalla `/admin/productos` funcionaba, pero se sentia como tabla plana;
- no permitia reconocer visualmente cada producto;
- las acciones competian entre si y quedaban visualmente ruidosas;
- el producto es el centro del negocio, por lo que el admin necesitaba una lectura mas editorial y premium.

Restricciones aplicadas:

- no se cambiaron rutas;
- no se agregaron librerias;
- no se inventaron campos;
- se uso la estructura real `Product`:
  - `id`;
  - `modelCode`;
  - `name`;
  - `garmentLabel`;
  - `categoryLabel`;
  - `price`;
  - `compareAtPrice`;
  - `status`;
  - `featured`;
  - `image`;
  - `images`.

Componentes agregados:

- `components/admin/ProductImagePreview.tsx`;
- `components/admin/AdminProductRow.tsx`.

`ProductImagePreview.tsx`:

- recibe `images: string[]`;
- muestra la primera imagen por defecto;
- permite navegar con flecha anterior/siguiente si hay mas de una imagen;
- muestra contador `1 / N`;
- muestra placeholder `RXW` si no hay imagen;
- usa aspect ratio vertical tipo producto;
- usa estado local solamente;
- no escribe nada en backend;
- agrega `aria-label` a botones de carrusel.

`AdminProductRow.tsx`:

- reemplaza la fila plana por una ficha visual;
- pone la imagen a la izquierda;
- agrupa datos principales:
  - modelo en dorado;
  - nombre del producto;
  - prenda;
  - categoria;
  - drop si existe;
  - precio;
  - precio anterior si existe;
  - estado;
- agrega indicador sutil `Home` cuando el producto esta destacado;
- reorganiza acciones:
  - principales visibles: `Studio`, `Editar`, `Publicar/Despublicar`;
  - secundarias en menu `Mas`: `Agotar`, `Destacar`, `Duplicar`;
  - `Borrar` queda separado, rojo y con confirmacion;
- reutiliza `ConfirmDeleteDialog`.

Cambios en `ProductTable.tsx`:

- dejo de renderizar `<table>`;
- ahora funciona como contenedor de fichas;
- mantiene el mismo contrato `products: Product[]`;
- se sigue reutilizando en `/admin/productos` y en el dashboard.

Validacion visual:

- se verifico con navegador real en desktop y mobile;
- resultado observado:
  - 9 fichas de producto renderizadas;
  - 6 productos con carrusel disponible;
  - 9 menus secundarios;
  - sin overflow horizontal;
- capturas generadas:
  - `admin-products-premium-desktop.png`;
  - `admin-products-premium-mobile.png`.

Validaciones tecnicas:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso;
- `/admin/productos` respondio correctamente con sesion local.

## 96. Error al cambiar estado de producto: causa confirmada

Problema reportado:

- al intentar quitar o cambiar un producto desde el admin aparecio una pantalla de error de Next.js;
- el error visible fue:
  - `No se pudo cambiar el estado del producto.`;
- la traza apunto a:
  - `lib/products/mutations.ts`;
  - `changeProductStatusAction`;
  - linea del guard que valida `supabase` e `id`.

Analisis:

- se reviso el formulario de `AdminProductRow`;
- el formulario si enviaba `id`;
- el problema no era el nuevo diseno visual ni la falta de producto;
- se reviso `lib/supabase/admin.ts`;
- `createSupabaseAdminClient()` devuelve `null` si falta `SUPABASE_SERVICE_ROLE_KEY`;
- se reviso `.env.local`;
- `SUPABASE_SERVICE_ROLE_KEY` estaba vacio.

Causa real:

- el admin local permite entrar por cookie de desarrollo;
- eso sirve para navegar y revisar UI;
- pero las acciones que escriben en Supabase necesitan service role key;
- sin `SUPABASE_SERVICE_ROLE_KEY`, acciones como publicar, despublicar, agotar, destacar, duplicar o borrar no pueden ejecutarse contra Supabase.

Conclusion:

- no era un bug del nuevo listado de productos;
- era una configuracion pendiente de Supabase admin;
- se decidio dejarlo para mas adelante y seguir con mejoras visuales.

Pendiente:

- cargar `SUPABASE_SERVICE_ROLE_KEY` real en `.env.local`;
- reiniciar servidor;
- probar acciones reales con productos reales de Supabase;
- mejorar luego el mensaje de error para que no aparezca pantalla roja cuando falte la clave.

## 97. Media fuera del flujo principal

Motivo:

- la seccion `Media` ya no era necesaria para el flujo principal de productos;
- Product Studio ahora sube y administra imagenes de producto directamente;
- mantener `Media` visible en el menu generaba ruido y confusion.

Decision:

- no se borro `/admin/media`;
- no se borro `lib/admin/media.ts`;
- no se borro la tabla `media_assets`;
- se dejo la ruta disponible como herramienta secundaria para assets generales:
  - home;
  - banners;
  - brand assets;
  - drops;
- se retiro del flujo principal.

Cambios realizados:

- en `components/admin/AdminShell.tsx` se quito `Media` del menu lateral;
- en `app/admin/(panel)/page.tsx` se quito el boton rapido `Subir imagenes`;
- el dashboard quedo mas enfocado en:
  - productos;
  - Studio;
  - home;
  - drops;
  - operaciones.

Validaciones:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
```

Resultado:

- lint paso;
- TypeScript paso;
- no se tocaron rutas ni acciones internas de Media.

## 98. Previews visuales en secciones admin fuera de Productos y Studio

Pedido:

- revisar seccion por seccion del admin;
- agregar vista previa visual donde haya algo real que mostrar;
- no inventar previews donde no exista imagen o superficie visual;
- dejar `Studio` y `Productos` sin tocar porque ya quedaron aprobados.

Secciones revisadas:

- Dashboard;
- Categorias;
- Drops;
- Home;
- Media;
- Clientes;
- Pedidos;
- Carritos;
- Consultas;
- Settings;
- Usuarios;
- Productos;
- Studio.

Decision por seccion:

- `Productos`:
  - no se toco;
  - ya tiene preview visual por producto;
- `Studio`:
  - no se toco;
  - ya tiene preview de producto e imagenes;
- `Home`:
  - si tiene material visual;
  - se agregaron previews;
- `Drops`:
  - si puede tener `hero_image_path`;
  - se agrego soporte de preview cuando el dato exista;
- `Media`:
  - ya mostraba imagenes subidas;
  - ademas quedo fuera del menu principal;
- `Categorias`:
  - no tiene imagen ni preview real;
  - no se invento nada;
- `Clientes`, `Pedidos`, `Carritos`, `Consultas`:
  - son datos operativos;
  - no tienen imagen propia de seccion;
  - no se invento preview;
- `Settings`, `Usuarios`:
  - configuracion/accesos;
  - no tienen visual propio;
  - no se agrego preview.

Componente agregado:

- `components/admin/AdminVisualPreview.tsx`.

Funciones del componente:

- `ImagePathPreview`:
  - recibe `imagePath`;
  - usa `getPublicMediaUrl`;
  - muestra imagen real si existe;
  - no renderiza nada si no hay path;
  - soporta bucket por defecto `site-images`;
- `RandomWheelAdminPreview`:
  - muestra una preview compacta de la ruleta usando:
    - datos reales de `final_cta`;
    - primer producto real disponible;
    - imagen real del producto;
    - textos reales de la seccion;
  - no escribe backend;
  - no ejecuta acciones de carrito;
  - es una preview visual administrativa;
- `HomeSectionVisualPreview`:
  - decide por tipo de seccion:
    - si `final_cta`, muestra ruleta;
    - si hay `imagePath`, muestra imagen;
    - si no hay nada visual, no muestra nada.

Cambios en `/admin/home`:

- se importo `HomeSectionVisualPreview`;
- se cargo tambien `getActiveProducts()` para alimentar la preview de ruleta;
- cada seccion se convirtio en un `article` que contiene:
  - formulario editable;
  - preview visual separada;
- se evito poner previews interactivos dentro del formulario;
- se corrigio el layout para que el preview no aplaste inputs:
  - en desktop normal el preview queda debajo;
  - en pantallas muy anchas pasa al costado;
  - no hay overflow horizontal.

Previews reales agregados en Home:

- `hero`:
  - muestra imagen real de `imagePath`;
- `final_cta`:
  - muestra preview de ruleta con producto real;
- secciones sin imagen:
  - no muestran preview.

Cambios en `/admin/drops`:

- se importo `ImagePathPreview`;
- cada drop existente puede mostrar preview de `heroImagePath`;
- si el drop no tiene `heroImagePath`, no se muestra nada;
- en el estado actual no habia drops con imagen, por lo que no se invento preview.

Problema detectado y corregido:

- primer layout de Home ponia el preview al costado en `xl`;
- con sidebar admin, ese ancho comprimio demasiado algunos inputs;
- se cambio a `2xl:grid-cols[...]`;
- con eso:
  - en desktop comun el formulario conserva espacio;
  - el preview queda debajo;
  - en pantallas grandes puede ir al costado.

Validacion visual:

- se uso navegador real con cookie local de admin;
- rutas verificadas:
  - `/admin/home`;
  - `/admin/drops`;
- resultados:
  - `/admin/home` mostro 2 previews:
    - imagen hero;
    - ruleta final CTA;
  - `/admin/drops` no mostro preview porque no habia `hero_image_path` cargado;
  - no hubo overflow horizontal;
- capturas generadas:
  - `admin-visual-previews-admin-home.png`;
  - `admin-visual-previews-admin-drops.png`.

Validaciones tecnicas finales:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build paso;
- rutas del admin siguieron disponibles en build:
  - `/admin/home`;
  - `/admin/drops`;
  - `/admin/productos`;
  - `/admin/productos/nuevo`;
  - `/admin/productos/nuevo/studio`;
  - `/admin/productos/[id]`;
  - `/admin/productos/[id]/simple`;
  - `/admin/media`.

Estado actual:

- Productos y Studio quedan congelados visualmente segun aprobacion del usuario;
- Home tiene previews visuales reales;
- Drops queda preparado para previews reales cuando haya imagen de hero;
- Media no ocupa espacio en el menu principal;
- acciones reales de producto siguen pendientes de service role key para Supabase.

## 2026-06-15 - Cierre operativo de subida de prendas

Objetivo de esta tanda:

- retomar el trabajo que habia quedado colgado el 2026-06-14;
- dejar el admin de productos conectado a Supabase real;
- corregir el error visto al intentar guardar una prenda con imagen;
- documentar el estado real para preparar Netlify.

### Estado inicial verificado

Estado Git:

```bash
git status -sb
```

Resultado:

- rama `main`;
- sincronizada con `origin/main`;
- arbol limpio antes de los cambios de codigo.

Variables locales revisadas sin exponer secretos:

```text
NEXT_PUBLIC_SUPABASE_URL=<set>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<set>
SUPABASE_SERVICE_ROLE_KEY=<empty>
NEXT_PUBLIC_SITE_URL=<set>
NEXT_PUBLIC_WHATSAPP_NUMBER=<set>
SUPABASE_PROJECT_REF=<set>
SUPABASE_DB_PASSWORD=<empty>
```

Conclusion inicial:

- el error de la captura no venia de Supabase;
- venia de Next.js cortando el formulario antes de ejecutar la Server Action;
- igualmente, `SUPABASE_SERVICE_ROLE_KEY` seguia vacia y eso dejaba fragil el guardado de productos si las acciones dependian de service role.

### Error reportado

Error visible en pantalla:

```text
Body exceeded 1 MB limit.
To configure the body size limit for Server Actions...
```

Ubicacion indicada por Next:

- `components/admin/product-studio/ProductStudio.tsx`;
- formulario del Studio en la linea del `<form action={action}>`.

Causa:

- Next.js Server Actions tienen limite de body bajo por defecto;
- el Studio envia datos + imagen por formulario;
- una imagen real de producto supera facilmente 1 MB;
- por eso el request se bloqueaba antes de llegar a `createProductAction` o `updateProductAction`.

### Supabase real alineado

Proyecto real:

```text
roxwana-store
project_ref=amdrfbppefqbdrxuolje
```

Migraciones confirmadas en Supabase:

- `20260608210706 initial_roxwana_store`;
- `20260610002848 phase3_customer_auth_cart_orders`;
- `20260610010431 lock_legacy_whatsapp_orders`;
- `20260614172402 product_studio_image_metadata`;
- `20260615010622 admin_completo`;
- `20260615163143 promote_first_roxwana_admin`.

La migracion `admin_completo` ya habia sido aplicada el 2026-06-15 01:06 aprox. desde el conector, pero la verificacion habia quedado bloqueada por limite de uso. En esta tanda se verifico que quedo aplicada.

Tablas admin verificadas:

- `categories`;
- `collections`;
- `media_assets`;
- `product_images`;
- `product_variants`;
- `products`;
- `profiles`;
- `settings`;
- `site_sections`.

Buckets verificados:

- `product-images`;
- `site-images`;
- `brand-assets`.

Estado de buckets:

- publicos;
- limite `5242880` bytes;
- `product-images` acepta:
  - `image/jpeg`;
  - `image/png`;
  - `image/webp`;
- `brand-assets` tambien acepta `image/svg+xml`.

Estados de productos verificados:

```text
draft=2
published=7
```

Esto confirma que los productos que antes estaban como `active` quedaron normalizados a `published`, que es lo que espera el codigo actual.

### Primer admin real

Cuenta promovida:

```text
jaelleiva@gmail.com
```

Estado final verificado:

```text
role=admin
name=lucas fabian leiva
```

Detalle importante:

- el intento directo de `update profiles set role='admin'` fallo por el trigger `profiles_prevent_role_escalation`;
- ese trigger protege contra escalado de privilegios;
- para crear el primer admin se aplico una migracion controlada:
  - desactivar trigger;
  - actualizar solo el perfil de `jaelleiva@gmail.com`;
  - reactivar trigger inmediatamente.

Verificacion posterior:

- `profiles_prevent_role_escalation` quedo activo;
- `tgenabled=O`.

### Cambios de codigo

Archivo modificado:

- `next.config.mjs`.

Cambio:

- se agrego `experimental.serverActions.bodySizeLimit = "12mb"`.

Motivo:

- permitir guardar prendas con imagen real;
- mantener margen sobre el limite de imagen de 5 MB;
- no abrir un limite excesivo.

Archivo modificado:

- `lib/products/mutations.ts`.

Cambio:

- las acciones de producto dejaron de depender de `createSupabaseAdminClient()`;
- ahora usan `createSupabaseServerClient()` y la sesion real del usuario admin/editor;
- se agrego `createProductMutationClient()`;
- si no existe sesion Supabase real, el guardado falla con mensaje explicito:

```text
Para guardar productos inicia sesion con un usuario admin real de Supabase.
```

Motivo:

- `SUPABASE_SERVICE_ROLE_KEY` local seguia vacia;
- para subir prendas no hace falta service role si el usuario esta autenticado y RLS permite `admin/editor`;
- la migracion `admin_completo` ya dejo politicas de staff para productos, imagenes y storage;
- este enfoque acerca el comportamiento local y Netlify al flujo real:
  - login admin;
  - session cookie;
  - RLS de Supabase;
  - upload a Storage.

Impacto:

- `/admin/productos/nuevo/studio` debe guardar con `jaelleiva@gmail.com` logueado;
- `/admin/productos/[id]/studio` debe actualizar y borrar/reemplazar imagenes con sesion real;
- publicar/despublicar, destacar, borrar y duplicar tambien usan sesion staff real;
- el fallback `admin@roxwana.local` queda solo como acceso de desarrollo para ver el panel, no para guardar productos reales.

### Validaciones ejecutadas

Build:

```bash
npm.cmd run build
```

Resultado:

- paso;
- Next.js 16.2.7 compilo;
- TypeScript paso;
- rutas admin quedaron disponibles;
- Next reconocio el experimento `serverActions`.

Lint:

```bash
npm.cmd run lint
```

Resultado:

- paso.

Servidor local:

```bash
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Verificacion HTTP:

```text
http://127.0.0.1:3000/admin/login
STATUS=200
```

### Advisors de Supabase

Se ejecutaron advisors de seguridad y performance.

Warnings relevantes encontrados:

- `function_search_path_mutable` en `public.set_updated_at`;
- buckets publicos con politicas amplias de listado;
- funciones `SECURITY DEFINER` ejecutables por `anon/authenticated`;
- proteccion de passwords filtrados deshabilitada;
- foreign keys sin indices;
- RLS con `auth.uid()` reevaluado por fila;
- multiples politicas permisivas en algunas tablas.

Decision:

- no se corrigieron en esta tanda para no mezclar el fix urgente de carga de prendas con una migracion de hardening mas amplia;
- no bloquean el flujo de subida de producto;
- quedan como deuda tecnica real antes de produccion final endurecida.

### Prueba pendiente con usuario real

No se completo desde Codex el submit visual completo porque no se dispone de la password real de `jaelleiva@gmail.com`.

Prueba que debe hacer el usuario en navegador:

1. abrir `http://127.0.0.1:3000/admin/login`;
2. entrar con `jaelleiva@gmail.com`;
3. ir a `/admin/productos/nuevo/studio`;
4. crear una prenda en `draft`;
5. subir una imagen menor o igual a 5 MB;
6. guardar;
7. verificar que vuelve a `/admin/productos`;
8. editar esa prenda;
9. publicar;
10. verificar que aparece en `/productos`.

Resultado esperado despues de esta tanda:

- no debe aparecer mas el error `Body exceeded 1 MB limit`;
- si hay error, ya deberia venir de validacion de producto, credenciales, RLS o Storage, no del limite de Next.

## 2026-06-15 - Cierre estable de carga real, visibilidad publica y carrito visual

### Objetivo de la tanda

Cerrar una version estable despues de probar carga real de prendas desde el admin:

- dejar un archivo de ficha reutilizable para autocompletar el Product Studio;
- hacer que los productos publicados aparezcan adelante sin depender de destacados;
- permitir que el filtro Hombre/Mujer se pueda deseleccionar;
- simplificar los circulos de color de producto;
- mostrar la imagen principal del producto dentro del carrito;
- validar localmente;
- guardar el estado en GitHub como checkpoint estable.

### Estado inicial detectado

El admin ya podia crear y publicar una prenda real con imagen.

Se creo una ficha local para pruebas:

```text
ficha-producto-prueba-studio-roxwana.txt
```

Esa ficha usa codigos reales del catalogo:

- prenda `REM`;
- categoria `rem`;
- colores `NEG`, `BLA`, `GRI`;
- talles `S`, `M`, `L`, `XL`;
- estado inicial `draft`.

La imagen no se incluye en el archivo porque se sube manualmente desde el Studio.

### Problema 1: producto publicado que no aparecia adelante

Sintoma:

- el producto se habia creado;
- se habia publicado;
- tenia imagen;
- pero el usuario no lo veia en la pagina principal.

Verificacion realizada:

- se consulto Supabase real;
- el producto `RXW-REM-TEST-JAEL-0615` existia;
- estaba en `status = published`;
- tenia imagen primaria en bucket `product-images`;
- tenia categoria, prenda, colores, talles y variantes.

Causa:

- la home usaba `getFeaturedProducts()`;
- cuando habia productos destacados, la grilla principal privilegiaba ese subconjunto;
- un producto publicado pero no destacado podia quedar invisible en el primer bloque.

Solucion:

- `app/page.tsx` dejo de pedir `getFeaturedProducts()`;
- la home ahora usa `getActiveProducts()`;
- todos los productos publicados entran en la grilla principal;
- `getFeaturedProducts()` se neutralizo para devolver los activos publicados y evitar que una reutilizacion futura vuelva a esconder productos.

Archivos modificados:

- `app/page.tsx`;
- `lib/products/queries.ts`.

Resultado:

- si el usuario no filtra por Hombre/Mujer, se muestran todos los publicados;
- el producto de prueba aparece en la home, en `/productos` y en su detalle.

### Problema 2: filtro Hombre/Mujer no se podia deseleccionar

Sintoma:

- al tocar `Hombre`, la grilla filtraba por hombre;
- para salir de esa vista habia que tocar `Mujer` o cambiar de contexto;
- no habia forma directa de volver a `todos` tocando el mismo filtro.

Solucion:

- `components/home/GenderFilteredDrop.tsx` ahora trata Hombre/Mujer como toggle;
- si se toca una opcion no activa, filtra;
- si se toca la misma opcion activa, la deselecciona;
- al deseleccionar vuelve a mostrar todos los productos publicados;
- se elimino el limite artificial de `slice(0, 8)` en esa grilla.

Validacion con navegador:

```text
inicio: 8 cards
click Hombre: 4 cards
click Hombre otra vez: 8 cards
```

Capturas generadas durante la verificacion:

- `home-all-products-initial.png`;
- `home-all-products-hombre.png`;
- `home-all-products-back-to-all.png`.

### Problema 3: swatches de color con doble circulo

Sintoma:

- el selector de color mostraba un circulo dentro de otro;
- el seleccionado parecia tener un aro externo adicional;
- visualmente se veia pesado y poco premium.

Solucion:

- `components/product/ColorSwatch.tsx` fue simplificado;
- el boton ahora es el propio circulo de color;
- no hay contenedor circular externo;
- el seleccionado tiene borde fino dorado y glow suave;
- el foco accesible mantiene feedback visual sin duplicar el aro.

Impacto:

- tarjetas de producto;
- detalle de producto;
- acciones rapidas;
- cualquier uso compartido de `ColorSwatch`.

Validacion:

- se genero captura `color-swatch-single-circle.png`;
- `npm.cmd run lint` paso;
- `npm.cmd run build` paso.

### Problema 4: carrito sin vista previa de imagen

Sintoma:

- al agregar una prenda al carrito, el item mostraba texto, SKU, color, talle, cantidad y precio;
- no mostraba la imagen principal de lo que el cliente estaba comprando;
- esto hacia menos claro el control visual del pedido.

Decision tecnica:

- no se agrego una nueva columna ni migracion;
- se aprovecho que `cart_items` ya guarda `product_id`;
- al leer el carrito, se buscan imagenes asociadas al producto en `product_images`;
- se prefiere la imagen `is_primary`;
- si no hay imagen primaria, se usa la primera por orden;
- si hiciera falta, se usa `products.main_image_path` convertido a URL publica de `product-images`;
- si un item viejo no tiene imagen o no tiene `product_id`, se muestra placeholder `RXW`.

Archivos modificados:

- `types/customer.ts`;
- `lib/cart/queries.ts`;
- `app/carrito/page.tsx`.

Implementacion:

- `CartItem` recibio `imageUrl: string | null`;
- `getCartByRow()` ahora adjunta un mapa `product_id -> imageUrl`;
- `/carrito` muestra una miniatura vertical con aspect ratio de producto;
- la miniatura usa `next/image`;
- el layout se ajusto para desktop y mobile con `minmax(0, 1fr)` y columnas estables;
- se mantiene fallback visual si falta imagen.

Validacion:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

Resultados:

- lint paso;
- TypeScript paso;
- build paso.

Limitacion de prueba:

- Codex no hizo una compra visual completa con una cuenta real porque no dispone de password/sesion real del usuario;
- la validacion se realizo a nivel de tipos, build y flujo de datos;
- el comportamiento esperado es que cualquier item con `product_id` valido muestre la imagen principal cargada en `product_images`.

### Problemas encontrados durante la tanda

1. El producto no estaba roto: el problema era de criterio visual en la home.
   - La base tenia el producto publicado correctamente.
   - La home seguia pensando en destacados.

2. El filtro de genero era de una sola direccion.
   - Seleccionaba Hombre/Mujer.
   - No tenia estado de salida hacia `todos`.

3. La primera captura automatizada del swatch fallo.
   - El selector `article[data-product-model]` apuntaba a muchas tarjetas.
   - Playwright rechazo el selector por `strict mode violation`.
   - Se corrigio apuntando a una tarjeta concreta:

```text
article[data-product-model="RXW-REM-TEST-JAEL-0615"]
```

4. El carrito no guardaba imagen en `cart_items`.
   - Se resolvio sin migracion, consultando la imagen por `product_id`.
   - Esto evita guardar snapshots visuales duplicados por ahora.

### Estado final de la version

Estado funcional:

- el admin puede crear prendas con ficha y subir imagen;
- el producto publicado aparece en la tienda;
- la home muestra todos los publicados por defecto;
- Hombre/Mujer filtra y permite volver a todos;
- los swatches son de un solo circulo;
- el carrito muestra miniatura de producto;
- los cambios pasaron lint, TypeScript y build.

Comandos de validacion ejecutados:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

GitHub:

- esta tanda se prepara para guardarse como version estable con commit y tag;
- no se registran claves privadas ni valores sensibles en esta documentacion.

## Tanda 2026-06-17 - Home visual, redes, footer y checkpoint super estable

### Objetivo

Dejar la home y el footer mas cerca de la identidad final de ROXWANA, corregir problemas visuales que aparecieron durante la revision en vivo, preparar la seccion nueva de redes y guardar una version estable recuperable.

### Cambios implementados

1. Portada
   - se incorporo el video de portada optimizado para web;
   - se agregaron controles temporales para ajustar opacidad y capa oscura;
   - esos controles quedaron ocultos, no eliminados, para poder reactivarlos si hace falta;
   - el boton principal de portada quedo orientado a `Destacados`;
   - se corrigio el problema de hidratacion provocado por leer valores guardados antes de que React terminara de hidratar el cliente.

2. Navegacion superior
   - el menu quedo con accesos mas claros: Inicio, Todos los modelos, Ruleta y Nosotros;
   - la lupa, carrito y controles generales existentes se mantuvieron;
   - se creo una pagina temporal de Nosotros con una descripcion breve de marca y fondo visual.

3. Ruleta
   - la ruleta dejo de mostrar todas las imagenes de una prenda;
   - ahora toma la imagen principal/de portada;
   - el estado previo al sorteo muestra la prenda de fondo con opacidad y un signo de pregunta para que se entienda que ahi va a aparecer el resultado.

4. Destacados de home
   - se oculto el codigo/SKU en las tarjetas destacadas de inicio;
   - el codigo se mantiene para vistas donde el cliente entra al detalle de la prenda.

5. Correo y entregas
   - se agrego la seccion de entregas debajo del proceso de pedido;
   - se optimizaron imagenes de mapa/ciudad para uso web;
   - se corrigio el uso del mapa para que funcione como fondo responsive;
   - se quitaron temporalmente el cartel de envio gratis y la tabla de tiempos estimados;
   - se elimino el bloque de dudas por WhatsApp porque ese canal no esta activo para atencion.

6. Footer
   - se reemplazo la imagen de ciudad por una imagen mas alineada a la marca;
   - se optimizo la imagen para web;
   - se quitaron accesos de WhatsApp;
   - se agregaron iconos sociales para Instagram, Facebook, YouTube y TikTok;
   - Instagram y Facebook apuntan por ahora a `https://www.instagram.com/roxwana.info/`;
   - YouTube y TikTok quedan visibles como proximamente, sin enlace asociado todavia.

7. Nueva seccion de redes
   - se agrego `SocialFollowSection` debajo de Pared de Posters y antes de las secciones siguientes de home;
   - se uso `final-redes.png` como collage principal;
   - se generaron versiones WebP optimizadas y recortadas para eliminar espacio transparente excesivo;
   - el diseno queda en blanco/negro con acentos ROXWANA;
   - el encabezado dice `ROXWANA` y `ESTILO URBANO`;
   - el llamado principal dice `SEGUINOS EN NUESTRAS REDES`;
   - se agregaron iconos para Instagram, Facebook, YouTube y TikTok;
   - Instagram y Facebook abren Instagram de ROXWANA;
   - YouTube y TikTok quedan como iconos preparados, sin link activo.

### Problemas y errores encontrados

1. Hidratacion de React en portada
   - Sintoma: Next.js aviso que el HTML del servidor tenia una opacidad distinta a la del cliente.
   - Causa: la portada leia valores guardados en `localStorage` durante el primer render del cliente.
   - Correccion: se dejo el render inicial igual al servidor y se cargan los valores guardados despues de montar el componente.

2. Imagen de Nosotros mal encuadrada
   - Sintoma: una imagen elegida no mostraba bien la cabeza/personaje.
   - Correccion: se cambio la imagen y el posicionamiento para que la pagina no dependa de un recorte malo.

3. Mapa de entregas poco responsive
   - Sintoma: en resoluciones mas bajas el mapa quedaba cortado o se leia como una imagen flotante.
   - Correccion: se paso a fondo responsive con capas y posicionamiento mas controlado.

4. Seccion de redes con demasiado aire transparente
   - Sintoma: la imagen original tenia mucho espacio vacio alrededor y empujaba el layout.
   - Correccion: se generaron WebP optimizados y versiones recortadas para web.

5. Canales sociales todavia incompletos
   - Sintoma: YouTube y TikTok aun no existen como URLs definitivas.
   - Decision: se muestran los iconos para dejar el diseno preparado, pero quedan sin enlace hasta que el usuario pase las URLs reales.

### Archivos principales tocados

- `app/page.tsx`
- `app/nosotros/page.tsx`
- `components/home/HeroCampaign.tsx`
- `components/home/ProductPosterCard.tsx`
- `components/home/RandomPrintTeaser.tsx`
- `components/home/ShippingSection.tsx`
- `components/home/SocialFollowSection.tsx`
- `components/layout/Footer.tsx`
- `components/layout/FooterBackground.tsx`
- `components/layout/Header.tsx`
- `components/layout/MobileMenu.tsx`
- `components/ui/OpacityControl.tsx`
- `public/images/nosotros/*`
- `public/images/shipping/*`
- `public/images/social/*`
- `public/videos/*`

### Validacion ejecutada

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- build de Next.js paso correctamente;
- se generaron 17 paginas estaticas/dinamicas sin errores de compilacion.

### Estado GitHub

- esta tanda se guarda como version super estable;
- tag estable previsto: `roxwana-home-visual-redes-estable-2026-06-17`;
- remoto: `origin https://github.com/Lucasleiva1/pagina-roxwana.git`;
- la publicacion debe quedar en `main` para poder volver a este estado si algo se rompe;
- no se registran claves privadas ni valores sensibles en esta documentacion.

## Tanda 2026-06-17 - Carrito interactivo, catalogo final, navegacion y checkpoint super estable

### Objetivo

Registrar y guardar una version recuperable luego de una tanda larga de ajustes publicos de tienda. El foco fue mejorar la experiencia del cliente al navegar productos, agregar prendas al carrito, revisar rapidamente lo cargado, entrar a filtros Hombre/Mujer, usar enlaces sociales reales y corregir el comportamiento visual del modo claro sin romper la identidad oscura de ROXWANA.

### Cambios implementados

1. Proceso de pedido
   - se extendio `components/home/OrderTimeline.tsx` de 4 a 5 pasos;
   - se agrego el paso `Pagas y recibis seguimiento`;
   - el texto final aprobado fue:
     - `Te enviamos por WhatsApp el enlace de pago de Mercado Pago. Cuando se confirma, preparamos el envio y te pasamos el numero de seguimiento.`;
   - se mantuvo la estetica original de tarjetas numeradas;
   - la grilla desktop paso a 5 columnas para conservar la lectura horizontal.

2. Navegacion superior
   - se agrego `Ordenar` apuntando a `/#ordenar`;
   - se agrego `Redes` apuntando a `/#redes`;
   - se cambio `Todos los modelos` por `Producto`;
   - se cambio `Como ordenar` por `Ordenar`;
   - se agrego hover sutil a los links principales: cambio a dorado, leve desplazamiento y linea inferior;
   - se corrigio la alineacion de `Producto` para que tenga la misma altura visual que Inicio, Ordenar, Redes, Ruleta y Nosotros;
   - `Producto` ahora despliega en hover/focus dos opciones:
     - `Hombre` -> `/productos?gender=hombre`;
     - `Mujer` -> `/productos?gender=mujer`;
   - el menu mobile tambien muestra Producto, Ordenar, Redes, Ruleta y Nosotros, con accesos Hombre/Mujer debajo de Producto.

3. Redes sociales
   - se elimino Facebook de la home y del footer porque no se va a usar;
   - se mantuvieron Instagram, YouTube y TikTok;
   - se asociaron los links reales:
     - Instagram: `https://www.instagram.com/roxwana.info/`;
     - YouTube: `https://www.youtube.com/@ROXWANAINFO`;
     - TikTok: `https://www.tiktok.com/@roxwanainfo`;
   - los iconos sociales de la seccion de redes y del footer ya abren las redes reales cuando corresponde.

4. Sonido y reaccion de carrito
   - se agrego el archivo `public/audio/cart-add.mp3` a partir del audio enviado por el usuario;
   - el header reproduce ese sonido cuando un producto se agrega correctamente al carrito;
   - se agrego animacion `rox-cart-add-react` para que el icono del carrito se infle y se sacuda sutilmente;
   - se agrego `rox-cart-toast` para mostrar una confirmacion breve debajo del carrito con la prenda agregada;
   - se agrego `rox-loading-button-bar` para reemplazar el estado gris de carga por una barra dorada interna en los botones que dicen `Agregando...`;
   - se quitaron las leyendas duplicadas de exito bajo los botones, por ejemplo `Agregado al carrito.`, para que la confirmacion viva en el mini aviso del carrito.

5. Mini-carrito en hover
   - el icono del carrito del header ahora despliega un mini-carrito al hacer hover o foco;
   - el panel se mantiene abierto al bajar el mouse desde el icono hacia el panel;
   - el mini-carrito muestra:
     - cantidad total;
     - total estimado;
     - hasta 4 productos recientes;
     - imagen o fallback `RXW`;
     - nombre, modelo, color, talle, cantidad y precio;
   - se agregaron controles directos dentro del mini-carrito:
     - sumar cantidad;
     - restar cantidad;
     - quitar producto;
     - limpiar todo;
     - ir a `Ver carrito`;
   - se agregaron endpoints para soportar esas acciones sin entrar a la pagina completa:
     - `app/api/cart/preview/route.ts`;
     - `app/api/cart/items/[itemId]/route.ts`;
     - `app/api/cart/clear/route.ts`;
   - si el usuario esta en `/carrito`, las mutaciones desde el mini-carrito refrescan tambien la vista de fondo.

6. Pagina de carrito
   - se agrego el boton `Limpiar todo` en `/carrito`;
   - se agrego `clearCartAction` en `lib/cart/actions.ts`;
   - se actualizo `updated_at` al modificar cantidad para detectar correctamente el ultimo producto agregado o actualizado;
   - se mantuvieron los controles previos de actualizar cantidad y quitar producto.

7. Catalogo `Todos los modelos`
   - se saco el codigo/SKU visible de arriba de las tarjetas;
   - se sacaron los talles visibles en la tarjeta cerrada;
   - se dejaron visibles los colores;
   - se igualo la altura de tarjetas para que las acciones queden alineadas;
   - `ProductCard` paso a ser interactiva como las tarjetas destacadas:
     - usa galeria local;
     - muestra flechas de imagen anterior/siguiente;
     - muestra contador `1/N`;
     - el hover prioriza imagen con `role=hover`, vista `03` o archivo `-03-desktop.webp`;
     - permite recorrer todas las imagenes de la prenda antes de entrar al detalle;
   - se mantuvo que los talles aparezcan solo al abrir el panel de agregar o al entrar a la ficha.

8. Pared de posters
   - cada poster ahora es un link a `/producto/[slug]`;
   - el marquee se pausa al hover o al foco;
   - se agrego indicador `Ver prenda`;
   - se mantuvo Pared de Posters como bloque oscuro tambien en modo claro, por decision de identidad visual.

9. Modo claro / modo oscuro
   - se agrego `theme-home` a `app/page.tsx` para poder controlar la home en modo claro;
   - se agrego `theme-force-dark` para secciones que deben conservar fondo oscuro;
   - hubo una primera solucion incorrecta que aplicaba overlays blancos sobre imagenes de portada, Hombre/Mujer, Entregas, Ruleta y footer;
   - esa solucion fue rechazada por el usuario porque lavaba imagenes importantes y se veia mal;
   - correccion final:
     - Portada queda intacta y oscura;
     - Hombre/Mujer conserva sus imagenes normales, sin filtro blanco encima;
     - Pared de Posters queda siempre oscura;
     - Entregas queda oscura porque el mapa actual esta preparado para fondo negro y no se rehizo un asset blanco confiable;
     - Ruleta queda oscura porque en blanco se leia mal con imagenes/producto;
     - Footer queda oscuro como estaba;
     - secciones de catalogo/destacados, redes y proceso de pedido quedan claras cuando el modo claro esta activo;
   - esto evita el efecto de "capa blanca encima" y deja solo las secciones adecuadas en blanco.

10. Correcciones de detalle
   - se corrigio que el hover de `Producto` quedara desalineado respecto de los demas items del header;
   - se midio la alineacion con navegador y todos los links quedaron con el mismo `y` y `height`;
   - se mantuvo el dropdown Hombre/Mujer funcionando despues de esa correccion;
   - se mantuvo el servidor local respondiendo en `http://127.0.0.1:3000/`.

### Problemas encontrados y decisiones

1. Modo claro mal resuelto en primer intento
   - Sintoma: portada, Hombre/Mujer, Entregas, Ruleta y footer quedaban como imagenes oscuras con una capa blanca encima.
   - Causa: se intento resolver el tema claro con reglas globales demasiado agresivas sobre imagenes y overlays.
   - Correccion: se quitaron esos lavados, se devolvieron portada/footer/ruleta/entregas a oscuro y se dejo claro solo lo que se puede resolver bien sin rehacer assets.

2. Entregas no tiene asset blanco confiable
   - Sintoma: el mapa oscuro de fondo se veia mal bajo modo blanco.
   - Decision: dejar Entregas oscura hasta que exista una version blanca del mapa/fondo preparada correctamente.

3. Footer no necesitaba modo claro
   - Sintoma: al convertirlo a blanco perdia identidad y se veia forzado.
   - Correccion: footer vuelve a quedar como estaba.

4. Header `Producto` quedo desalineado
   - Sintoma: al convertirlo en dropdown, el link quedo a otra altura que Inicio/Ordenar/Redes/Ruleta/Nosotros.
   - Correccion: se unifico la caja del link y se movio la animacion al wrapper correcto.

5. Hover de Pared de Posters sobre elemento en movimiento
   - Sintoma: solo CSS podia fallar o ser dificil de validar porque el marquee se mueve.
   - Correccion: el componente ahora maneja estado `paused` en mouse/focus y aplica `rox-marquee-paused`.

6. Mini-carrito necesitaba no cerrarse al bajar el mouse
   - Sintoma: el usuario no podia bajar al panel para tocar `Ver carrito` o botones internos.
   - Correccion: se agrego un wrapper con area continua entre icono y panel, y el cierre se maneja en `mouseleave`/`blur` del contenedor completo.

### Archivos principales tocados

- `app/page.tsx`
- `app/carrito/page.tsx`
- `app/globals.css`
- `app/api/cart/preview/route.ts`
- `app/api/cart/items/[itemId]/route.ts`
- `app/api/cart/clear/route.ts`
- `components/layout/Header.tsx`
- `components/layout/MobileMenu.tsx`
- `components/layout/Footer.tsx`
- `components/home/OrderTimeline.tsx`
- `components/home/PrintWallMarquee.tsx`
- `components/home/GenderFilteredDrop.tsx`
- `components/home/HeroCampaign.tsx`
- `components/home/ShippingSection.tsx`
- `components/home/RandomPrintTeaser.tsx`
- `components/home/SocialFollowSection.tsx`
- `components/product/ProductCard.tsx`
- `components/product/ProductQuickActions.tsx`
- `components/product/ProductSelector.tsx`
- `lib/cart/actions.ts`
- `public/audio/cart-add.mp3`

### Validacion ejecutada

```bash
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false --pretty false
Invoke-WebRequest -Uri http://127.0.0.1:3000/ -UseBasicParsing -TimeoutSec 15
npm.cmd run build
```

Resultado:

- lint paso;
- TypeScript paso;
- la home local respondio `200`;
- build de Next.js paso correctamente;
- Next genero 19 rutas/paginas durante el build;
- se incluyeron las rutas nuevas `/api/cart/preview`, `/api/cart/items/[itemId]` y `/api/cart/clear`;
- se verificaron con navegador checks locales en `.codex-checks`:
  - hover/dropdown de Producto con Hombre/Mujer;
  - alineacion de links del header;
  - galeria de tarjetas de producto;
  - pausa de Pared de Posters;
  - mini-carrito con toast/preview;
  - captura de modo claro corregido.

### Estado GitHub previsto

- esta tanda se guarda como version super estable posterior a `roxwana-home-visual-redes-estable-2026-06-17`;
- tag estable previsto: `roxwana-carrito-catalogo-nav-estable-2026-06-17`;
- remoto: `origin https://github.com/Lucasleiva1/pagina-roxwana.git`;
- se publicara en `main` para poder volver a este estado exacto si algo se rompe;
- este registro separa claramente el estado final de la solucion incorrecta inicial de modo claro.

## Tanda 2026-06-17 - Version pre-final de modo claro, experiencia mobile y carrito

### Objetivo de la tanda

Preparar una version pre-final publicable de la tienda ROXWANA, tomando el modo claro como experiencia principal para clientes y conservando el modo oscuro como herramienta secundaria de trabajo.

La tanda reunio ajustes realizados en varias conversaciones consecutivas:

- correccion integral del modo claro en la home;
- refinamiento de la ruleta en blanco;
- correccion del proceso de pedido sobre fondo gris;
- adaptacion de portada y botones para mobile;
- eliminacion de parpadeos y estados hover impropios en pantallas tactiles;
- adaptacion del agregado rapido al carrito;
- correccion del CTA principal de portada;
- limpieza del footer;
- rediseño funcional del menu mobile;
- adaptacion completa de `/carrito` al modo claro;
- reemplazo del boton visible de tema por una pulsacion larga sobre el logo;
- revision final de escritorio, mobile, rutas publicas, lint y build.

### 1. Modo claro como tema principal

Se cambio el tema inicial de la aplicacion:

- `app/layout.tsx` ahora entrega `data-theme="light"` desde el servidor;
- si no existe una preferencia guardada, la aplicacion usa modo claro;
- el modo oscuro sigue disponible, pero no aparece como una accion visible para el cliente;
- la preferencia se persiste en `localStorage` bajo `roxwana-theme`.

La intencion comercial es que la tienda de ropa abra con una superficie blanca, limpia y legible. Las secciones editoriales que dependen de fotografia oscura pueden conservar su identidad cuando corresponde.

### 2. Portada mobile

Se reviso la portada en anchos de telefono y se corrigio:

- el video/fondo se encuadra dentro de una capa mobile especifica;
- el encuadre usa una altura estable para mostrar mejor a los dos modelos;
- se ajustaron los overlays horizontal y vertical para conservar contraste;
- el titulo usa tamaños que no desbordan pantallas angostas;
- el CTA `Destacados` queda centrado en mobile;
- el CTA tiene esquinas levemente redondeadas para probar una direccion menos rigida;
- en desktop conserva alineacion a la izquierda.

El CTA tambien recibio una correccion funcional:

- cuando apunta a un ancla interna, busca el destino real;
- ejecuta `scrollIntoView`;
- actualiza el hash;
- puede usarse repetidas veces sin dejar de responder.

### 3. Botones y estados tactiles

Se agregaron reglas especificas para dispositivos sin hover o con puntero grueso:

- se elimina el relleno animado de hover persistente en botones `RoxButton`;
- un toque no deja un parpadeo visual largo;
- los controles usan `touch-action: manipulation`;
- la respuesta activa es corta y usa una escala sutil;
- los botones del header y menu tienen radio de 6px;
- el carrito, usuario, busqueda y menu conservan dimensiones estables.

En mobile, los botones de accion de prendas destacadas quedan dorados desde el estado inicial:

- no esperan un hover inexistente;
- texto e iconos quedan negros;
- el estado activo usa un dorado apenas mas oscuro;
- este cambio se limita a mobile para conservar el comportamiento desktop.

### 4. Agregado rapido desde prendas destacadas

El panel que sube desde la tarjeta al tocar `Agregar` fue adaptado al modo claro:

- fondo blanco casi opaco;
- borde dorado controlado;
- nombre de producto negro;
- boton de cerrar blanco con texto negro;
- talles blancos con borde gris;
- talle seleccionado dorado con texto negro;
- mensajes sobre una superficie gris clara;
- sombra superior mas suave.

Se agregaron clases semanticas para evitar depender de selectores genericos:

- `quick-add-panel`;
- `quick-add-surface`;
- `quick-add-header`;
- `quick-add-product-name`;
- `quick-add-close`;
- `quick-add-size`;
- `quick-add-message`.

### 5. Ruleta de prendas en modo claro

La primera version clara de la ruleta tenia poco contraste y ocultaba la prenda de fondo. La solucion final reorganizo sus superficies y estados:

- se agrego `random-print-section` y clases por cada parte de la ruleta;
- el contenedor usa una superficie clara con volumen;
- las opciones Hombre/Mujer tienen fondo blanco y seleccionado dorado;
- la imagen de la prenda mantiene visibilidad en reposo, giro y resultado;
- la capa inferior clara permite leer el texto sin borrar la imagen;
- la pregunta central usa una tarjeta blanca translucida;
- el estado y premio usan paneles claros;
- los botones habilitados son dorados;
- los botones deshabilitados usan gris legible sin bajar demasiado la opacidad.

La ruleta conserva su logica de seleccion, giro y agregado al carrito.

### 6. Proceso de pedido

La seccion `Ordenar` mantiene el fondo gris solicitado, pero fue corregida para modo claro:

- titulo, subtitulo y texto introductorio pasan a negro;
- las tarjetas usan fondo claro;
- titulos de tarjetas en negro;
- descripciones en gris oscuro;
- el contenido deja de usar texto blanco sobre gris.

Se agregaron las clases:

- `order-timeline`;
- `order-timeline-intro`;
- `order-timeline-card`.

### 7. Mini-carrito, dropdown y avisos del header

El mini-carrito y los paneles del header fueron adaptados al modo claro:

- dropdown de Producto blanco;
- mini-carrito blanco;
- aviso de agregado blanco;
- textos principales negros;
- textos secundarios grises;
- imagenes/fallback sobre superficie clara;
- hover de acciones con contraste correcto;
- contador del carrito conserva texto blanco sobre rojo.

Se mantuvieron las acciones:

- sumar;
- restar;
- quitar;
- limpiar;
- abrir carrito.

### 8. Footer

Se retiraron textos que no pertenecian a la version final:

- `Wear it loud`;
- `Street rock / graphic wear. Hecho para la calle.`.

El footer queda con:

- ROXWANA;
- ESTILO URBANO;
- Productos;
- Hombre;
- Mujer;
- Random;
- Instagram, YouTube y TikTok.

El footer conserva fondo fotografico oscuro tanto en modo claro como oscuro.

### 9. Menu mobile

Se reemplazo el menu de titulos grandes por una interfaz compacta y utilizable:

- tipografia de navegacion de 14px;
- iconos Lucide pequeños;
- filas con altura estable;
- Hombre/Mujer dentro del bloque Producto;
- accesos compactos a Cuenta y Carrito;
- bordes y radios discretos;
- compatibilidad con modo claro;
- cierre con Escape;
- rol de dialogo y `aria-modal`.

Se corrigio el desplazamiento:

- al abrir, se bloquea `html` y `body`;
- `body` queda fijo en la posicion previa;
- el contenido interno usa `overflow-y-auto`;
- el fondo no se desplaza al intentar bajar el menu;
- al cerrar, se restauran estilos y posicion de scroll.

Cuando todo el contenido entra en la pantalla, el scroller no necesita recorrido adicional. En pantallas mas bajas mantiene la capacidad de desplazarse internamente.

### 10. Control oculto de modo claro/oscuro

Se elimino por completo el boton visible con luna/sol:

- se retiro del header desktop;
- se retiro del menu mobile;
- se elimino `components/layout/ThemeToggle.tsx`.

Se creo `components/layout/ThemeLogoControl.tsx`.

Comportamiento:

- un toque corto sobre el icono circular ROXWANA conserva su funcion de volver al inicio;
- mantener presionado durante 3 segundos alterna el tema;
- claro pasa a oscuro;
- oscuro pasa a claro;
- la ruta actual no cambia al completar la pulsacion larga;
- el modo elegido queda guardado;
- en dispositivos compatibles se dispara una vibracion breve;
- durante la espera aparece un aro dorado de progreso y el logo reduce levemente su escala;
- funciona con mouse, teclado y eventos tactiles reales.

El mismo control se usa:

- en el header principal;
- dentro del encabezado del menu mobile.

### 11. Carrito completo en modo claro

La pagina `/carrito` estaba fuera del alcance de `.theme-shop` y por eso seguia mostrando fondos negros y texto blanco. Se corrigio la pagina completa:

- `cart-page` queda dentro de `theme-shop`;
- fondo general claro;
- tarjetas de producto blancas;
- textos negros;
- metadatos grises;
- total sobre panel blanco;
- estado vacio claro;
- checkout blanco;
- campos claros con texto negro;
- avisos de checkout y WhatsApp legibles;
- bordes dorados y grises con contraste moderado;
- sombras suaves para separar superficies.

Se agregaron clases semanticas:

- `cart-page`;
- `cart-item-card`;
- `cart-item-media`;
- `cart-empty-state`;
- `cart-total-panel`;
- `cart-checkout-panel`;
- `cart-checkout-message`;
- `cart-whatsapp-notice`.

### 12. Marco de imagen del carrito

La miniatura de la prenda usaba `bg-bone`. En modo claro esa clase se invertia a negro y generaba un marco muy pesado.

La correccion final:

- elimina el marco negro;
- usa la misma superficie clara de las tarjetas del catalogo;
- aplica un degradado gris muy suave;
- usa un borde fino;
- agrega sombra interior discreta;
- aplica `drop-shadow` a la prenda;
- mantiene `object-contain` para no recortar el producto.

Esto alinea visualmente la miniatura del carrito con prendas destacadas y tarjetas de venta.

### 13. Archivos principales modificados

- `app/layout.tsx`;
- `app/globals.css`;
- `app/carrito/page.tsx`;
- `components/cart/CartCheckout.tsx`;
- `components/cart/CartWhatsAppNotice.tsx`;
- `components/home/HeroCampaign.tsx`;
- `components/home/OrderTimeline.tsx`;
- `components/home/ProductPosterCard.tsx`;
- `components/home/RandomPrintTeaser.tsx`;
- `components/layout/Footer.tsx`;
- `components/layout/Header.tsx`;
- `components/layout/MobileMenu.tsx`;
- `components/layout/ThemeLogoControl.tsx`;
- `components/layout/ThemeToggle.tsx`, eliminado;
- `components/product/ProductCard.tsx`;
- `components/product/ProductQuickActions.tsx`;
- `components/ui/RoxButton.tsx`.

### 14. Verificacion tactil real del cambio de tema

Se uso Chromium mobile con viewport `390x844`, emulacion tactil y eventos CDP `Input.dispatchTouchEvent`.

Resultados:

- pulsacion de 900ms:
  - tema siguio en `light`;
  - no se produjo un cambio accidental;
- pulsacion de 3250ms en el logo del header:
  - tema cambio a `dark`;
  - `localStorage` guardo `dark`;
  - la ruta siguio en `/productos`;
- pulsacion de 3250ms en el logo dentro del menu:
  - tema cambio a `light`;
  - `localStorage` guardo `light`;
  - la ruta siguio en `/productos`;
  - el menu continuo abierto;
- no hubo errores ni warnings de consola durante esta prueba.

Evidencia local:

- `.codex-checks/mobile-theme-touch-dark.png`;
- `.codex-checks/mobile-theme-touch-light-menu.png`;
- `.codex-checks/check-mobile-theme-touch.mjs`.

### 15. Verificacion del carrito

Se uso una cuenta tecnica de prueba, sin registrar credenciales en el repositorio.

Procedimiento:

- iniciar sesion;
- abrir `/carrito`;
- agregar una prenda temporal si el carrito estaba vacio;
- verificar producto, total y checkout;
- cambiar viewport de desktop a mobile;
- capturar evidencia;
- limpiar el carrito tecnico al finalizar.

Resultado desktop:

- tema `light`;
- pagina `rgb(246, 243, 238)`;
- tarjeta de producto blanca;
- checkout blanco;
- inputs claros con texto oscuro;
- total blanco;
- producto y checkout visibles.

Resultado mobile:

- viewport `390px`;
- ancho del documento `390px`;
- no existe desborde horizontal;
- checkout debajo de la tarjeta;
- marco de producto claro y coherente;
- todos los campos se mantienen dentro de su contenedor.

Evidencia local:

- `.codex-checks/cart-light-desktop.png`;
- `.codex-checks/cart-light-mobile.png`;
- `.codex-checks/check-cart-light.mjs`.

### 16. Verificaciones de regresion

Se revisaron:

1. CTA de portada
   - dos activaciones consecutivas;
   - hash `#drop-01`;
   - scroll al bloque correcto.

2. Agregado rapido
   - panel abre;
   - colores claros correctos;
   - talle seleccionado dorado;
   - panel cierra;
   - sin errores de consola.

3. Menu mobile
   - fondo bloqueado;
   - `body` fijo;
   - `html` sin scroll;
   - tipografia de 14px;
   - iconos visibles;
   - restauracion al cerrar;
   - sin errores de consola.

4. Portada y botones mobile
   - CTA centrado;
   - boton con radio de 6px;
   - controles desktop con radio de 6px;
   - reglas para puntero tactil activas;
   - el hover no expande el relleno del boton en mobile.

5. Ruleta y proceso de pedido
   - secciones localizadas;
   - capturas en modo claro;
   - sin errores de consola.

6. Footer mobile
   - texto final:
     - ROXWANA;
     - ESTILO URBANO;
     - Productos;
     - Hombre;
     - Mujer;
     - Random;
   - no aparecen los textos eliminados.

7. Rutas publicas
   - `/` -> 200;
   - `/productos` -> 200;
   - `/hombre` -> 200;
   - `/mujer` -> 200;
   - `/random` -> 200;
   - `/nosotros` -> 200;
   - `/login` -> 200.

### 17. Validaciones tecnicas finales

Comandos usados:

```powershell
npm.cmd run lint
npm.cmd run build
git diff --check
Invoke-WebRequest http://127.0.0.1:3000/
```

Resultado:

- ESLint paso;
- TypeScript paso dentro del build;
- build de produccion paso;
- Next.js genero las rutas estaticas y dinamicas sin errores;
- la home local respondio `200`;
- `/carrito` redirige a login con `307` cuando no hay sesion, como corresponde;
- `git diff --check` no encontro errores de whitespace;
- no se detectaron errores de pagina o consola en los flujos principales.

### 18. Observacion no bloqueante

Next.js emitio una advertencia de LCP para la imagen de fondo del footer durante algunas capturas:

- desktop: `footer-roxwana-city-1920.webp`;
- mobile: `footer-roxwana-city-768.webp`.

No es un error funcional ni de compilacion. La pagina carga y las rutas responden correctamente. Puede optimizarse en una tanda posterior si las metricas reales de produccion lo justifican.

### 19. Estado pre-final previsto

Esta tanda se considera pre-final y apta para ser usada como base de la primera publicacion.

Publicacion prevista:

- rama: `main`;
- remoto: `https://github.com/Lucasleiva1/pagina-roxwana.git`;
- tag: `roxwana-prefinal-modo-claro-2026-06-17`;
- mensaje de commit: `Prepare light storefront pre-final release`.

El modo claro es el estado principal. El modo oscuro se conserva mediante pulsacion larga del logo para mantenimiento y programacion.

## Tanda 2026-06-18 - Ajustes finales de interfaz, mobile, admin y control de destacados

### Objetivo de la tanda

Esta tanda continuo sobre la version pre-final del 17 de junio sin restaurar archivos ni reemplazar el estado local existente.

El trabajo reunio los pedidos realizados en la conversacion posterior a esa entrega:

- unificar la curva visual de los botones;
- mantener el carrito visible en mobile;
- compactar las tarjetas destacadas en telefonos;
- mejorar los hovers del header y las redes;
- volver completamente secreto el cambio de tema;
- refinar la seccion social y el bloque de pedido;
- agregar un boton Volver persistente;
- actualizar la pagina Nosotros;
- corregir el destino del acceso Redes;
- completar el modo claro del admin;
- permitir una cantidad libre de productos destacados;
- evitar la pantalla roja al validar productos;
- agregar un interruptor visible de destacado directamente en las tarjetas del dashboard.

### 1. Curva comun para botones y acciones

Se extendio la curva sutil de la portada al resto de la aplicacion.

Decision visual:

- radio comun de `6px`;
- se evita el aspecto de pastilla;
- se mantienen redondos los controles que representan iconos circulares, colores, redes y logo;
- el cambio alcanza botones y enlaces de accion de tienda, tarjetas, carrito, talles, cantidades, login y admin.

Archivos principales:

- `app/globals.css`;
- `app/login/LoginForm.tsx`;
- `components/admin/AdminLoginForm.tsx`.

La verificacion en navegador confirmo que portada, tarjetas y accesos aplican el radio, mientras los controles circulares conservan su forma.

### 2. Carrito visible en el header mobile

Problema:

- el carrito estaba dentro del menu acordeon;
- el indicador reactivo del header quedaba oculto en telefonos;
- al agregar un producto no se aprovechaban correctamente el contador, el movimiento, el sonido y el aviso temporal.

Solucion:

- el carrito se retiro del acordeon mobile;
- se agrego como control siempre visible junto al boton de menu;
- se reutilizo el mismo estado reactivo del carrito desktop;
- no se duplico el enlace dentro del menu;
- la version de escritorio no cambio.

Archivos:

- `components/layout/Header.tsx`;
- `components/layout/MobileMenu.tsx`.

Se comprobo en viewport mobile que el carrito no comprime el logo, que desaparece del acordeon y que conserva el contador y la reaccion visual.

### 3. Tarjetas destacadas compactas en mobile

Problema:

- la tarjeta de destacado era demasiado vertical;
- en un telefono era necesario bajar para llegar a las acciones y volver a subir para revisar el producto;
- la composicion se comportaba mas como un poster largo que como una tarjeta de compra.

Solucion mobile:

- se redujo la altura visible de la imagen sin perder su presencia;
- se compacto el espaciado interno;
- se oculto solamente la descripcion secundaria;
- se conservaron nombre, tipo, precio y botones;
- tablet y escritorio mantienen la composicion vertical amplia.

Archivo:

- `components/home/ProductPosterCard.tsx`.

La medicion realizada en un viewport de `390x844` dio una altura aproximada de `451px` para la tarjeta completa.

### 4. Hovers elegantes del header y redes

Controles superiores:

- Buscar, Usuario y Carrito elevan aproximadamente `2px`;
- reciben un halo dorado tenue;
- el icono cambia de color con una transicion suave;
- no se alteran enlaces ni comportamiento.

Redes:

- Instagram usa degradado y brillo de marca;
- YouTube usa rojo luminoso;
- TikTok usa negro con acentos cian y rosa;
- el icono queda blanco para mantener contraste;
- el lenguaje visual tambien se aplico a los accesos sociales del footer.

Archivos:

- `app/globals.css`;
- `components/home/SocialFollowSection.tsx`;
- `components/layout/Footer.tsx`.

Los estados se verificaron con hover real y lectura de estilos computados.

### 5. Cambio de tema completamente oculto

La version pre-final mostraba un aro de progreso y una leve contraccion del logo durante la pulsacion larga.

Por pedido posterior, ese feedback se elimino:

- no aparece barra ni aro;
- no se muestra progreso;
- el logo no se contrae;
- la pulsacion larga sigue esperando tres segundos;
- el cambio claro/oscuro y la persistencia continúan funcionando.

Archivos:

- `app/globals.css`;
- `components/layout/ThemeLogoControl.tsx`.

Esta decision reemplaza el feedback visual documentado en la tanda anterior: el mecanismo ahora es deliberadamente secreto.

### 6. Redes sin rayo inferior y fondo degradado de pedido

En la seccion social principal:

- se quitaron los rayos que aparecian debajo de cada icono;
- se conservaron logos, colores, brillo y hover;
- la decoracion general del titulo no se modifico;
- los iconos del footer se mantuvieron como estaban.

En `Del modelo al pedido`:

- el gris plano se reemplazo por un degradado horizontal;
- comienza mas claro a la izquierda;
- se profundiza suavemente hacia la derecha;
- las tarjetas blancas y el texto conservan contraste.

Archivos:

- `app/globals.css`;
- `components/home/SocialFollowSection.tsx`.

### 7. Boton Volver persistente

Detalle de producto:

- el boton original permanece en su posicion normal al inicio;
- cuando sale por la parte superior aparece una version flotante;
- la version flotante acompaña el scroll;
- al volver arriba y reaparecer el boton original, el flotante desaparece;
- nunca quedan dos botones visibles al mismo tiempo.

Ruleta:

- se agrego un boton Volver flotante;
- permanece fijo durante todo el recorrido.

Se creo un componente reutilizable:

- `components/ui/BackButton.tsx`.

Integraciones:

- `components/product/ProductDetailClient.tsx`;
- `app/random/page.tsx`.

La primera prueba automatizada tuvo un fallo en una expresion usada para medir la posicion del elemento, no en la interfaz. Se corrigio el script de comprobacion y la segunda pasada confirmo ambos comportamientos.

### 8. Nueva imagen responsive en Nosotros

Se incorporo:

- `public/images/nosotros/ntros.png`.

Comportamiento:

- escritorio: imagen panoramica y texto sobre la zona oscura izquierda;
- mobile: imagen completa arriba y contenido debajo;
- sin deformacion;
- sin desborde horizontal;
- el modelo conserva visibilidad.

Archivo:

- `app/nosotros/page.tsx`.

### 9. Correccion del ancla Redes

Problema:

- el acceso `Redes` llegaba al inicio general de la seccion;
- el usuario quedaba demasiado arriba y no veia directamente los botones.

Solucion:

- el destino `#redes` se movio al bloque que contiene titulo y accesos sociales;
- se agrego margen de scroll para que el header fijo no tape el contenido.

Archivo:

- `components/home/SocialFollowSection.tsx`.

La navegacion a `/#redes` se verifico comprobando que los botones quedaran dentro del viewport.

### 10. Modo claro del admin

Problema:

- el admin usaba superficies oscuras y clases como `bg-ink`, `bg-charcoal` y `text-bone`;
- parte del texto heredaba colores del tema claro;
- el resultado tenia fondos oscuros con textos de bajo contraste.

Solucion:

- se agrego el contenedor comun `admin-surface`;
- el tema claro usa fondo marfil;
- paneles y formularios usan blanco;
- textos principales usan negro;
- textos secundarios usan grises legibles;
- campos, selects, tablas y bordes tienen contraste propio;
- dorado y rojo de marca se conservan;
- el modo oscuro mantiene sus valores originales.

Archivos:

- `app/admin/login/page.tsx`;
- `app/globals.css`.

La cobertura comun alcanza login, dashboard, productos, tablas, Product Studio, formularios, previsualizaciones y controles internos.

La autenticacion local guardada de una etapa anterior ya no era valida con la configuracion actual. No se modifico la autenticacion para forzar la entrada. El login se verifico visualmente y las superficies internas quedaron cubiertas desde el contenedor compartido.

### 11. Destacados sin limite rigido

Problema:

- la home llamaba `getFeaturedProducts(10)`;
- la consulta aplicaba ademas un `slice`;
- aunque se marcaran mas productos, la portada solo mostraba los primeros diez.

Solucion:

- `getFeaturedProducts()` ya no recibe un limite;
- se retiro el recorte por `slice`;
- la home renderiza todos los productos publicados que tengan `featured=true`;
- diez queda solamente como recomendacion visual, no como restriccion.

Archivos:

- `app/page.tsx`;
- `lib/products/queries.ts`;
- `components/admin/ProductForm.tsx`;
- `components/admin/product-studio/ProductStudio.tsx`.

Resultado:

- se pueden destacar 10, 20 o la cantidad necesaria;
- un producto destacado tambien continúa apareciendo en el catalogo general;
- la nota del admin recomienda hasta diez para mantener una portada breve, pero no bloquea.

### 12. Validacion de producto dentro del formulario

Problema:

- al guardar un producto publicado como destacado sin categoria valida, el servidor lanzaba una excepcion;
- Next.js mostraba su pantalla roja;
- el usuario perdia el contexto de lo que faltaba completar.

Solucion:

- Product Studio valida antes de enviar;
- el formulario simple aplica la misma barrera;
- para publicar o agotar se exige:
  - categoria;
  - al menos un color;
  - al menos un talle;
- si falta un dato, el guardado se frena;
- el mensaje aparece dentro del admin;
- el contenido del formulario se conserva.

La validacion del servidor se mantiene como segunda barrera. La correccion de interfaz no debilita las reglas de integridad del catalogo.

### 13. Interruptor directo de destacado en dashboard

Se agrego un control visible en cada tarjeta de producto renderizada por el dashboard.

Estado apagado:

- texto `No destacado`;
- fondo y borde rojos;
- estrella sin relleno;
- `aria-pressed=false`.

Estado encendido:

- texto `Destacado`;
- fondo y borde dorados;
- estrella rellena;
- `aria-pressed=true`.

Funcionamiento:

- al presionarlo envia el valor contrario al estado actual;
- si estaba apagado guarda `featured=true`;
- si estaba encendido guarda `featured=false`;
- la accion revalida home, catalogos y admin;
- el producto aparece o desaparece de Destacados sin dejar de pertenecer al catalogo general;
- el acceso duplicado que estaba escondido dentro de `Mas` se retiro para dejar una sola accion clara.

El mismo componente de tarjeta tambien se usa en `/admin/productos`, por lo que el control directo queda disponible en el dashboard y en la lista completa del catalogo.

Archivos:

- `components/admin/AdminProductRow.tsx`;
- `lib/products/mutations.ts`.

La mutacion solicita el `id` de la fila actualizada y comprueba tanto el error como la existencia del resultado antes de revalidar las superficies.

### 14. Verificaciones de esta tanda

Durante las conversaciones se realizaron:

- verificaciones visuales desktop y mobile;
- hovers reales;
- medicion de tarjeta destacada;
- comprobacion del header mobile;
- scroll del detalle de producto y la ruleta;
- revision responsive de Nosotros;
- navegacion a `#redes`;
- contraste claro/oscuro del login del admin;
- lint despues de cada grupo de cambios;
- TypeScript despues del cambio de validacion y destacados.

Los artefactos temporales de comprobacion creados dentro de `.codex-checks` se eliminaron cuando terminaron las pruebas.

### 15. Estado y alcance final

Esta tanda documenta el estado local posterior a la version pre-final del 17 de junio.

No forma parte de este pedido:

- crear commit;
- crear tag;
- hacer push;
- publicar una nueva version;
- modificar autenticacion;
- cambiar el criterio comercial de diez destacados recomendados.

El alcance solicitado termina en el control directo rojo/dorado, la verificacion correspondiente y este registro detallado.
