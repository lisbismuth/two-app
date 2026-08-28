import type { CardCodeFormat } from "./types";

export const CARD_CODE_FORMATS: { id: CardCodeFormat; label: string; hint: string }[] = [
  { id: "CODE128", label: "Code 128", hint: "чаще всего у магазинов" },
  { id: "EAN13", label: "EAN-13", hint: "13 цифр" },
  { id: "EAN8", label: "EAN-8", hint: "8 цифр" },
  { id: "CODE39", label: "Code 39", hint: "буквы и цифры" },
  { id: "QR", label: "QR-код", hint: "квадрат" },
];

export function normalizeCodeFormat(value: unknown): CardCodeFormat | "" {
  const ids = CARD_CODE_FORMATS.map((f) => f.id);
  return ids.includes(value as CardCodeFormat) ? (value as CardCodeFormat) : "";
}

/** Sanitize user input: trim, strip spaces in the middle for numeric barcodes. */
export function sanitizeCodeValue(raw: string): string {
  return raw.trim().replace(/\s+/g, "");
}

/** List view: never show full number — only last 4. */
export function maskCode(code: string): string {
  const clean = sanitizeCodeValue(code);
  if (!clean) return "";
  if (clean.length <= 4) return "••••";
  return `•••• ${clean.slice(-4)}`;
}

export function hasElectronicCode(item: {
  codeValue?: string;
  codeFormat?: string;
}): boolean {
  return Boolean(item.codeValue && item.codeFormat);
}
