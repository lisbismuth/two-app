import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as X, u as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as EmptyState, h as Segmented, n as Page, r as PageHeader, u as Button, y as useAppStore } from "./router-BlVNiMgI.mjs";
import { n as fileToDataUrl } from "./images-CyIRBXs-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-BPVfJzeh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocsPage() {
	const [tab, setTab] = (0, import_react.useState)("doc");
	const [viewer, setViewer] = (0, import_react.useState)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const docs = useAppStore((s) => s.docs);
	const addDoc = useAppStore((s) => s.addDoc);
	const deleteDoc = useAppStore((s) => s.deleteDoc);
	const visible = docs.filter((d) => d.kind === tab);
	async function onFiles(list) {
		if (!list?.length) return;
		const file = list[0];
		try {
			const { dataUrl, mime } = await fileToDataUrl(file);
			const name = file.name.replace(/\.[^.]+$/, "") || (tab === "card" ? "Карта" : "Документ");
			addDoc({
				title: name,
				kind: tab,
				mime,
				dataUrl
			});
			toast("Сохранили на устройство");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Не получилось добавить");
		} finally {
			if (cameraRef.current) cameraRef.current.value = "";
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Документы",
			onAdd: () => fileRef.current?.click()
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: tab,
			onChange: setTab,
			options: [{
				value: "doc",
				label: "Документы"
			}, {
				value: "card",
				label: "Карты"
			}]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: cameraRef,
			type: "file",
			accept: "image/*",
			capture: "environment",
			className: "hidden",
			onChange: (e) => onFiles(e.target.files)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: fileRef,
			type: "file",
			accept: "image/*,application/pdf",
			className: "hidden",
			onChange: (e) => onFiles(e.target.files)
		}),
		visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileGlyph, {}),
			title: tab === "card" ? "Карты будут здесь" : "Здесь будут билеты и страховки",
			text: "Всё, что добавите, сразу ляжет на устройство и откроется без интернета.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => cameraRef.current?.click(),
				children: "Сфотографировать"
			}),
			secondary: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => fileRef.current?.click(),
				children: "Выбрать файл"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 grid grid-cols-2 gap-2",
			children: visible.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setViewer(d),
				className: "w-full overflow-hidden rounded-card bg-surface text-left shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[4/3] bg-chip",
					children: d.mime.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: d.dataUrl,
						alt: "",
						className: "size-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-full items-center justify-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-8" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate px-3 py-2 text-[13px] font-semibold",
					children: d.title
				})]
			}) }, d.id))
		}),
		viewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex flex-col bg-ink/90",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate pr-4 text-[15px] font-semibold text-on-ink",
						children: viewer.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Закрыть",
						onClick: () => setViewer(null),
						className: "flex size-10 items-center justify-center rounded-full bg-white/10 text-on-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center justify-center p-4",
					children: viewer.mime.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: viewer.dataUrl,
						alt: viewer.title,
						className: "max-h-full max-w-full rounded-lg object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: viewer.title,
						src: viewer.dataUrl,
						className: "h-full w-full rounded-lg bg-surface"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "border-0 bg-white/10 text-on-ink ring-0",
						onClick: () => {
							deleteDoc(viewer.id);
							setViewer(null);
							toast("Удалили");
						},
						children: "Удалить"
					})
				})
			]
		}) : null
	] });
}
function FileGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "56",
		height: "64",
		viewBox: "0 0 56 64",
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 6c0-2.2 1.8-4 4-4h24l16 16v40c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4V6z",
				stroke: "#D4D0C8",
				strokeWidth: "2.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M36 2v12c0 2.2 1.8 4 4 4h12",
				stroke: "#D4D0C8",
				strokeWidth: "2.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M18 34h20M18 42h14",
				stroke: "#D4D0C8",
				strokeWidth: "2.4",
				strokeLinecap: "round"
			})
		]
	});
}
//#endregion
export { DocsPage as component };
