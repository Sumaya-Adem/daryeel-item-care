import { Car, ChevronRight, FileText, Laptop, Package, QrCode, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/daryeel-types";
import { Badge, StatusBadge } from "./ui-kit";

export function itemIcon(item: Item): ReactNode {
  if (item.icon === "laptop") return <Laptop />;
  if (item.icon === "phone") return <Smartphone />;
  if (item.icon === "car") return <Car />;
  if (item.icon === "document") return <FileText />;
  return <Package />;
}

export function warrantyLabel(item: Item) {
  if (!item.warrantyExpiry) return "No warranty";
  return `Warranty: ${item.warrantyExpiry}`;
}

export function ItemCard({ item, onOpen }: { item: Item; onOpen: (item: Item) => void }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
      {item.photo ? (
        <img
          src={item.photo}
          alt={item.name}
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-xl object-cover object-left-top"
        />
      ) : (
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-surface-subtle text-primary [&>svg]:h-7 [&>svg]:w-7">
          {itemIcon(item)}
        </div>
      )}
      <div className="min-w-0 flex-1 py-0.5">
        <h4 className="truncate font-bold">{item.name}</h4>
        <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>
            <QrCode /> QR Active
          </Badge>
          {item.status === "lost" ? <StatusBadge status="lost" /> : null}
          <Badge tone={item.warrantyExpiry ? "gold" : "muted"}>{warrantyLabel(item)}</Badge>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`View ${item.name}`}
        className="self-center"
        onClick={() => onOpen(item)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export function ItemList({ items, onOpen }: { items: Item[]; onOpen: (item: Item) => void }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}
