# Patron de tarjetas de venta de productos

Este documento fija el comportamiento base para las tarjetas de venta de productos de ROXWANA. La referencia actual es `components/home/ProductPosterCard.tsx`.

## Comportamiento obligatorio

- La primera imagen visible de cada tarjeta debe ser la imagen inicial del producto.
- Al entrar con hover sobre el area de imagen, la tarjeta puede mostrar una imagen alternativa de preview, por ejemplo una foto con modelo.
- Si el usuario toca las flechas mientras sigue dentro de la tarjeta, el hover debe apagarse para que se vea la galeria real.
- Las flechas deben cambiar la imagen visible y el contador al mismo tiempo.
- El usuario debe poder recorrer cualquier imagen de la galeria sin tener que sacar el mouse.
- Al salir del area de imagen, la tarjeta debe resetearse a la imagen inicial y al contador `1/n`.
- Al volver a entrar con hover, el preview debe funcionar otra vez desde el principio.

## Estado interno recomendado

Usar dos estados separados:

- `activeImage`: indice real de la imagen seleccionada en la galeria.
- `hoveringImage`: controla solo si el preview de hover esta activo.

Cuando se navega con flechas:

```tsx
setHoveringImage(false);
setActiveImage((value) => (value + 1) % gallery.images.length);
```

Cuando el mouse sale del area de imagen:

```tsx
setHoveringImage(false);
setActiveImage(0);
```

## Regla para nuevas prendas

Todas las tarjetas de venta de productos deben seguir este patron. Si se crean nuevas tarjetas o variantes, buscar primero `ProductPosterCard` y mantener esta misma mecanica antes de cambiar el diseno visual.
