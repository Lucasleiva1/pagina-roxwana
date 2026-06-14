export function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function nullableFormValue(formData: FormData, key: string) {
  const value = formValue(formData, key);
  return value.length > 0 ? value : null;
}

export function intFormValue(formData: FormData, key: string, fallback = 0) {
  const parsed = Number(formValue(formData, key));
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function slugify(value: string, fallback = "item") {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}
