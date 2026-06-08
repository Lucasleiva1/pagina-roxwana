import type { Product } from "@/types/product";

export const roxColors = [
  { code: "NEG", label: "Negro", hex: "#080808" },
  { code: "BLA", label: "Blanco / Hueso", hex: "#F6F3EE" }
] as const;

export const roxSizes = ["S", "M", "L", "XL", "XXL"] as const;

export const mockProducts: Product[] = [
  {
    modelCode: "RXW-REM-ROCK001",
    model: "ROCK001",
    name: "Remera Rock 001",
    garmentType: "REM",
    garmentLabel: "Remera",
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-01.png",
    slug: "remera-rock-001",
    story: "Logo circular ROXWANA con energia de escenario, calle mojada y noche urbana."
  },
  {
    modelCode: "RXW-REM-DRAGON002",
    model: "DRAGON002",
    name: "Remera Dragon 002",
    garmentType: "REM",
    garmentLabel: "Remera",
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-02.png",
    slug: "remera-dragon-002",
    story: "Grafica pesada para drops de alto contraste, pensada para vestir fuerte."
  },
  {
    modelCode: "RXW-REM-MOTO003",
    model: "MOTO003",
    name: "Remera Moto 003",
    garmentType: "REM",
    garmentLabel: "Remera",
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-03.png",
    slug: "remera-moto-003",
    story: "Actitud de ruta, metal y asfalto en una composicion grafica premium."
  },
  {
    modelCode: "RXW-REM-STREET004",
    model: "STREET004",
    name: "Remera Street 004",
    garmentType: "REM",
    garmentLabel: "Remera",
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-04.png",
    slug: "remera-street-004",
    story: "Pared de posters, textura rota y presencia de marca para uso diario."
  },
  {
    modelCode: "RXW-REM-SKULL005",
    model: "SKULL005",
    name: "Remera Skull 005",
    garmentType: "REM",
    garmentLabel: "Remera",
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-05.png",
    slug: "remera-skull-005",
    story: "Drop oscuro con filo rockero, rojo medido y detalle dorado."
  },
  {
    modelCode: "RXW-BUZ-HEAVY001",
    model: "HEAVY001",
    name: "Buzo Heavy 001",
    garmentType: "BUZ",
    garmentLabel: "Buzo",
    colors: [...roxColors],
    sizes: [...roxSizes],
    image: "/images/products/product-06.png",
    slug: "buzo-heavy-001",
    story: "Buzo pesado con identidad ROXWANA, pensado para la calle fria."
  }
];
