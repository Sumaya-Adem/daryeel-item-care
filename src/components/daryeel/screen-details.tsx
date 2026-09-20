import { useState } from "react";
import { Bell, Download, LockKeyhole, MapPin, Pencil, Printer, Share2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDaryeel } from "@/lib/daryeel-store";
import type { Item } from "@/lib/daryeel-types";
import { ActionMini, InfoRows, InfoSection, QrPlaceholder, SectionTitle, StatusBadge, TopBack } from "./ui-kit";
import { itemIcon } from "./item-card";
import { downloadQr, printQr, shareQr } from "./qr-actions";
import { VISIBILITY_LABELS } from "./screen-qr";

const REMINDERS = ["30 days before", "14 days before", "7 days before"];

export function ItemDetails({ item }: { item: Item }) {
  const { go, setStatus, deleteItem, pushNotification } = useDaryeel();
  const [dialog, setDialog] = useState<"none" | "reminder" | "lost" | "found" | "delete">("none");
  const [reminder, setReminder] = useState(REMINDERS[0]!);
  const close = () => setDialog("none");

  const shared = VISIBILITY_LABELS.filter(([key]) => item.visibility[key]).map(([, label]) => label);

  return (
    <div className="min-h-screen pb-10 lg:min-h-[820px]">
      <TopBack
        title="Item Details"
        onBack={() => go("items")}
        action={
          <Button variant="ghost" size="icon" aria-label="Edit item" onClick={() => go("edit", { itemId: item.id })}>
            <Pencil />
          </Button>
        }
      />

      {item.photo ? (
        <img src={item.photo} alt={item.name} className="aspect-[16/10] w-full object-cover object-left-top" />
      ) : (
        <div className="grid aspect-[16/10] w-full place-items-center bg-surface-subtle text-primary [&>svg]:h-16 [&>svg]:w-16">
          {itemIcon(item)}
        </div>
      )}

      <div className="px-5">
        <div className="py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.category} · {item.id}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>
        </div>

        <InfoSection
          title="Item Information"
          rows={[
            ["Brand", item.brand],
            ["Model", item.model],
            ["Serial Number", item.serial],
            ["Purchase Date", item.purchaseDate],
          ]}
        />

        <section className="mt-6">
          <SectionTitle>Warranty</SectionTitle>
          <div className="rounded-2xl border border-border p-4">
            {item.warrantyExpiry ? (
              <>
                <p className="text-xs text-muted-foreground">Warranty expires</p>
                <p className="mt-1 font-bold">{item.warrantyExpiry}</p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-warning" />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>8 months used</span>
                  <span>4 months left</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No warranty added for this item yet.</p>
            )}
            <Button variant="outline" className="mt-4 w-full" onClick={() => setDialog("reminder")}>
              <Bell /> Set Reminder
            </Button>
          </div>
        </section>

        <section className="mt-6">
          <SectionTitle>QR Identity</SectionTitle>
          <div className="rounded-2xl border border-border p-5 text-center">
            <QrPlaceholder />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <ActionMini icon={<Download />} label="Download" onClick={downloadQr} />
              <ActionMini icon={<Printer />} label="Print" onClick={printQr} />
              <ActionMini icon={<Share2 />} label="Share" onClick={() => void shareQr(item)} />
            </div>
            <Button className="mt-2 w-full" variant="secondary" onClick={() => go("qr", { itemId: item.id })}>
              Open QR Identity
            </Button>
            <Button className="mt-2 w-full" variant="outline" onClick={() => go("public", { itemId: item.id })}>
              View Public Page
            </Button>
          </div>
        </section>

        <section className="mt-6">
          <SectionTitle
            action={
              <Button variant="link" className="h-auto p-0 text-xs" onClick={() => go("edit", { itemId: item.id })}>
                Change
              </Button>
            }
          >
            Public Information
          </SectionTitle>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-border p-4 text-xs">
            {shared.length > 0 ? (
              shared.map((label) => (
                <span key={label} className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary">
                  {label}
                </span>
              ))
            ) : (
              <p className="text-muted-foreground">No public information selected yet.</p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface-subtle p-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <LockKeyhole className="h-4 w-4 text-primary" />
            Private — Only you can see this
          </div>
          <InfoRows
            rows={[
              ["Purchase Price", item.price],
              ["Seller", item.seller],
              ["Private Notes", item.notes],
            ]}
          />
        </section>

        <div className="mt-6 space-y-3">
          {item.status === "active" ? (
            <Button variant="outline" className="w-full text-warning" onClick={() => setDialog("lost")}>
              <MapPin /> Mark as Lost
            </Button>
          ) : (
            <Button variant="outline" className="w-full text-success" onClick={() => setDialog("found")}>
              <ShieldCheck /> Mark as Found
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => go("edit", { itemId: item.id })}>
            <Pencil /> Edit Item
          </Button>
          <Button variant="ghost" className="w-full text-destructive" onClick={() => setDialog("delete")}>
            <Trash2 /> Delete Item
          </Button>
        </div>
      </div>

      <Dialog open={dialog === "reminder"} onOpenChange={(open) => (open ? setDialog("reminder") : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warranty reminder</DialogTitle>
            <DialogDescription>Choose when Daryeel should remind you before the warranty ends.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {REMINDERS.map((option) => (
              <Button
                key={option}
                variant={reminder === option ? "default" : "outline"}
                className="w-full justify-start"
                aria-pressed={reminder === option}
                onClick={() => setReminder(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                close();
                toast.success("Reminder saved.");
                pushNotification({
                  title: "Warranty reminder set",
                  text: `You'll be reminded ${reminder.toLowerCase()} ${item.name}'s warranty ends.`,
                  tone: "gold",
                  icon: "warranty",
                });
              }}
            >
              Save Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "lost"} onOpenChange={(open) => (open ? setDialog("lost") : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark this item as lost?</DialogTitle>
            <DialogDescription>
              The public page will show a lost notice so anyone who scans the QR can contact you.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setStatus(item.id, "lost");
                close();
                toast.success("Item marked as lost.");
              }}
            >
              Mark as Lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "found"} onOpenChange={(open) => (open ? setDialog("found") : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark this item as found?</DialogTitle>
            <DialogDescription>The lost notice will be removed from the public page.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setStatus(item.id, "active");
                close();
                toast.success("Item marked as found.");
              }}
            >
              Mark as Found
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(open) => (open ? setDialog("delete") : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-destructive text-primary-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteItem(item.id);
                close();
                toast.success("Item deleted.");
                go("items");
              }}
            >
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
