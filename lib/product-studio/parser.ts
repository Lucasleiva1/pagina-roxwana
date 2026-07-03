import type { ProductGender, ProductStatus } from "@/types/product";
import { buildStudioSlug, expectedImageFromFileName, findOptionByCodeNameOrId, findProductOptionByKind, slugifyStudioValue, textToVariants, type ProductStudioDraft, type ProductStudioOptions, type StudioNotice } from "@/lib/product-studio/schema";
import { normalizeColorCode } from "@/lib/product-studio/imageRules";

export type ProductStudioImportFormat = "text" | "markdown" | "json" | "csv" | "pdf";

export type ProductStudioImportResult = {
  draft: Partial<ProductStudioDraft>;
  notices: StudioNotice[];
  format: ProductStudioImportFormat;
};

type ProductStudioImportField = keyof ProductStudioDraft | "drop" | "description" | "images" | "image" | "variants";

const FIELD_ALIASES: Record<string, ProductStudioImportField> = {
  codigo: "modelCode",
  codigomodelo: "modelCode",
  modelocode: "modelCode",
  modelcode: "modelCode",
  modelo: "modelCode",
  codigoproducto: "modelCode",
  productcode: "modelCode",
  productid: "modelCode",
  sku: "modelCode",
  nombre: "name",
  name: "name",
  titulo: "name",
  title: "name",
  slug: "slug",
  prenda: "garmentTypeCode",
  garment: "garmentTypeCode",
  garmenttype: "garmentTypeCode",
  tipoprenda: "garmentTypeCode",
  tipodeprenda: "garmentTypeCode",
  tipoproducto: "garmentTypeCode",
  tipodeproducto: "garmentTypeCode",
  genero: "gender",
  gender: "gender",
  estado: "status",
  status: "status",
  precio: "price",
  price: "price",
  precioanterior: "compareAtPrice",
  compareatprice: "compareAtPrice",
  oldprice: "compareAtPrice",
  categoria: "categoryCode",
  category: "categoryCode",
  coleccion: "collectionCode",
  collection: "collectionCode",
  drop: "drop",
  destacado: "featured",
  featured: "featured",
  orden: "sortOrder",
  sortorder: "sortOrder",
  descripcioncorta: "descriptionShort",
  descripcioncortaproducto: "descriptionShort",
  descripcioncortadelproducto: "descriptionShort",
  descripcionbreve: "descriptionShort",
  descripcionbrevedelproducto: "descriptionShort",
  descriptionshort: "descriptionShort",
  shortdescription: "descriptionShort",
  shortdesc: "descriptionShort",
  summary: "descriptionShort",
  resumen: "descriptionShort",
  bajada: "descriptionShort",
  descripcionlarga: "descriptionLong",
  descripcionlargaproducto: "descriptionLong",
  descripcionlargadelproducto: "descriptionLong",
  descripciondetallada: "descriptionLong",
  descripcionextendida: "descriptionLong",
  descriptionlong: "descriptionLong",
  longdescription: "descriptionLong",
  longdesc: "descriptionLong",
  fulldescription: "descriptionLong",
  detalle: "descriptionLong",
  detalles: "descriptionLong",
  story: "descriptionLong",
  descripcion: "description",
  description: "description",
  whatsapp: "whatsappMessage",
  textowhatsapp: "whatsappMessage",
  mensajewhatsapp: "whatsappMessage",
  whatsapptext: "whatsappMessage",
  whatsappcopy: "whatsappMessage",
  whatsappmessage: "whatsappMessage",
  colores: "colorCodes",
  colors: "colorCodes",
  talles: "sizeCodes",
  sizes: "sizeCodes",
  medidas: "sizeCodes",
  variantes: "variants",
  variants: "variants",
  stock: "variants",
  imagenes: "images",
  images: "images",
  imagen: "image",
  image: "image"
};

const VALID_GENDERS: ProductGender[] = ["hombre", "mujer", "unisex"];
const VALID_STATUSES: ProductStatus[] = ["draft", "published", "sold_out"];

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeFieldLine(value: string) {
  return value
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\*\*(.+)\*\*$/, "$1")
    .trim();
}

function getFieldForKey(key: string) {
  return FIELD_ALIASES[normalizeKey(key)] || null;
}

function isMultilineImportField(field: ProductStudioImportField) {
  return field === "descriptionShort" || field === "descriptionLong" || field === "description" || field === "variants" || field === "images" || field === "image";
}

function shouldStartBlock(field: ProductStudioImportField, value: string) {
  return value.trim() === "|" || field === "variants" || field === "images" || field === "image" || ((field === "descriptionShort" || field === "descriptionLong" || field === "description") && !value.trim());
}

function looksLikeUnmappedHeading(value: string) {
  const cleanValue = normalizeFieldLine(value);
  if (!cleanValue || cleanValue.length > 80) {
    return false;
  }

  return /^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ\s/#()-]*:\s*$/.test(cleanValue);
}

function splitList(value: string) {
  return value
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: string) {
  return /^(1|true|si|sí|yes|y|on|destacado)$/i.test(value.trim());
}

function normalizeStatus(value: string): ProductStatus {
  const normalized = normalizeKey(value);

  if (normalized === "publicado" || normalized === "published" || normalized === "activo") {
    return "published";
  }

  if (normalized === "agotado" || normalized === "soldout" || normalized === "sold_out") {
    return "sold_out";
  }

  return VALID_STATUSES.includes(value as ProductStatus) ? (value as ProductStatus) : "draft";
}

function normalizeGender(value: string): ProductGender {
  const normalized = normalizeKey(value);

  if (normalized === "hombre" || normalized === "men" || normalized === "masculino") {
    return "hombre";
  }

  if (normalized === "mujer" || normalized === "women" || normalized === "femenino") {
    return "mujer";
  }

  return VALID_GENDERS.includes(value as ProductGender) ? (value as ProductGender) : "unisex";
}

function parseImageLine(line: string) {
  const [fileName = "", role = ""] = line
    .replace(/^[-*]\s*/, "")
    .split(/\s*(?:=|->|:)\s*/)
    .map((part) => part.trim());

  if (!fileName) {
    return null;
  }

  return expectedImageFromFileName(fileName, role);
}

function applyField(target: Partial<ProductStudioDraft>, key: string, rawValue: string, options?: ProductStudioOptions, notices: StudioNotice[] = []) {
  const field = getFieldForKey(key);
  const value = rawValue.trim();

  if (!field || !value) {
    return;
  }

  if (field === "drop") {
    target.collectionCode = value;
    return;
  }

  if (field === "description") {
    target.descriptionLong = value;
    return;
  }

  if (field === "images" || field === "image") {
    const images = value
      .split(/[;\n]+/)
      .map((line) => parseImageLine(line))
      .filter((image): image is NonNullable<typeof image> => Boolean(image));
    target.expectedImages = [...(target.expectedImages || []), ...images];
    return;
  }

  if (field === "variants") {
    target.variants = textToVariants(value);
    return;
  }

  if (field === "gender") {
    target.gender = normalizeGender(value);
    return;
  }

  if (field === "status") {
    target.status = normalizeStatus(value);
    return;
  }

  if (field === "featured") {
    target.featured = parseBoolean(value);
    return;
  }

  if (field === "colorCodes") {
    const codes = splitList(value).map(normalizeColorCode).filter((code): code is string => Boolean(code));
    target.colorCodes = codes;
    target.colorIds = options ? codes.map((code) => findOptionByCodeNameOrId(options.colors, code)?.id).filter((id): id is string => Boolean(id)) : [];
    if (options && target.colorIds.length !== codes.length) {
      notices.push({ level: "warning", field: "colorCodes", message: "Algunos colores de la ficha no existen todavia en el admin." });
    }
    return;
  }

  if (field === "sizeCodes") {
    const codes = splitList(value).map((item) => item.toUpperCase());
    target.sizeCodes = codes;
    target.sizeIds = options ? codes.map((code) => findOptionByCodeNameOrId(options.sizes, code)?.id).filter((id): id is string => Boolean(id)) : [];
    if (options && target.sizeIds.length !== codes.length) {
      notices.push({ level: "warning", field: "sizeCodes", message: "Algunos talles de la ficha no existen todavia en el admin." });
    }
    return;
  }

  if (field === "garmentTypeCode") {
    const garment = options ? findProductOptionByKind(options.garmentTypes, value) : null;
    const category = options ? findProductOptionByKind(options.categories, value) || findProductOptionByKind(options.categories, garment?.name || garment?.code) : null;
    target.garmentTypeCode = garment?.code || value.toUpperCase();
    target.garmentTypeId = garment?.id || "";

    if (category) {
      target.categoryCode = category.code;
      target.categoryId = category.id;
    }
    return;
  }

  if (field === "categoryCode") {
    const category = options ? findProductOptionByKind(options.categories, value) : null;
    const garment = options ? findProductOptionByKind(options.garmentTypes, value) || findProductOptionByKind(options.garmentTypes, category?.name || category?.code) : null;
    target.categoryCode = category?.code || value;
    target.categoryId = category?.id || "";

    if (garment) {
      target.garmentTypeCode = garment.code;
      target.garmentTypeId = garment.id;
    }
    return;
  }

  if (field === "collectionCode") {
    target.collectionCode = value;
    target.collectionId = options ? findOptionByCodeNameOrId(options.collections, value)?.id || "" : "";
    return;
  }

  if (field === "modelCode") {
    target.modelCode = value.toUpperCase();
    return;
  }

  if (field === "slug") {
    target.slug = slugifyStudioValue(value);
    return;
  }

  target[field] = value as never;
}

function parseStructuredText(input: string, options?: ProductStudioOptions): ProductStudioImportResult {
  const draft: Partial<ProductStudioDraft> = {};
  const notices: StudioNotice[] = [];
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  let blockKey: string | null = null;
  let blockLines: string[] = [];

  function flushBlock() {
    if (!blockKey) {
      return;
    }

    applyField(draft, blockKey, blockLines.join("\n").trim(), options, notices);
    blockKey = null;
    blockLines = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    const fieldLine = normalizeFieldLine(trimmed);

    if (!trimmed) {
      if (blockKey) {
        blockLines.push("");
      }
      continue;
    }

    if (!blockKey && (trimmed === "ROXWANA Product Sheet v1" || fieldLine === "ROXWANA Product Sheet v1")) {
      continue;
    }

    const match = fieldLine.match(/^([^:=]+)\s*[:=]\s*(.*)$/);

    if (match && getFieldForKey(match[1])) {
      flushBlock();
      const [, key, value] = match;
      const field = getFieldForKey(key);

      if (field && shouldStartBlock(field, value)) {
        blockKey = key;
        blockLines = value.trim() === "|" ? [] : value ? [value] : [];
      } else {
        applyField(draft, key, value, options, notices);
      }
      continue;
    }

    const standaloneField = getFieldForKey(fieldLine);

    if (standaloneField && isMultilineImportField(standaloneField)) {
      flushBlock();
      blockKey = fieldLine;
      blockLines = [];
      continue;
    }

    if (blockKey && looksLikeUnmappedHeading(trimmed)) {
      flushBlock();
      continue;
    }

    if (!blockKey && trimmed.startsWith("#")) {
      continue;
    }

    if (blockKey) {
      blockLines.push(line.replace(/^\s{2,}/, ""));
    }
  }

  flushBlock();

  if (!draft.slug && draft.name) {
    draft.slug = buildStudioSlug(draft.name, draft.modelCode);
  }

  return { draft, notices, format: "text" };
}

function coerceRecordToDraft(record: Record<string, unknown>, options?: ProductStudioOptions): ProductStudioImportResult {
  const draft: Partial<ProductStudioDraft> = {};
  const notices: StudioNotice[] = [];

  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value)) {
      if (normalizeKey(key) === "variantes" || normalizeKey(key) === "variants") {
        draft.variants = value.map((item) => {
          const variant = typeof item === "object" && item ? (item as Record<string, unknown>) : {};
          return {
            sku: String(variant.sku || ""),
            size: String(variant.size || variant.talle || ""),
            color: String(variant.color || ""),
            stock: Number(variant.stock || 0)
          };
        });
      } else {
        applyField(draft, key, value.join(", "), options, notices);
      }
      continue;
    }

    if (value !== null && typeof value === "object") {
      continue;
    }

    applyField(draft, key, String(value ?? ""), options, notices);
  }

  if (!draft.slug && draft.name) {
    draft.slug = buildStudioSlug(draft.name, draft.modelCode);
  }

  return { draft, notices, format: "json" };
}

function detectCsvDelimiter(input: string) {
  const firstLine = input.split(/\r?\n/)[0] || "";
  const commas = (firstLine.match(/,/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;

  return semicolons > commas ? ";" : ",";
}

function parseCsvRows(input: string, delimiter = ",") {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  return rows.filter((items) => items.some(Boolean));
}

function parseCsv(input: string, options?: ProductStudioOptions): ProductStudioImportResult {
  const [headers = [], firstRow = []] = parseCsvRows(input, detectCsvDelimiter(input));
  const record: Record<string, unknown> = {};

  headers.forEach((header, index) => {
    record[header] = firstRow[index] || "";
  });

  const result = coerceRecordToDraft(record, options);
  return { ...result, format: "csv" };
}

export function parseProductStudioSheet(input: string, format: ProductStudioImportFormat = "text", options?: ProductStudioOptions): ProductStudioImportResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      draft: {},
      notices: [{ level: "warning", message: "La ficha esta vacia." }],
      format
    };
  }

  if (format === "json" || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const result = coerceRecordToDraft(parsed, options);
      return { ...result, format: "json" };
    } catch {
      return {
        draft: {},
        notices: [{ level: "error", message: "El JSON no se pudo leer." }],
        format: "json"
      };
    }
  }

  if (format === "csv") {
    return parseCsv(trimmed, options);
  }

  const result = parseStructuredText(trimmed, options);
  return { ...result, format };
}

export function inferImportFormat(fileName: string): ProductStudioImportFormat {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "json") {
    return "json";
  }

  if (extension === "csv") {
    return "csv";
  }

  if (extension === "md" || extension === "markdown") {
    return "markdown";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  return "text";
}
