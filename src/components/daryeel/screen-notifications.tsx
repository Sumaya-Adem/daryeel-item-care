import {
  BellOff,
  CalendarDays,
  Car,
  CheckCheck,
  MapPin,
  QrCode,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
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

const TONES = {
  gold: "bg-warning-soft text-warning-foreground",
  red: "bg-destructive-soft text-destructive",
  teal: "bg-secondary text-primary",
};

export function NotificationCard({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: () => void;
}) {
  const Icon = ICONS[notification.icon];
  return (
    <button
      type="button"
      onClick={onRead}
      aria-label={`${notification.title}${notification.unread ? " (unread, mark as read)" : ""}`}
      className={cn(
        "flex w-full cursor-pointer gap-3 rounded-xl border p-3.5 text-left transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        notification.unread ? "border-primary/20 bg-info-soft" : "border-border bg-card",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
          TONES[notification.tone],
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <span
            className={cn("flex-1 text-sm", notification.unread ? "font-semibold" : "font-medium")}
          >
            {notification.title}
          </span>
          {notification.unread ? (
            <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          ) : null}
        </span>
        <span className="mt-0.5 block type-caption text-muted-foreground">{notification.text}</span>
        <span className="mt-1.5 block text-xs text-muted-foreground">{notification.time}</span>
      </span>
    </button>
  );
}

export function NotificationsScreen() {
  const { notifications, markRead, markAllRead, unreadCount } = useDaryeel();
  const unread = notifications.filter((n) => n.unread);
  const earlier = notifications.filter((n) => !n.unread);

  const group = (title: string, list: AppNotification[]) =>
    list.length > 0 ? (
      <section aria-label={title}>
        <h3 className="mb-2 type-overline text-muted-foreground">{title}</h3>
        <ul className="space-y-2">
          {list.map((notification) => (
            <li key={notification.id}>
              <NotificationCard
                notification={notification}
                onRead={() => {
                  if (notification.unread) markRead(notification.id);
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    ) : null;

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Notifications"
        subtitle={
          notifications.length > 0
            ? unreadCount > 0
              ? `${unreadCount} unread`
              : "All read"
            : undefined
        }
        action={
          notifications.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={unreadCount === 0}
              onClick={() => {
                markAllRead();
                toast.success("All notifications marked as read.");
              }}
            >
              <CheckCheck /> Mark all as read
            </Button>
          ) : null
        }
      />
      {notifications.length === 0 ? (
        <EmptyState
          tone="muted"
          icon={<BellOff />}
          title="No notifications"
          text="You're all caught up."
        />
      ) : (
        <div className="space-y-6 px-gutter">
          {group("New", unread)}
          {group("Earlier", earlier)}
        </div>
      )}
    </div>
  );
}
