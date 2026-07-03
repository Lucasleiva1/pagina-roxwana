import type { ProductStudioDraft, ProductStudioOptions, StudioNotice } from "@/lib/product-studio/schema";

function hasPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
}

export function validateProductStudioDraft(draft: ProductStudioDraft, options: ProductStudioOptions, uploadedImagesCount: number, existingImagesCount: number): StudioNotice[] {
  const notices: StudioNotice[] = [];

  if (!draft.modelCode.trim()) {
    notices.push({ level: "error", field: "modelCode", message: "Falta codigo de modelo." });
  }

  if (!draft.name.trim()) {
    notices.push({ level: "error", field: "name", message: "Falta nombre del producto." });
  }

  if (!draft.slug.trim()) {
    notices.push({ level: "error", field: "slug", message: "Falta slug publico." });
  }

  if (!draft.categoryId || !options.categories.some((item) => item.id === draft.categoryId)) {
    notices.push({ level: "error", field: "categoryId", message: "Falta elegir categoria valida." });
  }

  if (draft.categoryId && (!draft.garmentTypeId || !options.garmentTypes.some((item) => item.id === draft.garmentTypeId))) {
    notices.push({ level: "error", field: "categoryId", message: "La categoria elegida no esta configurada para guardar productos." });
  }

  if (!hasPositiveNumber(draft.price)) {
    notices.push({ level: "error", field: "price", message: "El precio debe ser mayor a cero." });
  }

  if (draft.status !== "draft" && !draft.categoryId) {
    notices.push({ level: "error", field: "categoryId", message: "Para publicar o agotar, falta categoria." });
  }

  if (draft.status !== "draft" && draft.colorIds.length === 0) {
    notices.push({ level: "error", field: "colorIds", message: "Para publicar o agotar, falta al menos un color." });
  }

  if (draft.status !== "draft" && draft.sizeIds.length === 0) {
    notices.push({ level: "error", field: "sizeIds", message: "Para publicar o agotar, falta al menos un talle." });
  }

  if (!draft.descriptionShort.trim()) {
    notices.push({ level: "warning", field: "descriptionShort", message: "Conviene cargar una descripcion corta para cards y consultas." });
  }

  if (draft.colorIds.length === 0) {
    notices.push({ level: "warning", field: "colorIds", message: "Sin colores, el selector publico queda pobre." });
  }

  if (draft.sizeIds.length === 0) {
    notices.push({ level: "warning", field: "sizeIds", message: "Sin talles, no queda claro el stock disponible." });
  }

  if (draft.variants.length === 0) {
    notices.push({ level: "warning", field: "variants", message: "No hay variantes de stock cargadas." });
  }

  if (uploadedImagesCount + existingImagesCount === 0) {
    notices.push({ level: "warning", field: "images", message: "No hay imagenes; el producto usara fallback visual." });
  }

  return notices;
}
