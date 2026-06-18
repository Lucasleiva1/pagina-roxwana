"use client";

import { ChangeEvent, FormEvent, useMemo, useState, useTransition } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ClipboardPaste, FileText, Image as ImageIcon, RotateCcw, Save, Trash2, UploadCloud } from "lucide-react";
import type { Product } from "@/types/product";
import { extractProductSheetPdfText } from "@/lib/product-studio/actions";
import { inferImportFormat, parseProductStudioSheet } from "@/lib/product-studio/parser";
import {
  buildProductSheetExample,
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

const ROLE_OPTIONS: StudioImageRole[] = ["cover", "gallery", "hover", "lifestyle", "technical", "detail"];
const DEVICE_OPTIONS: StudioDeviceVariant[] = ["desktop", "mobile", "base"];
const INITIAL_IMAGE_INPUT_ID = "studio-image-input-0";

const inputClass = "min-h-9 border border-bone/12 bg-ink px-3 text-xs normal-case tracking-normal text-bone outline-none transition focus:border-roxgold";
const selectClass = "min-h-9 border border-bone/12 bg-ink px-3 text-xs normal-case tracking-normal text-bone outline-none transition focus:border-roxgold";
const textareaClass = "border border-bone/12 bg-ink px-3 py-2 text-xs normal-case tracking-normal text-bone outline-none transition focus:border-roxgold";
const iconButtonClass = "inline-grid h-8 w-8 place-items-center border border-bone/12 text-bone/64 transition hover:border-roxgold hover:text-roxgold disabled:pointer-events-none disabled:opacity-30";

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

function sortByStudioOrder<T extends { sortOrder: string; fileName?: string; label?: string }>(images: T[]) {
  return [...images].sort((a, b) => {
    const orderDiff = numericOrder(a.sortOrder, 9999) - numericOrder(b.sortOrder, 9999);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return (a.fileName || a.label || "").localeCompare(b.fileName || b.label || "");
  });
}

export function ProductStudio({ mode, product, options, action, submitLabel }: ProductStudioProps) {
  const [draft, setDraft] = useState<ProductStudioDraft>(() => productToStudioDraft(product, options));
  const [sheetText, setSheetText] = useState(buildProductSheetExample());
  const [importNotices, setImportNotices] = useState<StudioNotice[]>([]);
  const [saveError, setSaveError] = useState<StudioNotice | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadImageDraft[]>([]);
  const [imageInputIds, setImageInputIds] = useState([INITIAL_IMAGE_INPUT_ID]);
  const [activeImageInputId, setActiveImageInputId] = useState(INITIAL_IMAGE_INPUT_ID);
  const [nextImageInputIndex, setNextImageInputIndex] = useState(1);
  const [existingImages, setExistingImages] = useState<ExistingImageDraft[]>(() => makeExistingImageDrafts(product));
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
  const allNotices = [...validationNotices, ...importNotices, ...(saveError ? [saveError] : [])];
  const errorCount = allNotices.filter((notice) => notice.level === "error").length;
  const coverPreview = activeUploadedImages.find((image) => image.role === "cover")?.previewUrl || activeExistingImages.find((image) => image.role === "cover")?.url || product?.image || "";
  const hoverPreview = activeUploadedImages.find((image) => image.role === "hover")?.previewUrl || activeExistingImages.find((image) => image.role === "hover")?.url || "";

  function updateDraft(patch: Partial<ProductStudioDraft>) {
    setSaveError(null);
    setDraft((current) => mergeStudioDraft(current, patch));
  }

  function validateBeforeSubmit(event: FormEvent<HTMLFormElement>) {
    const firstError = validationNotices.find((notice) => notice.level === "error");

    if (!firstError) {
      setSaveError(null);
      return;
    }

    event.preventDefault();
    setSaveError({
      level: "error",
      message: `No se guardó: ${firstError.message}`
    });
  }

  function applyImport(text: string, fileName = "ficha.txt") {
    const format = inferImportFormat(fileName);
    const result = parseProductStudioSheet(text, format === "pdf" ? "text" : format, options);
    setDraft((current) => mergeStudioDraft(current, result.draft));
    setImportNotices(result.notices.length > 0 ? result.notices : [{ level: "info", message: "Ficha importada al borrador Studio." }]);
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

  function handleImages(inputId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files || []);

    if (files.length === 0) {
      return;
    }

    const activeCount = activeUploadedImages.length + activeExistingImages.length;
    const hasCover = activeUploadedImages.some((image) => image.role === "cover") || activeExistingImages.some((image) => image.role === "cover");
    const images = files.map<UploadImageDraft>((file, index) => {
      const parsed = parseProductImageName(file.name);
      const fallbackPosition = activeCount + index + 1;
      const fallbackViewNumber = String(fallbackPosition).padStart(2, "0");
      const role = parsed.viewNumber ? parsed.role : parsed.role !== "gallery" ? parsed.role : !hasCover && index === 0 ? "cover" : "gallery";
      return {
        clientId: `${inputId}-${file.name}-${file.size}-${file.lastModified}-${index}`,
        inputId,
        fileIndex: index,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
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
  }

  function toggleColor(id: string, code: string) {
    const selected = draft.colorIds.includes(id);
    updateDraft({
      colorIds: selected ? draft.colorIds.filter((item) => item !== id) : [...draft.colorIds, id],
      colorCodes: selected ? draft.colorCodes.filter((item) => item !== code) : Array.from(new Set([...draft.colorCodes, code]))
    });
  }

  function toggleSize(id: string, code: string) {
    const selected = draft.sizeIds.includes(id);
    updateDraft({
      sizeIds: selected ? draft.sizeIds.filter((item) => item !== id) : [...draft.sizeIds, id],
      sizeCodes: selected ? draft.sizeCodes.filter((item) => item !== code) : Array.from(new Set([...draft.sizeCodes, code]))
    });
  }

  function updateUploadedImage(clientId: string, patch: Partial<UploadImageDraft>) {
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

  function updateExistingImage(id: string, patch: Partial<ExistingImageDraft>) {
    setExistingImages((images) => images.map((image) => (image.id === id ? { ...image, ...patch } : image)));
  }

  return (
    <form action={action} onSubmit={validateBeforeSubmit} className="grid gap-4">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="primary_image_id" value={primaryTarget.startsWith("existing:") ? primaryTarget.replace("existing:", "") : ""} />
      <input type="hidden" name="primary_new_image_index" value={primaryNewImageIndex >= 0 ? String(primaryNewImageIndex) : ""} />
      {draft.colorIds.map((id) => (
        <input key={id} type="hidden" name="color_ids" value={id} />
      ))}
      {draft.sizeIds.map((id) => (
        <input key={id} type="hidden" name="size_ids" value={id} />
      ))}
      {fileOrderedUploadedImages.map((image) => (
        <span key={`${image.clientId}-metadata`}>
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

      <section className="overflow-hidden border border-roxgold/24 bg-charcoal">
        <div className="grid gap-4 border-b border-bone/10 p-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">Product Studio</p>
            <h2 className="headline mt-1 text-3xl leading-none text-bone md:text-4xl">{mode === "create" ? "NUEVO MODELO" : draft.modelCode || "EDITAR MODELO"}</h2>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-bone/62">Carga tecnica de producto, ficha, variantes e imagenes numeradas en un solo flujo.</p>
          </div>
          <div className="grid content-end gap-2 sm:grid-cols-3">
            <div className="border border-bone/10 p-3">
              <p className="text-[10px] uppercase tracking-rox text-steel">Errores</p>
              <p className="mt-1 text-2xl font-black text-roxred">{errorCount}</p>
            </div>
            <div className="border border-bone/10 p-3">
              <p className="text-[10px] uppercase tracking-rox text-steel">Imagenes</p>
              <p className="mt-1 text-2xl font-black text-bone">{activeExistingImages.length + activeUploadedImages.length}</p>
            </div>
            <div className="border border-bone/10 p-3">
              <p className="text-[10px] uppercase tracking-rox text-steel">Estado</p>
              <p className="mt-1 text-sm font-black uppercase text-roxgold">{draft.status}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
          <aside className="grid gap-3 self-start border border-bone/12 bg-ink/72 p-3">
            <div className="flex items-center gap-2 text-roxgold">
              <ClipboardPaste size={16} />
              <p className="text-[10px] font-bold uppercase tracking-rox">Ficha</p>
            </div>
            <textarea value={sheetText} onChange={(event) => setSheetText(event.target.value)} rows={11} className={`${textareaClass} font-mono text-[11px] leading-5`} />
            <div className="grid gap-2">
              <button type="button" onClick={() => applyImport(sheetText)} className="min-h-9 border border-roxgold bg-roxgold px-3 text-[10px] font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
                Pegar al Studio
              </button>
              <label className="grid min-h-9 cursor-pointer place-items-center border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/74 transition hover:border-roxgold hover:text-bone">
                <span className="inline-flex items-center gap-2">
                  <FileText size={14} /> {pdfPending ? "Leyendo PDF" : "Subir ficha"}
                </span>
                <input type="file" accept=".txt,.md,.markdown,.json,.csv,.pdf,text/plain,text/markdown,application/json,text/csv,application/pdf" className="sr-only" onChange={handleSheetFile} />
              </label>
            </div>
            {draft.expectedImages.length > 0 ? (
              <div className="border border-bone/10 p-2">
                <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Imagenes esperadas</p>
                <div className="mt-2 grid gap-1">
                  {draft.expectedImages.slice(0, 8).map((image) => (
                    <p key={`${image.fileName}-${image.role}`} className="truncate text-xs text-bone/64">
                      <span className="text-roxgold">{getImageRoleLabel(image.role)}</span> {image.fileName}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <main className="grid min-w-0 gap-4">
            <section className="border border-bone/12 bg-ink/72 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2">
                  {fieldLabel("Codigo modelo")}
                  <input name="model_code" required value={draft.modelCode} onChange={(event) => updateDraft({ modelCode: event.target.value.toUpperCase() })} className={inputClass} />
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Nombre")}
                  <input name="name" required value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} className={inputClass} />
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Slug")}
                  <input name="slug" required value={draft.slug} onChange={(event) => updateDraft({ slug: event.target.value })} className={inputClass} />
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Prenda")}
                  <select
                    name="garment_type_id"
                    required
                    value={draft.garmentTypeId}
                    onChange={(event) => {
                      const option = options.garmentTypes.find((item) => item.id === event.target.value);
                      updateDraft({ garmentTypeId: event.target.value, garmentTypeCode: option?.code || "" });
                    }}
                    className={selectClass}
                  >
                    <option value="">Elegir</option>
                    {options.garmentTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  {fieldLabel("Genero")}
                  <select name="gender" value={draft.gender} onChange={(event) => updateDraft({ gender: event.target.value as ProductStudioDraft["gender"] })} className={selectClass}>
                    <option value="unisex">Unisex</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                  </select>
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
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="border border-bone/12 bg-ink/72 p-3">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">Comercial</p>
                <div className="grid gap-3">
                  <label className="grid gap-2">
                    {fieldLabel("Precio")}
                    <input name="price" type="number" min={1} step={1} required value={draft.price} onChange={(event) => updateDraft({ price: event.target.value })} className={inputClass} />
                  </label>
                  <label className="grid gap-2">
                    {fieldLabel("Precio anterior")}
                    <input name="compare_at_price" type="number" min={0} step={1} value={draft.compareAtPrice} onChange={(event) => updateDraft({ compareAtPrice: event.target.value })} className={inputClass} />
                  </label>
                  <label className="grid gap-2">
                    {fieldLabel("Orden visual")}
                    <input name="sort_order" type="number" step={1} value={draft.sortOrder} onChange={(event) => updateDraft({ sortOrder: event.target.value })} className={inputClass} />
                  </label>
                  <div className="grid gap-1 border border-bone/10 p-2">
                    <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-rox text-bone/72">
                      <input type="checkbox" name="featured" checked={draft.featured} onChange={(event) => updateDraft({ featured: event.target.checked })} />
                      Destacado en home
                    </label>
                    <p className="text-[9px] uppercase tracking-rox text-bone/45">Sin límite. Recomendado: hasta 10.</p>
                  </div>
                </div>
              </div>

              <div className="border border-bone/12 bg-ink/72 p-3">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">Taxonomia</p>
                <div className="grid gap-3">
                  <label className="grid gap-2">
                    {fieldLabel("Categoria")}
                    <select
                      name="category_id"
                      value={draft.categoryId}
                      onChange={(event) => {
                        const option = options.categories.find((item) => item.id === event.target.value);
                        updateDraft({ categoryId: event.target.value, categoryCode: option?.code || "" });
                      }}
                      className={selectClass}
                    >
                      <option value="">Elegir</option>
                      {options.categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
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
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="border border-bone/12 bg-ink/72 p-3">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">Colores</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.colors.map((color) => {
                    const selected = draft.colorIds.includes(color.id);
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => toggleColor(color.id, color.code)}
                        className={`flex min-h-9 items-center gap-2 border px-2 text-left text-[10px] font-bold uppercase tracking-rox transition ${
                          selected ? "border-roxgold text-bone" : "border-bone/12 text-bone/56 hover:border-roxgold/60"
                        }`}
                      >
                        <span className="h-3.5 w-3.5 border border-bone/24" style={{ backgroundColor: color.hex || "#111111" }} />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="border border-bone/12 bg-ink/72 p-3">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">Talles</p>
                <div className="grid grid-cols-3 gap-2">
                  {options.sizes.map((size) => {
                    const selected = draft.sizeIds.includes(size.id);
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => toggleSize(size.id, size.code)}
                        className={`min-h-9 border px-2 text-[10px] font-bold uppercase tracking-rox transition ${selected ? "border-roxgold text-bone" : "border-bone/12 text-bone/56 hover:border-roxgold/60"}`}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="border border-bone/12 bg-ink/72 p-3">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">Descripcion y stock</p>
              <div className="grid gap-3">
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
              </div>
            </section>

            <section className="border border-bone/12 bg-ink/72 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">Imagenes</p>
                <label htmlFor={activeImageInputId} className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-roxgold/60 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:bg-roxgold hover:text-charcoal">
                  <UploadCloud size={14} /> Subir imagenes
                </label>
              </div>
              <div className="sr-only">
                {imageInputIds.map((inputId) => (
                  <input key={inputId} id={inputId} name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => handleImages(inputId, event)} />
                ))}
              </div>

              {existingImages.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Guardadas</p>
                  <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {sortByStudioOrder(existingImages).map((image) => {
                      const activeIndex = activeExistingImages.findIndex((item) => item.id === image.id);

                      return (
                      <div key={image.id} className={`grid gap-3 border p-3 ${image.delete ? "border-roxred/45 bg-roxred/10" : "border-bone/12 bg-charcoal"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="min-w-0 truncate text-[11px] text-bone/64">{image.label}</p>
                          <div className="flex shrink-0 items-center gap-1">
                            <button type="button" title="Subir orden" aria-label="Subir orden" disabled={image.delete || activeIndex <= 0} onClick={() => moveExistingImage(image.id, -1)} className={iconButtonClass}>
                              <ArrowUp size={14} />
                            </button>
                            <button type="button" title="Bajar orden" aria-label="Bajar orden" disabled={image.delete || activeIndex < 0 || activeIndex >= activeExistingImages.length - 1} onClick={() => moveExistingImage(image.id, 1)} className={iconButtonClass}>
                              <ArrowDown size={14} />
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
                        <div className="aspect-[4/5] overflow-hidden border border-bone/10 bg-ink">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image.url} alt={image.label} className="h-full w-full object-cover" />
                        </div>
                        <ImageControls
                          role={image.role}
                          viewNumber={image.viewNumber}
                          colorCode={image.colorCode}
                          deviceVariant={image.deviceVariant}
                          sortOrder={image.sortOrder}
                          onChange={(patch) => updateExistingImage(image.id, patch)}
                        />
                        <div className="grid gap-2 text-[11px] text-bone/72">
                          <label className="flex items-center gap-2">
                            <input type="radio" checked={primaryTarget === `existing:${image.id}`} disabled={image.delete} onChange={() => setPrimaryTarget(`existing:${image.id}`)} />
                            Portada al guardar
                          </label>
                          {image.delete ? <p className="text-roxred">Marcada para borrar</p> : null}
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              ) : null}

              {activeUploadedImages.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Nuevas</p>
                  <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {activeUploadedImages.map((image, index) => (
                      <div key={image.clientId} className="grid gap-3 border border-roxgold/22 bg-charcoal p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="min-w-0 truncate text-[11px] text-bone/64">{image.fileName}</p>
                          <div className="flex shrink-0 items-center gap-1">
                            <button type="button" title="Subir orden" aria-label="Subir orden" disabled={index === 0} onClick={() => moveUploadedImage(image.clientId, -1)} className={iconButtonClass}>
                              <ArrowUp size={14} />
                            </button>
                            <button type="button" title="Bajar orden" aria-label="Bajar orden" disabled={index >= activeUploadedImages.length - 1} onClick={() => moveUploadedImage(image.clientId, 1)} className={iconButtonClass}>
                              <ArrowDown size={14} />
                            </button>
                            <button type="button" title="Quitar imagen" aria-label="Quitar imagen" onClick={() => removeUploadedImage(image.clientId)} className={`${iconButtonClass} hover:border-roxred hover:text-roxred`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="aspect-[4/5] overflow-hidden border border-bone/10 bg-ink">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image.previewUrl} alt={image.fileName} className="h-full w-full object-cover" />
                        </div>
                        <ImageControls
                          role={image.role}
                          viewNumber={image.viewNumber}
                          colorCode={image.colorCode}
                          deviceVariant={image.deviceVariant}
                          sortOrder={image.sortOrder}
                          onChange={(patch) => updateUploadedImage(image.clientId, patch)}
                        />
                        <label className="flex items-center gap-2 text-[11px] text-bone/72">
                          <input type="radio" checked={primaryTarget === `new:${image.clientId}`} onChange={() => setPrimaryTarget(`new:${image.clientId}`)} />
                          Portada al guardar
                        </label>
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
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </main>

          <aside className="grid gap-4 self-start">
            <section className="border border-bone/12 bg-ink/72 p-3">
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
                      {hoverPreview ? (
                <div className="absolute bottom-2 right-2 border border-roxgold/50 bg-ink/80 px-2 py-1 text-[9px] font-bold uppercase tracking-rox text-roxgold">Hover OK</div>
                      ) : null}
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
            </section>

            <section className="border border-bone/12 bg-ink/72 p-3">
              <div className="flex items-center gap-2 text-roxgold">
                {errorCount > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                <p className="text-[10px] font-bold uppercase tracking-rox">Auditoria</p>
              </div>
              <div className="mt-3 grid gap-2">
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

            <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 border border-roxgold bg-roxgold px-4 text-[10px] font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
              <Save size={14} /> {submitLabel}
            </button>
          </aside>
        </div>
      </section>
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
  onChange: (patch: Partial<UploadImageDraft>) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1">
          {fieldLabel("Rol")}
          <select value={role} onChange={(event) => onChange({ role: event.target.value as StudioImageRole })} className={selectClass}>
            {ROLE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {getImageRoleLabel(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          {fieldLabel("Device")}
          <select value={deviceVariant} onChange={(event) => onChange({ deviceVariant: event.target.value as StudioDeviceVariant })} className={selectClass}>
            {DEVICE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label className="grid gap-1">
          {fieldLabel("Numero")}
          <input value={viewNumber} onChange={(event) => onChange({ viewNumber: event.target.value })} className={inputClass} />
        </label>
        <label className="grid gap-1">
          {fieldLabel("Color")}
          <input value={colorCode} onChange={(event) => onChange({ colorCode: event.target.value.toUpperCase() })} className={inputClass} />
        </label>
        <label className="grid gap-1">
          {fieldLabel("Orden")}
          <input type="number" value={sortOrder} onChange={(event) => onChange({ sortOrder: event.target.value })} className={inputClass} />
        </label>
      </div>
    </div>
  );
}
