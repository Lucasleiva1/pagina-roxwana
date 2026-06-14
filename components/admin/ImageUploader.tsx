"use client";

import { useState } from "react";
import type { ProductImage } from "@/types/product";

const MAX_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ images = [] }: { images?: ProductImage[] }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      {images.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image) => (
            <div key={image.id || image.url} className="grid gap-3 border border-bone/12 bg-ink p-3 text-xs text-bone/70">
              <div className="aspect-[3/4] overflow-hidden border border-bone/10 bg-charcoal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt || ""} className="h-full w-full object-cover" />
              </div>
              <span className="truncate">{image.alt || image.path || image.url}</span>
              {image.id ? (
                <div className="grid gap-2">
                  <label className="flex items-center gap-2 text-bone">
                    <input type="radio" name="primary_image_id" value={image.id} defaultChecked={image.isPrimary} />
                    Imagen principal
                  </label>
                  <label className="flex items-center gap-2 text-roxred">
                    <input type="checkbox" name="delete_image_ids" value={image.id} />
                    Borrar imagen
                  </label>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <input
        name="images"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="min-h-11 border border-bone/12 bg-ink p-3 text-sm text-bone file:mr-4 file:border-0 file:bg-bone file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-rox file:text-charcoal"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files || []);
          const invalid = files.find((file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE);
          setError(invalid ? "Solo jpg, png o webp de hasta 3 MB por imagen." : null);
        }}
      />
      {error ? <p className="text-xs uppercase tracking-rox text-roxred">{error}</p> : null}
    </div>
  );
}
