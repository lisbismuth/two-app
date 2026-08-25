import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return crypto.randomUUID();
}

export function todayISO() {
  const d = new Date();
  return isoDate(d);
}

export function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function isUrl(value: string) {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function titleFromUrl(url: string) {
  try {
    const u = new URL(url);
    const slug = u.pathname.split("/").filter(Boolean).pop();
    if (slug) {
      const decoded = decodeURIComponent(slug).replace(/\.(html|php|aspx)$/i, "");
      const pretty = decoded.replace(/[-_+]+/g, " ").trim();
      if (pretty.length > 1) return pretty[0]!.toUpperCase() + pretty.slice(1);
    }
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
