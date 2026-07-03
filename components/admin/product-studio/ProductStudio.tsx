"use client";

import { ChangeEvent, DragEvent, FormEvent, useMemo, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ClipboardPaste, FileText, Image as ImageIcon, Maximize2, Minimize2, RotateCcw, Save, Trash2, UploadCloud } from "lucide-react";
import type { Product } from "@/types/product";
import { extractProductSheetPdfText } from "@/lib/product-studio/actions";
import { inferImportFormat, parseProductStudioSheet } from "@/lib/product-studio/parser";
import {
  EMPTY_PRODUCT_STUDIO_DRAFT,
  findProductOptionByKind,
  mergeStudioDraft,
  productToStudioDraft,
  textToVariants,
  variantsToText,
  type ProductStudioDraft,
  type ProductStudioOptions,
  type StudioNotice
} from "@/lib/product-studio/schema";
import { getImageRoleLabel, parseProductImageName, type StudioDeviceVariant, type StudioImageRole } from "@/lib/product-studio/imageRules";
import { validateProductStudioDraft } from "@/lib/product-studio/validation";
import { formatPrice } from "@/lib/products/formatPrice";

type ProductStudioProps = {
  mode: "create" | "edit";
  product?: Product;
  options: ProductStudioOptions;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
};

type UploadImageDraft = {
  clientId: string;
  inputId: string;
  fileIndex: number;
  fileName: string;
  previewUrl: string;
  fileSize: number;
  lastModified: number;
  role: StudioImageRole;
  viewNumber: string;
  colorCode: string;
  deviceVariant: StudioDeviceVariant;
  sortOrder: string;
  delete: boolean;
  warnings: string[];
};

type ExistingImageDraft = {
  id: string;
  url: string;
  label: string;
  role: StudioImageRole;
  viewNumber: string;
  colorCode: string;
  deviceVariant: StudioDeviceVariant;
  sortOrder: string;
  delete: boolean;
};

type StudioFamilyDraft = {
  clientId: string;
  productId?: string;
  colorId: string;
  colorCode: string;
  colorName: string;
  colorHex?: string | null;
  draft: ProductStudioDraft;
  uploadedImages: UploadImageDraft[];
  imageInputIds: string[];
  activeImageInputId: string;
  nextImageInputIndex: number;
  existingImages: ExistingImageDraft[];
  primaryTarget: string;
  sheetText: string;
  importNotices: StudioNotice[];
  collapsed: boolean;
  imageBoardExpanded: boolean;
  isDraggingImages: boolean;
};

type RemovedFamilyProduct = {
  productId: string;
  colorId: string;
};

type ImageControlsPatch = Partial<Pick<UploadImageDraft, "role" | "viewNumber" | "colorCode" | "deviceVariant" | "sortOrder">>;
type DroppedFileSystemEntry = {
  isFile: boolean;
  isDirectory: boolean;
  file?: (success: (file: File) => void, error?: (error: DOMException) => void) => void;
  createReader?: () => {
    readEntries: (success: (entries: DroppedFileSystemEntry[]) => void, error?: (error: DOMException) => void) => void;
  };
};

const ROLE_OPTIONS: StudioImageRole[] = ["cover", "gallery", "hover", "lifestyle", "technical", "detail"];
const DEVICE_OPTIONS: StudioDeviceVariant[] = ["desktop", "mobile", "base"];
const INITIAL_IMAGE_INPUT_ID = "studio-image-input-0";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_BATCH_BYTES = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PRICE_SHORTCUTS = ["19000", "29000", "39000", "49000"];

const inputClass = "min-h-9 border border-bone/12 bg-ink px-3 text-xs normal-case tracking-normal text-bone outline-none transition focus:border-roxgold";
const selectClass = "min-h-9 border border-bone/12 bg-ink px-3 text-xs normal-case tracking-normal text-bone outline-none transition focus:border-roxgold";
const textareaClass = "border border-bone/12 bg-ink px-3 py-2 text-xs normal-case tracking-normal text-bone outline-none transition focus:border-roxgold";
const iconButtonClass = "inline-grid h-8 w-8 place-items-center border border-bone/12 text-bone/64 transition hover:border-roxgold hover:text-roxgold disabled:pointer-events-none disabled:opacity-30";
const panelClass = "border border-bone/12 bg-ink/72";

function fieldLabel(label: string) {
  return <span className="text-[9px] font-bold uppercase tracking-rox text-steel">{label}</span>;
}

function makeExistingImageDrafts(product?: Product): ExistingImageDraft[] {
  return (product?.images || []).map((image) => {
    const parsed = parseProductImageName(image.originalFilename || image.path || image.url, image.role);
    return {
      id: image.id || image.url,
      url: image.url,
      label: image.originalFilename || image.path || image.url,
      role: image.role || parsed.role,
      viewNumber: image.viewNumber || parsed.viewNumber || "",
      colorCode: image.colorCode || parsed.colorCode || "",
      deviceVariant: image.deviceVariant || parsed.deviceVariant,
      sortOrder: String(image.sortOrder || parsed.sortOrder),
      delete: false
    };
  });
}

function getFamilyColorOption(product: Product, options: ProductStudioOptions) {
  const explicitId = product.familyColorId || product.colors[0]?.id || "";
  const explicitCode = product.colors[0]?.code || "";
  return options.colors.find((color) => color.id === explicitId || color.code === explicitCode) || null;
}

function withCodeSuffix(value: string, colorCode: string) {
  const suffix = colorCode.toUpperCase();
  const base = value.trim().toUpperCase();
  return base.endsWith(`-${suffix}`) ? base : `${base || "RXW"}-${suffix}`;
}

function withSlugSuffix(value: string, colorCode: string) {
  const suffix = colorCode.toLowerCase();
  const base = slugifyDraftValue(value || "producto");
  return base.endsWith(`-${suffix}`) ? base : `${base}-${suffix}`;
}

function slugifyDraftValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withColorName(value: string, colorName: string) {
  const normalizedName = value.toLowerCase();
  const normalizedColor = colorName.toLowerCase();
  return normalizedName.includes(normalizedColor) ? value : `${value || "Producto"} ${colorName}`.trim();
}

function cloneDraftForFamilyColor(base: ProductStudioDraft, color: ProductStudioOptions["colors"][number]) {
  const colorCode = color.code.toUpperCase();
  const modelCode = withCodeSuffix(base.modelCode, colorCode);
  const sizeCodes = base.sizeCodes.length > 0 ? base.sizeCodes : base.variants.map((variant) => variant.size).filter(Boolean);
  const variants =
    base.variants.length > 0
      ? base.variants.map((variant) => ({
          ...variant,
          color: colorCode,
          sku: variant.sku ? withCodeSuffix(variant.sku.replace(/-[A-Z]{2,4}$/i, ""), colorCode) : [modelCode, variant.size, colorCode].filter(Boolean).join("-")
        }))
      : sizeCodes.map((size) => ({
          sku: [modelCode, size, colorCode].filter(Boolean).join("-"),
          size,
          color: colorCode,
          stock: 0
        }));

  return mergeStudioDraft(base, {
    modelCode,
    name: withColorName(base.name, color.name),
    slug: withSlugSuffix(base.slug || base.name || modelCode, colorCode),
    colorIds: [color.id],
    colorCodes: [colorCode],
    variants,
    expectedImages: []
  });
}

function makeFamilyDraftForColor(base: ProductStudioDraft, color: ProductStudioOptions["colors"][number], index: number): StudioFamilyDraft {
  const inputId = `studio-family-${color.id}-${index}-image-input-0`;

  return {
    clientId: `new-${color.id}`,
    colorId: color.id,
    colorCode: color.code.toUpperCase(),
    colorName: color.name,
    colorHex: color.hex || null,
    draft: cloneDraftForFamilyColor(base, color),
    uploadedImages: [],
    imageInputIds: [inputId],
    activeImageInputId: inputId,
    nextImageInputIndex: 1,
    existingImages: [],
    primaryTarget: "",
    sheetText: "",
    importNotices: [],
    collapsed: true,
    imageBoardExpanded: false,
    isDraggingImages: false
  };
}

function makeFamilyDraftFromProduct(product: Product, options: ProductStudioOptions, index: number): StudioFamilyDraft | null {
  const color = getFamilyColorOption(product, options);

  if (!color) {
    return null;
  }

  const inputId = `studio-family-${product.id || color.id}-${index}-image-input-0`;
  const primary = product.images.find((image) => image.isPrimary && image.id);

  return {
    clientId: product.id || `existing-${color.id}`,
    productId: product.id,
    colorId: color.id,
    colorCode: color.code.toUpperCase(),
    colorName: color.name,
    colorHex: color.hex || null,
    draft: mergeStudioDraft(productToStudioDraft(product, options), {
      colorIds: [color.id],
      colorCodes: [color.code.toUpperCase()]
    }),
    uploadedImages: [],
    imageInputIds: [inputId],
    activeImageInputId: inputId,
    nextImageInputIndex: 1,
    existingImages: makeExistingImageDrafts(product),
    primaryTarget: primary?.id ? `existing:${primary.id}` : "",
    sheetText: "",
    importNotices: [],
    collapsed: true,
    imageBoardExpanded: false,
    isDraggingImages: false
  };
}

function makeInitialFamilyDrafts(product: Product | undefined, options: ProductStudioOptions, rootDraft: ProductStudioDraft) {
  const existingFamily = (product?.familyProducts || [])
    .filter((item) => item.id && item.id !== product?.id)
    .map((item, index) => makeFamilyDraftFromProduct(item, options, index))
    .filter((item): item is StudioFamilyDraft => Boolean(item));

  if (existingFamily.length > 0) {
    return existingFamily;
  }

  return rootDraft.colorIds
    .slice(1)
    .map((colorId, index) => {
      const color = options.colors.find((item) => item.id === colorId);
      return color ? makeFamilyDraftForColor(rootDraft, color, index) : null;
    })
    .filter((item): item is StudioFamilyDraft => Boolean(item));
}

function noticeTone(level: StudioNotice["level"]) {
  if (level === "error") {
    return "border-roxred/45 text-roxred";
  }

  if (level === "warning") {
    return "border-roxgold/45 text-roxgold";
  }

  return "border-bone/16 text-bone/70";
}

function numericOrder(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatMegabytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function isAllowedImageFile(file: File) {
  return ALLOWED_IMAGE_TYPES.has(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
}

function fileIdentity(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function uploadImageIdentity(image: UploadImageDraft) {
  return `${image.fileName}-${image.fileSize}-${image.lastModified}`;
}

function sortByStudioOrder<T extends { sortOrder: string; fileName?: string; label?: string }>(images: T[]) {
  return [...images].sort((a, b) => {
    const orderDiff = numericOrder(a.sortOrder, 9999) - numericOrder(b.sortOrder, 9999);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return (a.fileName || a.label || "").localeCompare(b.fileName || b.label || "");
  });
}

function readFileEntry(entry: DroppedFileSystemEntry) {
  return new Promise<File[]>((resolve) => {
    if (!entry.file) {
      resolve([]);
      return;
    }

    entry.file((file) => resolve([file]), () => resolve([]));
  });
}

async function readDirectoryEntry(entry: DroppedFileSystemEntry): Promise<File[]> {
  if (!entry.createReader) {
    return [];
  }

  const reader = entry.createReader();
  const entries: DroppedFileSystemEntry[] = [];

  while (true) {
    const batch = await new Promise<DroppedFileSystemEntry[]>((resolve) => {
      reader.readEntries((items) => resolve(items), () => resolve([]));
    });

    if (batch.length === 0) {
      break;
    }

    entries.push(...batch);
  }

  const nested = await Promise.all(entries.map(readDroppedEntryFiles));
  return nested.flat();
}

function readDroppedEntryFiles(entry: DroppedFileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    return readFileEntry(entry);
  }

  if (entry.isDirectory) {
    return readDirectoryEntry(entry);
  }

  return Promise.resolve([]);
}

async function collectDroppedFiles(dataTransfer: DataTransfer) {
  const items = Array.from(dataTransfer.items || []);
  const entries = items.reduce<DroppedFileSystemEntry[]>((accumulator, item) => {
    const entry = (item as unknown as { webkitGetAsEntry?: () => DroppedFileSystemEntry | null }).webkitGetAsEntry?.();

    if (entry) {
      accumulator.push(entry);
    }

    return accumulator;
  }, []);

  if (entries.length > 0) {
    const files = (await Promise.all(entries.map(readDroppedEntryFiles))).flat();
    const unique = new Map(files.map((file) => [`${file.name}-${file.size}-${file.lastModified}`, file]));
    return Array.from(unique.values());
  }

  return Array.from(dataTransfer.files || []);
}

export function ProductStudio({ mode, product, options, action, submitLabel }: ProductStudioProps) {
  const pathname = usePathname();
  const [draft, setDraft] = useState<ProductStudioDraft>(() => productToStudioDraft(product, options));
  const [familyDrafts, setFamilyDrafts] = useState<StudioFamilyDraft[]>(() => makeInitialFamilyDrafts(product, options, productToStudioDraft(product, options)));
  const [removedFamilyProducts, setRemovedFamilyProducts] = useState<RemovedFamilyProduct[]>([]);
  const [rootCollapsed, setRootCollapsed] = useState(false);
  const [sheetText, setSheetText] = useState("");
  const [importNotices, setImportNotices] = useState<StudioNotice[]>([]);
  const [saveError, setSaveError] = useState<StudioNotice | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadImageDraft[]>([]);
  const [imageInputIds, setImageInputIds] = useState([INITIAL_IMAGE_INPUT_ID]);
  const [activeImageInputId, setActiveImageInputId] = useState(INITIAL_IMAGE_INPUT_ID);
  const [nextImageInputIndex, setNextImageInputIndex] = useState(1);
  const [existingImages, setExistingImages] = useState<ExistingImageDraft[]>(() => makeExistingImageDrafts(product));
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [imageBoardExpanded, setImageBoardExpanded] = useState(false);
  const [primaryTarget, setPrimaryTarget] = useState<string>(() => {
    const primary = product?.images.find((image) => image.isPrimary && image.id);
    return primary?.id ? `existing:${primary.id}` : "";
  });
  const [pdfPending, startPdfTransition] = useTransition();

  const fileOrderedUploadedImages = useMemo(
    () =>
      [...uploadedImages].sort((a, b) => {
        const inputDiff = imageInputIds.indexOf(a.inputId) - imageInputIds.indexOf(b.inputId);
        return inputDiff !== 0 ? inputDiff : a.fileIndex - b.fileIndex;
      }),
    [imageInputIds, uploadedImages]
  );
  const activeUploadedImages = useMemo(() => sortByStudioOrder(uploadedImages.filter((image) => !image.delete)), [uploadedImages]);
  const activeExistingImages = useMemo(() => sortByStudioOrder(existingImages.filter((image) => !image.delete)), [existingImages]);
  const primaryNewImageIndex = primaryTarget.startsWith("new:") ? fileOrderedUploadedImages.findIndex((image) => image.clientId === primaryTarget.replace("new:", "") && !image.delete) : -1;
  const validationNotices = useMemo(
    () => validateProductStudioDraft(draft, options, activeUploadedImages.length, activeExistingImages.length),
    [activeExistingImages.length, activeUploadedImages.length, draft, options]
  );
  const familyValidationNotices = useMemo(
    () =>
      familyDrafts.flatMap((family) => {
        const activeUploads = family.uploadedImages.filter((image) => !image.delete).length;
        const activeExisting = family.existingImages.filter((image) => !image.delete).length;
        return validateProductStudioDraft(family.draft, options, activeUploads, activeExisting).map((notice) => ({
          ...notice,
          message: `${family.colorCode}: ${notice.message}`
        }));
      }),
    [familyDrafts, options]
  );
  const familyImportNotices = useMemo(
    () =>
      familyDrafts.flatMap((family) =>
        family.importNotices.map((notice) => ({
          ...notice,
          message: `${family.colorCode}: ${notice.message}`
        }))
      ),
    [familyDrafts]
  );
  const allNotices = [...validationNotices, ...familyValidationNotices, ...familyImportNotices, ...importNotices, ...(saveError ? [saveError] : [])];
  const errorCount = allNotices.filter((notice) => notice.level === "error").length;
  const coverPreview = activeUploadedImages.find((image) => image.role === "cover")?.previewUrl || activeExistingImages.find((image) => image.role === "cover")?.url || product?.image || "";
  const hoverPreview = activeUploadedImages.find((image) => image.role === "hover")?.previewUrl || activeExistingImages.find((image) => image.role === "hover")?.url || "";
  const totalImages = activeExistingImages.length + activeUploadedImages.length;
  const selectedColorOptions = options.colors.filter((color) => draft.colorIds.includes(color.id));
  const selectedSizeOptions = options.sizes.filter((size) => draft.sizeIds.includes(size.id));
  const completionItems = [
    draft.modelCode,
    draft.name,
    draft.slug,
    draft.garmentTypeId,
    draft.price,
    draft.categoryId,
    selectedColorOptions.length > 0,
    selectedSizeOptions.length > 0,
    totalImages > 0,
    draft.descriptionShort,
    draft.variants.length > 0
  ];
  const completionScore = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);
  const boardHasImages = existingImages.length > 0 || activeUploadedImages.length > 0;

  function updateDraft(patch: Partial<ProductStudioDraft>) {
    setSaveError(null);
    setDraft((current) => mergeStudioDraft(current, patch));
  }

  function addMissingFamilyDrafts(current: StudioFamilyDraft[], baseDraft: ProductStudioDraft) {
    const next = [...current];

    baseDraft.colorIds.slice(1).forEach((colorId, index) => {
      if (next.some((family) => family.colorId === colorId)) {
        return;
      }

      const color = options.colors.find((item) => item.id === colorId);

      if (color) {
        next.push(makeFamilyDraftForColor(baseDraft, color, next.length + index));
      }
    });

    return next;
  }

  function updateFamily(clientId: string, patch: Partial<StudioFamilyDraft>) {
    setSaveError(null);
    setFamilyDrafts((current) => current.map((family) => (family.clientId === clientId ? { ...family, ...patch } : family)));
  }

  function updateFamilyDraft(clientId: string, patch: Partial<ProductStudioDraft>) {
    setSaveError(null);
    setFamilyDrafts((current) => current.map((family) => (family.clientId === clientId ? { ...family, draft: mergeStudioDraft(family.draft, patch) } : family)));
  }

  function lockFamilyColor(family: StudioFamilyDraft, nextDraft: ProductStudioDraft) {
    return {
      ...nextDraft,
      colorIds: [family.colorId],
      colorCodes: [family.colorCode],
      variants: nextDraft.variants.map((variant) => ({ ...variant, color: family.colorCode }))
    };
  }

  function validateBeforeSubmit(event: FormEvent<HTMLFormElement>) {
    const firstError = allNotices.find((notice) => notice.level === "error");

    if (!firstError) {
      setSaveError(null);
      return;
    }

    event.preventDefault();
    setSaveError({
      level: "error",
      message: `No se guardo: ${firstError.message}`
    });
  }

  function applyImport(text: string, fileName = "ficha.txt") {
    const format = inferImportFormat(fileName);
    const result = parseProductStudioSheet(text, format === "pdf" ? "text" : format, options);
    const baseDraft = mode === "edit" ? productToStudioDraft(product, options) : EMPTY_PRODUCT_STUDIO_DRAFT;
    const nextDraft = mergeStudioDraft(baseDraft, result.draft);
    setDraft(nextDraft);
    setFamilyDrafts((current) => addMissingFamilyDrafts(current, nextDraft));
    setImportNotices(result.notices.length > 0 ? result.notices : [{ level: "info", message: "Ficha importada al borrador Studio." }]);
  }

  async function handlePasteToStudio() {
    const currentText = sheetText.trim();

    if (currentText) {
      applyImport(currentText);
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      setSheetText(clipboardText);
      applyImport(clipboardText);
    } catch {
      setImportNotices([{ level: "warning", message: "No pude leer el portapapeles. Pegalo en el cuadro y apreta Pegar al Studio." }]);
    }
  }

  function findGarmentForCategory(category?: ProductStudioOptions["categories"][number]) {
    if (!category) {
      return null;
    }

    return findProductOptionByKind(options.garmentTypes, category.code) || findProductOptionByKind(options.garmentTypes, category.name);
  }

  async function handleSheetFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const format = inferImportFormat(file.name);

    if (format === "pdf") {
      const formData = new FormData();
      formData.set("sheet_file", file);
      startPdfTransition(async () => {
        const result = await extractProductSheetPdfText(formData);
        if (result.error) {
          setImportNotices([{ level: "error", message: result.error }]);
          return;
        }
        setSheetText(result.text);
        applyImport(result.text, file.name);
      });
      return;
    }

    const text = await file.text();
    setSheetText(text);
    applyImport(text, file.name);
  }

  function applyFamilyImport(clientId: string, text: string, fileName = "ficha.txt") {
    const family = familyDrafts.find((item) => item.clientId === clientId);

    if (!family) {
      return;
    }

    const format = inferImportFormat(fileName);
    const result = parseProductStudioSheet(text, format === "pdf" ? "text" : format, options);
    setFamilyDrafts((current) =>
      current.map((item) => {
        if (item.clientId !== clientId) {
          return item;
        }

        const nextDraft = lockFamilyColor(item, mergeStudioDraft(item.draft, result.draft));
        return {
          ...item,
          draft: nextDraft,
          sheetText: text,
          importNotices: result.notices.length > 0 ? result.notices : [{ level: "info", message: "Ficha importada al borrador Studio." }]
        };
      })
    );
  }

  async function handleFamilyPasteToStudio(clientId: string) {
    const family = familyDrafts.find((item) => item.clientId === clientId);
    const currentText = family?.sheetText.trim() || "";

    if (currentText) {
      applyFamilyImport(clientId, currentText);
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      applyFamilyImport(clientId, clipboardText);
    } catch {
      updateFamily(clientId, { importNotices: [{ level: "warning", message: "No pude leer el portapapeles. Pegalo en el cuadro y apreta Pegar al Studio." }] });
    }
  }

  async function handleFamilySheetFile(clientId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const format = inferImportFormat(file.name);

    if (format === "pdf") {
      const formData = new FormData();
      formData.set("sheet_file", file);
      startPdfTransition(async () => {
        const result = await extractProductSheetPdfText(formData);
        if (result.error) {
          updateFamily(clientId, { importNotices: [{ level: "error", message: result.error }] });
          return;
        }
        applyFamilyImport(clientId, result.text, file.name);
      });
      return;
    }

    const text = await file.text();
    applyFamilyImport(clientId, text, file.name);
  }

  function filterNewImageFiles(files: File[]) {
    const currentKeys = new Set(uploadedImages.filter((image) => !image.delete).map(uploadImageIdentity));
    const batchKeys = new Set<string>();
    const nextFiles: File[] = [];

    files.forEach((file) => {
      const key = fileIdentity(file);

      if (currentKeys.has(key) || batchKeys.has(key)) {
        return;
      }

      batchKeys.add(key);
      nextFiles.push(file);
    });

    const duplicateCount = files.length - nextFiles.length;
    if (duplicateCount > 0) {
      setImportNotices((current) => [{ level: "warning", message: `Se ignoraron ${duplicateCount} imagenes repetidas.` }, ...current]);
    }

    if (files.length > 0 && nextFiles.length === 0) {
      setSaveError({ level: "warning", message: "Esas imagenes ya estaban cargadas en el tablero." });
    }

    return nextFiles;
  }

  function addImageFiles(inputId: string, files: File[]) {
    if (files.length === 0) {
      return false;
    }

    const invalidType = files.find((file) => !isAllowedImageFile(file));
    if (invalidType) {
      setSaveError({ level: "error", message: `No se cargo ${invalidType.name}: solo se aceptan JPG, PNG o WEBP.` });
      return false;
    }

    const oversized = files.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversized) {
      setSaveError({
        level: "error",
        message: `No se cargo ${oversized.name}: pesa ${formatMegabytes(oversized.size)} y el limite por imagen es 5 MB.`
      });
      return false;
    }

    const currentBatchSize = uploadedImages.filter((image) => !image.delete).reduce((total, image) => {
      const input = document.getElementById(image.inputId) as HTMLInputElement | null;
      const file = Array.from(input?.files || []).find((item, index) => index === image.fileIndex && item.name === image.fileName);
      return total + (file?.size || 0);
    }, 0);
    const nextBatchSize = files.reduce((total, file) => total + file.size, currentBatchSize);

    if (nextBatchSize > MAX_IMAGE_BATCH_BYTES) {
      setSaveError({
        level: "error",
        message: `El lote de imagenes suma ${formatMegabytes(nextBatchSize)}. Subi menos fotos por guardado o comprimilas antes de guardar.`
      });
      return false;
    }

    const activeCount = activeUploadedImages.length + activeExistingImages.length;
    const hasCover = activeUploadedImages.some((image) => image.role === "cover") || activeExistingImages.some((image) => image.role === "cover");
    const batchId = `${inputId}-${nextImageInputIndex}`;
    const images = files.map<UploadImageDraft>((file, index) => {
      const parsed = parseProductImageName(file.name);
      const fallbackPosition = activeCount + index + 1;
      const fallbackViewNumber = String(fallbackPosition).padStart(2, "0");
      const role = parsed.viewNumber ? parsed.role : parsed.role !== "gallery" ? parsed.role : !hasCover && index === 0 ? "cover" : "gallery";
      return {
        clientId: `${inputId}-${batchId}-${index}`,
        inputId,
        fileIndex: index,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
        fileSize: file.size,
        lastModified: file.lastModified,
        role,
        viewNumber: parsed.viewNumber || fallbackViewNumber,
        colorCode: parsed.colorCode || "",
        deviceVariant: parsed.deviceVariant,
        sortOrder: String(parsed.viewNumber ? parsed.sortOrder : fallbackPosition * 10),
        delete: false,
        warnings: parsed.warnings.map((warning) => (warning.startsWith("No se detecto numero") ? "Sin numero: se ordeno por carga." : warning))
      };
    });
    setUploadedImages((current) => [...current, ...images]);

    const nextInputId = `studio-image-input-${nextImageInputIndex}`;
    setImageInputIds((current) => [...current, nextInputId]);
    setActiveImageInputId(nextInputId);
    setNextImageInputIndex((current) => current + 1);

    const coverIndex = images.findIndex((image) => image.role === "cover");
    if (coverIndex >= 0 && !primaryTarget) {
      setPrimaryTarget(`new:${images[coverIndex].clientId}`);
    }

    setSaveError(null);
    return true;
  }

  function handleImages(inputId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files || []);
    const nextFiles = filterNewImageFiles(files);

    if (nextFiles.length !== files.length) {
      setInputFiles(inputId, nextFiles);
    }

    const added = addImageFiles(inputId, nextFiles);

    if (!added) {
      event.currentTarget.value = "";
    }
  }

  function setInputFiles(inputId: string, files: File[]) {
    const input = document.getElementById(inputId) as HTMLInputElement | null;

    if (!input) {
      return false;
    }

    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
    return true;
  }

  function filterNewFamilyImageFiles(clientId: string, files: File[]) {
    const family = familyDrafts.find((item) => item.clientId === clientId);
    const currentKeys = new Set((family?.uploadedImages || []).filter((image) => !image.delete).map(uploadImageIdentity));
    const batchKeys = new Set<string>();
    const nextFiles: File[] = [];

    files.forEach((file) => {
      const key = fileIdentity(file);

      if (currentKeys.has(key) || batchKeys.has(key)) {
        return;
      }

      batchKeys.add(key);
      nextFiles.push(file);
    });

    const duplicateCount = files.length - nextFiles.length;
    if (duplicateCount > 0) {
      setImportNotices((current) => [{ level: "warning", message: `${family?.colorCode || "Color"}: se ignoraron ${duplicateCount} imagenes repetidas.` }, ...current]);
    }

    return nextFiles;
  }

  function addFamilyImageFiles(clientId: string, inputId: string, files: File[]) {
    const family = familyDrafts.find((item) => item.clientId === clientId);

    if (!family || files.length === 0) {
      return false;
    }

    const invalidType = files.find((file) => !isAllowedImageFile(file));
    if (invalidType) {
      setSaveError({ level: "error", message: `No se cargo ${invalidType.name}: solo se aceptan JPG, PNG o WEBP.` });
      return false;
    }

    const oversized = files.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversized) {
      setSaveError({
        level: "error",
        message: `No se cargo ${oversized.name}: pesa ${formatMegabytes(oversized.size)} y el limite por imagen es 5 MB.`
      });
      return false;
    }

    const currentBatchSize = family.uploadedImages.filter((image) => !image.delete).reduce((total, image) => {
      const input = document.getElementById(image.inputId) as HTMLInputElement | null;
      const file = Array.from(input?.files || []).find((item, index) => index === image.fileIndex && item.name === image.fileName);
      return total + (file?.size || 0);
    }, 0);
    const nextBatchSize = files.reduce((total, file) => total + file.size, currentBatchSize);

    if (nextBatchSize > MAX_IMAGE_BATCH_BYTES) {
      setSaveError({
        level: "error",
        message: `El lote de imagenes suma ${formatMegabytes(nextBatchSize)}. Subi menos fotos por guardado o comprimilas antes de guardar.`
      });
      return false;
    }

    const activeCount = family.uploadedImages.filter((image) => !image.delete).length + family.existingImages.filter((image) => !image.delete).length;
    const hasCover = family.uploadedImages.some((image) => !image.delete && image.role === "cover") || family.existingImages.some((image) => !image.delete && image.role === "cover");
    const batchId = `${inputId}-${family.nextImageInputIndex}`;
    const images = files.map<UploadImageDraft>((file, index) => {
      const parsed = parseProductImageName(file.name);
      const fallbackPosition = activeCount + index + 1;
      const fallbackViewNumber = String(fallbackPosition).padStart(2, "0");
      const role = parsed.viewNumber ? parsed.role : parsed.role !== "gallery" ? parsed.role : !hasCover && index === 0 ? "cover" : "gallery";
      return {
        clientId: `${clientId}-${batchId}-${index}`,
        inputId,
        fileIndex: index,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
        fileSize: file.size,
        lastModified: file.lastModified,
        role,
        viewNumber: parsed.viewNumber || fallbackViewNumber,
        colorCode: parsed.colorCode || family.colorCode,
        deviceVariant: parsed.deviceVariant,
        sortOrder: String(parsed.viewNumber ? parsed.sortOrder : fallbackPosition * 10),
        delete: false,
        warnings: parsed.warnings.map((warning) => (warning.startsWith("No se detecto numero") ? "Sin numero: se ordeno por carga." : warning))
      };
    });
    const nextInputId = `studio-family-${family.colorId}-${family.nextImageInputIndex}-image-input`;

    setFamilyDrafts((current) =>
      current.map((item) =>
        item.clientId === clientId
          ? {
              ...item,
              uploadedImages: [...item.uploadedImages, ...images],
              imageInputIds: [...item.imageInputIds, nextInputId],
              activeImageInputId: nextInputId,
              nextImageInputIndex: item.nextImageInputIndex + 1,
              primaryTarget: item.primaryTarget || (images.find((image) => image.role === "cover") ? `new:${images.find((image) => image.role === "cover")?.clientId}` : item.primaryTarget)
            }
          : item
      )
    );

    setSaveError(null);
    return true;
  }

  function handleFamilyImages(clientId: string, inputId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files || []);
    const nextFiles = filterNewFamilyImageFiles(clientId, files);

    if (nextFiles.length !== files.length) {
      setInputFiles(inputId, nextFiles);
    }

    const added = addFamilyImageFiles(clientId, inputId, nextFiles);

    if (!added) {
      event.currentTarget.value = "";
    }
  }

  function updateFamilyUploadedImage(clientId: string, imageClientId: string, patch: ImageControlsPatch) {
    setFamilyDrafts((current) =>
      current.map((family) =>
        family.clientId === clientId
          ? {
              ...family,
              uploadedImages: family.uploadedImages.map((image) => (image.clientId === imageClientId ? { ...image, ...patch } : image))
            }
          : family
      )
    );
  }

  function removeFamilyUploadedImage(clientId: string, imageClientId: string) {
    const family = familyDrafts.find((item) => item.clientId === clientId);
    const image = family?.uploadedImages.find((item) => item.clientId === imageClientId);

    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }

    setFamilyDrafts((current) =>
      current.map((item) =>
        item.clientId === clientId
          ? {
              ...item,
              uploadedImages: item.uploadedImages.map((currentImage) => (currentImage.clientId === imageClientId ? { ...currentImage, delete: true } : currentImage)),
              primaryTarget: item.primaryTarget === `new:${imageClientId}` ? "" : item.primaryTarget
            }
          : item
      )
    );
  }

  function moveFamilyUploadedImage(clientId: string, imageClientId: string, direction: -1 | 1) {
    setFamilyDrafts((current) =>
      current.map((family) => {
        if (family.clientId !== clientId) {
          return family;
        }

        const active = sortByStudioOrder(family.uploadedImages.filter((image) => !image.delete));
        const currentIndex = active.findIndex((image) => image.clientId === imageClientId);
        const targetIndex = currentIndex + direction;

        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= active.length) {
          return family;
        }

        const reordered = [...active];
        [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
        const orderMap = new Map(reordered.map((image, index) => [image.clientId, String((index + 1) * 10)]));
        return {
          ...family,
          uploadedImages: family.uploadedImages.map((image) => (orderMap.has(image.clientId) ? { ...image, sortOrder: orderMap.get(image.clientId) || image.sortOrder } : image))
        };
      })
    );
  }

  function updateFamilyExistingImage(clientId: string, imageId: string, patch: ImageControlsPatch | Partial<ExistingImageDraft>) {
    setFamilyDrafts((current) =>
      current.map((family) =>
        family.clientId === clientId
          ? {
              ...family,
              existingImages: family.existingImages.map((image) => (image.id === imageId ? { ...image, ...patch } : image))
            }
          : family
      )
    );
  }

  function moveFamilyExistingImage(clientId: string, imageId: string, direction: -1 | 1) {
    setFamilyDrafts((current) =>
      current.map((family) => {
        if (family.clientId !== clientId) {
          return family;
        }

        const active = sortByStudioOrder(family.existingImages.filter((image) => !image.delete));
        const currentIndex = active.findIndex((image) => image.id === imageId);
        const targetIndex = currentIndex + direction;

        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= active.length) {
          return family;
        }

        const reordered = [...active];
        [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
        const orderMap = new Map(reordered.map((image, index) => [image.id, String((index + 1) * 10)]));
        return {
          ...family,
          existingImages: family.existingImages.map((image) => (orderMap.has(image.id) ? { ...image, sortOrder: orderMap.get(image.id) || image.sortOrder } : image))
        };
      })
    );
  }

  async function handleImageDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImages(false);

    const droppedFiles = await collectDroppedFiles(event.dataTransfer);
    const imageFiles = droppedFiles.filter(isAllowedImageFile);

    if (imageFiles.length === 0) {
      setSaveError({ level: "error", message: "No encontre imagenes JPG, PNG o WEBP en lo que arrastraste." });
      return;
    }

    const nextFiles = filterNewImageFiles(imageFiles);

    if (nextFiles.length === 0) {
      return;
    }

    const inputId = activeImageInputId;
    if (!setInputFiles(inputId, nextFiles)) {
      setSaveError({ level: "error", message: "No pude conectar las imagenes al formulario. Proba otra vez o usa el boton Cargar imagenes." });
      return;
    }

    const added = addImageFiles(inputId, nextFiles);
    if (!added) {
      setInputFiles(inputId, []);
      return;
    }

    const skippedCount = droppedFiles.length - imageFiles.length;

    if (skippedCount > 0) {
      setImportNotices((current) => [{ level: "warning", message: `Se ignoraron ${skippedCount} archivos que no eran imagenes.` }, ...current]);
    }
  }

  function toggleColor(id: string, code: string) {
    const selected = draft.colorIds.includes(id);
    const color = options.colors.find((item) => item.id === id);

    if (selected) {
      const nextColorIds = draft.colorIds.filter((item) => item !== id);
      const nextColorCodes = draft.colorCodes.filter((item) => item !== code);
      const nextChildColorIds = new Set(nextColorIds.slice(1));
      const removedFamilies = familyDrafts.filter((family) => !nextChildColorIds.has(family.colorId) && family.productId);

      if (removedFamilies.length > 0) {
        setRemovedFamilyProducts((current) => {
          const byProductId = new Map(current.map((item) => [item.productId, item]));
          removedFamilies.forEach((family) => {
            if (family.productId) {
              byProductId.set(family.productId, { productId: family.productId, colorId: family.colorId });
            }
          });
          return Array.from(byProductId.values());
        });
      }

      setDraft(mergeStudioDraft(draft, { colorIds: nextColorIds, colorCodes: nextColorCodes }));
      setFamilyDrafts((current) => current.filter((family) => nextChildColorIds.has(family.colorId)));
      setSaveError(null);
      return;
    }

    const nextDraft = mergeStudioDraft(draft, {
      colorIds: [...draft.colorIds, id],
      colorCodes: Array.from(new Set([...draft.colorCodes, code]))
    });
    setDraft(nextDraft);
    setRemovedFamilyProducts((current) => current.filter((item) => item.colorId !== id));

    if (draft.colorIds.length > 0 && color) {
      setFamilyDrafts((current) => addMissingFamilyDrafts(current, nextDraft));
    }

    setSaveError(null);
  }

  async function handleFamilyImageDrop(clientId: string, event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    const family = familyDrafts.find((item) => item.clientId === clientId);
    updateFamily(clientId, { isDraggingImages: false });

    if (!family) {
      return;
    }

    const droppedFiles = await collectDroppedFiles(event.dataTransfer);
    const imageFiles = droppedFiles.filter(isAllowedImageFile);

    if (imageFiles.length === 0) {
      setSaveError({ level: "error", message: `${family.colorCode}: no encontre imagenes JPG, PNG o WEBP en lo que arrastraste.` });
      return;
    }

    const nextFiles = filterNewFamilyImageFiles(clientId, imageFiles);

    if (nextFiles.length === 0) {
      return;
    }

    const inputId = family.activeImageInputId;
    if (!setInputFiles(inputId, nextFiles)) {
      setSaveError({ level: "error", message: `${family.colorCode}: no pude conectar las imagenes al formulario. Proba otra vez o usa el boton Cargar imagenes.` });
      return;
    }

    const added = addFamilyImageFiles(clientId, inputId, nextFiles);
    if (!added) {
      setInputFiles(inputId, []);
      return;
    }

    const skippedCount = droppedFiles.length - imageFiles.length;

    if (skippedCount > 0) {
      setImportNotices((current) => [{ level: "warning", message: `${family.colorCode}: se ignoraron ${skippedCount} archivos que no eran imagenes.` }, ...current]);
    }
  }

  function toggleSize(id: string, code: string) {
    const selected = draft.sizeIds.includes(id);
    updateDraft({
      sizeIds: selected ? draft.sizeIds.filter((item) => item !== id) : [...draft.sizeIds, id],
      sizeCodes: selected ? draft.sizeCodes.filter((item) => item !== code) : Array.from(new Set([...draft.sizeCodes, code]))
    });
  }

  function updateUploadedImage(clientId: string, patch: ImageControlsPatch) {
    setUploadedImages((images) => images.map((image) => (image.clientId === clientId ? { ...image, ...patch } : image)));
  }

  function removeUploadedImage(clientId: string) {
    const image = uploadedImages.find((item) => item.clientId === clientId);

    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }

    setUploadedImages((images) => images.map((item) => (item.clientId === clientId ? { ...item, delete: true } : item)));
    setPrimaryTarget((current) => (current === `new:${clientId}` ? "" : current));
  }

  function moveUploadedImage(clientId: string, direction: -1 | 1) {
    setUploadedImages((images) => {
      const active = sortByStudioOrder(images.filter((image) => !image.delete));
      const currentIndex = active.findIndex((image) => image.clientId === clientId);
      const targetIndex = currentIndex + direction;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= active.length) {
        return images;
      }

      const reordered = [...active];
      [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
      const orderMap = new Map(reordered.map((image, index) => [image.clientId, String((index + 1) * 10)]));
      return images.map((image) => (orderMap.has(image.clientId) ? { ...image, sortOrder: orderMap.get(image.clientId) || image.sortOrder } : image));
    });
  }

  function moveExistingImage(id: string, direction: -1 | 1) {
    setExistingImages((images) => {
      const active = sortByStudioOrder(images.filter((image) => !image.delete));
      const currentIndex = active.findIndex((image) => image.id === id);
      const targetIndex = currentIndex + direction;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= active.length) {
        return images;
      }

      const reordered = [...active];
      [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
      const orderMap = new Map(reordered.map((image, index) => [image.id, String((index + 1) * 10)]));
      return images.map((image) => (orderMap.has(image.id) ? { ...image, sortOrder: orderMap.get(image.id) || image.sortOrder } : image));
    });
  }

  function updateExistingImage(id: string, patch: ImageControlsPatch | Partial<ExistingImageDraft>) {
    setExistingImages((images) => images.map((image) => (image.id === id ? { ...image, ...patch } : image)));
  }

  return (
    <form action={action} onSubmit={validateBeforeSubmit} className="grid gap-4">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="return_error_url" value={pathname} />
      <input type="hidden" name="garment_type_id" value={draft.garmentTypeId} />
      <input type="hidden" name="primary_image_id" value={primaryTarget.startsWith("existing:") ? primaryTarget.replace("existing:", "") : ""} />
      <input type="hidden" name="primary_new_image_index" value={primaryNewImageIndex >= 0 ? String(primaryNewImageIndex) : ""} />
      {draft.colorIds.map((id) => (
        <input key={id} type="hidden" name="color_ids" value={id} />
      ))}
      {draft.sizeIds.map((id) => (
        <input key={id} type="hidden" name="size_ids" value={id} />
      ))}
      {fileOrderedUploadedImages.map((image, index) => (
        <span key={`${image.clientId}-${index}-metadata`}>
          <input type="hidden" name="image_skip" value={image.delete ? "true" : "false"} />
          <input type="hidden" name="image_role" value={image.role} />
          <input type="hidden" name="image_view_number" value={image.viewNumber} />
          <input type="hidden" name="image_color_code" value={image.colorCode} />
          <input type="hidden" name="image_device_variant" value={image.deviceVariant} />
          <input type="hidden" name="image_original_name" value={image.fileName} />
          <input type="hidden" name="image_sort_order" value={image.sortOrder} />
        </span>
      ))}
      {existingImages.map((image) => (
        <span key={`${image.id}-metadata`}>
          <input type="hidden" name="existing_image_ids" value={image.id} />
          <input type="hidden" name="existing_image_role" value={image.role} />
          <input type="hidden" name="existing_image_view_number" value={image.viewNumber} />
          <input type="hidden" name="existing_image_color_code" value={image.colorCode} />
          <input type="hidden" name="existing_image_device_variant" value={image.deviceVariant} />
          <input type="hidden" name="existing_image_sort_order" value={image.sortOrder} />
          {image.delete ? <input type="hidden" name="delete_image_ids" value={image.id} /> : null}
        </span>
      ))}
      {removedFamilyProducts.map((item) => (
        <input key={item.productId} type="hidden" name="family_removed_product_ids" value={item.productId} />
      ))}
      <input type="hidden" name="family_child_count" value={familyDrafts.length} />
      {familyDrafts.map((family, familyIndex) => {
        const prefix = `family_child_${familyIndex}_`;
        const orderedUploads = [...family.uploadedImages].sort((a, b) => {
          const inputDiff = family.imageInputIds.indexOf(a.inputId) - family.imageInputIds.indexOf(b.inputId);
          return inputDiff !== 0 ? inputDiff : a.fileIndex - b.fileIndex;
        });
        const activeOrderedUploads = sortByStudioOrder(family.uploadedImages.filter((image) => !image.delete));
        const primaryNewIndex = family.primaryTarget.startsWith("new:") ? orderedUploads.findIndex((image) => image.clientId === family.primaryTarget.replace("new:", "") && !image.delete) : -1;

        return (
          <span key={`${family.clientId}-hidden`}>
            {family.productId ? <input type="hidden" name={`${prefix}id`} value={family.productId} /> : null}
            <input type="hidden" name={`${prefix}family_color_id`} value={family.colorId} />
            <input type="hidden" name={`${prefix}garment_type_id`} value={family.draft.garmentTypeId} />
            <input type="hidden" name={`${prefix}name`} value={family.draft.name} />
            <input type="hidden" name={`${prefix}category_id`} value={family.draft.categoryId} />
            <input type="hidden" name={`${prefix}gender`} value={family.draft.gender} />
            <input type="hidden" name={`${prefix}price`} value={family.draft.price} />
            <input type="hidden" name={`${prefix}compare_at_price`} value={family.draft.compareAtPrice} />
            <input type="hidden" name={`${prefix}status`} value={family.draft.status} />
            <input type="hidden" name={`${prefix}model_code`} value={family.draft.modelCode} />
            <input type="hidden" name={`${prefix}slug`} value={family.draft.slug} />
            <input type="hidden" name={`${prefix}collection_id`} value={family.draft.collectionId} />
            <input type="hidden" name={`${prefix}sort_order`} value={family.draft.sortOrder} />
            <input type="hidden" name={`${prefix}description_short`} value={family.draft.descriptionShort} />
            <input type="hidden" name={`${prefix}description_long`} value={family.draft.descriptionLong} />
            <input type="hidden" name={`${prefix}whatsapp_message`} value={family.draft.whatsappMessage} />
            <input type="hidden" name={`${prefix}variants`} value={variantsToText(family.draft.variants)} />
            {family.draft.featured ? <input type="hidden" name={`${prefix}featured`} value="on" /> : null}
            <input type="hidden" name={`${prefix}color_ids`} value={family.colorId} />
            {family.draft.sizeIds.map((id) => (
              <input key={`${family.clientId}-${id}`} type="hidden" name={`${prefix}size_ids`} value={id} />
            ))}
            <input type="hidden" name={`${prefix}primary_image_id`} value={family.primaryTarget.startsWith("existing:") ? family.primaryTarget.replace("existing:", "") : ""} />
            <input type="hidden" name={`${prefix}primary_new_image_index`} value={primaryNewIndex >= 0 ? String(primaryNewIndex) : ""} />
            {orderedUploads.map((image, imageIndex) => (
              <span key={`${family.clientId}-${image.clientId}-${imageIndex}-metadata`}>
                <input type="hidden" name={`${prefix}image_skip`} value={image.delete ? "true" : "false"} />
                <input type="hidden" name={`${prefix}image_role`} value={image.role} />
                <input type="hidden" name={`${prefix}image_view_number`} value={image.viewNumber} />
                <input type="hidden" name={`${prefix}image_color_code`} value={image.colorCode} />
                <input type="hidden" name={`${prefix}image_device_variant`} value={image.deviceVariant} />
                <input type="hidden" name={`${prefix}image_original_name`} value={image.fileName} />
                <input type="hidden" name={`${prefix}image_sort_order`} value={image.sortOrder} />
              </span>
            ))}
            {family.existingImages.map((image) => (
              <span key={`${family.clientId}-${image.id}-metadata`}>
                <input type="hidden" name={`${prefix}existing_image_ids`} value={image.id} />
                <input type="hidden" name={`${prefix}existing_image_role`} value={image.role} />
                <input type="hidden" name={`${prefix}existing_image_view_number`} value={image.viewNumber} />
                <input type="hidden" name={`${prefix}existing_image_color_code`} value={image.colorCode} />
                <input type="hidden" name={`${prefix}existing_image_device_variant`} value={image.deviceVariant} />
                <input type="hidden" name={`${prefix}existing_image_sort_order`} value={image.sortOrder} />
                {image.delete ? <input type="hidden" name={`${prefix}delete_image_ids`} value={image.id} /> : null}
              </span>
            ))}
            <input type="hidden" name={`${prefix}uploaded_image_count`} value={activeOrderedUploads.length} />
          </span>
        );
      })}

      <section className="overflow-hidden border border-roxgold/24 bg-charcoal">
        <div className="grid gap-4 border-b border-bone/10 p-4 lg:grid-cols-[minmax(0,1fr)_360px_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">Product Studio</p>
            <h2 className="headline mt-1 text-3xl leading-none text-bone md:text-4xl">{mode === "create" ? "CREAR PRODUCTO" : draft.modelCode || "EDITAR PRODUCTO"}</h2>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-bone/62">Carga manual de ficha, imagenes numeradas, variantes y datos comerciales.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border border-bone/10 p-3">
              <p className="text-[10px] uppercase tracking-rox text-steel">Errores</p>
              <p className="mt-1 text-2xl font-black text-roxred">{errorCount}</p>
            </div>
            <div className="border border-bone/10 p-3">
              <p className="text-[10px] uppercase tracking-rox text-steel">Imagenes</p>
              <p className="mt-1 text-2xl font-black text-bone">{totalImages}</p>
            </div>
            <div className="border border-bone/10 p-3">
              <p className="text-[10px] uppercase tracking-rox text-steel">Estado</p>
              <p className="mt-1 text-sm font-black uppercase text-roxgold">{draft.status}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRootCollapsed((current) => !current)}
            className="inline-flex min-h-9 items-center justify-center gap-2 border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-roxgold"
            title={rootCollapsed ? "Expandir madre" : "Minimizar madre"}
          >
            {rootCollapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            {rootCollapsed ? "Expandir" : "Minimizar"}
          </button>
        </div>

        {rootCollapsed ? (
          <div className="grid gap-2 px-4 py-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <p className="truncate text-xs font-bold text-bone/72">{draft.name || draft.modelCode || "Producto madre"}</p>
            <p className="text-[10px] font-bold uppercase tracking-rox text-bone/52">{totalImages} imagenes</p>
            <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">{completionScore}% completo</p>
          </div>
        ) : (
        <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
          <main className="grid min-w-0 gap-4">
            <section className={`${panelClass} p-3`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-roxgold">
                  <ClipboardPaste size={16} />
                  <p className="text-[10px] font-bold uppercase tracking-rox">Ficha tecnica</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={handlePasteToStudio} className="min-h-8 border border-roxgold bg-roxgold px-3 text-[10px] font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
                    Pegar al Studio
                  </button>
                  <label className="grid min-h-8 cursor-pointer place-items-center border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-bone">
                    <span className="inline-flex items-center gap-2">
                      <FileText size={14} /> {pdfPending ? "Leyendo PDF" : "Subir ficha"}
                    </span>
                    <input type="file" accept=".txt,.md,.markdown,.json,.csv,.pdf,text/plain,text/markdown,application/json,text/csv,application/pdf" className="sr-only" onChange={handleSheetFile} />
                  </label>
                </div>
              </div>
              <textarea
                value={sheetText}
                onChange={(event) => setSheetText(event.target.value)}
                rows={3}
                placeholder="Pega aca la ficha real del Product Manager. El Studio solo va a usar esos datos."
                className={`${textareaClass} mt-2 max-h-28 min-h-20 w-full resize-y font-mono text-[11px] leading-5`}
              />
              {draft.expectedImages.length > 0 ? (
                <div className="mt-2 grid gap-1 border border-bone/10 p-2 sm:grid-cols-2">
                  {draft.expectedImages.slice(0, 6).map((image) => (
                    <p key={`${image.fileName}-${image.role}`} className="truncate text-[10px] text-bone/64">
                      <span className="text-roxgold">{getImageRoleLabel(image.role)}</span> {image.fileName}
                    </p>
                  ))}
                </div>
              ) : null}
            </section>

            <section
              className={`${imageBoardExpanded ? "fixed inset-2 z-[80] overflow-auto border border-roxgold/45 bg-charcoal p-3 shadow-2xl md:inset-5 md:p-4" : `${panelClass} p-4`} ${isDraggingImages ? "border-roxgold/70" : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingImages(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                setIsDraggingImages(true);
              }}
              onDragLeave={() => setIsDraggingImages(false)}
              onDrop={handleImageDrop}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-roxgold">
                  <ImageIcon size={17} />
                  <p className="text-[10px] font-bold uppercase tracking-rox">Tablero de imagenes</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-bone/10 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-bone/56">Max 5 MB c/u</span>
                  <button type="button" onClick={() => setImageBoardExpanded((current) => !current)} className="inline-flex min-h-9 items-center gap-2 border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-roxgold">
                    {imageBoardExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    {imageBoardExpanded ? "Cerrar" : "Ampliar"}
                  </button>
                  <label htmlFor={activeImageInputId} className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-roxgold/60 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:bg-roxgold hover:text-charcoal">
                    <UploadCloud size={14} /> Cargar imagenes
                  </label>
                </div>
              </div>

              <div className="sr-only">
                {imageInputIds.map((inputId) => (
                  <input key={inputId} id={inputId} name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => handleImages(inputId, event)} />
                ))}
              </div>

              {!boardHasImages ? (
                <label
                  htmlFor={activeImageInputId}
                  className={`mt-4 grid min-h-[320px] cursor-pointer place-items-center border border-dashed p-6 text-center transition ${
                    isDraggingImages ? "border-roxgold bg-roxgold/10" : "border-bone/24 bg-charcoal/70 hover:border-roxgold/70"
                  }`}
                >
                  <span className="grid justify-items-center gap-3">
                    <UploadCloud size={34} className="text-bone/44" />
                    <span className="text-sm font-black text-bone">Arrastra aca las imagenes o una carpeta completa</span>
                    <span className="max-w-md text-xs leading-5 text-bone/54">Tambien podes usar Cargar imagenes. Toma JPG, PNG y WEBP; la primera queda como portada.</span>
                  </span>
                </label>
              ) : (
                <div
                  className={`mt-4 grid gap-3 border border-dashed p-2 md:p-3 ${
                    imageBoardExpanded ? "grid-cols-[repeat(auto-fit,minmax(210px,1fr))]" : "max-h-[min(620px,calc(100vh-220px))] grid-cols-[repeat(auto-fit,minmax(185px,1fr))] overflow-y-hidden overscroll-contain hover:overflow-y-auto"
                  } ${isDraggingImages ? "border-roxgold bg-roxgold/10" : "border-transparent"}`}
                >
                  {sortByStudioOrder(existingImages).map((image) => {
                    const activeIndex = activeExistingImages.findIndex((item) => item.id === image.id);
                    const isPrimary = primaryTarget === `existing:${image.id}`;
                    const isFeatured = !image.delete && activeIndex === 0;

                    return (
                      <div key={image.id} className={`grid gap-2 border p-2 ${isFeatured ? "lg:col-span-2" : ""} ${image.delete ? "border-roxred/45 bg-roxred/10" : isPrimary ? "border-roxgold/55 bg-charcoal" : "border-bone/12 bg-charcoal"}`}>
                        <div className={`relative overflow-hidden border border-bone/10 bg-bone/95 ${isFeatured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image.url} alt={image.label} className="h-full w-full object-contain p-1" />
                          <span className="absolute left-2 top-2 border border-bone/20 bg-ink/82 px-2 py-1 text-[10px] font-black uppercase tracking-rox text-bone">{image.viewNumber || "??"}</span>
                          <span className={`absolute right-2 top-2 border px-2 py-1 text-[9px] font-bold uppercase tracking-rox ${isPrimary ? "border-roxgold/70 bg-roxgold text-charcoal" : "border-bone/20 bg-ink/82 text-bone/70"}`}>
                            {isPrimary ? "Portada" : getImageRoleLabel(image.role)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-bold text-bone/72">{image.label}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-rox text-bone/42">Guardada</p>
                        </div>
                        <ImageControls
                          role={image.role}
                          viewNumber={image.viewNumber}
                          colorCode={image.colorCode}
                          deviceVariant={image.deviceVariant}
                          sortOrder={image.sortOrder}
                          onChange={(patch) => updateExistingImage(image.id, patch)}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <button type="button" title="Subir orden" aria-label="Subir orden" disabled={image.delete || activeIndex <= 0} onClick={() => moveExistingImage(image.id, -1)} className={iconButtonClass}>
                              <ArrowUp size={14} />
                            </button>
                            <button type="button" title="Bajar orden" aria-label="Bajar orden" disabled={image.delete || activeIndex < 0 || activeIndex >= activeExistingImages.length - 1} onClick={() => moveExistingImage(image.id, 1)} className={iconButtonClass}>
                              <ArrowDown size={14} />
                            </button>
                          </div>
                          <div className="flex gap-1">
                            <button type="button" title="Usar como portada" aria-label="Usar como portada" disabled={image.delete} onClick={() => setPrimaryTarget(`existing:${image.id}`)} className={`${iconButtonClass} ${isPrimary ? "border-roxgold bg-roxgold text-charcoal" : ""}`}>
                              <CheckCircle2 size={14} />
                            </button>
                            <button
                              type="button"
                              title={image.delete ? "Deshacer borrar" : "Borrar imagen"}
                              aria-label={image.delete ? "Deshacer borrar" : "Borrar imagen"}
                              onClick={() => {
                                updateExistingImage(image.id, { delete: !image.delete });
                                setPrimaryTarget((current) => (current === `existing:${image.id}` ? "" : current));
                              }}
                              className={`${iconButtonClass} ${image.delete ? "border-roxgold/50 text-roxgold" : "hover:border-roxred hover:text-roxred"}`}
                            >
                              {image.delete ? <RotateCcw size={14} /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </div>
                        {image.delete ? <p className="text-[10px] font-bold uppercase tracking-rox text-roxred">Marcada para borrar</p> : null}
                      </div>
                    );
                  })}

                  {activeUploadedImages.map((image, index) => {
                    const isPrimary = primaryTarget === `new:${image.clientId}`;
                    const isFeatured = activeExistingImages.length === 0 && index === 0;

                    return (
                      <div key={`${image.clientId}-${index}`} className={`grid gap-2 border p-2 ${isFeatured ? "lg:col-span-2" : ""} ${isPrimary ? "border-roxgold/60 bg-charcoal" : "border-roxgold/22 bg-charcoal"}`}>
                        <div className={`relative overflow-hidden border border-bone/10 bg-bone/95 ${isFeatured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image.previewUrl} alt={image.fileName} className="h-full w-full object-contain p-1" />
                          <span className="absolute left-2 top-2 border border-bone/20 bg-ink/82 px-2 py-1 text-[10px] font-black uppercase tracking-rox text-bone">{image.viewNumber || "??"}</span>
                          <span className={`absolute right-2 top-2 border px-2 py-1 text-[9px] font-bold uppercase tracking-rox ${isPrimary ? "border-roxgold/70 bg-roxgold text-charcoal" : "border-bone/20 bg-ink/82 text-bone/70"}`}>
                            {isPrimary ? "Portada" : getImageRoleLabel(image.role)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-bold text-bone/72">{image.fileName}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-rox text-bone/42">Nueva</p>
                        </div>
                        <ImageControls
                          role={image.role}
                          viewNumber={image.viewNumber}
                          colorCode={image.colorCode}
                          deviceVariant={image.deviceVariant}
                          sortOrder={image.sortOrder}
                          onChange={(patch) => updateUploadedImage(image.clientId, patch)}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <button type="button" title="Subir orden" aria-label="Subir orden" disabled={index === 0} onClick={() => moveUploadedImage(image.clientId, -1)} className={iconButtonClass}>
                              <ArrowUp size={14} />
                            </button>
                            <button type="button" title="Bajar orden" aria-label="Bajar orden" disabled={index >= activeUploadedImages.length - 1} onClick={() => moveUploadedImage(image.clientId, 1)} className={iconButtonClass}>
                              <ArrowDown size={14} />
                            </button>
                          </div>
                          <div className="flex gap-1">
                            <button type="button" title="Usar como portada" aria-label="Usar como portada" onClick={() => setPrimaryTarget(`new:${image.clientId}`)} className={`${iconButtonClass} ${isPrimary ? "border-roxgold bg-roxgold text-charcoal" : ""}`}>
                              <CheckCircle2 size={14} />
                            </button>
                            <button type="button" title="Quitar imagen" aria-label="Quitar imagen" onClick={() => removeUploadedImage(image.clientId)} className={`${iconButtonClass} hover:border-roxred hover:text-roxred`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {image.warnings.length > 0 ? (
                          <div className="grid gap-1">
                            {image.warnings.map((warning) => (
                              <p key={warning} className="text-[10px] uppercase tracking-rox text-roxgold">
                                {warning}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className={`${panelClass} p-4`}>
              <div className="flex items-center gap-2 text-roxgold">
                {errorCount > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                <p className="text-[10px] font-bold uppercase tracking-rox">Auditoria</p>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {allNotices.length > 0 ? (
                  allNotices.map((notice, index) => (
                    <p key={`${notice.message}-${index}`} className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-rox ${noticeTone(notice.level)}`}>
                      {notice.message}
                    </p>
                  ))
                ) : (
                  <p className="border border-roxgold/35 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">Listo para guardar</p>
                )}
              </div>
            </section>

          </main>

          <aside className="grid gap-4 self-start xl:sticky xl:top-4">
            <section className={`${panelClass} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-roxgold">
                  <CheckCircle2 size={16} />
                  <p className="text-[10px] font-bold uppercase tracking-rox">Datos del producto</p>
                </div>
                <span className="rounded-full border border-roxgold/35 px-3 py-1 text-[10px] font-bold text-roxgold">{completionScore}% completo</span>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  {fieldLabel("Nombre del producto")}
                  <input name="name" required value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} className={inputClass} />
                </label>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                  <label className="grid gap-2">
                    {fieldLabel("Categoria")}
                    <select
                      name="category_id"
                      required
                      value={draft.categoryId}
                      onChange={(event) => {
                        const option = options.categories.find((item) => item.id === event.target.value);
                        const garment = findGarmentForCategory(option);
                        updateDraft({
                          categoryId: event.target.value,
                          categoryCode: option?.code || "",
                          garmentTypeId: garment?.id || "",
                          garmentTypeCode: garment?.code || ""
                        });
                      }}
                      className={selectClass}
                    >
                      <option value="">Seleccionar</option>
                      {options.categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-2">
                    {fieldLabel("Genero")}
                    <select name="gender" value={draft.gender} onChange={(event) => updateDraft({ gender: event.target.value as ProductStudioDraft["gender"] })} className={selectClass}>
                      <option value="unisex">Unisex</option>
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                    </select>
                    <div className="grid grid-cols-3 gap-1">
                      {(["hombre", "mujer", "unisex"] as ProductStudioDraft["gender"][]).map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => updateDraft({ gender })}
                          className={`min-h-7 border px-2 text-[10px] capitalize transition ${draft.gender === gender ? "border-roxgold text-roxgold" : "border-bone/12 text-bone/54 hover:border-roxgold/60"}`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <label className="grid gap-2">
                    {fieldLabel("Precio")}
                    <input name="price" type="number" min={1} step={1} required value={draft.price} onChange={(event) => updateDraft({ price: event.target.value })} className={inputClass} />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRICE_SHORTCUTS.map((price) => (
                    <button key={price} type="button" onClick={() => updateDraft({ price })} className="min-h-8 border border-bone/12 px-2 text-[10px] text-bone/68 transition hover:border-roxgold hover:text-roxgold">
                      {formatPrice(Number(price))}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                  <label className="grid gap-2">
                    {fieldLabel("Precio anterior")}
                    <input name="compare_at_price" type="number" min={0} step={1} value={draft.compareAtPrice} onChange={(event) => updateDraft({ compareAtPrice: event.target.value })} className={inputClass} />
                  </label>
                  <label className="grid gap-2">
                    {fieldLabel("Estado")}
                    <select name="status" value={draft.status} onChange={(event) => updateDraft({ status: event.target.value as ProductStudioDraft["status"] })} className={selectClass}>
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="sold_out">Agotado</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                  <label className="grid gap-2">
                    {fieldLabel("Codigo modelo")}
                    <input name="model_code" required value={draft.modelCode} onChange={(event) => updateDraft({ modelCode: event.target.value.toUpperCase() })} className={inputClass} />
                  </label>
                  <label className="grid gap-2">
                    {fieldLabel("Slug")}
                    <input name="slug" required value={draft.slug} onChange={(event) => updateDraft({ slug: event.target.value })} className={inputClass} />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                  <label className="grid gap-2">
                    {fieldLabel("Drop / coleccion")}
                    <select
                      name="collection_id"
                      value={draft.collectionId}
                      onChange={(event) => {
                        const option = options.collections.find((item) => item.id === event.target.value);
                        updateDraft({ collectionId: event.target.value, collectionCode: option?.code || "" });
                      }}
                      className={selectClass}
                    >
                      <option value="">Sin drop</option>
                      {options.collections.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    {fieldLabel("Orden visual")}
                    <input name="sort_order" type="number" step={1} value={draft.sortOrder} onChange={(event) => updateDraft({ sortOrder: event.target.value })} className={inputClass} />
                  </label>
                </div>

                <div className="grid gap-2">
                  {fieldLabel("Colores")}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {options.colors.map((color) => {
                      const selected = draft.colorIds.includes(color.id);
                      return (
                        <button
                          key={color.id}
                          type="button"
                          title={color.name}
                          onClick={() => toggleColor(color.id, color.code)}
                          className={`flex min-h-9 items-center gap-2 border px-2 text-left transition ${selected ? "border-roxgold bg-roxgold/10 text-roxgold" : "border-bone/12 text-bone/62 hover:border-roxgold/70"}`}
                        >
                          <span className="h-5 w-5 shrink-0 border border-bone/24 ring-1 ring-bone/20" style={{ backgroundColor: color.hex || "#111111" }} />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-black uppercase tracking-rox">{color.code}</span>
                            <span className="block truncate text-[10px] normal-case tracking-normal text-bone/56">{color.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-2">
                  {fieldLabel("Talles")}
                  <div className="grid grid-cols-4 gap-2">
                    {options.sizes.map((size) => {
                      const selected = draft.sizeIds.includes(size.id);
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => toggleSize(size.id, size.code)}
                          className={`min-h-8 border px-2 text-[10px] font-bold uppercase tracking-rox transition ${selected ? "border-roxgold text-roxgold" : "border-bone/12 text-bone/56 hover:border-roxgold/60"}`}
                        >
                          {size.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="grid gap-2">
                  {fieldLabel("Descripcion corta")}
                  <textarea name="description_short" rows={2} value={draft.descriptionShort} onChange={(event) => updateDraft({ descriptionShort: event.target.value })} className={textareaClass} />
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Descripcion larga")}
                  <textarea name="description_long" rows={4} value={draft.descriptionLong} onChange={(event) => updateDraft({ descriptionLong: event.target.value })} className={textareaClass} />
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Mensaje WhatsApp")}
                  <textarea name="whatsapp_message" rows={2} value={draft.whatsappMessage} onChange={(event) => updateDraft({ whatsappMessage: event.target.value })} className={textareaClass} />
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Variantes: SKU | Talle | Color | Stock")}
                  <textarea name="variants" rows={4} value={variantsToText(draft.variants)} onChange={(event) => updateDraft({ variants: textToVariants(event.target.value) })} className={`${textareaClass} font-mono text-[11px] leading-5`} />
                </label>

                <div className="grid gap-1 border border-bone/10 p-2">
                  <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-rox text-bone/72">
                    <input type="checkbox" name="featured" checked={draft.featured} onChange={(event) => updateDraft({ featured: event.target.checked })} />
                    Destacado en home
                  </label>
                  <p className="text-[9px] uppercase tracking-rox text-bone/45">Recomendado: hasta 10 productos.</p>
                </div>
              </div>
            </section>

            <section className={`${panelClass} p-4`}>
              <div className="flex items-center gap-2 text-roxgold">
                <ImageIcon size={16} />
                <p className="text-[10px] font-bold uppercase tracking-rox">Preview</p>
              </div>
              <div className="mt-3 overflow-hidden border border-bone/12 bg-bone">
                <div className="relative aspect-[3/4]">
                  {coverPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverPreview} alt={draft.name} className="h-full w-full object-contain p-2" />
                      {hoverPreview ? <div className="absolute bottom-2 right-2 border border-roxgold/50 bg-ink/80 px-2 py-1 text-[9px] font-bold uppercase tracking-rox text-roxgold">Hover OK</div> : null}
                    </>
                  ) : (
                    <div className="grid h-full place-items-center bg-charcoal text-xs uppercase tracking-rox text-bone/44">Sin portada</div>
                  )}
                </div>
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">{draft.modelCode || "RXW"}</p>
              <h3 className="headline mt-1 text-2xl leading-none text-bone">{draft.name || "Producto ROXWANA"}</h3>
              <p className="mt-2 text-xs font-black uppercase tracking-rox text-bone">{draft.price ? formatPrice(Number(draft.price)) : "$0"}</p>
              <p className="mt-2 text-xs leading-5 text-bone/58">{draft.descriptionShort || "Descripcion corta pendiente."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="border border-bone/12 px-2 py-1 text-[9px] uppercase tracking-rox text-bone/54">{selectedSizeOptions.map((size) => size.code).join(" ") || "Sin talles"}</span>
                <span className="border border-bone/12 px-2 py-1 text-[9px] uppercase tracking-rox text-bone/54">{selectedColorOptions.map((color) => color.code).join(" ") || "Sin colores"}</span>
              </div>
            </section>

            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 border border-roxgold bg-roxgold px-4 text-[10px] font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
              <Save size={14} /> {submitLabel}
            </button>
          </aside>
        </div>
        )}
      </section>
      {familyDrafts.length > 0 ? (
        <div className="grid gap-4">
          {familyDrafts.map((family, familyIndex) => {
            const prefix = `family_child_${familyIndex}_`;
            const activeFamilyUploadedImages = sortByStudioOrder(family.uploadedImages.filter((image) => !image.delete));
            const activeFamilyExistingImages = sortByStudioOrder(family.existingImages.filter((image) => !image.delete));
            const familyBoardHasImages = family.existingImages.length > 0 || activeFamilyUploadedImages.length > 0;
            const familyCoverPreview = activeFamilyUploadedImages.find((image) => image.role === "cover")?.previewUrl || activeFamilyExistingImages.find((image) => image.role === "cover")?.url || "";
            const familyHoverPreview = activeFamilyUploadedImages.find((image) => image.role === "hover")?.previewUrl || activeFamilyExistingImages.find((image) => image.role === "hover")?.url || "";
            const familySizeOptions = options.sizes.filter((size) => family.draft.sizeIds.includes(size.id));
            const familyCompletionItems = [
              family.draft.modelCode,
              family.draft.name,
              family.draft.slug,
              family.draft.garmentTypeId,
              family.draft.price,
              family.draft.categoryId,
              family.draft.sizeIds.length > 0,
              activeFamilyExistingImages.length + activeFamilyUploadedImages.length > 0,
              family.draft.descriptionShort,
              family.draft.variants.length > 0
            ];
            const familyCompletionScore = Math.round((familyCompletionItems.filter(Boolean).length / familyCompletionItems.length) * 100);

            return (
              <section key={family.clientId} className="overflow-hidden border border-bone/12 bg-charcoal">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/10 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="h-8 w-8 shrink-0 border border-bone/24 ring-1 ring-bone/20" style={{ backgroundColor: family.colorHex || "#111111" }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">Producto hermano · {family.colorCode}</p>
                      <h3 className="headline mt-1 truncate text-2xl leading-none text-bone">{family.draft.modelCode || family.draft.name || family.colorName}</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFamily(family.clientId, { collapsed: !family.collapsed })}
                    className="inline-flex min-h-9 items-center gap-2 border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-roxgold"
                    title={family.collapsed ? "Expandir ficha" : "Minimizar ficha"}
                  >
                    {family.collapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    {family.collapsed ? "Expandir" : "Minimizar"}
                  </button>
                </div>

                <div className="sr-only">
                  {family.imageInputIds.map((inputId) => (
                    <input key={inputId} id={inputId} name={`${prefix}images`} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFamilyImages(family.clientId, inputId, event)} />
                  ))}
                </div>

                {family.collapsed ? (
                  <div className="grid gap-2 px-4 py-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <p className="truncate text-xs font-bold text-bone/72">{family.draft.name || family.colorName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-rox text-bone/52">{activeFamilyExistingImages.length + activeFamilyUploadedImages.length} imagenes</p>
                    <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">{familyCompletionScore}% completo</p>
                  </div>
                ) : (
                  <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
                    <main className="grid min-w-0 gap-4">
                      <section className={`${panelClass} p-3`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-roxgold">
                            <ClipboardPaste size={16} />
                            <p className="text-[10px] font-bold uppercase tracking-rox">Ficha tecnica</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleFamilyPasteToStudio(family.clientId)}
                              className="min-h-8 border border-roxgold bg-roxgold px-3 text-[10px] font-bold uppercase tracking-rox text-charcoal transition hover:border-bone"
                            >
                              Pegar al Studio
                            </button>
                            <label className="grid min-h-8 cursor-pointer place-items-center border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-bone">
                              <span className="inline-flex items-center gap-2">
                                <FileText size={14} /> {pdfPending ? "Leyendo PDF" : "Subir ficha"}
                              </span>
                              <input type="file" accept=".txt,.md,.markdown,.json,.csv,.pdf,text/plain,text/markdown,application/json,text/csv,application/pdf" className="sr-only" onChange={(event) => handleFamilySheetFile(family.clientId, event)} />
                            </label>
                          </div>
                        </div>
                        <textarea
                          value={family.sheetText}
                          onChange={(event) => updateFamily(family.clientId, { sheetText: event.target.value })}
                          rows={3}
                          placeholder={`Pega aca la ficha de ${family.colorName}. El color queda bloqueado en ${family.colorCode}.`}
                          className={`${textareaClass} mt-2 max-h-28 min-h-20 w-full resize-y font-mono text-[11px] leading-5`}
                        />
                        {family.importNotices.length > 0 ? (
                          <div className="mt-2 grid gap-1 md:grid-cols-2">
                            {family.importNotices.map((notice, index) => (
                              <p key={`${family.clientId}-${notice.message}-${index}`} className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-rox ${noticeTone(notice.level)}`}>
                                {notice.message}
                              </p>
                            ))}
                          </div>
                        ) : null}
                        {family.draft.expectedImages.length > 0 ? (
                          <div className="mt-2 grid gap-1 border border-bone/10 p-2 sm:grid-cols-2">
                            {family.draft.expectedImages.slice(0, 6).map((image) => (
                              <p key={`${family.clientId}-${image.fileName}-${image.role}`} className="truncate text-[10px] text-bone/64">
                                <span className="text-roxgold">{getImageRoleLabel(image.role)}</span> {image.fileName}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </section>

                      <section
                        className={`${panelClass} p-4 ${family.isDraggingImages ? "border-roxgold/70" : ""}`}
                        onDragEnter={(event) => {
                          event.preventDefault();
                          updateFamily(family.clientId, { isDraggingImages: true });
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "copy";
                          updateFamily(family.clientId, { isDraggingImages: true });
                        }}
                        onDragLeave={() => updateFamily(family.clientId, { isDraggingImages: false })}
                        onDrop={(event) => handleFamilyImageDrop(family.clientId, event)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2 text-roxgold">
                            <ImageIcon size={17} />
                            <p className="text-[10px] font-bold uppercase tracking-rox">Tablero de imagenes</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="border border-bone/10 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-bone/56">Color fijo {family.colorCode}</span>
                            <button
                              type="button"
                              onClick={() => updateFamily(family.clientId, { imageBoardExpanded: !family.imageBoardExpanded })}
                              className="inline-flex min-h-9 items-center gap-2 border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-roxgold"
                            >
                              {family.imageBoardExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                              {family.imageBoardExpanded ? "Cerrar" : "Ampliar"}
                            </button>
                            <label htmlFor={family.activeImageInputId} className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-roxgold/60 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:bg-roxgold hover:text-charcoal">
                              <UploadCloud size={14} /> Cargar imagenes
                            </label>
                          </div>
                        </div>

                        {!familyBoardHasImages ? (
                          <label
                            htmlFor={family.activeImageInputId}
                            className={`mt-4 grid min-h-[260px] cursor-pointer place-items-center border border-dashed p-6 text-center transition ${
                              family.isDraggingImages ? "border-roxgold bg-roxgold/10" : "border-bone/24 bg-charcoal/70 hover:border-roxgold/70"
                            }`}
                          >
                            <span className="grid justify-items-center gap-3">
                              <UploadCloud size={30} className="text-bone/44" />
                              <span className="text-sm font-black text-bone">Cargar imagenes de {family.colorName}</span>
                              <span className="max-w-md text-xs leading-5 text-bone/54">Arrastra aca las imagenes o usa Cargar imagenes. Las fotos quedan guardadas solo para este color hermano.</span>
                            </span>
                          </label>
                        ) : (
                          <div
                            className={`mt-4 grid gap-3 border border-dashed p-2 md:p-3 ${family.imageBoardExpanded ? "grid-cols-[repeat(auto-fit,minmax(210px,1fr))]" : "max-h-[520px] grid-cols-[repeat(auto-fit,minmax(185px,1fr))] overflow-y-hidden hover:overflow-y-auto"} ${
                              family.isDraggingImages ? "border-roxgold bg-roxgold/10" : "border-transparent"
                            }`}
                          >
                            {sortByStudioOrder(family.existingImages).map((image) => {
                              const activeIndex = activeFamilyExistingImages.findIndex((item) => item.id === image.id);
                              const isPrimary = family.primaryTarget === `existing:${image.id}`;

                              return (
                                <div key={image.id} className={`grid gap-2 border p-2 ${image.delete ? "border-roxred/45 bg-roxred/10" : isPrimary ? "border-roxgold/55 bg-charcoal" : "border-bone/12 bg-charcoal"}`}>
                                  <div className="relative aspect-[4/3] overflow-hidden border border-bone/10 bg-bone/95">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={image.url} alt={image.label} className="h-full w-full object-contain p-1" />
                                    <span className="absolute left-2 top-2 border border-bone/20 bg-ink/82 px-2 py-1 text-[10px] font-black uppercase tracking-rox text-bone">{image.viewNumber || "??"}</span>
                                    <span className={`absolute right-2 top-2 border px-2 py-1 text-[9px] font-bold uppercase tracking-rox ${isPrimary ? "border-roxgold/70 bg-roxgold text-charcoal" : "border-bone/20 bg-ink/82 text-bone/70"}`}>
                                      {isPrimary ? "Portada" : getImageRoleLabel(image.role)}
                                    </span>
                                  </div>
                                  <p className="truncate text-[11px] font-bold text-bone/72">{image.label}</p>
                                  <ImageControls role={image.role} viewNumber={image.viewNumber} colorCode={image.colorCode} deviceVariant={image.deviceVariant} sortOrder={image.sortOrder} onChange={(patch) => updateFamilyExistingImage(family.clientId, image.id, patch)} />
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex gap-1">
                                      <button type="button" title="Subir orden" aria-label="Subir orden" disabled={image.delete || activeIndex <= 0} onClick={() => moveFamilyExistingImage(family.clientId, image.id, -1)} className={iconButtonClass}>
                                        <ArrowUp size={14} />
                                      </button>
                                      <button type="button" title="Bajar orden" aria-label="Bajar orden" disabled={image.delete || activeIndex < 0 || activeIndex >= activeFamilyExistingImages.length - 1} onClick={() => moveFamilyExistingImage(family.clientId, image.id, 1)} className={iconButtonClass}>
                                        <ArrowDown size={14} />
                                      </button>
                                    </div>
                                    <div className="flex gap-1">
                                      <button type="button" title="Usar como portada" aria-label="Usar como portada" disabled={image.delete} onClick={() => updateFamily(family.clientId, { primaryTarget: `existing:${image.id}` })} className={`${iconButtonClass} ${isPrimary ? "border-roxgold bg-roxgold text-charcoal" : ""}`}>
                                        <CheckCircle2 size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        title={image.delete ? "Deshacer borrar" : "Borrar imagen"}
                                        aria-label={image.delete ? "Deshacer borrar" : "Borrar imagen"}
                                        onClick={() => {
                                          updateFamilyExistingImage(family.clientId, image.id, { delete: !image.delete });
                                          updateFamily(family.clientId, { primaryTarget: family.primaryTarget === `existing:${image.id}` ? "" : family.primaryTarget });
                                        }}
                                        className={`${iconButtonClass} ${image.delete ? "border-roxgold/50 text-roxgold" : "hover:border-roxred hover:text-roxred"}`}
                                      >
                                        {image.delete ? <RotateCcw size={14} /> : <Trash2 size={14} />}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {activeFamilyUploadedImages.map((image, imageIndex) => {
                              const isPrimary = family.primaryTarget === `new:${image.clientId}`;

                              return (
                                <div key={`${image.clientId}-${imageIndex}`} className={`grid gap-2 border p-2 ${isPrimary ? "border-roxgold/60 bg-charcoal" : "border-roxgold/22 bg-charcoal"}`}>
                                  <div className="relative aspect-[4/3] overflow-hidden border border-bone/10 bg-bone/95">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={image.previewUrl} alt={image.fileName} className="h-full w-full object-contain p-1" />
                                    <span className="absolute left-2 top-2 border border-bone/20 bg-ink/82 px-2 py-1 text-[10px] font-black uppercase tracking-rox text-bone">{image.viewNumber || "??"}</span>
                                    <span className={`absolute right-2 top-2 border px-2 py-1 text-[9px] font-bold uppercase tracking-rox ${isPrimary ? "border-roxgold/70 bg-roxgold text-charcoal" : "border-bone/20 bg-ink/82 text-bone/70"}`}>
                                      {isPrimary ? "Portada" : getImageRoleLabel(image.role)}
                                    </span>
                                  </div>
                                  <p className="truncate text-[11px] font-bold text-bone/72">{image.fileName}</p>
                                  <ImageControls role={image.role} viewNumber={image.viewNumber} colorCode={image.colorCode} deviceVariant={image.deviceVariant} sortOrder={image.sortOrder} onChange={(patch) => updateFamilyUploadedImage(family.clientId, image.clientId, patch)} />
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex gap-1">
                                      <button type="button" title="Subir orden" aria-label="Subir orden" disabled={imageIndex === 0} onClick={() => moveFamilyUploadedImage(family.clientId, image.clientId, -1)} className={iconButtonClass}>
                                        <ArrowUp size={14} />
                                      </button>
                                      <button type="button" title="Bajar orden" aria-label="Bajar orden" disabled={imageIndex >= activeFamilyUploadedImages.length - 1} onClick={() => moveFamilyUploadedImage(family.clientId, image.clientId, 1)} className={iconButtonClass}>
                                        <ArrowDown size={14} />
                                      </button>
                                    </div>
                                    <div className="flex gap-1">
                                      <button type="button" title="Usar como portada" aria-label="Usar como portada" onClick={() => updateFamily(family.clientId, { primaryTarget: `new:${image.clientId}` })} className={`${iconButtonClass} ${isPrimary ? "border-roxgold bg-roxgold text-charcoal" : ""}`}>
                                        <CheckCircle2 size={14} />
                                      </button>
                                      <button type="button" title="Quitar imagen" aria-label="Quitar imagen" onClick={() => removeFamilyUploadedImage(family.clientId, image.clientId)} className={`${iconButtonClass} hover:border-roxred hover:text-roxred`}>
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    </main>

                    <aside className="grid gap-4 self-start xl:sticky xl:top-4">
                      <section className={`${panelClass} p-4`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-roxgold">
                            <CheckCircle2 size={16} />
                            <p className="text-[10px] font-bold uppercase tracking-rox">Datos del producto</p>
                          </div>
                          <span className="rounded-full border border-roxgold/35 px-3 py-1 text-[10px] font-bold text-roxgold">{familyCompletionScore}% completo</span>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <label className="grid gap-2">
                            {fieldLabel("Nombre del producto")}
                            <input required value={family.draft.name} onChange={(event) => updateFamilyDraft(family.clientId, { name: event.target.value })} className={inputClass} />
                          </label>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                            <label className="grid gap-2">
                              {fieldLabel("Categoria")}
                              <select
                                required
                                value={family.draft.categoryId}
                                onChange={(event) => {
                                  const option = options.categories.find((item) => item.id === event.target.value);
                                  const garment = findGarmentForCategory(option);
                                  updateFamilyDraft(family.clientId, {
                                    categoryId: event.target.value,
                                    categoryCode: option?.code || "",
                                    garmentTypeId: garment?.id || "",
                                    garmentTypeCode: garment?.code || ""
                                  });
                                }}
                                className={selectClass}
                              >
                                <option value="">Seleccionar</option>
                                {options.categories.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="grid gap-2">
                              {fieldLabel("Genero")}
                              <select value={family.draft.gender} onChange={(event) => updateFamilyDraft(family.clientId, { gender: event.target.value as ProductStudioDraft["gender"] })} className={selectClass}>
                                <option value="unisex">Unisex</option>
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                              </select>
                            </label>
                          </div>

                          <label className="grid gap-2">
                            {fieldLabel("Precio")}
                            <input type="number" min={1} step={1} required value={family.draft.price} onChange={(event) => updateFamilyDraft(family.clientId, { price: event.target.value })} className={inputClass} />
                          </label>

                          <div className="grid grid-cols-4 gap-2">
                            {PRICE_SHORTCUTS.map((price) => (
                              <button key={price} type="button" onClick={() => updateFamilyDraft(family.clientId, { price })} className="min-h-8 border border-bone/12 px-2 text-[10px] text-bone/68 transition hover:border-roxgold hover:text-roxgold">
                                {formatPrice(Number(price))}
                              </button>
                            ))}
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                            <label className="grid gap-2">
                              {fieldLabel("Precio anterior")}
                              <input type="number" min={0} step={1} value={family.draft.compareAtPrice} onChange={(event) => updateFamilyDraft(family.clientId, { compareAtPrice: event.target.value })} className={inputClass} />
                            </label>
                            <label className="grid gap-2">
                              {fieldLabel("Estado")}
                              <select value={family.draft.status} onChange={(event) => updateFamilyDraft(family.clientId, { status: event.target.value as ProductStudioDraft["status"] })} className={selectClass}>
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="sold_out">Agotado</option>
                              </select>
                            </label>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                            <label className="grid gap-2">
                              {fieldLabel("Codigo modelo")}
                              <input required value={family.draft.modelCode} onChange={(event) => updateFamilyDraft(family.clientId, { modelCode: event.target.value.toUpperCase() })} className={inputClass} />
                            </label>
                            <label className="grid gap-2">
                              {fieldLabel("Slug")}
                              <input required value={family.draft.slug} onChange={(event) => updateFamilyDraft(family.clientId, { slug: event.target.value })} className={inputClass} />
                            </label>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                            <label className="grid gap-2">
                              {fieldLabel("Drop / coleccion")}
                              <select
                                value={family.draft.collectionId}
                                onChange={(event) => {
                                  const option = options.collections.find((item) => item.id === event.target.value);
                                  updateFamilyDraft(family.clientId, { collectionId: event.target.value, collectionCode: option?.code || "" });
                                }}
                                className={selectClass}
                              >
                                <option value="">Sin drop</option>
                                {options.collections.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="grid gap-2">
                              {fieldLabel("Orden visual")}
                              <input type="number" step={1} value={family.draft.sortOrder} onChange={(event) => updateFamilyDraft(family.clientId, { sortOrder: event.target.value })} className={inputClass} />
                            </label>
                          </div>

                          <div className="grid gap-2">
                            {fieldLabel("Color bloqueado")}
                            <div className="flex min-h-9 items-center gap-2 border border-roxgold bg-roxgold/10 px-2 text-roxgold">
                              <span className="h-5 w-5 shrink-0 border border-bone/24 ring-1 ring-bone/20" style={{ backgroundColor: family.colorHex || "#111111" }} />
                              <span className="min-w-0">
                                <span className="block text-[10px] font-black uppercase tracking-rox">{family.colorCode}</span>
                                <span className="block truncate text-[10px] normal-case tracking-normal text-bone/56">{family.colorName}</span>
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            {fieldLabel("Talles")}
                            <div className="grid grid-cols-4 gap-2">
                              {options.sizes.map((size) => {
                                const selected = family.draft.sizeIds.includes(size.id);
                                return (
                                  <button
                                    key={size.id}
                                    type="button"
                                    onClick={() =>
                                      updateFamilyDraft(family.clientId, {
                                        sizeIds: selected ? family.draft.sizeIds.filter((item) => item !== size.id) : [...family.draft.sizeIds, size.id],
                                        sizeCodes: selected ? family.draft.sizeCodes.filter((item) => item !== size.code) : Array.from(new Set([...family.draft.sizeCodes, size.code]))
                                      })
                                    }
                                    className={`min-h-8 border px-2 text-[10px] font-bold uppercase tracking-rox transition ${selected ? "border-roxgold text-roxgold" : "border-bone/12 text-bone/56 hover:border-roxgold/60"}`}
                                  >
                                    {size.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <label className="grid gap-2">
                            {fieldLabel("Descripcion corta")}
                            <textarea rows={2} value={family.draft.descriptionShort} onChange={(event) => updateFamilyDraft(family.clientId, { descriptionShort: event.target.value })} className={textareaClass} />
                          </label>
                          <label className="grid gap-2">
                            {fieldLabel("Descripcion larga")}
                            <textarea rows={4} value={family.draft.descriptionLong} onChange={(event) => updateFamilyDraft(family.clientId, { descriptionLong: event.target.value })} className={textareaClass} />
                          </label>
                          <label className="grid gap-2">
                            {fieldLabel("Mensaje WhatsApp")}
                            <textarea rows={2} value={family.draft.whatsappMessage} onChange={(event) => updateFamilyDraft(family.clientId, { whatsappMessage: event.target.value })} className={textareaClass} />
                          </label>
                          <label className="grid gap-2">
                            {fieldLabel("Variantes: SKU | Talle | Color | Stock")}
                            <textarea rows={4} value={variantsToText(family.draft.variants)} onChange={(event) => updateFamilyDraft(family.clientId, { variants: textToVariants(event.target.value) })} className={`${textareaClass} font-mono text-[11px] leading-5`} />
                          </label>

                          <div className="grid gap-1 border border-bone/10 p-2">
                            <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-rox text-bone/72">
                              <input type="checkbox" checked={family.draft.featured} onChange={(event) => updateFamilyDraft(family.clientId, { featured: event.target.checked })} />
                              Destacado en home
                            </label>
                            <p className="text-[9px] uppercase tracking-rox text-bone/45">Normalmente destacas la madre; esto queda editable por si lo necesitas.</p>
                          </div>
                        </div>
                      </section>

                      <section className={`${panelClass} p-4`}>
                        <div className="flex items-center gap-2 text-roxgold">
                          <ImageIcon size={16} />
                          <p className="text-[10px] font-bold uppercase tracking-rox">Preview</p>
                        </div>
                        <div className="mt-3 overflow-hidden border border-bone/12 bg-bone">
                          <div className="relative aspect-[3/4]">
                            {familyCoverPreview ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={familyCoverPreview} alt={family.draft.name} className="h-full w-full object-contain p-2" />
                                {familyHoverPreview ? <div className="absolute bottom-2 right-2 border border-roxgold/50 bg-ink/80 px-2 py-1 text-[9px] font-bold uppercase tracking-rox text-roxgold">Hover OK</div> : null}
                              </>
                            ) : (
                              <div className="grid h-full place-items-center bg-charcoal text-xs uppercase tracking-rox text-bone/44">Sin portada</div>
                            )}
                          </div>
                        </div>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">{family.draft.modelCode || "RXW"}</p>
                        <h3 className="headline mt-1 text-2xl leading-none text-bone">{family.draft.name || "Producto ROXWANA"}</h3>
                        <p className="mt-2 text-xs font-black uppercase tracking-rox text-bone">{family.draft.price ? formatPrice(Number(family.draft.price)) : "$0"}</p>
                        <p className="mt-2 text-xs leading-5 text-bone/58">{family.draft.descriptionShort || "Descripcion corta pendiente."}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="border border-bone/12 px-2 py-1 text-[9px] uppercase tracking-rox text-bone/54">{familySizeOptions.map((size) => size.code).join(" ") || "Sin talles"}</span>
                          <span className="border border-bone/12 px-2 py-1 text-[9px] uppercase tracking-rox text-bone/54">{family.colorCode}</span>
                        </div>
                      </section>
                    </aside>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : null}
    </form>
  );
}

function ImageControls({
  role,
  viewNumber,
  colorCode,
  deviceVariant,
  sortOrder,
  onChange
}: {
  role: StudioImageRole;
  viewNumber: string;
  colorCode: string;
  deviceVariant: StudioDeviceVariant;
  sortOrder: string;
  onChange: (patch: ImageControlsPatch) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(82px,1fr))] gap-2">
        <label className="grid gap-1">
          {fieldLabel("Rol")}
          <select value={role} onChange={(event) => onChange({ role: event.target.value as StudioImageRole })} className={`${selectClass} min-w-0`}>
            {ROLE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {getImageRoleLabel(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          {fieldLabel("Device")}
          <select value={deviceVariant} onChange={(event) => onChange({ deviceVariant: event.target.value as StudioDeviceVariant })} className={`${selectClass} min-w-0`}>
            {DEVICE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(58px,1fr))] gap-2">
        <label className="grid gap-1">
          {fieldLabel("Numero")}
          <input value={viewNumber} onChange={(event) => onChange({ viewNumber: event.target.value })} className={`${inputClass} min-w-0`} />
        </label>
        <label className="grid gap-1">
          {fieldLabel("Color")}
          <input value={colorCode} onChange={(event) => onChange({ colorCode: event.target.value.toUpperCase() })} className={`${inputClass} min-w-0`} />
        </label>
        <label className="grid gap-1">
          {fieldLabel("Orden")}
          <input type="number" value={sortOrder} onChange={(event) => onChange({ sortOrder: event.target.value })} className={`${inputClass} min-w-0`} />
        </label>
      </div>
    </div>
  );
}
