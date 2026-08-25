import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Gift } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as cn, D as titleFromUrl, _ as Textarea, b as useMe, f as EmptyState, g as Sheet, h as Segmented, m as Input, n as Page, p as Field, r as PageHeader, u as Button, v as otherId, w as isUrl, x as usePartner, y as useAppStore } from "./router-BlVNiMgI.mjs";
import { a as format, t as ru } from "../_libs/date-fns.mjs";
import { t as fetchLinkMeta } from "./images-CyIRBXs-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishes-BqEg4drv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WishesPage() {
	const [tab, setTab] = (0, import_react.useState)("wishes");
	const [openWish, setOpenWish] = (0, import_react.useState)(false);
	const [openPlan, setOpenPlan] = (0, import_react.useState)(false);
	const wishes = useAppStore((s) => s.wishes);
	const plans = useAppStore((s) => s.plans);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Хотелки",
			onAdd: () => tab === "wishes" ? setOpenWish(true) : setOpenPlan(true)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: tab,
			onChange: setTab,
			options: [{
				value: "wishes",
				label: "Хотелки"
			}, {
				value: "plans",
				label: "Планы"
			}]
		}),
		tab === "wishes" ? wishes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
				className: "size-16",
				strokeWidth: 1.2
			}),
			title: "Список пуст",
			text: "Киньте ссылку на товар — название, цена и картинка подтянутся сами.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpenWish(true),
				children: "Добавить хотелку"
			}),
			footnote: "или вставить из буфера"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 flex flex-col gap-2",
			children: wishes.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishCard, { wish: w }, w.id))
		}) : plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
				className: "size-16",
				strokeWidth: 1.2
			}),
			title: "Пока без планов",
			text: "Поездка, ужин, ремонт — всё, что хотите сделать вдвоём.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpenPlan(true),
				children: "Добавить план"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 flex flex-col gap-2",
			children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, { plan: p }, p.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishSheet, {
			open: openWish,
			onOpenChange: setOpenWish
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanSheet, {
			open: openPlan,
			onOpenChange: setOpenPlan
		})
	] });
}
function WishCard({ wish }) {
	const partners = useAppStore((s) => s.partners);
	const toggleWish = useAppStore((s) => s.toggleWish);
	const deleteWish = useAppStore((s) => s.deleteWish);
	const who = partners[wish.forId];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-3 overflow-hidden rounded-card bg-surface p-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "size-[72px] shrink-0 overflow-hidden rounded-[14px] bg-chip",
			style: wish.image ? void 0 : { background: who.color + "33" },
			children: wish.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: wish.image,
				alt: "",
				className: "size-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-full items-center justify-center text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
					className: "size-7",
					strokeWidth: 1.5
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("truncate text-[16px] font-bold", wish.done && "text-muted line-through"),
					children: wish.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-[13px] text-muted",
					children: [
						wish.price ? `${wish.price} · ` : "",
						"для ",
						who.name
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "chip",
							variant: "secondary",
							onClick: () => toggleWish(wish.id),
							children: wish.done ? "Вернуть" : "Исполнено"
						}),
						wish.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: wish.url,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex h-8 items-center rounded-full px-3 text-xs font-medium text-link",
							children: "Ссылка"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "chip",
							variant: "ghost",
							onClick: () => deleteWish(wish.id),
							children: "Удалить"
						})
					]
				})
			]
		})]
	});
}
function PlanCard({ plan }) {
	const togglePlan = useAppStore((s) => s.togglePlan);
	const deletePlan = useAppStore((s) => s.deletePlan);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-card bg-surface p-4 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-start justify-between gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-[16px] font-bold", plan.closed && "text-muted line-through"),
					children: plan.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-[13px] text-muted",
					children: [plan.kind === "trip" ? "Поездка" : "План", plan.date ? ` · ${format(/* @__PURE__ */ new Date(plan.date + "T12:00:00"), "d MMMM", { locale: ru })}` : ""]
				}),
				plan.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[14px] text-ink-soft",
					children: plan.notes
				}) : null
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "chip",
				variant: "secondary",
				onClick: () => togglePlan(plan.id),
				children: plan.closed ? "Открыть снова" : "Закрыть"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "chip",
				variant: "ghost",
				onClick: () => deletePlan(plan.id),
				children: "Удалить"
			})]
		})]
	});
}
function WishSheet({ open, onOpenChange }) {
	const addWish = useAppStore((s) => s.addWish);
	const me = useMe();
	const partner = usePartner();
	const currentId = useAppStore((s) => s.currentId);
	const [title, setTitle] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)("");
	const [forId, setForId] = (0, import_react.useState)(currentId);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle("");
		setUrl("");
		setPrice("");
		setImage("");
		setForId(currentId);
	}, [open, currentId]);
	async function applyUrl(raw) {
		setUrl(raw);
		if (!isUrl(raw)) return;
		if (!title) setTitle(titleFromUrl(raw));
		setLoading(true);
		try {
			const meta = await fetchLinkMeta(raw);
			if (meta.title) setTitle(meta.title);
			if (meta.image) setImage(meta.image);
		} catch {} finally {
			setLoading(false);
		}
	}
	async function paste() {
		try {
			const text = await navigator.clipboard.readText();
			if (isUrl(text)) await applyUrl(text.trim());
			else if (text) setTitle(text.trim());
		} catch {
			toast("Нет доступа к буферу — вставьте ссылку вручную");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: "Новая хотелка",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim()) return;
				addWish({
					title,
					url,
					price,
					image,
					forId
				});
				toast("Добавили в список");
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Ссылка",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: url,
						onChange: (e) => applyUrl(e.target.value),
						placeholder: "https://",
						inputMode: "url"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: paste,
					className: "self-start text-[13px] font-semibold text-link",
					children: "Вставить из буфера"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Название",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: loading ? "Подтягиваем…" : "Что хочется",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Цена",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: price,
						onChange: (e) => setPrice(e.target.value),
						placeholder: "4 500 ₽"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Для кого",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: [currentId, otherId(currentId)].map((id) => {
							const p = id === currentId ? me : partner;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setForId(id),
								className: cn("h-11 rounded-full text-[13px] font-semibold", forId === id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft"),
								children: p.name
							}, id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-2",
					children: "Добавить хотелку"
				})
			]
		})
	});
}
function PlanSheet({ open, onOpenChange }) {
	const addPlan = useAppStore((s) => s.addPlan);
	const [title, setTitle] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("plan");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle("");
		setNotes("");
		setDate("");
		setKind("plan");
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: "Новый план",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim()) return;
				addPlan({
					title,
					notes,
					date: date || null,
					kind
				});
				toast("План записан");
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Что планируете",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Тип",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setKind("plan"),
							className: cn("h-11 rounded-full text-[13px] font-semibold", kind === "plan" ? "bg-ink text-on-ink" : "bg-chip"),
							children: "План"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setKind("trip"),
							className: cn("h-11 rounded-full text-[13px] font-semibold", kind === "trip" ? "bg-ink text-on-ink" : "bg-chip"),
							children: "Поездка"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Дата",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Заметка",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						rows: 3
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-2",
					children: "Добавить"
				})
			]
		})
	});
}
//#endregion
export { WishesPage as component };
