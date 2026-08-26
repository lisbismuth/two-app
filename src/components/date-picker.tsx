import { useEffect, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
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

  const initialMonth = selected ?? (min ? parseISODate(min) : new Date());
  const [month, setMonth] = useState(initialMonth);

  // Keep visible month in sync when the value changes or panel opens
  useEffect(() => {
    if (!open) return;
    setMonth(selected ?? (min ? parseISODate(min) : new Date()));
  }, [open, value]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <span className="truncate">{label}</span>
        <span className="ml-3 shrink-0 text-[12px] font-medium text-muted">
          {open ? "Скрыть" : "Календарь"}
        </span>
      </button>

      {open ? (
        <div className="overflow-hidden rounded-card bg-surface p-3 shadow-card">
          {/* Own nav — no absolute positioning from DayPicker */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Предыдущий месяц"
              onClick={() => setMonth((m) => subMonths(m, 1))}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink active:bg-chip"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="min-w-0 flex-1 text-center text-[15px] font-bold capitalize text-ink">
              {format(month, "LLLL yyyy", { locale: ru })}
            </p>
            <button
              type="button"
              aria-label="Следующий месяц"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink active:bg-chip"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <DayPicker
            mode="single"
            locale={ru}
            weekStartsOn={1}
            month={month}
            onMonthChange={setMonth}
            hideNavigation
            selected={selected}
            onSelect={(day) => {
              if (!day) return;
              onChange(isoDate(day));
              setOpen(false);
            }}
            disabled={[
              ...(min ? [{ before: parseISODate(min) }] : []),
              ...(max ? [{ after: parseISODate(max) }] : []),
            ]}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              month_caption: "hidden",
              month_grid: "w-full",
              weekdays: "grid grid-cols-7",
              weekday:
                "text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-faint pb-1.5",
              week: "grid grid-cols-7",
              day: "p-0 text-center",
              day_button:
                "mx-auto flex size-9 items-center justify-center rounded-full text-[15px] font-medium text-ink active:bg-chip",
              selected:
                "[&>button]:bg-ink [&>button]:text-on-ink active:[&>button]:bg-ink",
              today: "[&>button]:ring-1 [&>button]:ring-ink/20",
              outside: "[&>button]:text-faint",
              disabled: "[&>button]:text-faint/40 [&>button]:pointer-events-none",
              hidden: "invisible",
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
