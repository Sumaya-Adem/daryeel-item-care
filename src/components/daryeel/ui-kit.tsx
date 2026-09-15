import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Badge({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "gold" | "red" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold [&>svg]:h-3 [&>svg]:w-3",
        tone === "gold" && "bg-warning-soft text-warning",
        tone === "red" && "bg-destructive/10 text-destructive",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "teal" && "bg-secondary text-primary",
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "active" | "lost" }) {
  return status === "lost" ? (
    <Badge tone="red">
      <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
      Lost
    </Badge>
  ) : (
    <Badge>
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      Active
    </Badge>
  );
}

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  required?: boolean;
  error?: string | undefined;
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="block">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </label>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        ) : null}
        <Input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-13 rounded-[13px] bg-card", icon && "pl-11", error && "border-destructive")}
        />
      </span>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  error?: string | undefined;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-13 w-full rounded-[13px] border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring",
          !value && "text-muted-foreground",
          error && "border-destructive",
        )}
      >
        <option value="">Select category</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full rounded-[13px] border border-input bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
      />
    </div>
  );
}

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-6">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {action}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-base font-bold">{children}</h3>
      {action}
    </div>
  );
}

export function TopBack({ title, onBack, action }: { title: string; onBack: () => void; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
        <ArrowLeft />
      </Button>
      <h2 className="flex-1 text-xl font-extrabold">{title}</h2>
      {action}
    </div>
  );
}

export function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <div>
      {rows.map(([key, value], index) => (
        <div key={key} className={cn("flex justify-between gap-4 py-3 text-sm", index && "border-t border-border")}>
          <span className="text-muted-foreground">{key}</span>
          <span className="text-right font-semibold">{value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

export function InfoSection({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <div className="rounded-2xl border border-border px-4">
        <InfoRows rows={rows} />
      </div>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
  tone = "teal",
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
  tone?: "teal" | "muted";
}) {
  return (
    <div className="px-5 py-12 text-center">
      <div
        className={cn(
          "mx-auto grid h-20 w-20 place-items-center rounded-full [&>svg]:h-9 [&>svg]:w-9",
          tone === "teal" ? "bg-secondary text-primary" : "bg-surface-subtle text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-6 text-muted-foreground">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function QrPlaceholder({ seed = 7 }: { seed?: number }) {
  return (
    <div
      role="img"
      aria-label="Sample QR code placeholder"
      className="mx-auto grid aspect-square w-44 grid-cols-7 gap-1 rounded-xl border-8 border-card bg-card p-2 shadow-soft"
    >
      {Array.from({ length: 49 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "rounded-[1px]",
            (i * seed + i * i + 3) % 5 < 2 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i)
              ? "bg-foreground"
              : "bg-card",
          )}
        />
      ))}
    </div>
  );
}

export function ActionMini({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick} className="h-auto flex-col gap-1.5 px-1 py-2 text-[10px] text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </Button>
  );
}

export function StepHeading({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="mb-7">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

export function ListRowButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick} className="h-14 w-full justify-start rounded-none px-4">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-info-soft text-primary [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="text-muted-foreground" />
    </Button>
  );
}

export function CheckRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 text-sm font-semibold">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-3 w-3" />
      </span>
      {label}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your belongings</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
