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

No se implemento todavia:

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
