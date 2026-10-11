import { Car, ChevronRight, FileText, Laptop, Package, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { describeDaysLeft, getWarrantyInfo } from "@/lib/daryeel-dates";
import type { Item } from "@/lib/daryeel-types";
import { cn } from "@/lib/utils";
import { Badge, StatusBadge } from "./ui-kit";

export function itemIcon(item: Item): ReactNode {
  if (item.icon === "laptop") return <Laptop />;
  if (item.icon === "phone") return <Smartphone />;
  if (item.icon === "car") return <Car />;
  if (item.icon === "document") return <FileText />;
  return <Package />;
}

export function warrantyLabel(item: Item) {
  const info = getWarrantyInfo(item.purchaseDate, item.warrantyExpiry);
  if (info.state === "none") return "No warranty";
  if (info.daysLeft === null) return `Warranty: ${item.warrantyExpiry}`;
  if (info.state === "expired") return "Warranty expired";
  return `Warranty: ${describeDaysLeft(info.daysLeft)}`;
}

function WarrantyBadge({ item }: { item: Item }) {
  const info = getWarrantyInfo(item.purchaseDate, item.warrantyExpiry);
  if (info.state === "none") return null;
  const tone = info.state === "soon" ? "gold" : info.state === "expired" ? "muted" : "teal";
  return <Badge tone={tone}>{warrantyLabel(item)}</Badge>;
}

export function ItemThumb({ item, className }: { item: Item; className?: string }) {
  return item.photo ? (
    <img
      src={item.photo}
      alt=""
      loading="lazy"
      className={cn("shrink-0 rounded-lg bg-muted object-cover object-left-top", className)}
    />
  ) : (
    <div
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-lg bg-surface-subtle text-muted-foreground [&>svg]:h-6 [&>svg]:w-6",
        className,
      )}
    >
      {itemIcon(item)}
    </div>
  );
}

export function ItemCard({ item, onOpen }: { item: Item; onOpen: (item: Item) => void }) {
  const lost = item.status === "lost";
  const meta = [item.category, item.brand && item.brand !== "—" ? item.brand : ""]
    .filter(Boolean)
    .join(" · ");
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`${item.name}, ${item.category}, ${lost ? "lost" : "active"}. View details`}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3.5 rounded-xl border bg-card p-3 text-left transition-colors hover:border-foreground/20 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        lost ? "border-destructive/30" : "border-border",
      )}
    >
      <ItemThumb item={item} className="h-16 w-16" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-semibold">{item.name}</span>
        </span>
        <span className="mt-0.5 block truncate type-caption text-muted-foreground">{meta}</span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          <StatusBadge status={item.status} />
          <WarrantyBadge item={item} />
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
    </button>
  );
}

export function ItemList({ items, onOpen }: { items: Item[]; onOpen: (item: Item) => void }) {
  // Two columns on tablet; the desktop preview is a phone-width frame, so it returns to one.
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}
