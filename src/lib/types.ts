export type PartnerId = "a" | "b";
export type Gender = "female" | "male" | "other";
export type TaskAssignee = PartnerId | "none";

/** How often a task repeats after completion. */
export type TaskRepeat = "none" | "daily" | "weekly" | "monthly";

/** Barcode / QR formats drawn only on-device (never sent to third parties). */
export type CardCodeFormat = "CODE128" | "EAN13" | "EAN8" | "CODE39" | "QR";

export type ExpenseCategory =
  | "groceries"
  | "cafes"
  | "taxi"
  | "delivery"
  | "home"
  | "other";

export interface Partner {
  id: PartnerId;
  name: string;
  gender: Gender;
  birthday: string;
  color: string;
}

export interface TaskItem {
  id: string;
  title: string;
  notes: string;
  assignee: TaskAssignee;
  dueDate: string | null;
  /** none = one-shot; otherwise advances dueDate on complete. */
  repeat: TaskRepeat;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
}

export interface CalEvent {
  id: string;
  title: string;
  notes: string;
  date: string;
}

export interface WishItem {
  id: string;
  title: string;
  url: string;
  price: string;
  image: string;
  forId: PartnerId;
  done: boolean;
  createdAt: string;
}

export interface PlanItem {
  id: string;
  title: string;
  notes: string;
  date: string | null;
  kind: "trip" | "plan";
  closed: boolean;
  createdAt: string;
}

export interface DocItem {
  id: string;
  title: string;
  /** Optional note: store, expiry… — not the scannable code */
  notes: string;
  kind: "doc" | "card";
  mime: string;
  /** Photo/PDF optional when card is electronic (codeValue set). */
  dataUrl: string;
  /** Small brand logo (data URL), shown on the card face. */
  logoUrl: string;
  /** Raw loyalty number — rendered as barcode/QR only on this device. */
  codeValue: string;
  codeFormat: CardCodeFormat | "";
  createdAt: string;
}

export interface Capsule {
  id: string;
  title: string;
  body: string;
  openAt: string;
  authorId: PartnerId;
  createdAt: string;
}

export interface Vote {
  id: string;
  question: string;
  options: string[];
  createdBy: PartnerId;
  ballots: Partial<Record<PartnerId, number>>;
  createdAt: string;
}

/** Shared purchase split 50/50. `amount` is the total in rubles. */
export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  paidBy: PartnerId;
  category: ExpenseCategory;
  date: string;
  notes: string;
  /** When true, excluded from debt balance (settled). */
  settled: boolean;
  createdAt: string;
}

export type CalKind = "event" | "task" | "birthday" | "anniversary";

export interface CalendarItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  kind: CalKind;
  color?: string;
}
