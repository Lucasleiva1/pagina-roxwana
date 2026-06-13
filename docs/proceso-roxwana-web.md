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
