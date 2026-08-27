import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { BarChart3, CheckCircle2, ChevronRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Field, Input, Sheet, Textarea } from "@/components/ui";
import { Page, PageHeader } from "@/components/shell";
import { PartnerEditor } from "@/components/partners";
import {
  daysTogether,
  daysUntil,
  nextAnniversary,
  untilAnniversaryLabel,
  untilAnniversaryLines,
} from "@/lib/dates";
import { categoryStats, monthlyExpenseStats } from "@/lib/expense-categories";
import { genderLabel, plural } from "@/lib/i18n";
import { formatRub } from "@/lib/money";
import { otherId, useAppStore, useMe } from "@/lib/store";
import type { Capsule, PartnerId, Vote } from "@/lib/types";
import { cn, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/us")({ component: UsPage });

function UsPage() {
  const me = useMe();
  const partners = useAppStore((s) => s.partners);
  const startedAt = useAppStore((s) => s.startedAt);
  const setStartedAt = useAppStore((s) => s.setStartedAt);
  const wishes = useAppStore((s) => s.wishes);
  const plans = useAppStore((s) => s.plans);
  const tasks = useAppStore((s) => s.tasks);
  const votes = useAppStore((s) => s.votes);
  const capsules = useAppStore((s) => s.capsules);

  const [capsOpen, setCapsOpen] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerId | null>(null);
  const [dateOpen, setDateOpen] = useState(false);

  const together = daysTogether(startedAt);
  const until = daysUntil(nextAnniversary(startedAt));
  const untilLines = untilAnniversaryLines(startedAt);

  const fulfilled = wishes.filter((w) => w.done).length;
  const trips = plans.filter((p) => p.kind === "trip").length;
  const closedPlans = plans.filter((p) => p.closed).length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const openedCaps = capsules.filter((c) => c.openAt <= todayISO()).length;

  return (
    <Page>
      <PageHeader kicker={me.name} title="Мы" avatar />

      <div className="flex flex-col gap-2.5">
        <Card onClick={() => setStatsOpen(true)} className="flex items-center gap-3 px-4 py-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-chip text-ink">
            <BarChart3 className="size-5" strokeWidth={1.7} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[17px] font-bold">Статистика</span>
            <span className="block text-[13px] text-muted">дни вместе, траты по месяцам</span>
          </span>
          <ChevronRight className="size-4 text-faint" />
        </Card>

        <Card onClick={() => setCapsOpen(true)} className="flex items-center gap-3 px-4 py-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-chip text-ink">
            <Mail className="size-5" strokeWidth={1.7} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[17px] font-bold">Капсулы</span>
            <span className="block text-[13px] text-muted">написать письмо в будущее</span>
          </span>
        </Card>

        <Card onClick={() => setVoteOpen(true)} className="flex items-center gap-3 px-4 py-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-chip text-ink">
            <CheckCircle2 className="size-5" strokeWidth={1.7} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[17px] font-bold">Голосование</span>
            <span className="block text-[13px] text-muted">спросить партнёра тайно</span>
          </span>
        </Card>

        <div className="grid grid-cols-2 overflow-hidden rounded-card bg-surface shadow-card">
          <div className="px-5 py-5">
            <p className="text-[40px] font-extrabold leading-none tracking-tight tabular">{together}</p>
            <p className="mt-2 text-[12px] leading-snug text-muted">
              {plural(together, "день", "дня", "дней")}
              <br />
              вместе
            </p>
          </div>
          <div className="border-l border-line px-5 py-5">
            <p className="text-[40px] font-extrabold leading-none tracking-tight text-danger tabular">{until}</p>
            <p className="mt-2 text-[12px] leading-snug text-muted">
              до {untilLines.ordinal}
              <br />
              {untilLines.rest}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-card bg-surface px-2 py-5 shadow-card">
          <Stat n={fulfilled} label="хотелок" />
          <Stat n={trips} label="поездок" />
          <Stat n={closedPlans} label="планов" />
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-card bg-surface px-2 py-5 shadow-card">
          <Stat n={doneTasks} label="задач" />
          <Stat n={votes.length} label="голосований" />
          <Stat n={openedCaps} label="капсул" />
        </div>

        <p className="mt-3 px-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Профили</p>
        {(["a", "b"] as PartnerId[]).map((id) => {
          const p = partners[id];
          return (
            <Card key={id} onClick={() => setEditing(id)} className="flex items-center gap-3 px-4 py-4">
              <span className="size-12 rounded-full" style={{ background: p.color }} />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold">{p.name}</span>
                <span className="block text-[13px] text-muted">
                  {genderLabel(p.gender)}
                  {p.birthday ? ` · ${format(new Date(p.birthday + "T12:00:00"), "d MMMM", { locale: ru })}` : ""}
                </span>
              </span>
              <ChevronRight className="size-4 text-faint" />
            </Card>
          );
        })}

        <Card onClick={() => setDateOpen(true)} className="px-4 py-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">Вместе с</p>
          <p className="mt-1 text-[17px] font-bold">
            {format(new Date(startedAt + "T12:00:00"), "d MMMM yyyy", { locale: ru })}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Через {until} {plural(until, "день", "дня", "дней")} —{" "}
            {untilAnniversaryLabel(startedAt).replace("до ", "")}
          </p>
        </Card>
      </div>

      <StatsSheet open={statsOpen} onOpenChange={setStatsOpen} />
      <CapsulesSheet open={capsOpen} onOpenChange={setCapsOpen} />
      <VotesSheet open={voteOpen} onOpenChange={setVoteOpen} />
      {editing ? (
        <PartnerEditor key={editing} open partnerId={editing} onOpenChange={(v) => !v && setEditing(null)} />
      ) : null}
      <Sheet open={dateOpen} onOpenChange={setDateOpen} title="Дата начала">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const v = String(fd.get("started") || "");
            if (v) {
              setStartedAt(v);
              toast("Дату обновили — календарь пересчитается");
              setDateOpen(false);
            }
          }}
        >
          <Field label="С какого дня вы вместе">
            <Input type="date" name="started" defaultValue={startedAt} required />
          </Field>
          <Button type="submit">Сохранить</Button>
        </form>
      </Sheet>
    </Page>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[28px] font-extrabold leading-none tabular">{n}</p>
      <p className="mt-2 text-[11px] leading-snug text-muted">{label}</p>
    </div>
  );
}

function StatsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const startedAt = useAppStore((s) => s.startedAt);
  const expenses = useAppStore((s) => s.expenses);
  const together = daysTogether(startedAt);
  const until = daysUntil(nextAnniversary(startedAt));
  const untilLines = untilAnniversaryLines(startedAt);

  const months = useMemo(() => monthlyExpenseStats(expenses), [expenses]);
  const cats = useMemo(() => categoryStats(expenses), [expenses]);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Статистика">
      <div className="flex flex-col gap-5">
        <section>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Пара</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-card bg-chip px-4 py-4">
              <p className="text-[28px] font-extrabold leading-none tabular">{together}</p>
              <p className="mt-2 text-[12px] text-muted">
                {plural(together, "день", "дня", "дней")} вместе
              </p>
            </div>
            <div className="rounded-card bg-chip px-4 py-4">
              <p className="text-[28px] font-extrabold leading-none text-danger tabular">{until}</p>
              <p className="mt-2 text-[12px] text-muted">
                до {untilLines.ordinal} {untilLines.rest}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            Вместе с {format(new Date(startedAt + "T12:00:00"), "d MMMM yyyy", { locale: ru })}
          </p>
        </section>

        <section>
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
            Общие траты
          </p>
          <p className="mb-3 text-[22px] font-extrabold tabular">{formatRub(totalSpent)}</p>

          {months.length === 0 ? (
            <p className="text-[14px] text-muted">Пока нет записанных покупок</p>
          ) : (
            <>
              <p className="mb-2 text-[13px] font-semibold text-ink-soft">По месяцам</p>
              <ul className="mb-4 flex flex-col gap-2">
                {months.map((m) => (
                  <li
                    key={m.key}
                    className="flex items-center justify-between rounded-card bg-chip px-3 py-2.5"
                  >
                    <span className="text-[14px] font-semibold">{m.label}</span>
                    <span className="text-[14px] font-bold tabular">{formatRub(m.amount)}</span>
                  </li>
                ))}
              </ul>

              {cats.length > 0 ? (
                <>
                  <p className="mb-2 text-[13px] font-semibold text-ink-soft">По категориям</p>
                  <ul className="flex flex-col gap-3">
                    {cats.map((c) => (
                      <li key={c.id}>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-[14px] font-semibold">{c.label}</span>
                          <span className="text-[14px] font-bold tabular">{formatRub(c.amount)}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-chip">
                          <div
                            className="h-full rounded-full bg-rose"
                            style={{ width: `${Math.max(4, Math.round(c.share * 100))}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          )}
        </section>
      </div>
    </Sheet>
  );
}

function CapsulesSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const capsules = useAppStore((s) => s.capsules);
  const partners = useAppStore((s) => s.partners);
  const [compose, setCompose] = useState(false);
  const [reading, setReading] = useState<Capsule | null>(null);

  return (
    <>
      <Sheet open={open && !compose && !reading} onOpenChange={onOpenChange} title="Капсулы">
        <p className="mb-4 text-[14px] leading-relaxed text-muted">
          Письмо, которое откроется только в выбранный день.
        </p>
        <div className="flex flex-col gap-2">
          {capsules.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-muted">Пока пусто</p>
          ) : (
            capsules.map((c) => {
              const locked = c.openAt > todayISO();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (locked) {
                      toast("Ещё рано — капсула откроется в свой день");
                      return;
                    }
                    setReading(c);
                  }}
                  className="flex items-center gap-3 rounded-card bg-surface px-3 py-3 text-left shadow-card"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-chip">
                    {locked ? <Lock className="size-4" /> : <Mail className="size-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{c.title}</span>
                    <span className="block text-[12px] text-muted">
                      {locked ? "откроется" : "можно читать"}{" "}
                      {format(new Date(c.openAt + "T12:00:00"), "d MMMM yyyy", { locale: ru })}
                      {" · "}
                      {partners[c.authorId].name}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
        <Button className="mt-5" onClick={() => setCompose(true)}>
          Написать капсулу
        </Button>
      </Sheet>
      <ComposeCapsule open={compose} onOpenChange={setCompose} />
      {reading ? (
        <Sheet open onOpenChange={(v) => !v && setReading(null)} title={reading.title}>
          <p className="whitespace-pre-wrap text-[16px] leading-relaxed">{reading.body}</p>
          <p className="mt-6 text-[13px] text-muted">
            {partners[reading.authorId].name} ·{" "}
            {format(new Date(reading.createdAt), "d MMMM yyyy", { locale: ru })}
          </p>
        </Sheet>
      ) : null}
    </>
  );
}

function ComposeCapsule({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addCapsule = useAppStore((s) => s.addCapsule);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [openAt, setOpenAt] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setBody("");
    setOpenAt("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Письмо в будущее">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !body.trim() || !openAt) return;
          addCapsule({ title, body, openAt });
          toast("Капсулу запечатали");
          onOpenChange(false);
        }}
      >
        <Field label="Название">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Открыть">
          <Input type="date" value={openAt} min={todayISO()} onChange={(e) => setOpenAt(e.target.value)} required />
        </Field>
        <Field label="Письмо">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} required />
        </Field>
        <Button type="submit">Запечатать</Button>
      </form>
    </Sheet>
  );
}

function VotesSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const votes = useAppStore((s) => s.votes);
  const [compose, setCompose] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <Sheet open={open && !compose && !active} onOpenChange={onOpenChange} title="Голосование">
        <p className="mb-4 text-[14px] leading-relaxed text-muted">
          Ответ партнёра откроется только после вашего голоса. Никто никого не торопит.
        </p>
        <div className="flex flex-col gap-2">
          {votes.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-muted">Вопросов пока нет</p>
          ) : (
            votes.map((v) => <VoteRow key={v.id} vote={v} onOpen={() => setActive(v.id)} />)
          )}
        </div>
        <Button className="mt-5" onClick={() => setCompose(true)}>
          Задать вопрос
        </Button>
      </Sheet>
      <ComposeVote open={compose} onOpenChange={setCompose} />
      {active ? <VoteDetail voteId={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}

function VoteRow({ vote, onOpen }: { vote: Vote; onOpen: () => void }) {
  const me = useAppStore((s) => s.currentId);
  const partner = useAppStore((s) => s.partners[otherId(s.currentId)]);
  const mine = vote.ballots[me] !== undefined;
  const theirs = vote.ballots[otherId(me)] !== undefined;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-card bg-surface px-4 py-3 text-left shadow-card"
    >
      <p className="font-bold leading-snug">{vote.question}</p>
      <p className="mt-1 text-[12px] text-muted">
        {!mine
          ? "Вы ещё не голосовали"
          : theirs
            ? "Оба ответили — можно смотреть"
            : `Ждём ${partner.name}`}
      </p>
    </button>
  );
}

function VoteDetail({ voteId, onClose }: { voteId: string; onClose: () => void }) {
  const vote = useAppStore((s) => s.votes.find((v) => v.id === voteId));
  const me = useAppStore((s) => s.currentId);
  const partners = useAppStore((s) => s.partners);
  const castVote = useAppStore((s) => s.castVote);
  const deleteVote = useAppStore((s) => s.deleteVote);
  if (!vote) return null;

  const mine = vote.ballots[me];
  const partnerId = otherId(me);
  const theirs = vote.ballots[partnerId];
  const revealed = mine !== undefined && theirs !== undefined;

  return (
    <Sheet open onOpenChange={(v) => !v && onClose()} title="Вопрос">
      <p className="text-[20px] font-extrabold leading-snug">{vote.question}</p>
      <div className="mt-5 flex flex-col gap-2">
        {vote.options.map((opt, i) => {
          const chosen = mine === i;
          return (
            <button
              key={opt + i}
              type="button"
              disabled={mine !== undefined}
              onClick={() => {
                castVote(vote.id, i);
                toast(
                  theirs !== undefined
                    ? "Голос учтён — ответы открыты"
                    : "Голос сохранён. Ответ партнёра откроется, когда проголосует и он.",
                );
              }}
              className={cn(
                "rounded-card px-4 py-3 text-left text-[15px] font-semibold",
                chosen ? "bg-ink text-on-ink" : "bg-chip text-ink",
                mine !== undefined && !chosen && "opacity-50",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {mine === undefined ? (
        <p className="mt-5 text-[13px] leading-relaxed text-muted">
          Ответ {partners[partnerId].name} скрыт, пока вы не выберете свой.
        </p>
      ) : !revealed ? (
        <p className="mt-5 text-[13px] leading-relaxed text-muted">
          Вы проголосовали. {partners[partnerId].name} ещё нет — подсмотреть нельзя.
        </p>
      ) : (
        <div className="mt-5 rounded-card bg-surface p-4 shadow-card">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Открыто</p>
          <p className="mt-2 text-[15px]">
            <span className="font-bold">{partners[me].name}:</span> {vote.options[mine]}
          </p>
          <p className="mt-1 text-[15px]">
            <span className="font-bold">{partners[partnerId].name}:</span> {vote.options[theirs]}
          </p>
          <p className="mt-3 text-[13px] text-muted">
            {mine === theirs ? "Совпало." : "Разъехались — можно обсудить."}
          </p>
        </div>
      )}

      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => {
          deleteVote(vote.id);
          onClose();
        }}
      >
        Удалить вопрос
      </Button>
    </Sheet>
  );
}

function ComposeVote({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addVote = useAppStore((s) => s.addVote);
  const [question, setQuestion] = useState("");
  const [o1, setO1] = useState("");
  const [o2, setO2] = useState("");
  const [o3, setO3] = useState("");

  useEffect(() => {
    if (!open) return;
    setQuestion("");
    setO1("");
    setO2("");
    setO3("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Новый вопрос">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const options = [o1, o2, o3].map((s) => s.trim()).filter(Boolean);
          if (!question.trim() || options.length < 2) {
            toast("Нужны вопрос и хотя бы два варианта");
            return;
          }
          addVote({ question, options });
          toast("Вопрос задан");
          onOpenChange(false);
        }}
      >
        <Field label="Вопрос">
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Куда поедем?" required />
        </Field>
        <Field label="Вариант 1">
          <Input value={o1} onChange={(e) => setO1(e.target.value)} required />
        </Field>
        <Field label="Вариант 2">
          <Input value={o2} onChange={(e) => setO2(e.target.value)} required />
        </Field>
        <Field label="Вариант 3 — необязательно">
          <Input value={o3} onChange={(e) => setO3(e.target.value)} />
        </Field>
        <Button type="submit">Спросить</Button>
      </form>
    </Sheet>
  );
}
