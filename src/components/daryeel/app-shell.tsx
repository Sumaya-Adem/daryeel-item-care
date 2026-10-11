import { Bell, Box, Home, User } from "lucide-react";
import type { ReactNode } from "react";
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
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur md:mx-auto md:max-w-[720px] lg:absolute lg:max-w-none"
      aria-label="Main navigation"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {nav.map(({ id, label, icon: Icon }) => {
          const current = active === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => go(id)}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-14 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  current
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={current ? 2.25 : 1.75}
                    aria-hidden="true"
                  />
                  {id === "notifications" && unreadCount > 0 ? (
                    <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                      {unreadCount}
                      <span className="sr-only"> unread</span>
                    </span>
                  ) : null}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
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
