import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { PARTNER_COLORS } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import type { Gender, Partner, PartnerId } from "@/lib/types";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;

const emptyPartner = (id: PartnerId, color: string): Partner => ({
  id,
  name: "",
  gender: id === "a" ? "female" : "male",
  birthday: "",
  color,
});

export function Setup() {
  const completeSetup = useAppStore((s) => s.completeSetup);
  const [step, setStep] = useState<Step>(0);
  const [a, setA] = useState<Partner>(emptyPartner("a", PARTNER_COLORS[0]!));
  const [b, setB] = useState<Partner>(emptyPartner("b", PARTNER_COLORS[1]!));
  const [startedAt, setStartedAt] = useState("2022-09-04");
  const [currentId, setCurrentId] = useState<PartnerId>("a");

  return (
    <main className="flex min-h-dvh flex-col px-6 pb-10 pt-16">
      <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted">Двое</p>
      {step === 0 ? (
        <div className="flex flex-1 flex-col">
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight">
            Пространство только для вас двоих
          </h1>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-muted">
            Задачи, даты, хотелки и тайные вопросы — без начальников и без лишних людей.
          </p>
          <div className="mt-auto">
            <Button onClick={() => setStep(1)}>Начать</Button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <PartnerStep
          kicker="Первый из пары"
          title="Расскажите о себе"
          partner={a}
          onChange={setA}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      ) : null}

      {step === 2 ? (
        <PartnerStep
          kicker="Второй из пары"
          title="А теперь — о партнёре"
          partner={b}
          onChange={setB}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      ) : null}

      {step === 3 ? (
        <div className="flex flex-1 flex-col">
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight">
            С какого дня вы вместе
          </h1>
          <div className="mt-8 flex flex-col gap-5">
            <Field label="Дата начала">
              <Input type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} />
            </Field>
            <Field label="Кто пользуется телефоном сейчас">
              <div className="grid grid-cols-2 gap-2">
                {([a, b] as Partner[]).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCurrentId(p.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-card px-3 py-3 text-left",
                      currentId === p.id ? "bg-ink text-on-ink" : "bg-chip text-ink",
                    )}
                  >
                    <span className="size-8 rounded-full" style={{ background: p.color }} />
                    <span className="font-semibold">{p.name || "Без имени"}</span>
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-8">
            <Button
              onClick={() => {
                if (!startedAt) return;
                completeSetup({
                  partners: { a, b },
                  startedAt,
                  currentId,
                });
              }}
            >
              Это мы
            </Button>
            <Button variant="ghost" size="md" onClick={() => setStep(2)}>
              Назад
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function PartnerStep({
  kicker,
  title,
  partner,
  onChange,
  onNext,
  onBack,
}: {
  kicker: string;
  title: string;
  partner: Partner;
  onChange: (p: Partner) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!partner.name.trim() || !partner.birthday) return;
        onNext();
      }}
    >
      <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted">{kicker}</p>
      <h1 className="mt-2 text-[34px] font-extrabold leading-[1.1] tracking-tight">{title}</h1>
      <div className="mt-8 flex flex-col gap-4">
        <Field label="Имя">
          <Input
            value={partner.name}
            onChange={(e) => onChange({ ...partner, name: e.target.value })}
            placeholder="Имя"
            required
          />
        </Field>
        <Field label="Пол">
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                ["female", "Женский"],
                ["male", "Мужской"],
                ["other", "Другое"],
              ] as [Gender, string][]
            ).map(([g, label]) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ ...partner, gender: g })}
                className={cn(
                  "h-11 rounded-full text-[13px] font-semibold",
                  partner.gender === g ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Дата рождения">
          <Input
            type="date"
            value={partner.birthday}
            onChange={(e) => onChange({ ...partner, birthday: e.target.value })}
            required
          />
        </Field>
        <Field label="Цвет">
          <div className="flex gap-2">
            {PARTNER_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ ...partner, color: c })}
                className={cn(
                  "size-10 rounded-full ring-2 ring-offset-2 ring-offset-bg",
                  partner.color === c ? "ring-ink" : "ring-transparent",
                )}
                style={{ background: c }}
              />
            ))}
          </div>
        </Field>
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-8">
        <Button type="submit">Дальше</Button>
        <Button variant="ghost" size="md" onClick={onBack}>
          Назад
        </Button>
      </div>
    </form>
  );
}
