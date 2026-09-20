import { toast } from "sonner";
import type { Item } from "@/lib/daryeel-types";

export function downloadQr() {
  toast("QR download will be available when QR generation is connected.");
}

export function printQr() {
  if (typeof window === "undefined") return;
  toast("Opening your print dialog...");
  window.setTimeout(() => window.print(), 300);
}

export async function shareQr(item: Item) {
  const text = `Daryeel item: ${item.name} (${item.id})`;
  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }) : undefined;
  if (nav?.share) {
    try {
      await nav.share({ title: "Daryeel", text });
      return;
    } catch {
      toast("Sharing was cancelled.");
      return;
    }
  }
  toast("Sharing isn't supported on this device yet.");
}
