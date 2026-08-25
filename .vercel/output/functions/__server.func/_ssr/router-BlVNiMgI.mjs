import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Gift, h as CalendarDays, l as Folder, m as Check, n as TriangleAlert, o as ListTodo, r as Plus, s as Heart } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BlVNiMgI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
function todayISO() {
	return isoDate(/* @__PURE__ */ new Date());
}
function isoDate(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseISODate(s) {
	const [y, m, d] = s.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function isUrl(value) {
	try {
		const u = new URL(value.trim());
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
}
function titleFromUrl(url) {
	try {
		const u = new URL(url);
		const slug = u.pathname.split("/").filter(Boolean).pop();
		if (slug) {
			const pretty = decodeURIComponent(slug).replace(/\.(html|php|aspx)$/i, "").replace(/[-_+]+/g, " ").trim();
			if (pretty.length > 1) return pretty[0].toUpperCase() + pretty.slice(1);
		}
		return u.hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}
function capitalize(s) {
	if (!s) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
}
function otherId(id) {
	return id === "a" ? "b" : "a";
}
var partners = {
	a: {
		id: "a",
		name: "Лиза",
		gender: "female",
		birthday: "1999-03-12",
		color: "#D4899A"
	},
	b: {
		id: "b",
		name: "Артём",
		gender: "male",
		birthday: "1997-07-08",
		color: "#7A9E8A"
	}
};
var now = "2026-08-25T08:06:00.000Z";
var useAppStore = create()(persist((set, get) => ({
	setupComplete: true,
	currentId: "a",
	startedAt: "2022-09-04",
	partners,
	tasks: [
		{
			id: "t1",
			title: "Купить продукты на ужин",
			notes: "Овощи, хлеб, то самое вино",
			assignee: "none",
			dueDate: "2026-08-25",
			done: false,
			doneAt: null,
			createdAt: now
		},
		{
			id: "t2",
			title: "Позвонить в банк",
			notes: "",
			assignee: "a",
			dueDate: null,
			done: false,
			doneAt: null,
			createdAt: now
		},
		{
			id: "t3",
			title: "Забронировать столик в субботу",
			notes: "На двоих, у окна",
			assignee: "b",
			dueDate: "2026-08-29",
			done: false,
			doneAt: null,
			createdAt: now
		}
	],
	events: [],
	wishes: [{
		id: "w1",
		title: "Льняной плед",
		url: "",
		price: "4 500 ₽",
		image: "",
		forId: "a",
		done: false,
		createdAt: now
	}],
	plans: [{
		id: "p1",
		title: "Выходные у моря",
		notes: "Тихое место, без планов",
		date: "2026-09-12",
		kind: "trip",
		closed: false,
		createdAt: now
	}],
	docs: [],
	capsules: [{
		id: "c1",
		title: "На четвёртую годовщину",
		body: "Если ты это читаешь — значит, мы всё ещё выбираем друг друга. Спасибо, что ты есть.",
		openAt: "2026-09-04",
		authorId: "a",
		createdAt: now
	}],
	votes: [{
		id: "v1",
		question: "Куда поедем в выходные?",
		options: [
			"К морю",
			"В горы",
			"Остаёмся дома"
		],
		createdBy: "a",
		ballots: {},
		createdAt: now
	}],
	completeSetup: ({ partners: next, startedAt, currentId }) => set({
		setupComplete: true,
		partners: next,
		startedAt,
		currentId
	}),
	setCurrentId: (id) => set({ currentId: id }),
	updatePartner: (id, patch) => set((s) => ({ partners: {
		...s.partners,
		[id]: {
			...s.partners[id],
			...patch
		}
	} })),
	setStartedAt: (date) => set({ startedAt: date }),
	addTask: (input) => set((s) => ({ tasks: [{
		id: uid(),
		title: input.title.trim(),
		notes: input.notes?.trim() ?? "",
		assignee: input.assignee ?? "none",
		dueDate: input.dueDate ?? null,
		done: false,
		doneAt: null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.tasks] })),
	updateTask: (id, patch) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? {
		...t,
		...patch
	} : t) })),
	toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? {
		...t,
		done: !t.done,
		doneAt: !t.done ? (/* @__PURE__ */ new Date()).toISOString() : null
	} : t) })),
	deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
	addEvent: (input) => set((s) => ({ events: [{
		id: uid(),
		title: input.title.trim(),
		notes: input.notes?.trim() ?? "",
		date: input.date
	}, ...s.events] })),
	updateEvent: (id, patch) => set((s) => ({ events: s.events.map((e) => e.id === id ? {
		...e,
		...patch
	} : e) })),
	deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
	addWish: (input) => set((s) => ({ wishes: [{
		id: uid(),
		title: input.title.trim(),
		url: input.url?.trim() ?? "",
		price: input.price?.trim() ?? "",
		image: input.image ?? "",
		forId: input.forId,
		done: false,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.wishes] })),
	updateWish: (id, patch) => set((s) => ({ wishes: s.wishes.map((w) => w.id === id ? {
		...w,
		...patch
	} : w) })),
	toggleWish: (id) => set((s) => ({ wishes: s.wishes.map((w) => w.id === id ? {
		...w,
		done: !w.done
	} : w) })),
	deleteWish: (id) => set((s) => ({ wishes: s.wishes.filter((w) => w.id !== id) })),
	addPlan: (input) => set((s) => ({ plans: [{
		id: uid(),
		title: input.title.trim(),
		notes: input.notes?.trim() ?? "",
		date: input.date ?? null,
		kind: input.kind,
		closed: false,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.plans] })),
	togglePlan: (id) => set((s) => ({ plans: s.plans.map((p) => p.id === id ? {
		...p,
		closed: !p.closed
	} : p) })),
	deletePlan: (id) => set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),
	addDoc: (input) => set((s) => ({ docs: [{
		id: uid(),
		title: input.title.trim() || "Без названия",
		kind: input.kind,
		mime: input.mime,
		dataUrl: input.dataUrl,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.docs] })),
	updateDoc: (id, patch) => set((s) => ({ docs: s.docs.map((d) => d.id === id ? {
		...d,
		...patch
	} : d) })),
	deleteDoc: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id) })),
	addCapsule: (input) => set((s) => ({ capsules: [{
		id: uid(),
		title: input.title.trim(),
		body: input.body.trim(),
		openAt: input.openAt,
		authorId: s.currentId,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.capsules] })),
	deleteCapsule: (id) => set((s) => ({ capsules: s.capsules.filter((c) => c.id !== id) })),
	addVote: (input) => set((s) => ({ votes: [{
		id: uid(),
		question: input.question.trim(),
		options: input.options.map((o) => o.trim()).filter(Boolean),
		createdBy: s.currentId,
		ballots: {},
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.votes] })),
	castVote: (id, optionIndex) => {
		const me = get().currentId;
		set((s) => ({ votes: s.votes.map((v) => v.id === id ? {
			...v,
			ballots: {
				...v.ballots,
				[me]: optionIndex
			}
		} : v) }));
	},
	deleteVote: (id) => set((s) => ({ votes: s.votes.filter((v) => v.id !== id) }))
}), { name: "dvoe-couple-v1" }));
function useMe() {
	return useAppStore((s) => s.partners[s.currentId]);
}
function usePartner() {
	return useAppStore((s) => s.partners[otherId(s.currentId)]);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] transition-[transform,background-color,opacity] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-ink text-on-ink",
			secondary: "bg-transparent text-ink ring-1 ring-line",
			ghost: "bg-transparent text-ink",
			surface: "bg-surface text-ink shadow-plus",
			link: "bg-transparent text-link font-semibold",
			danger: "bg-danger text-on-ink"
		},
		size: {
			lg: "h-14 w-full rounded-full text-[17px]",
			md: "h-11 px-5 rounded-full text-sm",
			sm: "h-9 px-4 rounded-full text-sm",
			icon: "size-11 rounded-full",
			chip: "h-8 px-3 rounded-full text-xs font-medium"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "lg"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-control bg-chip px-4 text-[15px] text-ink outline-none", "placeholder:text-faint", "ring-1 ring-transparent transition-[box-shadow] duration-150", "focus:bg-surface focus:ring-ink/15", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full resize-none rounded-control bg-chip px-4 py-3 text-[15px] text-ink outline-none", "placeholder:text-faint", "ring-1 ring-transparent transition-[box-shadow] duration-150", "focus:bg-surface focus:ring-ink/15", className),
		...props
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-1 text-[12px] font-medium uppercase tracking-[0.08em] text-muted",
			children: label
		}), children]
	});
}
function Sheet({ open, onOpenChange, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open,
		onOpenChange,
		shouldScaleBackground: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-50 bg-ink/35" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Content, {
			className: "fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col outline-none",
			"aria-describedby": void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-h-[92dvh] flex-col overflow-hidden rounded-t-sheet bg-bg shadow-float",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-faint/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
						className: "px-5 pb-3 pt-4 text-[22px] font-extrabold tracking-tight text-ink",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
						children
					})
				]
			})
		})] })
	});
}
function Segmented({ value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 rounded-full bg-chip p-1",
		children: options.map((opt) => {
			const active = opt.value === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(opt.value),
				className: cn("h-10 rounded-full text-[15px] font-semibold transition-[background-color,color,box-shadow] duration-200", active ? "bg-surface text-ink shadow-plus" : "bg-transparent text-muted"),
				children: opt.label
			}, opt.value);
		})
	});
}
function EmptyState({ icon, title, text, action, secondary, footnote }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center px-4 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-7 text-faint",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[22px] font-extrabold tracking-tight text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-[280px] text-[15px] leading-relaxed text-muted",
				children: text
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-7 w-full max-w-[340px]",
				children: action
			}) : null,
			secondary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 w-full max-w-[340px]",
				children: secondary
			}) : null,
			footnote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-[280px] text-[12px] uppercase tracking-[0.08em] text-faint",
				children: footnote
			}) : null
		]
	});
}
function Card({ className, children, onClick }) {
	const cls = cn("w-full rounded-card bg-surface p-4 text-left shadow-card", className);
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn(cls, "transition-transform duration-150 active:scale-[0.98]"),
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls,
		children
	});
}
function plural(n, one, few, many) {
	const abs = Math.abs(n) % 100;
	const d = abs % 10;
	if (abs > 10 && abs < 20) return many;
	if (d === 1) return one;
	if (d >= 2 && d <= 4) return few;
	return many;
}
function genderLabel(g) {
	if (g === "female") return "Женский";
	if (g === "male") return "Мужской";
	return "Другое";
}
var ORDINAL_FEM_GEN = {
	1: "первой",
	2: "второй",
	3: "третьей",
	4: "четвёртой",
	5: "пятой",
	6: "шестой",
	7: "седьмой",
	8: "восьмой",
	9: "девятой",
	10: "десятой",
	11: "одиннадцатой",
	12: "двенадцатой",
	13: "тринадцатой",
	14: "четырнадцатой",
	15: "пятнадцатой",
	16: "шестнадцатой",
	17: "семнадцатой",
	18: "восемнадцатой",
	19: "девятнадцатой",
	20: "двадцатой"
};
function anniversaryOrdinal(n) {
	return ORDINAL_FEM_GEN[n] ?? `${n}-й`;
}
var MONTHS_SHORT = [
	"янв",
	"фев",
	"мар",
	"апр",
	"мая",
	"июн",
	"июл",
	"авг",
	"сент",
	"окт",
	"ноя",
	"дек"
];
var WEEKDAYS = [
	"ПН",
	"ВТ",
	"СР",
	"ЧТ",
	"ПТ",
	"СБ",
	"ВС"
];
var PARTNER_COLORS = [
	"#D4899A",
	"#7A9E8A",
	"#7A93B0",
	"#C4A574",
	"#C4846A",
	"#6E7C86"
];
var emptyPartner = (id, color) => ({
	id,
	name: "",
	gender: id === "a" ? "female" : "male",
	birthday: "",
	color
});
function Setup() {
	const completeSetup = useAppStore((s) => s.completeSetup);
	const [step, setStep] = (0, import_react.useState)(0);
	const [a, setA] = (0, import_react.useState)(emptyPartner("a", PARTNER_COLORS[0]));
	const [b, setB] = (0, import_react.useState)(emptyPartner("b", PARTNER_COLORS[1]));
	const [startedAt, setStartedAt] = (0, import_react.useState)("2022-09-04");
	const [currentId, setCurrentId] = (0, import_react.useState)("a");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col px-6 pb-10 pt-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] font-medium uppercase tracking-[0.16em] text-muted",
				children: "Двое"
			}),
			step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight",
						children: "Пространство только для вас двоих"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-[16px] leading-relaxed text-muted",
						children: "Задачи, даты, хотелки и тайные вопросы — без начальников и без лишних людей."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setStep(1),
							children: "Начать"
						})
					})
				]
			}) : null,
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerStep, {
				kicker: "Первый из пары",
				title: "Расскажите о себе",
				partner: a,
				onChange: setA,
				onNext: () => setStep(2),
				onBack: () => setStep(0)
			}) : null,
			step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerStep, {
				kicker: "Второй из пары",
				title: "А теперь — о партнёре",
				partner: b,
				onChange: setB,
				onNext: () => setStep(3),
				onBack: () => setStep(1)
			}) : null,
			step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight",
						children: "С какого дня вы вместе"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Дата начала",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: startedAt,
								onChange: (e) => setStartedAt(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Кто пользуется телефоном сейчас",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [a, b].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCurrentId(p.id),
									className: cn("flex items-center gap-2 rounded-card px-3 py-3 text-left", currentId === p.id ? "bg-ink text-on-ink" : "bg-chip text-ink"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-8 rounded-full",
										style: { background: p.color }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: p.name || "Без имени"
									})]
								}, p.id))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex flex-col gap-2 pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!startedAt) return;
								completeSetup({
									partners: {
										a,
										b
									},
									startedAt,
									currentId
								});
							},
							children: "Это мы"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "md",
							onClick: () => setStep(2),
							children: "Назад"
						})]
					})
				]
			}) : null
		]
	});
}
function PartnerStep({ kicker, title, partner, onChange, onNext, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "flex flex-1 flex-col",
		onSubmit: (e) => {
			e.preventDefault();
			if (!partner.name.trim() || !partner.birthday) return;
			onNext();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-[34px] font-extrabold leading-[1.1] tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Имя",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: partner.name,
							onChange: (e) => onChange({
								...partner,
								name: e.target.value
							}),
							placeholder: "Имя",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Пол",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-1.5",
							children: [
								["female", "Женский"],
								["male", "Мужской"],
								["other", "Другое"]
							].map(([g, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onChange({
									...partner,
									gender: g
								}),
								className: cn("h-11 rounded-full text-[13px] font-semibold", partner.gender === g ? "bg-ink text-on-ink" : "bg-chip text-ink-soft"),
								children: label
							}, g))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Дата рождения",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: partner.birthday,
							onChange: (e) => onChange({
								...partner,
								birthday: e.target.value
							}),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Цвет",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: PARTNER_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onChange({
									...partner,
									color: c
								}),
								className: cn("size-10 rounded-full ring-2 ring-offset-2 ring-offset-bg", partner.color === c ? "ring-ink" : "ring-transparent"),
								style: { background: c }
							}, c))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex flex-col gap-2 pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Дальше"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "md",
					onClick: onBack,
					children: "Назад"
				})]
			})
		]
	});
}
function PartnerSwitcher({ open, onOpenChange }) {
	const partners = useAppStore((s) => s.partners);
	const currentId = useAppStore((s) => s.currentId);
	const setCurrentId = useAppStore((s) => s.setCurrentId);
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open: open && !editing,
		onOpenChange,
		title: "Кто сейчас",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-[14px] leading-relaxed text-muted",
				children: "Переключитесь, чтобы голосовать, брать задачи и писать капсулы от своего имени."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: ["a", "b"].map((id) => {
					const p = partners[id];
					const active = id === currentId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setCurrentId(id);
							toast(`Теперь вы — ${p.name}`);
							onOpenChange(false);
						},
						className: cn("flex items-center gap-3 rounded-card px-3 py-3 text-left transition-colors", active ? "bg-chip" : "bg-surface"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-11 rounded-full",
								style: { background: p.color }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[16px] font-bold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[13px] text-muted",
									children: genderLabel(p.gender)
								})]
							}),
							active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-5 text-ink",
								strokeWidth: 2.4
							}) : null
						]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => setEditing(currentId),
					children: ["Редактировать ", partners[currentId].name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "md",
					onClick: () => setEditing(otherId(currentId)),
					children: ["Редактировать ", partners[otherId(currentId)].name]
				})]
			})
		]
	}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerEditor, {
		open: true,
		partnerId: editing,
		onOpenChange: (v) => {
			if (!v) setEditing(null);
		}
	}) : null] });
}
function PartnerEditor({ open, onOpenChange, partnerId }) {
	const partner = useAppStore((s) => s.partners[partnerId]);
	const updatePartner = useAppStore((s) => s.updatePartner);
	const [draft, setDraft] = (0, import_react.useState)(partner);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setDraft(useAppStore.getState().partners[partnerId]);
	}, [open, partnerId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: partner.name ? partner.name : "Профиль",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!draft.name.trim()) return;
				updatePartner(partnerId, {
					name: draft.name.trim(),
					gender: draft.gender,
					birthday: draft.birthday,
					color: draft.color
				});
				toast("Профиль сохранён");
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Имя",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.name,
						onChange: (e) => setDraft({
							...draft,
							name: e.target.value
						}),
						placeholder: "Как зовут",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Пол",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1.5",
						children: [
							["female", "Женский"],
							["male", "Мужской"],
							["other", "Другое"]
						].map(([g, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDraft({
								...draft,
								gender: g
							}),
							className: cn("h-11 rounded-full text-[13px] font-semibold", draft.gender === g ? "bg-ink text-on-ink" : "bg-chip text-ink-soft"),
							children: label
						}, g))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Дата рождения",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: draft.birthday,
						onChange: (e) => setDraft({
							...draft,
							birthday: e.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Цвет",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: PARTNER_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": c,
							onClick: () => setDraft({
								...draft,
								color: c
							}),
							className: cn("size-10 rounded-full ring-2 ring-offset-2 ring-offset-bg transition-transform", draft.color === c ? "ring-ink scale-105" : "ring-transparent"),
							style: { background: c }
						}, c))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-2",
					children: "Сохранить"
				})
			]
		})
	});
}
var TABS = [
	{
		to: "/",
		label: "Задачи",
		icon: ListTodo,
		end: true
	},
	{
		to: "/calendar",
		label: "Календарь",
		icon: CalendarDays,
		end: false
	},
	{
		to: "/wishes",
		label: "Хотелки",
		icon: Gift,
		end: false
	},
	{
		to: "/docs",
		label: "Документы",
		icon: Folder,
		end: false
	},
	{
		to: "/us",
		label: "Мы",
		icon: Heart,
		end: false
	}
];
function HydrationGate({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = useAppStore.persist.onFinishHydration(() => setReady(true));
		if (useAppStore.persist.hasHydrated()) setReady(true);
		return unsub;
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	return children;
}
function Splash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-3xl font-extrabold tracking-tight text-ink",
			children: "Двое"
		})
	});
}
function AppShell() {
	const setupComplete = useAppStore((s) => s.setupComplete);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HydrationGate, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg-warm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg",
			children: setupComplete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Setup, {})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-center",
		offset: 16,
		toastOptions: { className: "!bg-ink !text-on-ink !rounded-full !px-4 !py-3 !font-[Manrope] !text-sm !shadow-float" }
	})] });
}
function TabBar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "sticky bottom-0 z-30 mt-auto border-t border-line bg-bg pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-5",
			children: TABS.map((tab) => {
				const active = tab.end ? pathname === "/" : pathname.startsWith(tab.to);
				const Icon = tab.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: tab.to,
					className: cn("flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors duration-150", active ? "text-ink" : "text-faint"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-[22px]",
						strokeWidth: active ? 2.2 : 1.7,
						fill: tab.to === "/us" && active ? "currentColor" : "none"
					}), tab.label]
				}) }, tab.to);
			})
		})
	});
}
function Page({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: cn("flex flex-1 flex-col px-5 pt-3 pb-4", className),
		children
	});
}
function PageHeader({ kicker, title, onAdd, addLabel = "Добавить", avatar, extra, kickerUpper = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5 pt-1",
		children: [kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mb-2 text-[12px] font-medium text-muted", kickerUpper && "uppercase tracking-[0.14em]"),
			children: kicker
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "min-w-0 text-[34px] font-extrabold leading-none tracking-tight text-ink",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-1",
				children: [
					extra,
					onAdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onAdd,
						"aria-label": addLabel,
						className: "flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-plus transition-transform duration-150 active:scale-[0.96]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "size-5",
							strokeWidth: 2.2
						})
					}) : null,
					avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderAvatar, {}) : null
				]
			})]
		})]
	});
}
function HeaderAvatar() {
	const me = useMe();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setOpen(true),
		"aria-label": "Профиль",
		className: "size-11 rounded-full transition-transform duration-150 active:scale-[0.96]",
		style: { background: me.color }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerSwitcher, {
		open,
		onOpenChange: setOpen
	})] });
}
var styles_default = "/assets/styles-UAkGlr9x.css";
var APP_NAME = "Двое";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#F3F1EC"
			},
			{
				name: "description",
				content: "Минималистичное пространство для пары: задачи, даты, хотелки и тайные вопросы."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ru",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-BxCTHadO.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./calendar-BKtBdATQ.mjs");
var Route$3 = createFileRoute("/calendar")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./docs-BPVfJzeh.mjs");
var Route$2 = createFileRoute("/docs")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./us-_rGGA5Iu.mjs");
var Route$1 = createFileRoute("/us")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./wishes-BqEg4drv.mjs");
var Route = createFileRoute("/wishes")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	CalendarRoute: Route$3.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => Route$5
	}),
	DocsRoute: Route$2.update({
		id: "/docs",
		path: "/docs",
		getParentRoute: () => Route$5
	}),
	UsRoute: Route$1.update({
		id: "/us",
		path: "/us",
		getParentRoute: () => Route$5
	}),
	WishesRoute: Route.update({
		id: "/wishes",
		path: "/wishes",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as C, titleFromUrl as D, parseISODate as E, todayISO as O, capitalize as S, isoDate as T, Textarea as _, MONTHS_SHORT as a, useMe as b, genderLabel as c, Card as d, EmptyState as f, Sheet as g, Segmented as h, PartnerEditor as i, plural as l, Input as m, Page as n, WEEKDAYS as o, Field as p, PageHeader as r, anniversaryOrdinal as s, router_exports as t, Button as u, otherId as v, isUrl as w, usePartner as x, useAppStore as y };
