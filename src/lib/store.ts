import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CalEvent,
  Capsule,
  DocItem,
  Partner,
  PartnerId,
  PlanItem,
  TaskItem,
  Vote,
  WishItem,
} from "./types";
import { uid } from "./utils";

export function otherId(id: PartnerId): PartnerId {
  return id === "a" ? "b" : "a";
}

const partners: Record<PartnerId, Partner> = {
  a: {
    id: "a",
    name: "Лиза",
    gender: "female",
    birthday: "1999-03-12",
    color: "#D4899A",
  },
  b: {
    id: "b",
    name: "Андрей",
    gender: "male",
    birthday: "1997-07-08",
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

  completeSetup: (payload: {
    partners: Record<PartnerId, Partner>;
    startedAt: string;
    currentId: PartnerId;
  }) => void;
  setCurrentId: (id: PartnerId) => void;
  updatePartner: (id: PartnerId, patch: Partial<Partner>) => void;
  setStartedAt: (date: string) => void;

  addTask: (input: { title: string; notes?: string; assignee?: TaskItem["assignee"]; dueDate?: string | null }) => void;
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
  togglePlan: (id: string) => void;
  deletePlan: (id: string) => void;

  addDoc: (input: { title: string; kind: DocItem["kind"]; mime: string; dataUrl: string }) => void;
  updateDoc: (id: string, patch: Partial<DocItem>) => void;
  deleteDoc: (id: string) => void;

  addCapsule: (input: { title: string; body: string; openAt: string }) => void;
  deleteCapsule: (id: string) => void;

  addVote: (input: { question: string; options: string[] }) => void;
  castVote: (id: string, optionIndex: number) => void;
  deleteVote: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
          createdAt: now,
        },
        {
          id: "t2",
          title: "Позвонить в банк",
          notes: "",
          assignee: "a",
          dueDate: null,
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
          title: "На четвёртую годовщину",
          body: "Если ты это читаешь — значит, мы всё ещё выбираем друг друга. Спасибо, что ты есть.",
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

      completeSetup: ({ partners: next, startedAt, currentId }) =>
        set({ setupComplete: true, partners: next, startedAt, currentId }),

      setCurrentId: (id) => set({ currentId: id }),

      updatePartner: (id, patch) =>
        set((s) => ({
          partners: { ...s.partners, [id]: { ...s.partners[id], ...patch } },
        })),

      setStartedAt: (date) => set({ startedAt: date }),

      addTask: (input) =>
        set((s) => ({
          tasks: [
            {
              id: uid(),
              title: input.title.trim(),
              notes: input.notes?.trim() ?? "",
              assignee: input.assignee ?? "none",
              dueDate: input.dueDate ?? null,
              done: false,
              doneAt: null,
              createdAt: new Date().toISOString(),
            },
            ...s.tasks,
          ],
        })),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  done: !t.done,
                  doneAt: !t.done ? new Date().toISOString() : null,
                }
              : t,
          ),
        })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addEvent: (input) =>
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
        })),

      updateEvent: (id, patch) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      addWish: (input) =>
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
        })),

      updateWish: (id, patch) =>
        set((s) => ({
          wishes: s.wishes.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),

      toggleWish: (id) =>
        set((s) => ({
          wishes: s.wishes.map((w) => (w.id === id ? { ...w, done: !w.done } : w)),
        })),

      deleteWish: (id) => set((s) => ({ wishes: s.wishes.filter((w) => w.id !== id) })),

      addPlan: (input) =>
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
        })),

      togglePlan: (id) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, closed: !p.closed } : p)),
        })),

      deletePlan: (id) => set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),

      addDoc: (input) =>
        set((s) => ({
          docs: [
            {
              id: uid(),
              title: input.title.trim() || "Без названия",
              kind: input.kind,
              mime: input.mime,
              dataUrl: input.dataUrl,
              createdAt: new Date().toISOString(),
            },
            ...s.docs,
          ],
        })),

      updateDoc: (id, patch) =>
        set((s) => ({
          docs: s.docs.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),

      deleteDoc: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id) })),

      addCapsule: (input) =>
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
        })),

      deleteCapsule: (id) => set((s) => ({ capsules: s.capsules.filter((c) => c.id !== id) })),

      addVote: (input) =>
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
        })),

      castVote: (id, optionIndex) => {
        const me = get().currentId;
        set((s) => ({
          votes: s.votes.map((v) =>
            v.id === id ? { ...v, ballots: { ...v.ballots, [me]: optionIndex } } : v,
          ),
        }));
      },

      deleteVote: (id) => set((s) => ({ votes: s.votes.filter((v) => v.id !== id) })),
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
