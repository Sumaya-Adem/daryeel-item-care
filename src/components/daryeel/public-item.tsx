import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DaryeelLogo } from "@/components/daryeel-logo";
import { useDaryeel } from "@/lib/daryeel-store";
import type { Item } from "@/lib/daryeel-types";
import { Badge, InfoRows } from "./ui-kit";
import { itemIcon } from "./item-card";

export function PublicItemCard({ item, forceLost = false }: { item: Item; forceLost?: boolean }) {
  const { owner } = useDaryeel();
  const lost = forceLost || item.status === "lost";
  const telHref = `tel:${owner.phone.replace(/[^+0-9]/g, "")}`;

  const rows: [string, string][] = [];
  if (item.visibility.ownerName) rows.push(["Owner", owner.name]);
  if (item.visibility.contactNumber) rows.push(["Contact", owner.phone]);
  if (item.visibility.serialNumber) rows.push(["Serial Number", item.serial || "—"]);
  if (item.visibility.warrantyStatus) rows.push(["Warranty", item.warrantyExpiry ? `Valid until ${item.warrantyExpiry}` : "No warranty"]);

  const callOwner = () => {
    if (!item.visibility.contactNumber) {
      toast("The owner has not shared a contact number for this item.");
      return;
    }
    if (typeof window !== "undefined") window.location.href = telHref;
    window.setTimeout(() => {
      toast(`If your device can't make calls, dial ${owner.phone}.`);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:min-h-[820px]">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <DaryeelLogo className="text-primary" markClassName="h-8 w-8" />
        <Badge>
          <ShieldCheck />
          Verified item
        </Badge>
      </header>

      <div className="mx-auto w-full max-w-[520px] flex-1 px-5 py-6">
        {lost ? (
          <div className="mb-5 rounded-2xl border border-warning/30 bg-warning-soft p-5 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-warning text-accent-foreground">
              <MapPin />
            </div>
            <p className="mt-3 text-sm font-extrabold text-warning">LOST ITEM</p>
            <h2 className="mt-2 text-xl font-extrabold">This item has been reported lost.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">If you found this item, please contact the owner.</p>
          </div>
        ) : null}

        {item.photo ? (
          <img src={item.photo} alt={item.name} className="aspect-[4/3] w-full rounded-[22px] object-cover object-left-top shadow-soft" />
        ) : (
          <div className="grid aspect-[4/3] w-full place-items-center rounded-[22px] bg-card text-primary shadow-soft [&>svg]:h-16 [&>svg]:w-16">
            {itemIcon(item)}
          </div>
        )}

        <div className="py-6 text-center">
          <p className="text-xs font-bold uppercase text-primary">Personal belonging</p>
          {item.visibility.itemName ? (
            <h1 className="mt-2 text-2xl font-extrabold">{item.name}</h1>
          ) : (
            <h1 className="mt-2 text-2xl font-extrabold">Protected item</h1>
          )}
        </div>

        {rows.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card px-4">
            <InfoRows rows={rows} />
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            The owner has not shared any public details for this item.
          </div>
        )}

        <Button size="lg" className="mt-5 w-full" onClick={callOwner}>
          <Phone />
          Contact Owner
        </Button>
        {!lost ? (
          <Button size="lg" variant="outline" className="mt-3 w-full" onClick={() => toast("Thank you. The owner has been notified.")}>
            <MapPin />I found this item
          </Button>
        ) : null}

        <div className="mt-5 flex gap-2 rounded-xl bg-info-soft p-3 text-xs leading-5 text-secondary-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Only information approved by the owner is shown here.
        </div>
      </div>

      <footer className="p-6 text-center text-xs text-muted-foreground">
        Protected by <span className="font-bold text-primary">Daryeel</span>
      </footer>
    </div>
  );
}
