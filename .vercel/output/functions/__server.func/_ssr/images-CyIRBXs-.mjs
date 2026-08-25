//#region node_modules/.nitro/vite/services/ssr/assets/images-CyIRBXs-.js
async function fileToDataUrl(file, opts = {}) {
	const maxSize = opts.maxSize ?? 1100;
	const quality = opts.quality ?? .72;
	if (!file.type.startsWith("image/")) {
		if ((await file.arrayBuffer()).byteLength > 18e5) throw new Error("Файл слишком большой — до 1.5 МБ");
		return {
			dataUrl: await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result));
				reader.onerror = () => reject(/* @__PURE__ */ new Error("Не удалось прочитать файл"));
				reader.readAsDataURL(file);
			}),
			mime: file.type || "application/octet-stream"
		};
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
	return {
		dataUrl: canvas.toDataURL("image/jpeg", quality),
		mime: "image/jpeg"
	};
}
async function fetchLinkMeta(url) {
	const endpoint = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
	const res = await fetch(endpoint);
	if (!res.ok) throw new Error("meta");
	const json = await res.json();
	if (json.status !== "success" || !json.data) throw new Error("meta");
	return {
		title: json.data.title,
		description: json.data.description,
		image: json.data.image?.url
	};
}
//#endregion
export { fileToDataUrl as n, fetchLinkMeta as t };
