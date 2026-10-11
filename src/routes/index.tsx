import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Info, LayoutGrid, PackageOpen, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DaryeelLogo } from "@/components/daryeel-logo";
import { DaryeelStoreProvider, useDaryeel, type Screen } from "@/lib/daryeel-store";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/daryeel/app-shell";
import { AuthScreen, ForgotPassword, Splash, Welcome } from "@/components/daryeel/auth-screens";
import { HomeScreen } from "@/components/daryeel/screen-home";
import { ItemsScreen } from "@/components/daryeel/screen-items";
import { AddItemForm } from "@/components/daryeel/add-item-form";
import { ItemDetails } from "@/components/daryeel/screen-details";
import { QrScreen } from "@/components/daryeel/screen-qr";
import { PublicItemCard } from "@/components/daryeel/public-item";
import { NotificationsScreen } from "@/components/daryeel/screen-notifications";
import { ProfileScreen, ProfileSectionScreen } from "@/components/daryeel/screen-profile";
import { EmptyState, TopBack } from "@/components/daryeel/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daryeel — Your Belongings, Always Connected" },
      { name: "description", content: "A personal digital care system for the things you own." },
      { property: "og:title", content: "Daryeel — Your Belongings, Always Connected" },
      {
        property: "og:description",
        content: "Manage, protect, and stay connected to your personal belongings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DaryeelApp,
});

const screens: { id: Screen; label: string; group: string }[] = [
  { id: "splash", label: "Splash", group: "Start" },
  { id: "welcome", label: "Welcome", group: "Start" },
  { id: "signup", label: "Sign up", group: "Start" },
  { id: "login", label: "Sign in", group: "Start" },
  { id: "home", label: "Home", group: "App" },
  { id: "items", label: "My Items", group: "App" },
  { id: "add", label: "Add Item", group: "App" },
  { id: "details", label: "Item Details", group: "App" },
  { id: "qr", label: "QR Identity", group: "App" },
  { id: "notifications", label: "Notifications", group: "App" },
  { id: "profile", label: "Profile", group: "App" },
  { id: "empty", label: "Empty States", group: "App" },
  { id: "public", label: "Public Page", group: "Public" },
  { id: "lost", label: "Lost Item", group: "Public" },
];

const GROUPS = ["Start", "App", "Public"];

/** Screens reached from inside the app are highlighted under their entry in the picker. */
const PICKER_PARENT: Partial<Record<Screen, Screen>> = {
  forgot: "login",
  edit: "add",
  "profile-section": "profile",
};

function DaryeelApp() {
  return (
    <DaryeelStoreProvider>
      <PrototypeFrame />
    </DaryeelStoreProvider>
  );
}

function ScreenPicker({
  onChoose,
  current,
}: {
  onChoose: (screen: Screen) => void;
  current: Screen;
}) {
  return (
    <div className="space-y-5">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-3 type-overline text-muted-foreground">{group}</p>
          <ul className="grid grid-cols-2 gap-0.5 lg:grid-cols-1">
            {screens
              .filter((item) => item.group === group)
              .map((item) => {
                const active = current === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onChoose(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-secondary font-semibold text-secondary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PrototypeFrame() {
  const { nav, go } = useDaryeel();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = PICKER_PARENT[nav.screen] ?? nav.screen;
  const choose = (screen: Screen) => {
    go(screen);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <div className="px-3">
          <DaryeelLogo className="text-primary" markClassName="h-8 w-8" />
          <p className="mt-2 type-caption text-muted-foreground">Interactive prototype</p>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto" aria-label="Prototype screens">
          <ScreenPicker onChoose={choose} current={current} />
        </nav>
        <div className="mt-4">
          <PrototypeNote />
        </div>
      </aside>

      <section className="min-w-0 lg:px-8 lg:py-7 xl:px-14">
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-gutter backdrop-blur lg:hidden">
          <DaryeelLogo className="text-primary" markClassName="h-7 w-7" />
          <Button
            variant="outline"
            size="sm"
            aria-expanded={menuOpen}
            aria-controls="screen-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <LayoutGrid />}
            {menuOpen ? "Close" : "Choose screen"}
          </Button>
        </div>
        {menuOpen ? (
          <>
            <div
              aria-hidden="true"
              className="fixed inset-0 top-14 z-40 bg-foreground/30 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              id="screen-menu"
              data-screen-menu
              aria-label="Prototype screens"
              className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-border bg-card p-4 shadow-float lg:hidden"
            >
              <ScreenPicker onChoose={choose} current={current} />
              <div className="mt-4">
                <PrototypeNote />
              </div>
            </nav>
          </>
        ) : null}

        <div className="mx-auto w-full max-w-[1100px]">
          <div className="hidden items-end justify-between pb-5 lg:flex">
            <div>
              <p className="type-overline text-primary">Daryeel prototype</p>
              <h1 className="mt-1 type-title">
                {screens.find((item) => item.id === current)?.label ?? "Daryeel"}
              </h1>
            </div>
            <p className="type-caption text-muted-foreground">Mobile-first preview</p>
          </div>
          <div className="mx-auto min-h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-card md:my-6 md:max-w-[720px] md:rounded-2xl md:border md:border-border md:shadow-float lg:my-0 lg:min-h-[820px] lg:max-w-[430px]">
            <ScreenView />
          </div>
        </div>
      </section>
    </main>
  );
}

function PrototypeNote() {
  return (
    <div className="flex gap-2.5 rounded-lg bg-surface-subtle p-3 type-caption text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>Frontend prototype with sample data. Changes are lost when you refresh.</p>
    </div>
  );
}

function ScreenView() {
  const { nav, items, go, selectedItem } = useDaryeel();
  const fallback = selectedItem ?? items[0];

  switch (nav.screen) {
    case "splash":
      return <Splash />;
    case "welcome":
      return <Welcome />;
    case "signup":
      return <AuthScreen mode="signup" />;
    case "login":
      return <AuthScreen mode="login" />;
    case "forgot":
      return <ForgotPassword />;
    case "add":
      return <AddItemForm />;
    case "edit":
      return fallback ? <AddItemForm editing={fallback} /> : <NoItemState />;
    case "details":
      return fallback ? <ItemDetails item={fallback} /> : <NoItemState />;
    case "qr":
      return fallback ? <QrScreen item={fallback} /> : <NoItemState />;
    case "public":
      return fallback ? <PublicItemCard item={fallback} /> : <NoItemState />;
    case "lost": {
      const lostItem = items.find((item) => item.status === "lost") ?? fallback;
      return lostItem ? <PublicItemCard item={lostItem} forceLost /> : <NoItemState />;
    }
    case "empty":
      return (
        <div className="min-h-screen lg:min-h-[820px]">
          <TopBack title="Empty states" onBack={() => go("home")} />
          <EmptyState
            icon={<PackageOpen />}
            title="No items yet"
            text="You haven't added any belongings yet."
            action={
              <Button onClick={() => go("add")}>
                <Plus /> Add your first item
              </Button>
            }
          />
          <div className="mx-gutter h-px bg-border" />
          <EmptyState
            tone="muted"
            icon={<Bell />}
            title="No notifications"
            text="You're all caught up."
          />
        </div>
      );
    case "profile-section":
      return (
        <AppShell active="profile">
          <ProfileSectionScreen section={nav.section ?? "account"} />
        </AppShell>
      );
    case "items":
      return (
        <AppShell active="items">
          <ItemsScreen />
        </AppShell>
      );
    case "notifications":
      return (
        <AppShell active="notifications">
          <NotificationsScreen />
        </AppShell>
      );
    case "profile":
      return (
        <AppShell active="profile">
          <ProfileScreen />
        </AppShell>
      );
    default:
      return (
        <AppShell active="home">
          <HomeScreen />
        </AppShell>
      );
  }
}

function NoItemState() {
  const { go } = useDaryeel();
  return (
    <div className="min-h-screen lg:min-h-[820px]">
      <TopBack title="Item" onBack={() => go("items")} />
      <EmptyState
        icon={<PackageOpen />}
        title="No items yet"
        text="Add your first belonging to see its details, QR identity and public page."
        action={
          <Button onClick={() => go("add")}>
            <Plus /> Add your first item
          </Button>
        }
      />
    </div>
  );
}
