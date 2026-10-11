import { ArrowLeft, Check, ChevronDown, ChevronRight, Eye, EyeOff, QrCode } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatItemDate, parseItemDate, toInputDate } from "@/lib/daryeel-dates";
import { cn } from "@/lib/utils";

type Tone = "teal" | "gold" | "red" | "green" | "muted";

const BADGE_TONES: Record<Tone, string> = {
  teal: "bg-secondary text-secondary-foreground",
  gold: "bg-warning-soft text-warning-foreground",
  red: "bg-destructive-soft text-destructive",
  green: "bg-success-soft text-success",
  muted: "bg-muted text-muted-foreground",
};

export function Badge({ children, tone = "teal" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:h-3.5 [&>svg]:w-3.5",
        BADGE_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "active" | "lost" }) {
  return status === "lost" ? (
    <Badge tone="red">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-destructive" />
      Lost
    </Badge>
  ) : (
    <Badge tone="green">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" />
      Active
    </Badge>
  );
}

/** Label, hint and error wrapper shared by every form control. */
function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block type-label text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-destructive">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 type-caption font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 type-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
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
  hint,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const id = useId();
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  return (
    <Field id={id} label={label} required={required} hint={hint} error={error}>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        ) : null}
        <Input
          id={id}
          type={isPassword && revealed ? "text" : type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(icon && "pl-10", isPassword && "pr-12")}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </span>
    </Field>
  );
}

const controlClass =
  "w-full rounded-md border border-input bg-card px-3.5 text-base transition-colors hover:border-foreground/25 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive md:text-sm";

export function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = "Select category",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  error?: string | undefined;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Field id={id} label={label} required={required} error={error}>
      <span className="relative block">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error)}
          className={cn(
            controlClass,
            "h-11 cursor-pointer appearance-none pr-10",
            !value && "text-muted-foreground",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="text-foreground">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
      </span>
    </Field>
  );
}

/**
 * Native date picker. The item keeps its "12 March 2026" string format; a stored value the
 * picker can't read is kept unchanged and shown as a hint until the user picks a new date.
 */
export function DateField({
  label,
  value,
  onChange,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string | undefined;
}) {
  const id = useId();
  const unreadable = value.trim() !== "" && !parseItemDate(value);
  const shownHint = unreadable ? `Current value: “${value}”. Pick a date to replace it.` : hint;
  return (
    <Field id={id} label={label} hint={shownHint} error={error}>
      <Input
        id={id}
        type="date"
        value={toInputDate(value)}
        onChange={(event) => {
          const picked = parseItemDate(event.target.value);
          onChange(picked ? formatItemDate(picked) : "");
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, shownHint)}
        className="block appearance-none"
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint}>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={describedBy(id, undefined, hint)}
        className={cn(controlClass, "min-h-28 py-2.5 placeholder:text-muted-foreground")}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-gutter pb-5 pt-6">
      <div className="min-w-0">
        <h2 className="type-title">{title}</h2>
        {subtitle ? <p className="mt-1 type-caption text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function SectionTitle({
  children,
  action,
  description,
}: {
  children: ReactNode;
  action?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h3 className="type-heading">{children}</h3>
        {description ? (
          <p className="mt-0.5 type-caption text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function TopBack({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  onBack: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-3">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
        <ArrowLeft />
      </Button>
      <div className="min-w-0 flex-1">
        <h2 className="truncate type-heading">{title}</h2>
        {subtitle ? (
          <p className="truncate type-caption text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** White surface with a hairline border — the base container for grouped content. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-card", className)}>{children}</div>;
}

export function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <dl>
      {rows.map(([key, value], index) => (
        <div
          key={key}
          className={cn(
            "grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3",
            index && "border-t border-border",
          )}
        >
          <dt className="type-caption text-muted-foreground">{key}</dt>
          <dd
            className={cn(
              "text-right text-sm break-words",
              value ? "font-medium" : "text-muted-foreground",
            )}
          >
            {value || "Not added"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function InfoSection({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <Card className="px-4">
        <InfoRows rows={rows} />
      </Card>
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
    <div className="px-gutter py-10 text-center">
      <div
        className={cn(
          "mx-auto grid h-14 w-14 place-items-center rounded-full [&>svg]:h-6 [&>svg]:w-6",
          tone === "teal" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <h2 className="mt-4 type-heading">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-[20rem] type-caption text-muted-foreground">{text}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/**
 * Stand-in for the item's QR code. QR generation isn't connected yet, so this deliberately
 * does not look like a scannable code.
 */
export function QrPlaceholder({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div
      role="img"
      aria-label="QR code not generated yet"
      className={cn(
        "mx-auto grid aspect-square place-items-center rounded-xl border-2 border-dashed border-input bg-surface-subtle p-4 text-center",
        size === "sm" ? "w-32" : "w-44",
      )}
    >
      <div>
        <QrCode
          aria-hidden="true"
          className={cn("mx-auto text-muted-foreground", size === "sm" ? "h-8 w-8" : "h-10 w-10")}
        />
        <p className="mt-2 text-xs font-medium text-muted-foreground">QR not generated yet</p>
      </div>
    </div>
  );
}

export function ActionMini({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="h-auto flex-col gap-1.5 px-2 py-3 text-xs font-medium"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Button>
  );
}

export function StepHeading({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <div>
        <h3 className="type-heading">{title}</h3>
        <p className="mt-0.5 type-caption text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

/** Numbered, labelled progress for multi-step forms. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-start gap-2" aria-label="Form progress">
      {steps.map((label, index) => {
        const number = index + 1;
        const done = number < current;
        const active = number === current;
        return (
          <li
            key={label}
            className="flex min-w-0 flex-1 flex-col gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span className={cn("h-1 rounded-full", done || active ? "bg-primary" : "bg-border")} />
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                  done && "bg-primary text-primary-foreground",
                  active && "border-2 border-primary text-primary",
                  !done && !active && "border border-input text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : number}
              </span>
              <span
                className={cn(
                  "truncate text-xs",
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {done ? <span className="sr-only">(completed)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ListRowButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {description ? (
          <span className="block type-caption text-muted-foreground">{description}</span>
        ) : null}
      </span>
      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

export function CheckRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2.5 py-1.5 text-sm">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-primary">
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      </span>
      {label}
    </li>
  );
}

const NOTICE_TONES = {
  info: "border-primary/15 bg-info-soft text-secondary-foreground",
  neutral: "border-border bg-surface-subtle text-muted-foreground",
  warning: "border-warning/40 bg-warning-soft text-warning-foreground",
  danger: "border-destructive/25 bg-destructive-soft text-destructive",
};

/** Inline callout for privacy notes, prototype limitations and status warnings. */
export function Notice({
  icon,
  title,
  children,
  tone = "info",
  action,
}: {
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
  tone?: keyof typeof NOTICE_TONES;
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex gap-3 rounded-lg border p-3.5", NOTICE_TONES[tone])}>
      {icon ? <span className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        {children ? (
          <div
            className={cn(
              "type-caption",
              title && "mt-0.5",
              tone !== "neutral" && "text-foreground/80",
            )}
          >
            {children}
          </div>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-secondary font-semibold text-secondary-foreground",
        size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm",
      )}
    >
      {initials || "?"}
    </span>
  );
}
