import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as ChevronRight, p as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as cn, E as parseISODate, O as todayISO, S as capitalize, T as isoDate, _ as Textarea, a as MONTHS_SHORT, g as Sheet, m as Input, n as Page, o as WEEKDAYS, p as Field, r as PageHeader, u as Button, y as useAppStore } from "./router-BlVNiMgI.mjs";
import { a as format, n as subMonths, s as addMonths, t as ru } from "../_libs/date-fns.mjs";
import { a as monthCells, l as upcomingItems, n as buildCalendarItems, s as sameDay } from "./dates-DLukipNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-BKtBdATQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const [cursor, setCursor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [selected, setSelected] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [open, setOpen] = (0, import_react.useState)(false);
	const partners = useAppStore((s) => s.partners);
	const startedAt = useAppStore((s) => s.startedAt);
	const events = useAppStore((s) => s.events);
	const tasks = useAppStore((s) => s.tasks);
	const items = (0, import_react.useMemo)(() => {
		const rangeStart = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
		const rangeEnd = new Date(cursor.getFullYear() + 1, cursor.getMonth() + 2, 0);
		return buildCalendarItems({
			partners,
			startedAt,
			events,
			tasks,
			rangeStart,
			rangeEnd
		});
	}, [
		partners,
		startedAt,
		events,
		tasks,
		cursor
	]);
	const byDate = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const it of items) {
			const list = map.get(it.date) ?? [];
			list.push(it);
			map.set(it.date, list);
		}
		return map;
	}, [items]);
	const cells = monthCells(cursor.getFullYear(), cursor.getMonth());
	const today = /* @__PURE__ */ new Date();
	const selectedKey = isoDate(selected);
	const dayItems = byDate.get(selectedKey) ?? [];
	const upcoming = upcomingItems(items, today, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: format(today, "eeee, d MMMM", { locale: ru }),
			title: capitalize(format(cursor, "LLLL", { locale: ru })),
			avatar: true,
			kickerUpper: false,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Предыдущий месяц",
				onClick: () => setCursor((d) => subMonths(d, 1)),
				className: "flex size-10 items-center justify-center text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Следующий месяц",
				onClick: () => setCursor((d) => addMonths(d, 1)),
				className: "flex size-10 items-center justify-center text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7 gap-y-1",
			children: [WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-faint",
				children: d
			}, d)), cells.map((d) => {
				const key = isoDate(d);
				const inMonth = d.getMonth() === cursor.getMonth();
				const isToday = sameDay(d, today);
				const isSelected = sameDay(d, selected);
				const has = (byDate.get(key) ?? []).length > 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(d),
					className: cn("relative mx-auto flex size-10 items-center justify-center rounded-full text-[15px] font-medium", !inMonth && "text-faint", inMonth && !isToday && !isSelected && "text-ink", isToday && "bg-ink text-on-ink", isSelected && !isToday && "bg-chip text-ink"),
					children: [d.getDate(), has && !isToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-rose" }) : null]
				}, key);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[12px] font-semibold uppercase tracking-[0.14em] text-muted",
					children: sameDay(selected, today) ? "Ближайшие" : format(selected, "d MMMM", { locale: ru })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(true),
					className: "text-[15px] font-semibold text-link",
					children: "Добавить"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: (sameDay(selected, today) ? upcoming : dayItems).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-card bg-surface px-4 py-5 text-[14px] text-muted shadow-card",
					children: "Пока тихо. Добавьте дату — она появится здесь и в сетке."
				}) : (sameDay(selected, today) ? upcoming : dayItems).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { item: it }, it.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventSheet, {
			open,
			onOpenChange: setOpen,
			defaultDate: selectedKey
		})
	] });
}
function EventCard({ item }) {
	const d = parseISODate(item.date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex items-stretch overflow-hidden rounded-card bg-surface shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-[68px] shrink-0 flex-col items-center justify-center py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[22px] font-extrabold leading-none tabular",
					children: d.getDate()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted",
					children: MONTHS_SHORT[d.getMonth()]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-4 w-[3px] shrink-0 rounded-full",
				style: { background: item.color || "var(--color-rose)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col justify-center py-4 pr-4 pl-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[16px] font-bold leading-snug",
					children: item.title
				}), item.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 truncate text-[13px] text-muted",
					children: item.subtitle
				}) : null]
			})
		]
	});
}
function EventSheet({ open, onOpenChange, defaultDate }) {
	const addEvent = useAppStore((s) => s.addEvent);
	const [title, setTitle] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(defaultDate);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle("");
		setNotes("");
		setDate(defaultDate || todayISO());
	}, [open, defaultDate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: "Важная дата",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim() || !date) return;
				addEvent({
					title,
					notes,
					date
				});
				toast("Дата в календаре");
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Название",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Годовщина, поездка, встреча",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Дата",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Подпись",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "4 года вместе",
						rows: 2
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
export { CalendarPage as component };
