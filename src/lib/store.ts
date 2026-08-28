import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { normalizeCodeFormat, sanitizeCodeValue } from "./card-code";
import { isGuestMode } from "./guest";
import { advanceDueDate, normalizeRepeat } from "./task-repeat";
import type {
  CalEvent,
  Capsule,
  CardCodeFormat,
  DocItem,
  ExpenseCategory,
  ExpenseItem,
  Partner,
  PartnerId,
  PlanItem,
  TaskItem,
  TaskRepeat,
  Vote,
  WishItem,
} from "./types";
import { uid } from "./utils";

export function otherId(id: PartnerId): PartnerId {
  return id === "a" ? "b" : "a";
}

function blockGuest(): boolean {
  if (!isGuestMode()) return false;
  toast("Гостевой режим — только просмотр");
  return true;
}

/** Placeholder partners for source / empty install — not real personal data. */
const partners: Record<PartnerId, Partner> = {
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

const now = "2026-08-25T08:06:00.000Z";

interface AppState {
  setupComplete: boolean;
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

  completeSetup: (payload: {
    partners: Record<PartnerId, Partner>;
    startedAt: string;
    currentId: PartnerId;
  }) => void;
  setCurrentId: (id: PartnerId) => void;
  updatePartner: (id: PartnerId, patch: Partial<Partner>) => void;
  setStartedAt: (date: string) => void;

  addTask: (input: {
    title: string;
    notes?: string;
    assignee?: TaskItem["assignee"];
    dueDate?: string | null;
    repeat?: TaskRepeat;
  }) => void;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  addEvent: (input: { title: string; notes?: string; date: string }) => void;
  updateEvent: (id: string, patch: Partial<CalEvent>) => void;
  deleteEvent: (id: string) => void;

  addWish: (input: { title: string; url?: string; price?: string; image?: string; forId: PartnerId }) => void;
  updateWish: (id: string, patch: Partial<WishItem>) => void;
  toggleWish: (id: string) => void;
  deleteWish: (id: string) => void;

  addPlan: (input: { title: string; notes?: string; date?: string | null; kind: PlanItem["kind"] }) => void;
  updatePlan: (id: string, patch: Partial<PlanItem>) => void;
  togglePlan: (id: string) => void;
  deletePlan: (id: string) => void;

  addDoc: (input: {
    title: string;
    notes?: string;
    kind: DocItem["kind"];
    mime?: string;
    dataUrl?: string;
    logoUrl?: string;
    codeValue?: string;
    codeFormat?: CardCodeFormat | "";
  }) => string;
  updateDoc: (id: string, patch: Partial<DocItem>) => void;
  deleteDoc: (id: string) => void;

  addCapsule: (input: { title: string; body: string; openAt: string }) => void;
  deleteCapsule: (id: string) => void;

  addVote: (input: { question: string; options: string[] }) => void;
  castVote: (id: string, optionIndex: number) => void;
  deleteVote: (id: string) => void;

  addExpense: (input: {
    title: string;
    amount: number;
    paidBy: PartnerId;
    category?: ExpenseCategory;
    date: string;
    notes?: string;
  }) => void;
  updateExpense: (id: string, patch: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  settleBalance: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      setupComplete: true,
      currentId: "a",
      startedAt: "2020-01-01",
      partners,
      tasks: [
        {
          id: "t1",
          title: "Купить продукты на ужин",
          notes: "Овощи, хлеб, то самое вино",
          assignee: "none",
          dueDate: "2026-08-25",
          repeat: "none",
          done: false,
          doneAt: null,
          createdAt: now,
        },
        {
          id: "t2",
          title: "Позвонить в банк",
          notes: "",
          assignee: "a",
          dueDate: null,
          repeat: "none",
          done: false,
          doneAt: null,
          createdAt: now,
        },
        {
          id: "t3",
          title: "Забронировать столик в субботу",
          notes: "На двоих, у окна",
          assignee: "b",
          dueDate: "2026-08-29",
          repeat: "none",
          done: false,
          doneAt: null,
          createdAt: now,
        },
      ],
      events: [],
      wishes: [
        {
          id: "w1",
          title: "Льняной плед",
          url: "",
          price: "4 500 ₽",
          image: "",
          forId: "a",
          done: false,
          createdAt: now,
        },
      ],
      plans: [
        {
          id: "p1",
          title: "Выходные у моря",
          notes: "Тихое место, без планов",
          date: "2026-09-12",
          kind: "trip",
          closed: false,
          createdAt: now,
        },
      ],
      docs: [],
      capsules: [
        {
          id: "c1",
          title: "На годовщину",
          body: "Если ты это читаешь — значит, мы всё ещё выбираем друг друга.",
          openAt: "2026-09-04",
          authorId: "a",
          createdAt: now,
        },
      ],
      votes: [
        {
          id: "v1",
          question: "Куда поедем в выходные?",
          options: ["К морю", "В горы", "Остаёмся дома"],
          createdBy: "a",
          ballots: {},
          createdAt: now,
        },
      ],
      expenses: [],

      completeSetup: ({ partners: next, startedAt, currentId }) => {
        if (blockGuest()) return;
        set({ setupComplete: true, partners: next, startedAt, currentId });
      },

      setCurrentId: (id) => set({ currentId: id }),

      updatePartner: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          partners: { ...s.partners, [id]: { ...s.partners[id], ...patch } },
        }));
      },

      setStartedAt: (date) => {
        if (blockGuest()) return;
        set({ startedAt: date });
      },

      addTask: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          tasks: [
            {
              id: uid(),
              title: input.title.trim(),
              notes: input.notes?.trim() ?? "",
              assignee: input.assignee ?? "none",
              dueDate: input.dueDate ?? null,
              repeat: normalizeRepeat(input.repeat ?? "none"),
              done: false,
              doneAt: null,
              createdAt: new Date().toISOString(),
            },
            ...s.tasks,
          ],
        }));
      },

      updateTask: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },

      toggleTask: (id) => {
        if (blockGuest()) return;
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            const repeat = normalizeRepeat(t.repeat);
            if (!t.done && repeat !== "none") {
              return {
                ...t,
                done: false,
                doneAt: null,
                dueDate: advanceDueDate(t.dueDate, repeat),
              };
            }
            return {
              ...t,
              done: !t.done,
              doneAt: !t.done ? new Date().toISOString() : null,
            };
          }),
        }));
      },

      deleteTask: (id) => {
        if (blockGuest()) return;
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      addEvent: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          events: [
            {
              id: uid(),
              title: input.title.trim(),
              notes: input.notes?.trim() ?? "",
              date: input.date,
            },
            ...s.events,
          ],
        }));
      },

      updateEvent: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }));
      },

      deleteEvent: (id) => {
        if (blockGuest()) return;
        set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
      },

      addWish: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          wishes: [
            {
              id: uid(),
              title: input.title.trim(),
              url: input.url?.trim() ?? "",
              price: input.price?.trim() ?? "",
              image: input.image ?? "",
              forId: input.forId,
              done: false,
              createdAt: new Date().toISOString(),
            },
            ...s.wishes,
          ],
        }));
      },

      updateWish: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          wishes: s.wishes.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        }));
      },

      toggleWish: (id) => {
        if (blockGuest()) return;
        set((s) => ({
          wishes: s.wishes.map((w) => (w.id === id ? { ...w, done: !w.done } : w)),
        }));
      },

      deleteWish: (id) => {
        if (blockGuest()) return;
        set((s) => ({ wishes: s.wishes.filter((w) => w.id !== id) }));
      },

      addPlan: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          plans: [
            {
              id: uid(),
              title: input.title.trim(),
              notes: input.notes?.trim() ?? "",
              date: input.date ?? null,
              kind: input.kind,
              closed: false,
              createdAt: new Date().toISOString(),
            },
            ...s.plans,
          ],
        }));
      },

      updatePlan: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      togglePlan: (id) => {
        if (blockGuest()) return;
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, closed: !p.closed } : p)),
        }));
      },

      deletePlan: (id) => {
        if (blockGuest()) return;
        set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
      },

      addDoc: (input) => {
        if (blockGuest()) return "";
        const id = uid();
        const codeValue = sanitizeCodeValue(input.codeValue ?? "");
        const codeFormat = codeValue ? normalizeCodeFormat(input.codeFormat) : "";
        set((s) => ({
          docs: [
            {
              id,
              title: input.title.trim() || "Без названия",
              notes: input.notes?.trim() ?? "",
              kind: input.kind,
              mime: input.mime ?? "",
              dataUrl: input.dataUrl ?? "",
              logoUrl: input.logoUrl ?? "",
              codeValue,
              codeFormat,
              createdAt: new Date().toISOString(),
            },
            ...s.docs,
          ],
        }));
        return id;
      },

      updateDoc: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          docs: s.docs.map((d) => {
            if (d.id !== id) return d;
            const next = { ...d, ...patch };
            if (patch.codeValue !== undefined) {
              next.codeValue = sanitizeCodeValue(patch.codeValue);
            }
            if (patch.codeFormat !== undefined || patch.codeValue !== undefined) {
              next.codeFormat = next.codeValue
                ? normalizeCodeFormat(patch.codeFormat ?? next.codeFormat)
                : "";
            }
            return next;
          }),
        }));
      },

      deleteDoc: (id) => {
        if (blockGuest()) return;
        set((s) => ({ docs: s.docs.filter((d) => d.id !== id) }));
      },

      addCapsule: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          capsules: [
            {
              id: uid(),
              title: input.title.trim(),
              body: input.body.trim(),
              openAt: input.openAt,
              authorId: s.currentId,
              createdAt: new Date().toISOString(),
            },
            ...s.capsules,
          ],
        }));
      },

      deleteCapsule: (id) => {
        if (blockGuest()) return;
        set((s) => ({ capsules: s.capsules.filter((c) => c.id !== id) }));
      },

      addVote: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          votes: [
            {
              id: uid(),
              question: input.question.trim(),
              options: input.options.map((o) => o.trim()).filter(Boolean),
              createdBy: s.currentId,
              ballots: {},
              createdAt: new Date().toISOString(),
            },
            ...s.votes,
          ],
        }));
      },

      castVote: (id, optionIndex) => {
        if (blockGuest()) return;
        const me = get().currentId;
        set((s) => ({
          votes: s.votes.map((v) =>
            v.id === id ? { ...v, ballots: { ...v.ballots, [me]: optionIndex } } : v,
          ),
        }));
      },

      deleteVote: (id) => {
        if (blockGuest()) return;
        set((s) => ({ votes: s.votes.filter((v) => v.id !== id) }));
      },

      addExpense: (input) => {
        if (blockGuest()) return;
        set((s) => ({
          expenses: [
            {
              id: uid(),
              title: input.title.trim() || "Покупка",
              amount: input.amount,
              paidBy: input.paidBy,
              category: input.category ?? "other",
              date: input.date,
              notes: input.notes?.trim() ?? "",
              settled: false,
              createdAt: new Date().toISOString(),
            },
            ...s.expenses,
          ],
        }));
      },

      updateExpense: (id, patch) => {
        if (blockGuest()) return;
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }));
      },

      deleteExpense: (id) => {
        if (blockGuest()) return;
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
      },

      settleBalance: () => {
        if (blockGuest()) return;
        set((s) => ({
          expenses: s.expenses.map((e) => (e.settled ? e : { ...e, settled: true })),
        }));
      },
    }),
    { name: "dvoe-couple-v1" },
  ),
);

export function useMe() {
  return useAppStore((s) => s.partners[s.currentId]);
}

export function usePartner() {
  return useAppStore((s) => s.partners[otherId(s.currentId)]);
}
