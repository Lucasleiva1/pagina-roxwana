# ROXWANA Product Sheet v1

Esta es la estructura canonica que Product Studio puede leer sin IA ni servicios externos.

## Formato Recomendado

```txt
ROXWANA Product Sheet v1
codigo: RXW-REM-STREET-001
nombre: Remera Street Rock 001
slug: remera-street-rock-001
prenda: REM
genero: unisex
estado: draft
precio: 29000
precio_anterior: 35000
categoria: remeras
drop: drop-01
destacado: false
orden: 10
colores: NEG, BLA, GRI
talles: S, M, L, XL
descripcion_corta: Algodon pesado con grafica frontal.
descripcion_larga: |
  Remera urbana de alto impacto.
  Calce comodo, estampa protagonista y energia callejera.
whatsapp: Quiero consultar por la Remera Street Rock 001.
variantes:
  RXW-REM-STREET-001-S-NEG | S | NEG | 4
  RXW-REM-STREET-001-M-NEG | M | NEG | 6
imagenes:
  neg-01-desktop.webp = portada
  neg-01-mobile.webp = portada
  neg-02-desktop.webp = espalda
  neg-03-desktop.webp = hover
  neg-04-desktop.webp = costado
  neg-05-desktop.webp = modelo
  neg-06-desktop.webp = detalle
```

## Imagenes

Formato preferido:

```txt
color-numero-device.ext
```

Ejemplos:

```txt
neg-01-desktop.webp
neg-01-mobile.webp
neg-02-desktop.webp
neg-03-desktop.webp
neg-04-desktop.webp
neg-05-desktop.webp
neg-06-desktop.webp
```

Reglas:

- `01` es portada.
- `02` es espalda de la remera.
- `03` es hover.
- `04` es costado, si existe.
- `05` es espalda con modelo.
- `06` y `07` son detalle.
- Si falta una vista intermedia, por ejemplo `04`, el orden se mantiene por numero.
- `desktop`, `mobile` y `base` se guardan como variante responsive.
- `NEG`, `BLA`, `GRI` se guardan como color detectado.
- Si el nombre es ambiguo, el numero manda primero; Product Studio permite cambiar el tipo manualmente antes de guardar.

## Archivos Soportados

Product Studio acepta pegar texto o subir:

- `.txt`
- `.md`
- `.json`
- `.csv`
- PDF textual

En JSON y CSV se usan los mismos nombres de campos o sus alias: `codigo`, `nombre`, `precio`, `categoria`, `colores`, `talles`, `variantes`, `imagenes`.

## Guardado

La pantalla convierte esta ficha a los campos reales del admin:

- producto principal,
- colores,
- talles,
- variantes de stock,
- imagenes con rol, numero, color, device y nombre original.

No hay inteligencia artificial en este flujo. Solo parser, alias, reglas de archivo y validaciones.
