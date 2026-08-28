import type { CardCodeFormat } from "./types";

export type ScanResult = {
  value: string;
  format: CardCodeFormat;
};

/** Map ZXing format name → our CardCodeFormat. */
export function mapZxingFormat(name: string): CardCodeFormat {
  const n = name.toUpperCase().replace(/-/g, "_");
  if (n.includes("EAN_13") || n === "EAN13") return "EAN13";
  if (n.includes("EAN_8") || n === "EAN8") return "EAN8";
  if (n.includes("CODE_39") || n === "CODE39") return "CODE39";
  if (n.includes("QR")) return "QR";
  // CODE_128, UPC, etc. → Code128 is the most flexible 1D fallback
  return "CODE128";
}

/**
 * Decode barcode/QR from an image file entirely in the browser (ZXing).
 * No network — safe for loyalty card numbers on iPhone Safari.
 */
export async function decodeBarcodeFromFile(file: File): Promise<ScanResult> {
  const url = URL.createObjectURL(file);
  try {
    return await decodeBarcodeFromImageUrl(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function decodeBarcodeFromImageUrl(url: string): Promise<ScanResult> {
  const { BrowserMultiFormatReader } = await import("@zxing/browser");
  const reader = new BrowserMultiFormatReader();
  try {
    const result = await reader.decodeFromImageUrl(url);
    const value = result.getText();
    if (!value) throw new Error("empty");
    const formatName =
      typeof result.getBarcodeFormat === "function"
        ? String(result.getBarcodeFormat())
        : "CODE_128";
    return { value, format: mapZxingFormat(formatName) };
  } catch {
    throw new Error("Код не распознан — попробуйте ближе и при хорошем свете");
  }
}
