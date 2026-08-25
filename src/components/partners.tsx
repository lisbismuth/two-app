import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button, Field, Input, Sheet } from "@/components/ui";
import { genderLabel, PARTNER_COLORS } from "@/lib/i18n";
import { otherId, useAppStore } from "@/lib/store";
import type { Gender, Partner, PartnerId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PartnerSwitcher({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const partners = useAppStore((s) => s.partners);
  const currentId = useAppStore((s) => s.currentId);
  const setCurrentId = useAppStore((s) => s.setCurrentId);
  const [editing, setEditing] = useState<PartnerId | null>(null);

  return (
    <>
      <Sheet open={open && !editing} onOpenChange={onOpenChange} title="Кто сейчас">
        <p className="mb-4 text-[14px] leading-relaxed text-muted">
          Переключитесь, чтобы голосовать, брать задачи и писать капсулы от своего имени.
        </p>
        <div className="flex flex-col gap-2">
          {(["a", "b"] as PartnerId[]).map((id) => {
            const p = partners[id];
            const active = id === currentId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCurrentId(id);
                  toast(`Теперь вы — ${p.name}`);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-card px-3 py-3 text-left transition-colors",
                  active ? "bg-chip" : "bg-surface",
                )}
              >
                <span className="size-11 rounded-full" style={{ background: p.color }} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-bold">{p.name}</span>
                  <span className="block text-[13px] text-muted">{genderLabel(p.gender)}</span>
                </span>
                {active ? <Check className="size-5 text-ink" strokeWidth={2.4} /> : null}
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant="secondary"
            onClick={() => setEditing(currentId)}
          >
            Редактировать {partners[currentId].name}
          </Button>
          <Button variant="ghost" size="md" onClick={() => setEditing(otherId(currentId))}>
            Редактировать {partners[otherId(currentId)].name}
          </Button>
        </div>
      </Sheet>
      {editing ? (
        <PartnerEditor
          open
          partnerId={editing}
          onOpenChange={(v) => {
            if (!v) setEditing(null);
          }}
        />
      ) : null}
    </>
  );
}

export function PartnerEditor({
  open,
  onOpenChange,
  partnerId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  partnerId: PartnerId;
}) {
  const partner = useAppStore((s) => s.partners[partnerId]);
  const updatePartner = useAppStore((s) => s.updatePartner);
  const [draft, setDraft] = useState<Partner>(partner);

  useEffect(() => {
    if (!open) return;
    setDraft(useAppStore.getState().partners[partnerId]);
  }, [open, partnerId]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={partner.name ? partner.name : "Профиль"}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.name.trim()) return;
          updatePartner(partnerId, {
            name: draft.name.trim(),
            gender: draft.gender,
            birthday: draft.birthday,
            color: draft.color,
          });
          toast("Профиль сохранён");
          onOpenChange(false);
        }}
      >
        <Field label="Имя">
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Как зовут"
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
                onClick={() => setDraft({ ...draft, gender: g })}
                className={cn(
                  "h-11 rounded-full text-[13px] font-semibold",
                  draft.gender === g ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
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
            value={draft.birthday}
            onChange={(e) => setDraft({ ...draft, birthday: e.target.value })}
            required
          />
        </Field>
        <Field label="Цвет">
          <div className="flex gap-2">
            {PARTNER_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onClick={() => setDraft({ ...draft, color: c })}
                className={cn(
                  "size-10 rounded-full ring-2 ring-offset-2 ring-offset-bg transition-transform",
                  draft.color === c ? "ring-ink scale-105" : "ring-transparent",
                )}
                style={{ background: c }}
              />
            ))}
          </div>
        </Field>
        <Button type="submit" className="mt-2">
          Сохранить
        </Button>
      </form>
    </Sheet>
  );
}
