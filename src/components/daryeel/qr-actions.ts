import { toast } from "sonner";
import type { Item } from "@/lib/daryeel-types";

/** Shown wherever QR download or printing would be offered. */
export const QR_PENDING_MESSAGE =
  "Download and print become available once QR codes are generated.";

export async function shareQr(item: Item) {
  const text = `Daryeel item: ${item.name} (${item.id})`;
  const nav =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & { share?: (data: ShareData) => Promise<void> })
      : undefined;
  if (nav?.share) {
    try {
      await nav.share({ title: "Daryeel", text });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Sharing didn't work on this device.");
    }
    return;
  }
  toast("Sharing isn't supported on this device.");
}
