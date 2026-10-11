import { Download, ExternalLink, Info, Printer, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDaryeel } from "@/lib/daryeel-store";
import type { Item, Visibility } from "@/lib/daryeel-types";
import {
  ActionMini,
  Card,
  CheckRow,
  EmptyState,
  Notice,
  QrPlaceholder,
  SectionTitle,
  TopBack,
} from "./ui-kit";
import { QR_PENDING_MESSAGE, shareQr } from "./qr-actions";

export const VISIBILITY_LABELS: [keyof Visibility, string][] = [
  ["itemName", "Item name"],
  ["ownerName", "Owner name"],
  ["contactNumber", "Contact number"],
  ["serialNumber", "Serial number"],
  ["warrantyStatus", "Warranty status"],
];

export function QrScreen({ item }: { item: Item }) {
  const { go } = useDaryeel();
  const shared = VISIBILITY_LABELS.filter(([key]) => item.visibility[key]);

  return (
    <div className="min-h-screen bg-background pb-10 lg:min-h-[820px]">
      <TopBack
        title="QR identity"
        subtitle={item.name}
        onBack={() => go("details", { itemId: item.id })}
      />
      <div className="space-y-section px-gutter pt-6">
        <Card className="p-6 text-center">
          <QrPlaceholder />
          <h3 className="mt-5 type-heading">Attach this QR code to your item</h3>
          <p className="mx-auto mt-1 max-w-xs type-caption text-muted-foreground">
            Anyone who scans it will see only the information you choose to make public.
          </p>
          <p className="mt-3 inline-flex rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
            Item ID: {item.id}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <ActionMini icon={<Download />} label="Download" onClick={() => undefined} disabled />
            <ActionMini icon={<Printer />} label="Print" onClick={() => undefined} disabled />
            <ActionMini icon={<Share2 />} label="Share" onClick={() => void shareQr(item)} />
          </div>
          <div className="mt-4 text-left">
            <Notice tone="neutral" icon={<Info />}>
              {QR_PENDING_MESSAGE} You can share the item ID now.
            </Notice>
          </div>
        </Card>

        <section>
          <SectionTitle
            description="Shown when someone scans this QR"
            action={
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => go("edit", { itemId: item.id })}
              >
                Change
              </Button>
            }
          >
            Public information
          </SectionTitle>
          {shared.length > 0 ? (
            <Card className="px-4 py-2.5">
              <ul>
                {shared.map(([key, label]) => (
                  <CheckRow key={key} label={label} />
                ))}
              </ul>
            </Card>
          ) : (
            <Card>
              <EmptyState
                tone="muted"
                icon={<QrCode />}
                title="Nothing shared yet"
                text="You haven't chosen any information to show when this QR is scanned."
                action={
                  <Button variant="outline" onClick={() => go("edit", { itemId: item.id })}>
                    Choose public information
                  </Button>
                }
              />
            </Card>
          )}
        </section>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => go("public", { itemId: item.id })}
        >
          <ExternalLink /> Preview public page
        </Button>
      </div>
    </div>
  );
}
