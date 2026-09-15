import { Bell, Box, Home, User } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDaryeel, type Screen } from "@/lib/daryeel-store";

export function BottomNavigation({ active }: { active: Screen }) {
  const { go, unreadCount } = useDaryeel();
  const nav = [
    { id: "home" as Screen, label: "Home", icon: Home },
    { id: "items" as Screen, label: "My Items", icon: Box },
    { id: "notifications" as Screen, label: "Notifications", icon: Bell },
    { id: "profile" as Screen, label: "Profile", icon: User },
  ];

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex h-[82px] items-start justify-around border-t border-border bg-card px-2 pt-2 lg:absolute"
      aria-label="Main navigation"
    >
      {nav.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant="ghost"
          onClick={() => go(id)}
          aria-current={active === id ? "page" : undefined}
          className={cn("h-14 min-w-16 flex-col gap-1 px-2 text-[11px]", active === id ? "text-primary" : "text-muted-foreground")}
        >
          <span className="relative">
            <Icon className="!h-5 !w-5" />
            {id === "notifications" && unreadCount > 0 ? (
              <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            ) : null}
          </span>
          {label}
        </Button>
      ))}
    </nav>
  );
}

export function AppShell({ active, children }: { active: Screen; children: ReactNode }) {
  return (
    <div className="relative min-h-screen pb-28 lg:min-h-[820px]">
      {children}
      <BottomNavigation active={active} />
    </div>
  );
}
