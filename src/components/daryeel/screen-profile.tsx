import { useState } from "react";
import { Bell, CircleHelp, KeyRound, LogOut, QrCode, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDaryeel } from "@/lib/daryeel-store";
import { InfoRows, ListRowButton, PageHeader, SectionTitle, TopBack } from "./ui-kit";

const SECTIONS = [
  { id: "account", label: "Account", icon: <UserRound /> },
  { id: "privacy", label: "Privacy", icon: <ShieldCheck /> },
  { id: "notifications", label: "Notification Settings", icon: <Bell /> },
  { id: "qr-privacy", label: "QR Privacy", icon: <QrCode /> },
  { id: "security", label: "Security", icon: <KeyRound /> },
  { id: "help", label: "Help & Support", icon: <CircleHelp /> },
];

export function ProfileScreen() {
  const { owner, go } = useDaryeel();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Profile" />
      <div className="px-5">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-foreground text-xl font-extrabold text-primary">
              AA
            </div>
            <div>
              <h2 className="text-lg font-extrabold">{owner.name}</h2>
              <p className="mt-1 text-xs text-primary-foreground/80">{owner.phone}</p>
              <p className="mt-1 text-xs text-primary-foreground/80">{owner.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {SECTIONS.map((section) => (
            <ListRowButton
              key={section.id}
              icon={section.icon}
              label={section.label}
              onClick={() => go("profile-section", { section: section.id })}
            />
          ))}
        </div>

        <Button variant="ghost" className="mt-4 w-full justify-start text-destructive" onClick={() => setLogoutOpen(true)}>
          <LogOut />
          Logout
        </Button>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out of Daryeel?</DialogTitle>
            <DialogDescription>You can sign back in at any time with your email or phone number.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setLogoutOpen(false);
                toast("You have been signed out.");
                go("welcome");
              }}
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToggleRow({ label, description, defaultOn = true }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={on}
        aria-label={label}
        onCheckedChange={(value) => {
          setOn(value);
          toast.success("Changes saved.");
        }}
      />
    </div>
  );
}

export function ProfileSectionScreen({ section }: { section: string }) {
  const { owner, go, items } = useDaryeel();
  const meta = SECTIONS.find((entry) => entry.id === section);

  return (
    <div className="animate-fade-up min-h-screen pb-10 lg:min-h-[820px]">
      <TopBack title={meta?.label ?? "Settings"} onBack={() => go("profile")} />
      <div className="px-5">
        {section === "account" ? (
          <div className="rounded-2xl border border-border px-4">
            <InfoRows
              rows={[
                ["Full Name", owner.name],
                ["Phone", owner.phone],
                ["Email", owner.email],
                ["Items", String(items.length)],
              ]}
            />
          </div>
        ) : null}

        {section === "privacy" ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ToggleRow label="Hide my full name publicly" description="Show only your first name on public pages." defaultOn={false} />
            <ToggleRow label="Allow found reports" description="Let finders tell you they have your item." />
          </div>
        ) : null}

        {section === "notifications" ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ToggleRow label="Warranty reminders" description="Alerts before a warranty expires." />
            <ToggleRow label="Lost item alerts" description="Updates when someone scans a lost item." />
            <ToggleRow label="Product tips" description="Occasional guidance on caring for your items." defaultOn={false} />
          </div>
        ) : null}

        {section === "qr-privacy" ? (
          <>
            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              Default information shown when someone scans a new item's QR code.
            </p>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ToggleRow label="Item Name" description="Shown on the public page." />
              <ToggleRow label="Owner Name" description="Shown on the public page." />
              <ToggleRow label="Contact Number" description="Used by the Contact Owner button." />
              <ToggleRow label="Serial Number" description="Optional. Off by default." defaultOn={false} />
            </div>
          </>
        ) : null}

        {section === "security" ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ToggleRow label="Require passcode" description="Ask for a passcode when opening Daryeel." defaultOn={false} />
            <ToggleRow label="Two-step verification" description="Add an extra check when signing in." defaultOn={false} />
          </div>
        ) : null}

        {section === "help" ? (
          <div className="space-y-3">
            <SectionTitle>We're here to help</SectionTitle>
            <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
              Questions about QR stickers, warranties, or lost items? Reach the Daryeel care team and we'll reply within one
              business day.
            </div>
            <Button className="w-full" onClick={() => toast("Support chat will open when the service is connected.")}>
              Contact Support
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
