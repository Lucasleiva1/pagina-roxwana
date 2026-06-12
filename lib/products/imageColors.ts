import type { Product, ProductImage } from "@/types/product";

const imageColorPrefixes: Record<string, string> = {
  neg: "NEG",
  bla: "BLA",
  gri: "GRI"
};

function imageFileName(url: string) {
  return (url.split(/[?#]/)[0].split("/").pop() || "").toLowerCase();
}

export function getImageColorCode(url: string) {
  const fileName = imageFileName(url);
  const prefix = fileName.split("-")[0];

  return imageColorPrefixes[prefix] || null;
}

export function getProductImageColorCode(image: ProductImage) {
  return image.colorCode || getImageColorCode(image.url);
}

export function getProductImages(product: Product) {
  if (product.images.length > 0) {
    return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return [{ url: product.image, alt: product.name, sortOrder: 0, isPrimary: true, colorCode: getImageColorCode(product.image) }];
}

export function getImagesForColor(product: Product, colorCode?: string) {
  const images = getProductImages(product);
  const hasColorImages = images.some((image) => getProductImageColorCode(image));

  if (!hasColorImages) {
    return images;
  }

  if (!colorCode) {
    return getRepresentativeImagesByColor(product);
  }

  const matches = images.filter((image) => getProductImageColorCode(image) === colorCode);
  const neutral = images.filter((image) => !getProductImageColorCode(image));

  return matches.length > 0 ? matches : neutral.length > 0 ? neutral : images;
}

export function getRepresentativeImagesByColor(product: Product) {
  const images = getProductImages(product);
  const hasColorImages = images.some((image) => getProductImageColorCode(image));

  if (!hasColorImages) {
    return images;
  }

  const representatives = product.colors
    .map((color) => images.find((image) => getProductImageColorCode(image) === color.code))
    .filter((image): image is ProductImage => Boolean(image));

  return representatives.length > 0 ? representatives : images;
}
