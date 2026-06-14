import type { Product } from "@/types/product";

export const roxColors = [
  { code: "NEG", label: "Negro", hex: "#080808" },
  { code: "BLA", label: "Blanco / Hueso", hex: "#F6F3EE" }
] as const;

export const roxGrayColor = { code: "GRI", label: "Gris", hex: "#B8B8B2" } as const;
export const roxLisaColors = [...roxColors, roxGrayColor] as const;

export const roxSizes = ["S", "M", "L", "XL", "XXL"] as const;

const remeraLisaImageSets = [
  { code: "NEG", prefix: "neg", label: "negra" },
  { code: "BLA", prefix: "bla", label: "blanca" },
  { code: "GRI", prefix: "gri", label: "gris" }
] as const;

const remeraLisaMujerImageSets = [
  { code: "BLA", prefix: "bla", label: "blanca" },
  { code: "NEG", prefix: "neg", label: "negra" },
  { code: "GRI", prefix: "gri", label: "gris" }
] as const;

function buildLisaImages(folder: string, sets: readonly { code: string; prefix: string; label: string }[], primaryCode: string) {
  return sets.flatMap((set, colorIndex) =>
    Array.from({ length: 6 }, (_, index) => {
      const imageNumber = index + 1;
      const paddedNumber = imageNumber.toString().padStart(2, "0");

      return {
        url: `/images/products/${folder}/${set.prefix}-${paddedNumber}-desktop.webp`,
        alt: `Remera Lisa ${set.label} vista ${imageNumber}`,
        sortOrder: colorIndex * 10 + imageNumber,
        isPrimary: set.code === primaryCode && imageNumber === 1,
        colorCode: set.code
      };
    })
  );
}

const remeraLisaImages = buildLisaImages("remera-lisa-fb", remeraLisaImageSets, "NEG");
const remeraLisaMujerImages = buildLisaImages("remera-lisa-mujer-fb", remeraLisaMujerImageSets, "BLA");
const remeraLisaHombre002Images = buildLisaImages("remera-lisa-hombre-002-fb", remeraLisaMujerImageSets, "BLA");

export const mockProducts: Product[] = [
  {
    id: "mock-street-004",
    modelCode: "RXW-REM-STREET004",
    model: "STREET004",
    name: "Remera Street 004",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "mujer",
    status: "published",
    featured: false,
    price: 29000,
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-04.png",
    images: [{ url: "/images/products/product-04.png", alt: "Remera Street 004", sortOrder: 0, isPrimary: true }],
    slug: "remera-street-004",
    story: "Pared de posters, textura rota y presencia de marca para uso diario.",
    description: "Pared de posters, textura rota y presencia de marca para uso diario."
  },
  {
    id: "mock-skull-005",
    modelCode: "RXW-REM-SKULL005",
    model: "SKULL005",
    name: "Remera Skull 005",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "unisex",
    status: "published",
    featured: false,
    price: 29000,
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-05.png",
    images: [{ url: "/images/products/product-05.png", alt: "Remera Skull 005", sortOrder: 0, isPrimary: true }],
    slug: "remera-skull-005",
    story: "Drop oscuro con filo rockero, rojo medido y detalle dorado.",
    description: "Drop oscuro con filo rockero, rojo medido y detalle dorado."
  },
  {
    id: "mock-heavy-001",
    modelCode: "RXW-BUZ-HEAVY001",
    model: "HEAVY001",
    name: "Buzo Heavy 001",
    garmentType: "BUZ",
    garmentTypeId: "mock-buz",
    garmentLabel: "Buzo",
    gender: "unisex",
    status: "published",
    featured: false,
    price: 29000,
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-06.png",
    images: [{ url: "/images/products/product-06.png", alt: "Buzo Heavy 001", sortOrder: 0, isPrimary: true }],
    slug: "buzo-heavy-001",
    story: "Buzo pesado con identidad ROXWANA, pensado para la calle fria.",
    description: "Buzo pesado con identidad ROXWANA, pensado para la calle fria."
  },
  {
    id: "mock-boyband-001",
    modelCode: "RXW-REM-NEG001",
    model: "NEG001",
    name: "Remera Boy Band Style 001",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "published",
    featured: true,
    price: 29000,
    colors: [{ code: "NEG", label: "Negro", hex: "#080808" }],
    sizes: [...roxSizes],
    image: "/images/products/product-boyband-001-shirt.png",
    images: [
      { url: "/images/products/product-boyband-001-shirt.png", alt: "Remera Boy Band Style 001 vista producto", sortOrder: 1, isPrimary: true },
      { url: "/images/products/product-boyband-001-street.png", alt: "Remera Boy Band Style 001 en pared urbana", sortOrder: 2, isPrimary: false },
      { url: "/images/products/product-boyband-001-front.png", alt: "Remera Boy Band Style 001 vista frontal hombre", sortOrder: 3, isPrimary: false },
      { url: "/images/products/product-boyband-001-back.png", alt: "Remera Boy Band Style 001 vista espalda hombre", sortOrder: 4, isPrimary: false },
      { url: "/images/products/product-boyband-001-side.png", alt: "Remera Boy Band Style 001 vista lateral hombre", sortOrder: 5, isPrimary: false }
    ],
    slug: "remera-boy-band-style-001",
    story: "Remera negra de hombre con grafica ROXWANA Boy Band Style, corte urbano y presencia fuerte.",
    description: "Remera negra de hombre con grafica ROXWANA Boy Band Style, pensada para una primera prueba real de producto, color negro y galeria completa."
  },
  {
    id: "mock-flame-fearless-001",
    modelCode: "RXW-REM-FLM001",
    model: "FLM001",
    name: "Remera Flame Fearless 001",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "mujer",
    status: "published",
    featured: true,
    price: 29000,
    colors: [{ code: "BLA", label: "Blanco / Hueso", hex: "#F6F3EE" }],
    sizes: [...roxSizes],
    image: "/images/products/product-flame-fearless-001-shirt-desktop.webp",
    images: [
      { url: "/images/products/product-flame-fearless-001-shirt-desktop.webp", alt: "Remera Flame Fearless 001 vista producto", sortOrder: 1, isPrimary: true },
      { url: "/images/products/product-flame-fearless-001-front-model-desktop.webp", alt: "Remera Flame Fearless 001 vista frontal con modelo", sortOrder: 2, isPrimary: false },
      { url: "/images/products/product-flame-fearless-001-back-model-desktop.webp", alt: "Remera Flame Fearless 001 vista espalda con modelo", sortOrder: 3, isPrimary: false }
    ],
    slug: "remera-flame-fearless-001",
    story: "Remera blanca de mujer con grafica ROXWANA flame rosa, calce al cuerpo y actitud fearless.",
    description: "Remera blanca de mujer con grafica ROXWANA flame rosa y negro, galeria con vista producto, frente con modelo y espalda."
  },
  {
    id: "mock-remera-lisa-mujer-001",
    modelCode: "RXW-REM-LISAM001",
    model: "LISAM001",
    name: "Remera Lisa Mujer",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "mujer",
    status: "published",
    featured: true,
    price: 19000,
    colors: [roxColors[1], roxColors[0], roxGrayColor],
    sizes: [...roxSizes],
    image: "/images/products/remera-lisa-mujer-fb/bla-01-desktop.webp",
    images: remeraLisaMujerImages,
    slug: "remera-lisa-mujer-001",
    story: "Remera lisa ROXWANA para mujer, con calce urbano y blanco protagonista en la galeria.",
    description: "Remera lisa ROXWANA para mujer, disponible en blanco, negro y gris con vista real por color."
  },
  {
    id: "mock-remera-lisa-hombre-002",
    modelCode: "RXW-REM-LISAH002",
    model: "LISAH002",
    name: "Remera Lisa Hombre 002",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "published",
    featured: true,
    price: 19000,
    colors: [roxColors[1], roxColors[0], roxGrayColor],
    sizes: [...roxSizes],
    image: "/images/products/remera-lisa-hombre-002-fb/bla-01-desktop.webp",
    images: remeraLisaHombre002Images,
    slug: "remera-lisa-hombre-002",
    story: "Remera lisa ROXWANA para hombre, con blanco protagonista y galeria real por color.",
    description: "Remera lisa ROXWANA para hombre, disponible en blanco, negro y gris con vistas de producto y modelo."
  },
  {
    id: "mock-street-rock-001",
    modelCode: "RXW-REM-SRK001",
    model: "SRK001",
    name: "Remera Street Rock 001",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "published",
    featured: true,
    price: 29000,
    colors: [{ code: "NEG", label: "Negro", hex: "#080808" }],
    sizes: [...roxSizes],
    image: "/images/products/product-street-rock-001-shirt-desktop.webp",
    images: [
      { url: "/images/products/product-street-rock-001-shirt-desktop.webp", alt: "Remera Street Rock 001 vista producto", sortOrder: 1, isPrimary: true },
      { url: "/images/products/product-street-rock-001-street-desktop.webp", alt: "Remera Street Rock 001 en calle urbana", sortOrder: 2, isPrimary: false },
      { url: "/images/products/product-street-rock-001-front-model-desktop.webp", alt: "Remera Street Rock 001 vista frontal con modelo", sortOrder: 3, isPrimary: false },
      { url: "/images/products/product-street-rock-001-back-model-desktop.webp", alt: "Remera Street Rock 001 vista espalda con modelo", sortOrder: 4, isPrimary: false },
      { url: "/images/products/product-street-rock-001-side-model-desktop.webp", alt: "Remera Street Rock 001 vista lateral con modelo", sortOrder: 5, isPrimary: false }
    ],
    slug: "remera-street-rock-001",
    story: "Remera negra de hombre con grafica ROXWANA Street Rock, energia urbana y presencia de escenario.",
    description: "Remera negra de hombre con grafica ROXWANA Street Rock, galeria completa con producto, calle, frente, espalda y lateral."
  },
  {
    id: "mock-remera-lisa-001",
    modelCode: "RXW-REM-LISA001",
    model: "LISA001",
    name: "Remera Lisa",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "published",
    featured: true,
    price: 19000,
    colors: [...roxLisaColors],
    sizes: [...roxSizes],
    image: "/images/products/remera-lisa-fb/neg-01-desktop.webp",
    images: remeraLisaImages,
    slug: "remera-lisa-001",
    story: "Remera lisa ROXWANA de calce urbano, disponible en negro, blanco y gris con vista real por color.",
    description: "Remera lisa ROXWANA para hombre, pensada para elegir color con referencia visual clara antes de sumar al carrito."
  }
];
