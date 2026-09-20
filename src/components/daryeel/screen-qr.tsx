import { Download, Printer, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDaryeel } from "@/lib/daryeel-store";
import type { Item, Visibility } from "@/lib/daryeel-types";
import { CheckRow, EmptyState, QrPlaceholder, SectionTitle, TopBack } from "./ui-kit";
import { downloadQr, printQr, shareQr } from "./qr-actions";

export const VISIBILITY_LABELS: [keyof Visibility, string][] = [
  ["itemName", "Item Name"],
  ["ownerName", "Owner Name"],
  ["contactNumber", "Contact Number"],
  ["serialNumber", "Serial Number"],
  ["warrantyStatus", "Warranty Status"],
];

export function QrScreen({ item }: { item: Item }) {
  const { go } = useDaryeel();
  const shared = VISIBILITY_LABELS.filter(([key]) => item.visibility[key]);

  return (
    <div className="min-h-screen bg-card lg:min-h-[820px]">
      <TopBack title="Your Item QR" onBack={() => go("details", { itemId: item.id })} />
      <div className="px-5 pb-8 text-center">
        <div className="mt-2 rounded-[24px] bg-surface-subtle p-7">
          <QrPlaceholder />
          <p className="mt-5 text-lg font-bold">Attach this QR code to your item.</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Anyone who scans this code can see only the information you choose to make public.
          </p>
          <p className="mt-3 text-xs font-bold text-primary">Item ID: {item.id}</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Button variant="outline" onClick={downloadQr} className="h-auto flex-col py-4 text-xs">
            <Download />
            Download QR
          </Button>
          <Button variant="outline" onClick={printQr} className="h-auto flex-col py-4 text-xs">
            <Printer />
            Print QR
          </Button>
          <Button variant="outline" onClick={() => void shareQr(item)} className="h-auto flex-col py-4 text-xs">
            <Share2 />
            Share QR
          </Button>
        </div>

        <div className="mt-7 text-left">
          <SectionTitle>Public Information</SectionTitle>
          {shared.length > 0 ? (
            <div className="rounded-2xl border border-border p-4">
              {shared.map(([key, label]) => (
                <CheckRow key={key} label={label} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border">
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
            </div>
          )}
        </div>

        <Button variant="secondary" className="mt-6 w-full" onClick={() => go("public", { itemId: item.id })}>
          View Public Page
        </Button>
      </div>
    </div>
  );
}
