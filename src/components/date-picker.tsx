import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, isoDate, parseISODate } from "@/lib/utils";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  /** ISO date — days before this are disabled */
  min?: string;
  /** ISO date — days after this are disabled */
  max?: string;
  placeholder?: string;
  allowClear?: boolean;
  required?: boolean;
};

export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "Выберите дату",
  allowClear = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISODate(value) : undefined;

  const label = selected
    ? format(selected, "d MMMM yyyy", { locale: ru })
    : placeholder;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-control bg-chip px-4 text-left text-[15px] outline-none",
          "ring-1 ring-transparent transition-[box-shadow,background-color] duration-150",
          open ? "bg-surface ring-ink/15" : "",
          selected ? "text-ink" : "text-faint",
        )}
      >
        <span>{label}</span>
        <span className="text-[12px] font-medium text-muted">{open ? "Скрыть" : "Календарь"}</span>
      </button>

      {open ? (
        <div className="rounded-card bg-surface p-3 shadow-card">
          <DayPicker
            mode="single"
            locale={ru}
            weekStartsOn={1}
            selected={selected}
            defaultMonth={selected ?? (min ? parseISODate(min) : new Date())}
            onSelect={(day) => {
              if (!day) return;
              onChange(isoDate(day));
              setOpen(false);
            }}
            disabled={[
              ...(min ? [{ before: parseISODate(min) }] : []),
              ...(max ? [{ after: parseISODate(max) }] : []),
            ]}
            className="rdp-root"
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              month_caption: "flex items-center justify-center relative h-10 mb-2",
              caption_label: "text-[15px] font-bold capitalize text-ink",
              nav: "absolute inset-x-0 top-0 flex items-center justify-between px-0",
              button_previous:
                "flex size-9 items-center justify-center rounded-full text-ink hover:bg-chip",
              button_next:
                "flex size-9 items-center justify-center rounded-full text-ink hover:bg-chip",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday:
                "flex-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-faint pb-1",
              week: "flex w-full",
              day: "flex-1 p-0 text-center",
              day_button:
                "mx-auto flex size-9 items-center justify-center rounded-full text-[15px] font-medium text-ink hover:bg-chip",
              selected: "[&>button]:bg-ink [&>button]:text-on-ink hover:[&>button]:bg-ink",
              today: "[&>button]:ring-1 [&>button]:ring-ink/20",
              outside: "[&>button]:text-faint",
              disabled: "[&>button]:text-faint/50 [&>button]:pointer-events-none",
              hidden: "invisible",
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                ),
            }}
          />
          {allowClear && value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="mt-1 w-full py-2 text-center text-[14px] font-semibold text-muted"
            >
              Очистить дату
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
