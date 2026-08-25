import { E as parseISODate, T as isoDate, a as MONTHS_SHORT, s as anniversaryOrdinal } from "./router-BlVNiMgI.mjs";
import { i as getDate, o as differenceInCalendarDays, r as getMonth } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dates-DLukipNc.js
function startOfDay(d) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysTogether(startedAt, now = /* @__PURE__ */ new Date()) {
	return Math.max(0, differenceInCalendarDays(startOfDay(now), parseISODate(startedAt)));
}
function nextAnniversary(startedAt, now = /* @__PURE__ */ new Date()) {
	const start = parseISODate(startedAt);
	const thisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate());
	if (startOfDay(now) <= thisYear) return thisYear;
	return new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
}
function anniversaryNumber(startedAt, now = /* @__PURE__ */ new Date()) {
	const start = parseISODate(startedAt);
	return nextAnniversary(startedAt, now).getFullYear() - start.getFullYear();
}
function daysUntil(date, now = /* @__PURE__ */ new Date()) {
	return differenceInCalendarDays(startOfDay(date), startOfDay(now));
}
function untilAnniversaryLabel(startedAt, now = /* @__PURE__ */ new Date()) {
	const n = anniversaryNumber(startedAt, now);
	return `до ${anniversaryOrdinal(n)} годовщины`;
}
function monthCells(year, month) {
	const mondayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
	const start = new Date(year, month, 1 - mondayIndex);
	const cells = [];
	for (let i = 0; i < 42; i++) {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		cells.push(d);
	}
	return cells;
}
function sameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function yearlyOn(fromYear, toYear, month, day) {
	const dates = [];
	for (let y = fromYear; y <= toYear; y++) {
		const d = new Date(y, month, day);
		if (d.getMonth() === month) dates.push(isoDate(d));
	}
	return dates;
}
function buildCalendarItems(opts) {
	const items = [];
	const fromY = opts.rangeStart.getFullYear();
	const toY = opts.rangeEnd.getFullYear();
	const start = parseISODate(opts.startedAt);
	for (const date of yearlyOn(fromY, toY, start.getMonth(), start.getDate())) {
		const n = parseISODate(date).getFullYear() - start.getFullYear();
		if (n <= 0) continue;
		items.push({
			id: `ann-${date}`,
			date,
			title: "Годовщина пары",
			subtitle: `${n} ${n === 1 ? "год" : n >= 2 && n <= 4 ? "года" : "лет"} вместе`,
			kind: "anniversary",
			color: "var(--color-rose)"
		});
	}
	["a", "b"].forEach((id) => {
		const p = opts.partners[id];
		if (!p.birthday) return;
		const b = parseISODate(p.birthday);
		for (const date of yearlyOn(fromY, toY, b.getMonth(), b.getDate())) items.push({
			id: `bd-${id}-${date}`,
			date,
			title: `День рождения ${p.name}`,
			subtitle: `${getDate(b)} ${MONTHS_SHORT[getMonth(b)]}`,
			kind: "birthday",
			color: p.color
		});
	});
	for (const ev of opts.events) items.push({
		id: ev.id,
		date: ev.date,
		title: ev.title,
		subtitle: ev.notes || void 0,
		kind: "event"
	});
	for (const t of opts.tasks) {
		if (!t.dueDate || t.done) continue;
		items.push({
			id: `task-${t.id}`,
			date: t.dueDate,
			title: t.title,
			subtitle: "Задача",
			kind: "task"
		});
	}
	return items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "ru"));
}
function upcomingItems(items, now = /* @__PURE__ */ new Date(), limit = 8) {
	const today = isoDate(now);
	return items.filter((i) => i.date >= today).slice(0, limit);
}
//#endregion
export { monthCells as a, untilAnniversaryLabel as c, daysUntil as i, upcomingItems as l, buildCalendarItems as n, nextAnniversary as o, daysTogether as r, sameDay as s, anniversaryNumber as t };
