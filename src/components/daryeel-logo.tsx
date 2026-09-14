import { cn } from "@/lib/utils";

type DaryeelLogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  inverse?: boolean;
};

export function DaryeelLogo({ className, markClassName, showWordmark = true, inverse = false }: DaryeelLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)} aria-label="Daryeel">
      <svg viewBox="0 0 48 48" role="img" aria-hidden="true" className={cn("h-10 w-10 shrink-0", markClassName)}>
        <path d="M24 3.8 40 10v11.2c0 10.2-6.4 18.7-16 23-9.6-4.3-16-12.8-16-23V10l16-6.2Z" fill="currentColor" />
        <path d="M16 16.2a3.2 3.2 0 0 1 3.2-3.2h9.6a3.2 3.2 0 0 1 3.2 3.2v11.6a3.2 3.2 0 0 1-3.2 3.2h-9.6a3.2 3.2 0 0 1-3.2-3.2V16.2Z" fill={inverse ? "var(--primary)" : "var(--primary-foreground)"} />
        <path d="M19 16h4v4h-4zm7 0h3v3h-3zm-7 7h3v3h-3zm5-2h5v5h-5zm-5 7h3v1h-3zm6 0h4v1h-4z" fill="currentColor" />
      </svg>
      {showWordmark ? <span className={cn("font-display text-xl font-bold", inverse ? "text-primary-foreground" : "text-foreground")}>Daryeel</span> : null}
    </div>
  );
}