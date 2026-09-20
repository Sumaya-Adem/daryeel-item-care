import { BellOff, CalendarDays, Car, MapPin, QrCode, ReceiptText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDaryeel } from "@/lib/daryeel-store";
import type { AppNotification } from "@/lib/daryeel-types";
import { cn } from "@/lib/utils";
import { EmptyState, PageHeader } from "./ui-kit";

const ICONS = {
  warranty: ReceiptText,
  lost: MapPin,
  found: ShieldCheck,
  calendar: CalendarDays,
  qr: QrCode,
  car: Car,
};

export function NotificationCard({ notification, onRead }: { notification: AppNotification; onRead: () => void }) {
  const Icon = ICONS[notification.icon];
  return (
    <button
      type="button"
      onClick={onRead}
      aria-label={`${notification.title}${notification.unread ? " (unread)" : ""}`}
      className={cn(
        "flex w-full gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        notification.unread ? "border-primary/20 bg-info-soft" : "border-border bg-card",
      )}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          notification.tone === "gold" && "bg-warning-soft text-warning",
          notification.tone === "red" && "bg-destructive/10 text-destructive",
          notification.tone === "teal" && "bg-secondary text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <span className="flex-1 text-sm font-bold">{notification.title}</span>
          {notification.unread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{notification.text}</span>
        <span className="mt-2 block text-[10px] text-muted-foreground">{notification.time}</span>
      </span>
    </button>
  );
}

export function NotificationsScreen() {
  const { notifications, markRead, markAllRead, unreadCount } = useDaryeel();

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Notifications"
        action={
          notifications.length > 0 ? (
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              disabled={unreadCount === 0}
              onClick={() => {
                markAllRead();
                toast.success("All notifications marked as read.");
              }}
            >
              Mark all as read
            </Button>
          ) : null
        }
      />
      {notifications.length === 0 ? (
        <EmptyState tone="muted" icon={<BellOff />} title="No Notifications" text="You're all caught up." />
      ) : (
        <div className="space-y-3 px-5">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={() => {
                if (notification.unread) {
                  markRead(notification.id);
                  toast("Marked as read.");
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
