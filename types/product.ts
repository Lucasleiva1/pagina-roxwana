export type ProductColor = {
  code: "NEG" | "BLA";
  label: string;
  hex: string;
};

export type ProductSize = "S" | "M" | "L" | "XL" | "XXL";

export type Product = {
  modelCode: string;
  model: string;
  name: string;
  garmentType: "REM" | "BUZ";
  garmentLabel: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  image: string;
  slug: string;
  story: string;
};
