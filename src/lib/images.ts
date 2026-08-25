export async function fileToDataUrl(
  file: File,
  opts: { maxSize?: number; quality?: number } = {},
): Promise<{ dataUrl: string; mime: string }> {
  const maxSize = opts.maxSize ?? 1100;
  const quality = opts.quality ?? 0.72;

  if (!file.type.startsWith("image/")) {
    const buf = await file.arrayBuffer();
    if (buf.byteLength > 1_800_000) {
      throw new Error("Файл слишком большой — до 1.5 МБ");
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
      reader.readAsDataURL(file);
    });
    return { dataUrl, mime: file.type || "application/octet-stream" };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, mime: "image/jpeg" };
}

export type LinkMeta = {
  title?: string;
  image?: string;
  description?: string;
};

export async function fetchLinkMeta(url: string): Promise<LinkMeta> {
  const endpoint = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("meta");
  const json = (await res.json()) as {
    status?: string;
    data?: { title?: string; description?: string; image?: { url?: string } };
  };
  if (json.status !== "success" || !json.data) throw new Error("meta");
  return {
    title: json.data.title,
    description: json.data.description,
    image: json.data.image?.url,
  };
}
