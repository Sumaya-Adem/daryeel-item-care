import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  LockKeyhole,
  MapPin,
  Pencil,
  Printer,
  QrCode,
  Share2,
  Trash2,
} from "lucide-react";
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
import { describeDaysLeft, getWarrantyInfo } from "@/lib/daryeel-dates";
import { useDaryeel } from "@/lib/daryeel-store";
import type { Item } from "@/lib/daryeel-types";
import { cn } from "@/lib/utils";
import {
  ActionMini,
  Badge,
  Card,
  InfoRows,
  InfoSection,
  Notice,
  QrPlaceholder,
  SectionTitle,
  StatusBadge,
  TopBack,
} from "./ui-kit";
import { itemIcon } from "./item-card";
import { QR_PENDING_MESSAGE, shareQr } from "./qr-actions";
import { VISIBILITY_LABELS } from "./screen-qr";

const REMINDERS = ["30 days before", "14 days before", "7 days before"];

function WarrantySection({ item, onReminder }: { item: Item; onReminder: () => void }) {
  const info = getWarrantyInfo(item.purchaseDate, item.warrantyExpiry);
  const badge =
    info.state === "soon" ? (
      <Badge tone="gold">Ending soon</Badge>
    ) : info.state === "expired" ? (
      <Badge tone="muted">Expired</Badge>
    ) : info.state === "active" ? (
      <Badge tone="green">Valid</Badge>
    ) : null;

  return (
    <section>
      <SectionTitle>Warranty</SectionTitle>
      <Card className="p-4">
        {info.state === "none" ? (
          <p className="type-caption text-muted-foreground">
            No warranty added. Add an expiry date when editing this item to track it here.
          </p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="type-caption text-muted-foreground">Expires</p>
                <p className="mt-0.5 font-semibold">{item.warrantyExpiry}</p>
              </div>
              {badge}
            </div>
            {info.progress !== null && info.daysLeft !== null ? (
              <div className="mt-4">
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label="Warranty period used"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(info.progress * 100)}
                >
                  <div
                    className={cn(
                      "h-full rounded-full",
                      info.state === "soon"
                        ? "bg-warning"
                        : info.state === "expired"
                          ? "bg-muted-foreground"
                          : "bg-primary",
                    )}
                    style={{ width: `${Math.max(2, info.progress * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Purchased {item.purchaseDate}</span>
                  <span className="font-medium text-foreground">
                    {describeDaysLeft(info.daysLeft)}
                  </span>
                </div>
              </div>
            ) : info.daysLeft !== null ? (
              <p className="mt-2 type-caption text-muted-foreground">
                {describeDaysLeft(info.daysLeft)}
              </p>
            ) : null}
          </>
        )}
        <Button variant="outline" className="mt-4 w-full" onClick={onReminder}>
          <Bell /> Set reminder
        </Button>
      </Card>
    </section>
  );
}

export function ItemDetails({ item }: { item: Item }) {
  const { go, setStatus, deleteItem, pushNotification } = useDaryeel();
  const [dialog, setDialog] = useState<"none" | "reminder" | "lost" | "found" | "delete">("none");
  const [reminder, setReminder] = useState(REMINDERS[0]!);
  const close = () => setDialog("none");
  const lost = item.status === "lost";

  const shared = VISIBILITY_LABELS.filter(([key]) => item.visibility[key]).map(
    ([, label]) => label,
  );

  return (
    <div className="min-h-screen bg-background pb-10 lg:min-h-[820px]">
      <TopBack
        title="Item details"
        onBack={() => go("items")}
        action={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit item"
            onClick={() => go("edit", { itemId: item.id })}
          >
            <Pencil />
          </Button>
        }
      />

      <div className="px-gutter pt-5">
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.name}
            className="aspect-[16/10] w-full rounded-xl border border-border object-cover object-left-top"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid aspect-[16/10] w-full place-items-center rounded-xl border border-border bg-surface-subtle text-muted-foreground [&>svg]:h-12 [&>svg]:w-12"
          >
            {itemIcon(item)}
          </div>
        )}

        <div className="flex items-start justify-between gap-3 pt-5">
          <div className="min-w-0">
            <h2 className="type-title break-words">{item.name}</h2>
            <p className="mt-1 type-caption text-muted-foreground">
              {item.category} · <span className="font-mono text-xs">{item.id}</span>
            </p>
          </div>
          <div className="pt-1.5">
            <StatusBadge status={item.status} />
          </div>
        </div>

        {lost ? (
          <div className="mt-4">
            <Notice
              tone="danger"
              icon={<AlertTriangle />}
              title="This item is marked as lost"
              action={
                <Button size="sm" variant="outline" onClick={() => setDialog("found")}>
                  <CheckCircle2 /> Mark as found
                </Button>
              }
            >
              Its public page shows a lost notice so whoever scans the QR can contact you.
            </Notice>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ActionMini
            icon={<Pencil />}
            label="Edit"
            onClick={() => go("edit", { itemId: item.id })}
          />
          <ActionMini
            icon={<QrCode />}
            label="QR identity"
            onClick={() => go("qr", { itemId: item.id })}
          />
          <ActionMini
            icon={<ExternalLink />}
            label="Public page"
            onClick={() => go("public", { itemId: item.id })}
          />
        </div>

        <div className="mt-section space-y-section">
          <InfoSection
            title="Item information"
            rows={[
              ["Brand", item.brand],
              ["Model", item.model],
              ["Serial number", item.serial],
              ["Purchase date", item.purchaseDate],
            ]}
          />

          <WarrantySection item={item} onReminder={() => setDialog("reminder")} />

          <section>
            <SectionTitle description="What people see, and what stays with you">
              Privacy
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Eye className="h-4 w-4 text-primary" aria-hidden="true" /> Shown publicly
                  </p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[13px]"
                    onClick={() => go("edit", { itemId: item.id })}
                  >
                    Change
                  </Button>
                </div>
                {shared.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {shared.map((label) => (
                      <li key={label}>
                        <Badge>{label}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 type-caption text-muted-foreground">
                    Nothing is shared on the public page.
                  </p>
                )}
              </Card>
              <Card className="bg-surface-subtle px-4 pt-4 pb-1">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" aria-hidden="true" />{" "}
                  Private — only you
                </p>
                <InfoRows
                  rows={[
                    ["Purchase price", item.price],
                    ["Seller", item.seller],
                    ["Private notes", item.notes],
                  ]}
                />
              </Card>
            </div>
          </section>

          <section>
            <SectionTitle>QR identity</SectionTitle>
            <Card className="p-5 text-center">
              <QrPlaceholder size="sm" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <ActionMini
                  icon={<Download />}
                  label="Download"
                  onClick={() => undefined}
                  disabled
                />
                <ActionMini icon={<Printer />} label="Print" onClick={() => undefined} disabled />
                <ActionMini icon={<Share2 />} label="Share" onClick={() => void shareQr(item)} />
              </div>
              <p className="mt-3 type-caption text-muted-foreground">{QR_PENDING_MESSAGE}</p>
            </Card>
          </section>

          <section>
            <SectionTitle>Manage item</SectionTitle>
            <Card className="divide-y divide-border">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-4">
                <div className="min-w-[11rem] flex-1">
                  <p className="text-sm font-medium">{lost ? "Item found?" : "Lost this item?"}</p>
                  <p className="type-caption text-muted-foreground">
                    {lost
                      ? "Remove the lost notice from the public page."
                      : "Show a lost notice on the public page."}
                  </p>
                </div>
                {lost ? (
                  <Button variant="outline" className="shrink-0" onClick={() => setDialog("found")}>
                    <CheckCircle2 className="text-success" /> Mark as found
                  </Button>
                ) : (
                  <Button variant="outline" className="shrink-0" onClick={() => setDialog("lost")}>
                    <MapPin className="text-destructive" /> Mark as lost
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-4">
                <div className="min-w-[11rem] flex-1">
                  <p className="text-sm font-medium">Delete item</p>
                  <p className="type-caption text-muted-foreground">
                    Permanently remove it and its QR identity.
                  </p>
                </div>
                <Button
                  variant="destructive-outline"
                  className="shrink-0"
                  onClick={() => setDialog("delete")}
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>

      <Dialog
        open={dialog === "reminder"}
        onOpenChange={(open) => (open ? setDialog("reminder") : close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warranty reminder</DialogTitle>
            <DialogDescription>
              Choose when you'd like to be reminded before the warranty ends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2" role="group" aria-label="Reminder timing">
            {REMINDERS.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="w-full justify-start"
                aria-pressed={reminder === option}
                onClick={() => setReminder(option)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border",
                    reminder === option ? "border-primary" : "border-input",
                  )}
                >
                  {reminder === option ? (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </span>
                {option}
              </Button>
            ))}
          </div>
          <p className="type-caption text-muted-foreground">
            Reminders are added to your notifications in this preview. Push and email alerts aren't
            connected yet.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                close();
                toast.success("Reminder preference saved.");
                pushNotification({
                  title: "Warranty reminder set",
                  text: `You'll be reminded ${reminder.toLowerCase()} ${item.name}'s warranty ends.`,
                  tone: "gold",
                  icon: "warranty",
                });
              }}
            >
              Save reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "lost"}
        onOpenChange={(open) => (open ? setDialog("lost") : close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark this item as lost?</DialogTitle>
            <DialogDescription>
              The public page will show a lost notice so anyone who scans the QR can contact you.
              You can undo this at any time.
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
              Mark as lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "found"}
        onOpenChange={(open) => (open ? setDialog("found") : close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark this item as found?</DialogTitle>
            <DialogDescription>
              The lost notice will be removed from the public page.
            </DialogDescription>
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
              Mark as found
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "delete"}
        onOpenChange={(open) => (open ? setDialog("delete") : close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{item.name}”?</DialogTitle>
            <DialogDescription>
              This removes the item, its details and its QR identity. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                deleteItem(item.id);
                close();
                toast.success("Item deleted.");
                go("items");
              }}
            >
              <Trash2 /> Delete item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
