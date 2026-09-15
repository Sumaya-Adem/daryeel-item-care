import { Box, MapPin, PackageOpen, Plus, QrCode, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDaryeel } from "@/lib/daryeel-store";
import { ItemCard } from "./item-card";
import { EmptyState, SectionTitle } from "./ui-kit";

export function HomeScreen() {
  const { items, go, owner, notifications } = useDaryeel();
  const lost = items.filter((item) => item.status === "lost");
  const withWarranty = items.filter((item) => item.warrantyExpiry);
  const firstItem = items[0];

  const stats = [
    { label: "My Items", value: String(items.length), icon: Box, onClick: () => go("items") },
    { label: "QR Items", value: String(items.length), icon: QrCode, onClick: () => go("items") },
    { label: "Warranty", value: `${withWarranty.length} active`, icon: ReceiptText, onClick: () => go("items") },
    { label: "Lost", value: `${lost.length} item${lost.length === 1 ? "" : "s"}`, icon: MapPin, onClick: () => go("items") },
  ];

  const actions = [
    { label: "Add Item", icon: Plus, onClick: () => go("add") },
    {
      label: "QR Code",
      icon: QrCode,
      onClick: () => (firstItem ? go("qr", { itemId: firstItem.id }) : go("add")),
    },
    {
      label: "Lost Item",
      icon: MapPin,
      onClick: () => {
        const target = lost[0] ?? firstItem;
        if (target) go("details", { itemId: target.id });
        else go("add");
      },
    },
    {
      label: "Warranty",
      icon: ReceiptText,
      onClick: () => {
        const target = withWarranty[0] ?? firstItem;
        if (target) go("details", { itemId: target.id });
        else go("add");
      },
    },
  ];

  return (
    <div className="animate-fade-up px-5 pt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold">Good morning, {owner.name.split(" ")[0]}</p>
          <p className="mt-1 text-sm text-muted-foreground">Keep your belongings organized and protected.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => go("profile")}
          aria-label="Open profile"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary p-0 font-bold text-primary"
        >
          AA
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, onClick }, index) => (
          <Button
            key={label}
            variant="ghost"
            onClick={onClick}
            className="h-auto flex-col items-start rounded-2xl border border-border bg-card p-4 text-left shadow-soft"
          >
            <span
              className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${index > 1 ? "bg-warning-soft text-warning" : "bg-secondary text-primary"}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-xl font-extrabold">{value}</span>
            <span className="mt-1 text-xs font-normal text-muted-foreground">{label}</span>
          </Button>
        ))}
      </div>

      <div className="mt-7">
        <SectionTitle
          action={
            <Button variant="link" className="h-auto p-0" onClick={() => go("items")}>
              View All
            </Button>
          }
        >
          Recent Items
        </SectionTitle>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card">
            <EmptyState
              icon={<PackageOpen />}
              title="No Items Yet"
              text="You haven't added any belongings yet."
              action={
                <Button onClick={() => go("add")}>
                  <Plus /> Add Your First Item
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 2).map((item) => (
              <ItemCard key={item.id} item={item} onOpen={(next) => go("details", { itemId: next.id })} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-7">
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <Button
              key={label}
              variant="ghost"
              onClick={onClick}
              className="h-auto flex-col gap-2 px-1 py-3 text-[11px] text-muted-foreground"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-info-soft text-primary">
                <Icon />
              </span>
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <SectionTitle
          action={
            <Button variant="link" className="h-auto p-0" onClick={() => go("notifications")}>
              Open
            </Button>
          }
        >
          Latest Update
        </SectionTitle>
        <div className="rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="font-bold">{notifications[0]?.title ?? "You're all caught up."}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{notifications[0]?.text ?? "No new notifications."}</p>
        </div>
      </div>

      <Button className="mt-6 w-full" size="lg" onClick={() => go("add")}>
        <Plus /> Add New Item
      </Button>
    </div>
  );
}
