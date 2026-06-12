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

const remeraLisaImages = remeraLisaImageSets.flatMap((set, colorIndex) =>
  Array.from({ length: 6 }, (_, index) => {
    const imageNumber = index + 1;
    const paddedNumber = imageNumber.toString().padStart(2, "0");

    return {
      url: `/images/products/remera-lisa-fb/${set.prefix}-${paddedNumber}-desktop.webp`,
      alt: `Remera Lisa ${set.label} vista ${imageNumber}`,
      sortOrder: colorIndex * 10 + imageNumber,
      isPrimary: set.code === "NEG" && imageNumber === 1,
      colorCode: set.code
    };
  })
);

export const mockProducts: Product[] = [
  {
    id: "mock-rock-001",
    modelCode: "RXW-REM-ROCK001",
    model: "ROCK001",
    name: "Remera Rock 001",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "unisex",
    status: "active",
    featured: true,
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-01.png",
    images: [{ url: "/images/products/product-01.png", alt: "Remera Rock 001", sortOrder: 0, isPrimary: true }],
    slug: "remera-rock-001",
    story: "Logo circular ROXWANA con energia de escenario, calle mojada y noche urbana.",
    description: "Logo circular ROXWANA con energia de escenario, calle mojada y noche urbana."
  },
  {
    id: "mock-dragon-002",
    modelCode: "RXW-REM-DRAGON002",
    model: "DRAGON002",
    name: "Remera Dragon 002",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "active",
    featured: true,
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-02.png",
    images: [{ url: "/images/products/product-02.png", alt: "Remera Dragon 002", sortOrder: 0, isPrimary: true }],
    slug: "remera-dragon-002",
    story: "Grafica pesada para drops de alto contraste, pensada para vestir fuerte.",
    description: "Grafica pesada para drops de alto contraste, pensada para vestir fuerte."
  },
  {
    id: "mock-moto-003",
    modelCode: "RXW-REM-MOTO003",
    model: "MOTO003",
    name: "Remera Moto 003",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "active",
    featured: true,
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-03.png",
    images: [{ url: "/images/products/product-03.png", alt: "Remera Moto 003", sortOrder: 0, isPrimary: true }],
    slug: "remera-moto-003",
    story: "Actitud de ruta, metal y asfalto en una composicion grafica premium.",
    description: "Actitud de ruta, metal y asfalto en una composicion grafica premium."
  },
  {
    id: "mock-street-004",
    modelCode: "RXW-REM-STREET004",
    model: "STREET004",
    name: "Remera Street 004",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "mujer",
    status: "active",
    featured: false,
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
    status: "active",
    featured: false,
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
    status: "active",
    featured: false,
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
    status: "active",
    featured: true,
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
    status: "active",
    featured: true,
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
    id: "mock-street-rock-001",
    modelCode: "RXW-REM-SRK001",
    model: "SRK001",
    name: "Remera Street Rock 001",
    garmentType: "REM",
    garmentTypeId: "mock-rem",
    garmentLabel: "Remera",
    gender: "hombre",
    status: "active",
    featured: true,
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
    status: "active",
    featured: true,
    colors: [...roxLisaColors],
    sizes: [...roxSizes],
    image: "/images/products/remera-lisa-fb/neg-01-desktop.webp",
    images: remeraLisaImages,
    slug: "remera-lisa-001",
    story: "Remera lisa ROXWANA de calce urbano, disponible en negro, blanco y gris con vista real por color.",
    description: "Remera lisa ROXWANA para hombre, pensada para elegir color con referencia visual clara antes de sumar al carrito."
  }
];
