import {
  AlertTriangle,
  Box,
  CheckCircle2,
  MapPin,
  PackageOpen,
  Plus,
  QrCode,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWarrantyInfo, WARRANTY_SOON_DAYS } from "@/lib/daryeel-dates";
import { useDaryeel } from "@/lib/daryeel-store";
import { cn } from "@/lib/utils";
import { ItemList } from "./item-card";
import { NotificationCard } from "./screen-notifications";
import { Avatar, Card, EmptyState, Notice, SectionTitle } from "./ui-kit";

export function HomeScreen() {
  const { items, go, owner, notifications, markRead } = useDaryeel();
  const lost = items.filter((item) => item.status === "lost");
  const active = items.filter((item) => item.status === "active");
  const endingSoon = items.filter(
    (item) => getWarrantyInfo(item.purchaseDate, item.warrantyExpiry).state === "soon",
  );
  const withWarranty = items.filter((item) => item.warrantyExpiry);
  const firstItem = items[0];
  const firstName = owner.name.split(" ")[0];

  const stats = [
    { label: "Total items", value: items.length, icon: Box, onClick: () => go("items") },
    {
      label: "Active",
      value: active.length,
      icon: CheckCircle2,
      onClick: () => go("items", { section: "active" }),
    },
    {
      label: "Lost",
      value: lost.length,
      icon: MapPin,
      onClick: () => go("items", { section: "lost" }),
      alert: lost.length > 0,
    },
    {
      label: "Warranty ending soon",
      value: endingSoon.length,
      icon: ReceiptText,
      onClick: () => go("items"),
      hint: `Within ${WARRANTY_SOON_DAYS} days`,
    },
  ];

  const actions = [
    { label: "Add item", icon: Plus, onClick: () => go("add") },
    {
      label: "QR identity",
      icon: QrCode,
      onClick: () => (firstItem ? go("qr", { itemId: firstItem.id }) : go("add")),
    },
    {
      label: "Lost items",
      icon: MapPin,
      onClick: () => go("items", { section: "lost" }),
    },
    {
      label: "Warranty",
      icon: ReceiptText,
      onClick: () => {
        const target = endingSoon[0] ?? withWarranty[0] ?? firstItem;
        if (target) go("details", { itemId: target.id });
        else go("add");
      },
    },
  ];

  const latest = notifications.slice(0, 2);

  return (
    <div className="animate-fade-up px-gutter pt-6">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="type-caption text-muted-foreground">Welcome back</p>
          <h2 className="truncate type-title">{firstName}</h2>
        </div>
        <button
          type="button"
          onClick={() => go("profile")}
          aria-label="Open profile"
          className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar name={owner.name} />
        </button>
      </header>

      <Button className="mt-5 w-full sm:w-auto lg:w-full" size="lg" onClick={() => go("add")}>
        <Plus /> Add new item
      </Button>

      <section
        aria-label="Summary"
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2"
      >
        {stats.map(({ label, value, icon: Icon, onClick, alert, hint }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={cn(
              "flex cursor-pointer flex-col items-start rounded-xl border bg-card p-4 text-left transition-colors hover:border-foreground/20 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              alert ? "border-destructive/30" : "border-border",
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn("h-4 w-4", alert ? "text-destructive" : "text-muted-foreground")}
            />
            <span className="mt-3 text-2xl font-semibold tabular-nums">{value}</span>
            <span className="mt-0.5 type-caption text-muted-foreground">{label}</span>
            {hint ? <span className="text-xs text-muted-foreground/90">{hint}</span> : null}
          </button>
        ))}
      </section>

      {lost.length > 0 ? (
        <div className="mt-4">
          <Notice
            tone="danger"
            icon={<AlertTriangle />}
            title={`${lost.length} item${lost.length === 1 ? " is" : "s are"} marked as lost`}
            action={
              <Button
                size="sm"
                variant="destructive-outline"
                onClick={() => go("items", { section: "lost" })}
              >
                View lost items
              </Button>
            }
          >
            Their public pages show a lost notice to anyone who scans the QR.
          </Notice>
        </div>
      ) : null}

      <section className="mt-section">
        <SectionTitle
          action={
            items.length > 0 ? (
              <Button variant="link" className="h-auto p-0" onClick={() => go("items")}>
                View all
              </Button>
            ) : null
          }
        >
          Recent items
        </SectionTitle>
        {items.length === 0 ? (
          <Card>
            <EmptyState
              icon={<PackageOpen />}
              title="No items yet"
              text="Add your first belonging to create its digital identity."
              action={
                <Button onClick={() => go("add")}>
                  <Plus /> Add your first item
                </Button>
              }
            />
          </Card>
        ) : (
          <ItemList
            items={items.slice(0, 3)}
            onOpen={(next) => go("details", { itemId: next.id })}
          />
        )}
      </section>

      <section className="mt-section">
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg px-1 py-2 text-center text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-section">
        <SectionTitle
          action={
            <Button variant="link" className="h-auto p-0" onClick={() => go("notifications")}>
              See all
            </Button>
          }
        >
          Latest updates
        </SectionTitle>
        {latest.length === 0 ? (
          <Card className="p-4 type-caption text-muted-foreground">You're all caught up.</Card>
        ) : (
          <div className="space-y-2">
            {latest.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onRead={() => markRead(notification.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
