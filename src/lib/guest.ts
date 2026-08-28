import type {
  CalEvent,
  Capsule,
  DocItem,
  ExpenseItem,
  Partner,
  PartnerId,
  PlanItem,
  TaskItem,
  Vote,
  WishItem,
} from "./types";

const GUEST_KEY = "dvoe-guest-mode";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(GUEST_KEY) === "1";
  } catch {
    return false;
  }
}

export function enterGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(GUEST_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function exitGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(GUEST_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Deep-link into demo/guest mode via `?demo=true` or `?guest=true`.
 * Sets the guest flag, strips the query params (clean `/`), returns true when
 * the current load should show the demo snapshot. Works with auth on or off.
 *
 * Safe to call during render on the client — sessionStorage + replaceState only.
 * Callers should apply `buildGuestSnapshot()` after Zustand has hydrated.
 */
export function tryEnterGuestFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const want =
      params.get("demo") === "true" ||
      params.get("guest") === "true" ||
      params.get("demo") === "1" ||
      params.get("guest") === "1";
    if (!want) return false;

    enterGuestMode();

    params.delete("demo");
    params.delete("guest");
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", next || "/");
    return true;
  } catch {
    return false;
  }
}

/** Demo partners — fictional, no real emails or birthdays. */
export const GUEST_PARTNERS: Record<PartnerId, Partner> = {
  a: {
    id: "a",
    name: "Аня",
    gender: "female",
    birthday: "1998-06-15",
    color: "#D4899A",
  },
  b: {
    id: "b",
    name: "Игорь",
    gender: "male",
    birthday: "1996-11-03",
    color: "#7A9E8A",
  },
};

const now = "2026-08-20T10:00:00.000Z";

export type GuestSnapshot = {
  setupComplete: true;
  currentId: PartnerId;
  startedAt: string;
  partners: Record<PartnerId, Partner>;
  tasks: TaskItem[];
  events: CalEvent[];
  wishes: WishItem[];
  plans: PlanItem[];
  docs: DocItem[];
  capsules: Capsule[];
  votes: Vote[];
  expenses: ExpenseItem[];
};

/** Read-only demo content for guest mode. No real emails or personal data. */
export function buildGuestSnapshot(): GuestSnapshot {
  return {
    setupComplete: true,
    currentId: "a",
    startedAt: "2020-01-01",
    partners: GUEST_PARTNERS,
    tasks: [
      {
        id: "guest-t1",
        title: "Купить продукты",
        notes: "Молоко, хлеб, фрукты",
        assignee: "none",
        dueDate: "2026-08-28",
        repeat: "weekly",
        done: false,
        doneAt: null,
        createdAt: now,
      },
      {
        id: "guest-t2",
        title: "Оплатить интернет",
        notes: "",
        assignee: "a",
        dueDate: "2026-08-30",
        repeat: "monthly",
        done: false,
        doneAt: null,
        createdAt: now,
      },
      {
        id: "guest-t3",
        title: "Забрать посылку",
        notes: "Пункт выдачи до 20:00",
        assignee: "b",
        dueDate: null,
        repeat: "none",
        done: true,
        doneAt: now,
        createdAt: now,
      },
    ],
    events: [
      {
        id: "guest-e1",
        title: "Ужин в городе",
        notes: "Бронь на 19:00",
        date: "2026-08-29",
      },
    ],
    wishes: [
      {
        id: "guest-w1",
        title: "Книга по путешествиям",
        url: "",
        price: "1 200 ₽",
        image: "",
        forId: "a",
        done: false,
        createdAt: now,
      },
      {
        id: "guest-w2",
        title: "Беспроводные наушники",
        url: "",
        price: "7 900 ₽",
        image: "",
        forId: "b",
        done: false,
        createdAt: now,
      },
    ],
    plans: [
      {
        id: "guest-p1",
        title: "Поездка на выходные",
        notes: "Тихий город у воды",
        date: "2026-09-12",
        kind: "trip",
        closed: false,
        createdAt: now,
      },
    ],
    docs: [
      {
        id: "guest-d1",
        title: "Демо-карта",
        notes: "Пример электронной карты",
        kind: "card",
        mime: "",
        dataUrl: "",
        logoUrl: "",
        codeValue: "1234567890123",
        codeFormat: "EAN13",
        createdAt: now,
      },
    ],
    capsules: [
      {
        id: "guest-c1",
        title: "Капсула на потом",
        body: "Короткое послание себе в будущем — только демо.",
        openAt: "2027-01-01",
        authorId: "a",
        createdAt: now,
      },
    ],
    votes: [
      {
        id: "guest-v1",
        question: "Что приготовим вечером?",
        options: ["Паста", "Салат", "Заказ доставки"],
        createdBy: "a",
        ballots: { a: 0 },
        createdAt: now,
      },
    ],
    expenses: [
      {
        id: "guest-x1",
        title: "Продукты",
        amount: 2400,
        paidBy: "a",
        category: "groceries",
        date: "2026-08-20",
        notes: "",
        settled: false,
        createdAt: now,
      },
      {
        id: "guest-x2",
        title: "Такси",
        amount: 650,
        paidBy: "b",
        category: "taxi",
        date: "2026-08-22",
        notes: "",
        settled: false,
        createdAt: now,
      },
    ],
  };
}
