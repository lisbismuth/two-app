import { addDays, addMonths, addWeeks, format, parseISO } from "date-fns";
import type { TaskRepeat } from "./types";
import { todayISO } from "./utils";

export const TASK_REPEAT_OPTIONS: { id: TaskRepeat; label: string; short: string }[] = [
  { id: "none", label: "Без повтора", short: "" },
  { id: "daily", label: "Каждый день", short: "каждый день" },
  { id: "weekly", label: "Каждую неделю", short: "каждую неделю" },
  { id: "monthly", label: "Каждый месяц", short: "каждый месяц" },
];

export function normalizeRepeat(value: unknown): TaskRepeat {
  const ids = TASK_REPEAT_OPTIONS.map((o) => o.id);
  return ids.includes(value as TaskRepeat) ? (value as TaskRepeat) : "none";
}

export function repeatLabel(repeat: TaskRepeat | undefined): string {
  return TASK_REPEAT_OPTIONS.find((o) => o.id === normalizeRepeat(repeat))?.short ?? "";
}

/** Next due date after completing a recurring occurrence. */
export function advanceDueDate(dueDate: string | null, repeat: TaskRepeat): string {
  const baseIso = dueDate || todayISO();
  const base = parseISO(baseIso + "T12:00:00");
  if (repeat === "daily") return format(addDays(base, 1), "yyyy-MM-dd");
  if (repeat === "weekly") return format(addWeeks(base, 1), "yyyy-MM-dd");
  if (repeat === "monthly") return format(addMonths(base, 1), "yyyy-MM-dd");
  return baseIso;
}
