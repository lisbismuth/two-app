import { differenceInCalendarDays } from "date-fns";
import type { CalEvent, CalendarItem, Partner, PartnerId, TaskItem } from "./types";
import { isoDate, parseISODate } from "./utils";
import { anniversaryOrdinal, genitiveName } from "./i18n";

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysTogether(startedAt: string, now = new Date()) {
  return Math.max(0, differenceInCalendarDays(startOfDay(now), parseISODate(startedAt)));
}

export function nextAnniversary(startedAt: string, now = new Date()) {
  const start = parseISODate(startedAt);
  const thisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (startOfDay(now) <= thisYear) return thisYear;
  return new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
}

export function anniversaryNumber(startedAt: string, now = new Date()) {
  const start = parseISODate(startedAt);
  const next = nextAnniversary(startedAt, now);
  return next.getFullYear() - start.getFullYear();
}

export function daysUntil(date: Date, now = new Date()) {
  return differenceInCalendarDays(startOfDay(date), startOfDay(now));
}

export function yearsTogetherLabel(startedAt: string, now = new Date()) {
  const n = anniversaryNumber(startedAt, now);
  return `${n} ${n === 1 ? "год" : n >= 2 && n <= 4 ? "года" : "лет"} вместе`;
}

export function anniversarySubtitle(startedAt: string, now = new Date()) {
  return yearsTogetherLabel(startedAt, now);
}

export function untilAnniversaryLabel(startedAt: string, now = new Date()) {
  const n = anniversaryNumber(startedAt, now);
  return `до ${anniversaryOrdinal(n)} годовщины`;
}

export function untilAnniversaryLines(startedAt: string, now = new Date()) {
  const n = anniversaryNumber(startedAt, now);
  return { ordinal: anniversaryOrdinal(n), rest: "годовщины" };
}

export function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const mondayIndex = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - mondayIndex);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function yearlyOn(fromYear: number, toYear: number, month: number, day: number) {
  const dates: string[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    const d = new Date(y, month, day);
    if (d.getMonth() === month) dates.push(isoDate(d));
  }
  return dates;
}

export function buildCalendarItems(opts: {
  partners: Record<PartnerId, Partner>;
  startedAt: string;
  events: CalEvent[];
  tasks: TaskItem[];
  rangeStart: Date;
  rangeEnd: Date;
}): CalendarItem[] {
  const items: CalendarItem[] = [];
  const fromY = opts.rangeStart.getFullYear();
  const toY = opts.rangeEnd.getFullYear();

  const start = parseISODate(opts.startedAt);
  for (const date of yearlyOn(fromY, toY, start.getMonth(), start.getDate())) {
    const when = parseISODate(date);
    const n = when.getFullYear() - start.getFullYear();
    if (n <= 0) continue;
    items.push({
      id: `ann-${date}`,
      date,
      title: "Годовщина пары",
      subtitle: `${n} ${n === 1 ? "год" : n >= 2 && n <= 4 ? "года" : "лет"} вместе`,
      kind: "anniversary",
      color: "var(--color-rose)",
    });
  }

  (["a", "b"] as PartnerId[]).forEach((id) => {
    const p = opts.partners[id];
    if (!p.birthday) return;
    const b = parseISODate(p.birthday);
    for (const date of yearlyOn(fromY, toY, b.getMonth(), b.getDate())) {
      items.push({
        id: `bd-${id}-${date}`,
        date,
        title: `День рождения ${genitiveName(p.name)}`,
        kind: "birthday",
        color: p.color,
      });
    }
  });

  for (const ev of opts.events) {
    items.push({
      id: ev.id,
      date: ev.date,
      title: ev.title,
      subtitle: ev.notes || undefined,
      kind: "event",
    });
  }

  for (const t of opts.tasks) {
    if (!t.dueDate || t.done) continue;
    items.push({
      id: `task-${t.id}`,
      date: t.dueDate,
      title: t.title,
      subtitle: "Задача",
      kind: "task",
    });
  }

  return items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "ru"));
}

export function upcomingItems(items: CalendarItem[], now = new Date(), limit = 4) {
  const today = isoDate(now);
  const capDate = new Date(now.getFullYear(), now.getMonth() + 4, now.getDate());
  const cap = isoDate(capDate);
  return items.filter((i) => i.date >= today && i.date <= cap).slice(0, limit);
}
