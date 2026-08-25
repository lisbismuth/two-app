import { cva, type VariantProps } from "class-variance-authority";
import { Drawer } from "vaul";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] transition-[transform,background-color,opacity] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-ink text-on-ink",
        secondary: "bg-transparent text-ink ring-1 ring-line",
        ghost: "bg-transparent text-ink",
        surface: "bg-surface text-ink shadow-plus",
        link: "bg-transparent text-link font-semibold",
        danger: "bg-danger text-on-ink",
      },
      size: {
        lg: "h-14 w-full rounded-full text-[17px]",
        md: "h-11 px-5 rounded-full text-sm",
        sm: "h-9 px-4 rounded-full text-sm",
        icon: "size-11 rounded-full",
        chip: "h-8 px-3 rounded-full text-xs font-medium",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-control bg-chip px-4 text-[15px] text-ink outline-none",
        "placeholder:text-faint",
        "ring-1 ring-transparent transition-[box-shadow] duration-150",
        "focus:bg-surface focus:ring-ink/15",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-control bg-chip px-4 py-3 text-[15px] text-ink outline-none",
        "placeholder:text-faint",
        "ring-1 ring-transparent transition-[box-shadow] duration-150",
        "focus:bg-surface focus:ring-ink/15",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-[12px] font-medium uppercase tracking-[0.08em] text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/35" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col outline-none"
          aria-describedby={undefined}
        >
          <div className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-sheet bg-bg shadow-float">
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-faint/70" />
            <Drawer.Title className="px-5 pb-3 pt-4 text-[22px] font-extrabold tracking-tight text-ink">
              {title}
            </Drawer.Title>
            <div className="flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 rounded-full bg-chip p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "h-10 rounded-full text-[15px] font-semibold transition-[background-color,color,box-shadow] duration-200",
              active ? "bg-surface text-ink shadow-plus" : "bg-transparent text-muted",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
  secondary,
  footnote,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
  secondary?: ReactNode;
  footnote?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-7 text-faint">{icon}</div>
      <h2 className="text-[22px] font-extrabold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-[280px] text-[15px] leading-relaxed text-muted">{text}</p>
      {action ? <div className="mt-7 w-full max-w-[340px]">{action}</div> : null}
      {secondary ? <div className="mt-3 w-full max-w-[340px]">{secondary}</div> : null}
      {footnote ? (
        <p className="mt-5 max-w-[280px] text-[12px] uppercase tracking-[0.08em] text-faint">{footnote}</p>
      ) : null}
    </div>
  );
}

export function Card({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const cls = cn("w-full rounded-card bg-surface p-4 text-left shadow-card", className);
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(cls, "transition-transform duration-150 active:scale-[0.98]")}
      >
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}
