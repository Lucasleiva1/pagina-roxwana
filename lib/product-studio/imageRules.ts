export type StudioImageRole = "cover" | "hover" | "gallery" | "detail" | "lifestyle" | "technical";
export type StudioDeviceVariant = "desktop" | "mobile" | "base";

export type ParsedStudioImageName = {
  fileName: string;
  stem: string;
  extension: string | null;
  role: StudioImageRole;
  viewNumber: string | null;
  colorCode: string | null;
  deviceVariant: StudioDeviceVariant;
  sortOrder: number;
  warnings: string[];
};

const COLOR_ALIASES: Record<string, string> = {
  negro: "NEG",
  negra: "NEG",
  neg: "NEG",
  black: "NEG",
  blanco: "BLA",
  blanca: "BLA",
  bla: "BLA",
  white: "BLA",
  gris: "GRI",
  gri: "GRI",
  gray: "GRI",
  grey: "GRI"
};

const DEVICE_ALIASES: Record<string, StudioDeviceVariant> = {
  desktop: "desktop",
  desk: "desktop",
  web: "desktop",
  pc: "desktop",
  mobile: "mobile",
  movil: "mobile",
  mob: "mobile",
  cel: "mobile",
  base: "base"
};

const ROLE_ALIASES: Record<string, StudioImageRole> = {
  portada: "cover",
  principal: "cover",
  cover: "cover",
  main: "cover",
  hover: "hover",
  rollover: "hover",
  galeria: "gallery",
  gallery: "gallery",
  frente: "gallery",
  front: "gallery",
  espalda: "gallery",
  back: "gallery",
  atras: "gallery",
  detalle: "detail",
  detail: "detail",
  lifestyle: "lifestyle",
  calle: "lifestyle",
  street: "lifestyle",
  costado: "lifestyle",
  lado: "lifestyle",
  tecnica: "technical",
  technical: "technical",
  modelo: "technical"
};

function stripExtension(fileName: string) {
  const clean = fileName.trim().split(/[?#]/)[0].split(/[\\/]/).pop() || "";
  const dotIndex = clean.lastIndexOf(".");

  if (dotIndex <= 0) {
    return { stem: clean, extension: null };
  }

  return {
    stem: clean.slice(0, dotIndex),
    extension: clean.slice(dotIndex + 1).toLowerCase()
  };
}

function normalizeToken(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function normalizeColorCode(value?: string | null) {
  if (!value) {
    return null;
  }

  const compact = normalizeToken(value);

  if (!compact) {
    return null;
  }

  return COLOR_ALIASES[compact] || compact.slice(0, 3).toUpperCase();
}

function inferRoleFromNumber(viewNumber: string | null): StudioImageRole {
  if (viewNumber === "01" || viewNumber === "1") {
    return "cover";
  }

  if (viewNumber === "02" || viewNumber === "2") {
    return "gallery";
  }

  if (viewNumber === "03" || viewNumber === "3") {
    return "hover";
  }

  if (viewNumber === "04" || viewNumber === "4") {
    return "lifestyle";
  }

  if (viewNumber === "05" || viewNumber === "5") {
    return "technical";
  }

  return "detail";
}

export function normalizeImageRole(value?: string | null): StudioImageRole | null {
  if (!value) {
    return null;
  }

  const compact = normalizeToken(value);
  return ROLE_ALIASES[compact] || null;
}

export function normalizeDeviceVariant(value?: string | null): StudioDeviceVariant | null {
  if (!value) {
    return null;
  }

  const compact = normalizeToken(value);
  return DEVICE_ALIASES[compact] || null;
}

export function parseProductImageName(fileName: string, explicitRole?: string | null): ParsedStudioImageName {
  const { stem, extension } = stripExtension(fileName);
  const tokens = stem.split(/[-_\s]+/).filter(Boolean);
  const normalizedTokens = tokens.map(normalizeToken);
  const warnings: string[] = [];
  const numberToken = normalizedTokens.find((token) => /^\d{1,2}$/.test(token)) || null;
  const viewNumber = numberToken ? numberToken.padStart(2, "0") : null;
  const colorToken = normalizedTokens.find((token) => COLOR_ALIASES[token]);
  const colorCode = colorToken ? COLOR_ALIASES[colorToken] : null;
  const deviceToken = normalizedTokens.find((token) => DEVICE_ALIASES[token]);
  const deviceVariant = deviceToken ? DEVICE_ALIASES[deviceToken] : "base";
  const namedRole = normalizedTokens.map((token) => ROLE_ALIASES[token]).find(Boolean) || null;
  const requestedRole = normalizeImageRole(explicitRole);
  const numberedRole = inferRoleFromNumber(viewNumber);
  const role = requestedRole || numberedRole || namedRole;

  if (!viewNumber) {
    warnings.push("No se detecto numero de vista; se ordena al final.");
  }

  if (!colorCode) {
    warnings.push("No se detecto color en el nombre.");
  }

  if (namedRole && viewNumber && namedRole !== numberedRole) {
    warnings.push(`El nombre sugiere ${namedRole}, pero el numero ${viewNumber} sugiere ${numberedRole}.`);
  }

  if (requestedRole && viewNumber && requestedRole !== numberedRole) {
    warnings.push(`La ficha fuerza ${requestedRole}, aunque el numero ${viewNumber} sugiere ${numberedRole}.`);
  }

  return {
    fileName,
    stem,
    extension,
    role,
    viewNumber,
    colorCode,
    deviceVariant,
    sortOrder: viewNumber ? Number(viewNumber) * 10 + (deviceVariant === "mobile" ? 1 : 0) : 999,
    warnings
  };
}

export function getImageRoleLabel(role: StudioImageRole) {
  const labels: Record<StudioImageRole, string> = {
    cover: "1 Portada",
    hover: "3 Hover",
    gallery: "2 Espalda remera",
    detail: "6/7 Detalle",
    lifestyle: "4 Costado",
    technical: "5 Espalda modelo"
  };

  return labels[role];
}
