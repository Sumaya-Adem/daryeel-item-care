import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Menu, PackageOpen, Plus, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DaryeelLogo } from "@/components/daryeel-logo";
import { DaryeelStoreProvider, useDaryeel, type Screen } from "@/lib/daryeel-store";
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
      { property: "og:description", content: "Manage, protect, and stay connected to your personal belongings." },
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

function DaryeelApp() {
  return (
    <DaryeelStoreProvider>
      <PrototypeFrame />
    </DaryeelStoreProvider>
  );
}

function PrototypeFrame() {
  const { nav, go } = useDaryeel();
  const [menuOpen, setMenuOpen] = useState(false);
  const choose = (screen: Screen) => {
    go(screen);
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card px-5 py-7 lg:flex lg:flex-col">
        <DaryeelLogo className="text-primary" />
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Interactive prototype
          <br />
          Your belongings, always connected.
        </p>
        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto" aria-label="Prototype screens">
          {["Start", "App", "Public"].map((group) => (
            <div key={group}>
              <p className="mb-2 px-3 text-[11px] font-bold uppercase text-muted-foreground">{group}</p>
              <div className="space-y-1">
                {screens
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => choose(item.id)}
                      className={`h-10 w-full justify-start px-3 ${nav.screen === item.id ? "bg-secondary text-primary" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="rounded-2xl bg-info-soft p-4 text-xs leading-5 text-secondary-foreground">
          <ShieldCheck className="mb-2 h-5 w-5" />
          Frontend prototype. Data stays in this browser session only.
        </div>
      </aside>

      <section className="min-w-0 lg:px-8 lg:py-7 xl:px-14">
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur lg:hidden">
          <DaryeelLogo className="text-primary" markClassName="h-8 w-8" />
          <Button variant="outline" size="icon" aria-label="Choose screen" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen ? (
          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-card p-4 shadow-float lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {screens.map((item) => (
                <Button
                  key={item.id}
                  variant={nav.screen === item.id ? "secondary" : "ghost"}
                  onClick={() => choose(item.id)}
                  className="justify-start"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mx-auto w-full max-w-[1100px]">
          <div className="hidden items-end justify-between pb-5 lg:flex">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Daryeel product design</p>
              <h1 className="mt-1 text-2xl font-bold">{screens.find((item) => item.id === nav.screen)?.label ?? "Daryeel"}</h1>
            </div>
            <p className="text-sm text-muted-foreground">Interactive mobile-first prototype</p>
          </div>
          <div className="mx-auto min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-card lg:min-h-[820px] lg:max-w-[430px] lg:rounded-[28px] lg:border lg:border-border lg:shadow-float">
            <ScreenView />
          </div>
        </div>
      </section>
    </main>
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
          <TopBack title="Empty States" onBack={() => go("home")} />
          <EmptyState
            icon={<PackageOpen />}
            title="No Items Yet"
            text="You haven't added any belongings yet."
            action={
              <Button onClick={() => go("add")}>
                <Plus /> Add Your First Item
              </Button>
            }
          />
          <div className="mx-5 h-px bg-border" />
          <EmptyState tone="muted" icon={<Bell />} title="No Notifications" text="You're all caught up." />
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
        title="No Items Yet"
        text="Add your first belonging to see its details, QR identity, and public page."
        action={
          <Button onClick={() => go("add")}>
            <Plus /> Add Your First Item
          </Button>
        }
      />
    </div>
  );
}
