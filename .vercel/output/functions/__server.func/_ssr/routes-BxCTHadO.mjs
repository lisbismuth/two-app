import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as cn, O as todayISO, _ as Textarea, b as useMe, f as EmptyState, g as Sheet, m as Input, n as Page, p as Field, r as PageHeader, u as Button, v as otherId, x as usePartner, y as useAppStore } from "./router-BlVNiMgI.mjs";
import { a as format, t as ru } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BxCTHadO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TasksPage() {
	const tasks = useAppStore((s) => s.tasks);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const openCount = tasks.filter((t) => !t.done).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Задачи",
			onAdd: () => {
				setEditing(null);
				setOpen(true);
			}
		}),
		tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksGlyph, {}),
			title: "Список дел на двоих",
			text: "Пишите, что нужно сделать. Любой берёт задачу себе — или ставит её партнёру.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: "Добавить задачу"
			}),
			footnote: "никто никому не начальник — задачу можно вернуть"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6",
			children: [
				openCount === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[14px] text-muted",
					children: "Все задачи закрыты. Можно выдохнуть."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Общие",
					items: tasks.filter((t) => !t.done && t.assignee === "none"),
					onEdit: (t) => {
						setEditing(t);
						setOpen(true);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignedGroups, { onEdit: (t) => {
					setEditing(t);
					setOpen(true);
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Сделано",
					items: tasks.filter((t) => t.done),
					muted: true,
					onEdit: (t) => {
						setEditing(t);
						setOpen(true);
					}
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskSheet, {
			open,
			onOpenChange: setOpen,
			editing
		})
	] });
}
function AssignedGroups({ onEdit }) {
	const partners = useAppStore((s) => s.partners);
	const tasks = useAppStore((s) => s.tasks);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: ["a", "b"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
		title: partners[id].name,
		accent: partners[id].color,
		items: tasks.filter((t) => !t.done && t.assignee === id),
		onEdit
	}, id)) });
}
function TaskGroup({ title, items, muted, accent, onEdit }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center gap-2",
		children: [accent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-2 rounded-full",
			style: { background: accent }
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: cn("text-[12px] font-semibold uppercase tracking-[0.12em]", muted ? "text-faint" : "text-muted"),
			children: title
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-2",
		children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
			task: t,
			onEdit: () => onEdit(t)
		}, t.id))
	})] });
}
function TaskRow({ task, onEdit }) {
	const toggleTask = useAppStore((s) => s.toggleTask);
	const updateTask = useAppStore((s) => s.updateTask);
	const me = useMe();
	const partner = usePartner();
	const currentId = useAppStore((s) => s.currentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-card bg-surface px-3 py-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": task.done ? "Вернуть" : "Сделано",
				onClick: () => toggleTask(task.id),
				className: cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", task.done ? "bg-ink text-on-ink" : "ring-1 ring-faint text-transparent"),
				children: task.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-3.5",
					strokeWidth: 3
				}) : null
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onEdit,
				className: "min-w-0 flex-1 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-[16px] font-semibold leading-snug", task.done && "text-muted line-through"),
					children: task.title
				}), task.dueDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-[12px] text-muted",
					children: ["до ", format(/* @__PURE__ */ new Date(task.dueDate + "T12:00:00"), "d MMMM", { locale: ru })]
				}) : null]
			})]
		}), !task.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-1.5 pl-9",
			children: task.assignee === "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "chip",
				variant: "secondary",
				onClick: () => {
					updateTask(task.id, { assignee: currentId });
					toast(`Задача у ${me.name}`);
				},
				children: "Взять себе"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "chip",
				variant: "ghost",
				onClick: () => {
					updateTask(task.id, { assignee: otherId(currentId) });
					toast(`Поставили ${partner.name}`);
				},
				children: "Партнёру"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "chip",
				variant: "ghost",
				onClick: () => {
					updateTask(task.id, { assignee: "none" });
					toast("Задачу вернули в общие");
				},
				children: "Вернуть"
			})
		}) : null]
	});
}
function TaskSheet({ open, onOpenChange, editing }) {
	const addTask = useAppStore((s) => s.addTask);
	const updateTask = useAppStore((s) => s.updateTask);
	const deleteTask = useAppStore((s) => s.deleteTask);
	const me = useMe();
	const partner = usePartner();
	const currentId = useAppStore((s) => s.currentId);
	const [title, setTitle] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [assignee, setAssignee] = (0, import_react.useState)("none");
	const [dueDate, setDueDate] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle(editing?.title ?? "");
		setNotes(editing?.notes ?? "");
		setAssignee(editing?.assignee ?? "none");
		setDueDate(editing?.dueDate ?? "");
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: editing ? "Задача" : "Новая задача",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim()) return;
				if (editing) {
					updateTask(editing.id, {
						title: title.trim(),
						notes,
						assignee,
						dueDate: dueDate || null
					});
					toast("Сохранили");
				} else {
					addTask({
						title,
						notes,
						assignee,
						dueDate: dueDate || null
					});
					toast("Задача в списке");
				}
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Что сделать",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Коротко и ясно",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Заметка",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Если нужно уточнить",
						rows: 3
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Кто делает",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1.5",
						children: [
							["none", "Никто"],
							[currentId, me.name],
							[otherId(currentId), partner.name]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAssignee(id),
							className: cn("h-11 rounded-full px-2 text-[13px] font-semibold", assignee === id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft"),
							children: label
						}, id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Срок — попадёт в календарь",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: dueDate,
						min: todayISO(),
						onChange: (e) => setDueDate(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-2",
					children: editing ? "Сохранить" : "Добавить задачу"
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						deleteTask(editing.id);
						toast("Удалили");
						onOpenChange(false);
					},
					children: "Удалить"
				}) : null
			]
		})
	});
}
function TasksGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "72",
		height: "56",
		viewBox: "0 0 72 56",
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "14",
				cy: "16",
				r: "10",
				fill: "#D4D0C8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9.5 16.5l3.2 3.2 6.2-7",
				stroke: "white",
				strokeWidth: "2.2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "32",
				y: "13",
				width: "28",
				height: "6",
				rx: "3",
				fill: "#D4D0C8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "14",
				cy: "40",
				r: "10",
				stroke: "#D4D0C8",
				strokeWidth: "2.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "32",
				y: "37",
				width: "22",
				height: "6",
				rx: "3",
				fill: "#D4D0C8"
			})
		]
	});
}
//#endregion
export { TasksPage as component };
