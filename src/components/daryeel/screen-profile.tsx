import { useId, useState } from "react";
import {
  Bell,
  CircleHelp,
  Info,
  KeyRound,
  LogOut,
  QrCode,
  ShieldCheck,
  UserRound,
} from "lucide-react";
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
import { Avatar, Card, InfoRows, ListRowButton, Notice, PageHeader, TopBack } from "./ui-kit";

const SECTIONS = [
  {
    id: "account",
    label: "Account",
    description: "Name, phone and email",
    icon: <UserRound />,
    group: "Account",
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "What finders can see about you",
    icon: <ShieldCheck />,
    group: "Privacy & sharing",
  },
  {
    id: "qr-privacy",
    label: "QR privacy",
    description: "Defaults for new items",
    icon: <QrCode />,
    group: "Privacy & sharing",
  },
  {
    id: "notifications",
    label: "Notification settings",
    description: "Warranty and lost-item alerts",
    icon: <Bell />,
    group: "Preferences",
  },
  {
    id: "security",
    label: "Security",
    description: "Passcode and sign-in",
    icon: <KeyRound />,
    group: "Preferences",
  },
  {
    id: "help",
    label: "Help & support",
    description: "Get help with Daryeel",
    icon: <CircleHelp />,
    group: "Support",
  },
];

const GROUPS = ["Account", "Privacy & sharing", "Preferences", "Support"];

export function ProfileScreen() {
  const { owner, go, items } = useDaryeel();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Profile" />
      <div className="space-y-6 px-gutter">
        <Card className="flex items-center gap-4 p-4">
          <Avatar name={owner.name} size="lg" />
          <div className="min-w-0">
            <h3 className="truncate type-heading">{owner.name}</h3>
            <p className="truncate type-caption text-muted-foreground">{owner.phone}</p>
            <p className="truncate type-caption text-muted-foreground">{owner.email}</p>
          </div>
          <div className="ml-auto shrink-0 text-right">
            <p className="text-lg font-semibold tabular-nums">{items.length}</p>
            <p className="text-xs text-muted-foreground">Items</p>
          </div>
        </Card>

        {GROUPS.map((group) => (
          <section key={group} aria-label={group}>
            <h3 className="mb-2 type-overline text-muted-foreground">{group}</h3>
            <Card className="divide-y divide-border overflow-hidden">
              {SECTIONS.filter((section) => section.group === group).map((section) => (
                <ListRowButton
                  key={section.id}
                  icon={section.icon}
                  label={section.label}
                  description={section.description}
                  onClick={() => go("profile-section", { section: section.id })}
                />
              ))}
            </Card>
          </section>
        ))}

        <Button
          variant="destructive-outline"
          className="w-full"
          onClick={() => setLogoutOpen(true)}
        >
          <LogOut /> Log out
        </Button>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out of Daryeel?</DialogTitle>
            <DialogDescription>
              You can sign back in at any time with your email or phone number.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                setLogoutOpen(false);
                toast("Left the preview.", {
                  description: "There's no real session to sign out of yet.",
                });
                go("welcome");
              }}
            >
              <LogOut /> Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** A setting that is shown for design review only; it is disabled because nothing saves it yet. */
function PreviewToggleRow({
  label,
  description,
  defaultOn = true,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <p id={`${id}-desc`} className="mt-0.5 type-caption text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch id={id} checked={defaultOn} disabled aria-describedby={`${id}-desc`} />
    </div>
  );
}

function PreviewNotice() {
  return (
    <Notice tone="neutral" icon={<Info />} title="Preview only">
      These settings show the planned defaults. They can't be changed or saved yet.
    </Notice>
  );
}

export function ProfileSectionScreen({ section }: { section: string }) {
  const { owner, go, items } = useDaryeel();
  const meta = SECTIONS.find((entry) => entry.id === section);

  return (
    <div className="animate-fade-up min-h-screen pb-10 lg:min-h-[820px]">
      <TopBack
        title={meta?.label ?? "Settings"}
        subtitle={meta?.description}
        onBack={() => go("profile")}
      />
      <div className="space-y-4 px-gutter pt-5">
        {section === "account" ? (
          <>
            <Card className="px-4">
              <InfoRows
                rows={[
                  ["Full name", owner.name],
                  ["Phone", owner.phone],
                  ["Email", owner.email],
                  ["Items", String(items.length)],
                ]}
              />
            </Card>
            <p className="type-caption text-muted-foreground">
              Editing your profile will be available once accounts are connected.
            </p>
          </>
        ) : null}

        {section === "privacy" ? (
          <>
            <PreviewNotice />
            <Card className="divide-y divide-border">
              <PreviewToggleRow
                label="Hide my full name publicly"
                description="Show only your first name on public pages."
                defaultOn={false}
              />
              <PreviewToggleRow
                label="Allow found reports"
                description="Let finders tell you they have your item."
              />
            </Card>
          </>
        ) : null}

        {section === "notifications" ? (
          <>
            <PreviewNotice />
            <Card className="divide-y divide-border">
              <PreviewToggleRow
                label="Warranty reminders"
                description="Alerts before a warranty expires."
              />
              <PreviewToggleRow
                label="Lost item alerts"
                description="Updates when someone scans a lost item."
              />
              <PreviewToggleRow
                label="Product tips"
                description="Occasional guidance on caring for your items."
                defaultOn={false}
              />
            </Card>
          </>
        ) : null}

        {section === "qr-privacy" ? (
          <>
            <PreviewNotice />
            <p className="type-caption text-muted-foreground">
              Default information shown when someone scans a new item's QR code. You can already
              choose this for each item in its Privacy step.
            </p>
            <Card className="divide-y divide-border">
              <PreviewToggleRow label="Item name" description="Shown on the public page." />
              <PreviewToggleRow label="Owner name" description="Shown on the public page." />
              <PreviewToggleRow
                label="Contact number"
                description="Used by the Contact owner button."
              />
              <PreviewToggleRow
                label="Serial number"
                description="Optional. Off by default."
                defaultOn={false}
              />
            </Card>
          </>
        ) : null}

        {section === "security" ? (
          <>
            <PreviewNotice />
            <Card className="divide-y divide-border">
              <PreviewToggleRow
                label="Require passcode"
                description="Ask for a passcode when opening Daryeel."
                defaultOn={false}
              />
              <PreviewToggleRow
                label="Two-step verification"
                description="Add an extra check when signing in."
                defaultOn={false}
              />
            </Card>
          </>
        ) : null}

        {section === "help" ? (
          <>
            <Card className="p-4">
              <h3 className="type-heading">We're here to help</h3>
              <p className="mt-1 type-caption text-muted-foreground">
                Questions about QR stickers, warranties or lost items? The support channel will be
                listed here once it's available.
              </p>
            </Card>
            <Button className="w-full" disabled>
              Contact support
            </Button>
            <p className="text-center type-caption text-muted-foreground">
              Support contact isn't connected yet.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
