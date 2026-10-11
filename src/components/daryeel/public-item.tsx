import { AlertTriangle, HandHeart, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DaryeelLogo } from "@/components/daryeel-logo";
import { useDaryeel } from "@/lib/daryeel-store";
import type { Item } from "@/lib/daryeel-types";
import { InfoRows } from "./ui-kit";
import { itemIcon } from "./item-card";

export function PublicItemCard({ item, forceLost = false }: { item: Item; forceLost?: boolean }) {
  const { owner } = useDaryeel();
  const lost = forceLost || item.status === "lost";
  const canCall = item.visibility.contactNumber;
  const telHref = `tel:${owner.phone.replace(/[^+0-9]/g, "")}`;

  const rows: [string, string][] = [];
  if (item.visibility.ownerName) rows.push(["Owner", owner.name]);
  if (item.visibility.contactNumber) rows.push(["Contact", owner.phone]);
  if (item.visibility.serialNumber) rows.push(["Serial number", item.serial]);
  if (item.visibility.warrantyStatus)
    rows.push([
      "Warranty",
      item.warrantyExpiry ? `Valid until ${item.warrantyExpiry}` : "No warranty",
    ]);

  const callOwner = () => {
    if (typeof window === "undefined") return;
    window.location.href = telHref;
    window.setTimeout(() => {
      toast(`If your device can't make calls, dial ${owner.phone}.`);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle lg:min-h-[820px]">
      <header className="flex items-center justify-between border-b border-border bg-card px-gutter py-3">
        <DaryeelLogo className="text-primary" markClassName="h-7 w-7" />
        <span className="type-caption text-muted-foreground">Item page</span>
      </header>

      <div className="mx-auto w-full max-w-[480px] flex-1 px-gutter py-6">
        {lost ? (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-destructive/25 bg-destructive-soft p-4"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-destructive text-destructive-foreground">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="type-overline text-destructive">Lost item</p>
                <h2 className="mt-1 text-base font-semibold">This item has been reported lost.</h2>
                <p className="mt-1 type-caption text-foreground/80">
                  If you found it, please contact the owner using the button below.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          {item.photo ? (
            <img
              src={item.photo}
              alt={item.visibility.itemName ? item.name : "Item photo"}
              className="aspect-[4/3] w-full object-cover object-left-top"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grid aspect-[4/3] w-full place-items-center bg-muted text-muted-foreground [&>svg]:h-14 [&>svg]:w-14"
            >
              {itemIcon(item)}
            </div>
          )}

          <div className="p-5">
            <p className="type-overline text-primary">Personal belonging</p>
            <h1 className="mt-1 type-title">
              {item.visibility.itemName ? item.name : "Protected item"}
            </h1>

            {rows.length > 0 ? (
              <div className="mt-3 border-t border-border">
                <InfoRows rows={rows} />
              </div>
            ) : (
              <p className="mt-3 type-caption text-muted-foreground">
                The owner has not shared any public details for this item.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Button size="lg" className="w-full" onClick={callOwner} disabled={!canCall}>
            <Phone /> Contact owner
          </Button>
          {!canCall ? (
            <p className="text-center type-caption text-muted-foreground">
              The owner hasn't shared a contact number for this item.
            </p>
          ) : null}
          {!lost ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() =>
                toast("Found reports aren't connected yet.", {
                  description: canCall ? "Please use Contact owner to reach them." : undefined,
                })
              }
            >
              <HandHeart /> I found this item
            </Button>
          ) : null}
        </div>

        <p className="mt-6 flex items-start justify-center gap-2 text-center type-caption text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Only information the owner chose to share is shown here.
        </p>
      </div>

      <footer className="px-gutter pb-6 text-center text-xs text-muted-foreground">
        Protected by <span className="font-semibold text-primary">Daryeel</span>
      </footer>
    </div>
  );
}
