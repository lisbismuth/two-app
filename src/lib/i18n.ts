import type { Gender } from "./types";

export function plural(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (d === 1) return one;
  if (d >= 2 && d <= 4) return few;
  return many;
}

export function genderLabel(g: Gender) {
  if (g === "female") return "Женский";
  if (g === "male") return "Мужской";
  return "Другое";
}

const ORDINAL_FEM_GEN: Record<number, string> = {
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
  20: "двадцатой",
};

export function anniversaryOrdinal(n: number) {
  return ORDINAL_FEM_GEN[n] ?? `${n}-й`;
}

export function genitiveName(name: string) {
  const n = name.trim();
  if (!n) return n;
  if (n.endsWith("а")) return n.slice(0, -1) + "ы";
  if (n.endsWith("я")) return n.slice(0, -1) + "и";
  if (n.endsWith("й") || n.endsWith("ь")) return n.slice(0, -1) + "я";
  return n + "а";
}

export const MONTHS_SHORT = [
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
  "дек",
];

export const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export const PARTNER_COLORS = [
  "#D4899A",
  "#7A9E8A",
  "#7A93B0",
  "#C4A574",
  "#C4846A",
  "#6E7C86",
];
