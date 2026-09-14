import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft, Bell, Box, CalendarDays, Camera, Car, Check, ChevronRight, CircleHelp,
  Download, FileText, Filter, Home, ImagePlus, KeyRound, Laptop, LockKeyhole, LogOut,
  Mail, MapPin, Menu, PackageOpen, Phone, Plus, Printer, QrCode, Search, Settings,
  Share2, ShieldCheck, Smartphone, Tag, User, UserRound, WalletCards, Warranty, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DaryeelLogo } from "@/components/daryeel-logo";
import belongingsImage from "@/assets/daryeel-belongings.jpg";

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
  component: DaryeelPrototype,
});

type Screen = "splash" | "welcome" | "signup" | "login" | "home" | "items" | "add" | "details" | "qr" | "public" | "lost" | "notifications" | "profile" | "empty";

const screens: { id: Screen; label: string; group: string }[] = [
  { id: "splash", label: "Splash", group: "Start" }, { id: "welcome", label: "Welcome", group: "Start" },
  { id: "signup", label: "Sign up", group: "Start" }, { id: "login", label: "Sign in", group: "Start" },
  { id: "home", label: "Home", group: "App" }, { id: "items", label: "My Items", group: "App" },
  { id: "add", label: "Add Item", group: "App" }, { id: "details", label: "Item Details", group: "App" },
  { id: "qr", label: "QR Identity", group: "App" }, { id: "notifications", label: "Notifications", group: "App" },
  { id: "profile", label: "Profile", group: "App" }, { id: "empty", label: "Empty States", group: "App" },
  { id: "public", label: "Public Page", group: "Public" }, { id: "lost", label: "Lost Item", group: "Public" },
];

function DaryeelPrototype() {
  const [screen, setScreen] = useState<Screen>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const choose = (next: Screen) => { setScreen(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card px-5 py-7 lg:flex lg:flex-col">
        <DaryeelLogo className="text-primary" />
        <p className="mt-3 text-xs leading-5 text-muted-foreground">UI/UX prototype<br />Your belongings, always connected.</p>
        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto" aria-label="Prototype screens">
          {["Start", "App", "Public"].map((group) => (
            <div key={group}>
              <p className="mb-2 px-3 text-[11px] font-bold uppercase text-muted-foreground">{group}</p>
              <div className="space-y-1">
                {screens.filter((item) => item.group === group).map((item) => (
                  <Button key={item.id} variant="ghost" onClick={() => choose(item.id)} className={`h-10 w-full justify-start px-3 ${screen === item.id ? "bg-secondary text-primary" : "text-muted-foreground"}`}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="rounded-2xl bg-info-soft p-4 text-xs leading-5 text-secondary-foreground"><ShieldCheck className="mb-2 h-5 w-5" />Visual prototype only. No personal information is stored.</div>
      </aside>

      <section className="min-w-0 lg:px-8 lg:py-7 xl:px-14">
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur lg:hidden">
          <DaryeelLogo className="text-primary" markClassName="h-8 w-8" />
          <Button variant="outline" size="icon" aria-label="Choose screen" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen ? (
          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-card p-4 shadow-float lg:hidden">
            <div className="grid grid-cols-2 gap-2">{screens.map((item) => <Button key={item.id} variant={screen === item.id ? "secondary" : "ghost"} onClick={() => choose(item.id)} className="justify-start">{item.label}</Button>)}</div>
          </div>
        ) : null}
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="hidden items-end justify-between pb-5 lg:flex">
            <div><p className="text-xs font-bold uppercase text-primary">Daryeel product design</p><h1 className="mt-1 text-2xl font-bold">{screens.find((item) => item.id === screen)?.label}</h1></div>
            <p className="text-sm text-muted-foreground">Interactive mobile-first prototype</p>
          </div>
          <div className="mx-auto min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-card lg:min-h-[820px] lg:max-w-[430px] lg:rounded-[28px] lg:border lg:border-border lg:shadow-float">
            <ScreenView screen={screen} go={choose} notify={notify} />
          </div>
        </div>
      </section>
      {toast ? <div role="status" className="fixed bottom-24 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-card shadow-float"><Check className="h-4 w-4" />{toast}</div> : null}
    </main>
  );
}

function ScreenView({ screen, go, notify }: { screen: Screen; go: (screen: Screen) => void; notify: (message: string) => void }) {
  if (screen === "splash") return <Splash go={go} />;
  if (screen === "welcome") return <Welcome go={go} />;
  if (screen === "signup") return <AuthScreen mode="signup" go={go} />;
  if (screen === "login") return <AuthScreen mode="login" go={go} />;
  if (screen === "add") return <AddItem go={go} notify={notify} />;
  if (screen === "details") return <ItemDetails go={go} notify={notify} />;
  if (screen === "qr") return <QrScreen go={go} notify={notify} />;
  if (screen === "public") return <PublicItem lost={false} go={go} notify={notify} />;
  if (screen === "lost") return <PublicItem lost go={go} notify={notify} />;
  if (screen === "empty") return <EmptyStates go={go} />;
  return <AppShell active={screen} go={go}>{screen === "home" ? <HomeScreen go={go} /> : screen === "items" ? <ItemsScreen go={go} /> : screen === "notifications" ? <Notifications notify={notify} /> : <Profile go={go} />}</AppShell>;
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return <button aria-label="Continue to welcome" onClick={() => go("welcome")} className="flex min-h-screen w-full cursor-pointer flex-col items-center justify-center bg-primary text-primary-foreground lg:min-h-[820px]">
    <DaryeelLogo showWordmark={false} inverse className="animate-logo-breathe" markClassName="h-24 w-24" />
    <p className="mt-5 font-display text-3xl font-extrabold">DARYEEL</p><p className="mt-3 text-sm text-primary-foreground/80">Your belongings, always connected.</p>
  </button>;
}

function Welcome({ go }: { go: (screen: Screen) => void }) {
  return <div className="flex min-h-screen flex-col px-6 py-6 lg:min-h-[820px]">
    <DaryeelLogo className="text-primary" />
    <div className="my-auto py-7">
      <img src={belongingsImage} width={1200} height={900} alt="Personal belongings connected through Daryeel" className="aspect-[4/3] w-full rounded-[24px] object-cover" />
      <h2 className="mt-7 text-3xl font-extrabold leading-tight">Take care of what you own.</h2>
      <p className="mt-3 leading-7 text-muted-foreground">Manage your belongings, create digital identities, and stay connected to your items.</p>
    </div>
    <div className="space-y-3"><Button className="w-full" size="lg" onClick={() => go("signup")}>Get Started <ChevronRight /></Button><Button className="w-full" size="lg" variant="outline" onClick={() => go("login")}>I already have an account</Button></div>
  </div>;
}

function AuthScreen({ mode, go }: { mode: "signup" | "login"; go: (screen: Screen) => void }) {
  const signup = mode === "signup";
  return <div className="min-h-screen px-6 py-6 lg:min-h-[820px]">
    <Button variant="ghost" size="icon" aria-label="Back" onClick={() => go("welcome")}><ArrowLeft /></Button>
    <DaryeelLogo className="mt-5 text-primary" />
    <h2 className="mt-8 text-3xl font-extrabold">{signup ? "Create your account" : "Welcome back"}</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{signup ? "Start caring for the things that matter to you." : "Sign in to manage your belongings."}</p>
    <form className="mt-8 space-y-4" onSubmit={(event) => { event.preventDefault(); go("home"); }}>
      {signup ? <Field label="Full Name" placeholder="Ahmed Ali" icon={<UserRound />} /> : null}
      {signup ? <Field label="Phone Number" placeholder="+252 63 000 0000" icon={<Phone />} /> : null}
      <Field label={signup ? "Email" : "Email or Phone"} placeholder={signup ? "ahmed@example.com" : "Email or phone number"} icon={<Mail />} />
      <Field label="Password" placeholder="Enter your password" type="password" icon={<LockKeyhole />} />
      {signup ? <Field label="Confirm Password" placeholder="Re-enter your password" type="password" icon={<LockKeyhole />} /> : <div className="text-right"><Button type="button" variant="link" className="h-auto p-0">Forgot Password?</Button></div>}
      <Button type="submit" className="mt-3 w-full" size="lg">{signup ? "Create Account" : "Sign In"}</Button>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">{signup ? "Already have an account?" : "Don't have an account?"} <Button variant="link" className="h-auto p-0" onClick={() => go(signup ? "login" : "signup")}>{signup ? "Sign In" : "Create one"}</Button></p>
  </div>;
}

function Field({ label, placeholder, type = "text", icon }: { label: string; placeholder: string; type?: string; icon?: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><span className="relative block">{icon ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}<Input type={type} placeholder={placeholder} className={`h-13 rounded-[13px] bg-card ${icon ? "pl-11" : ""}`} /></span></label>;
}

function AppShell({ active, go, children }: { active: Screen; go: (screen: Screen) => void; children: ReactNode }) {
  const nav = [{ id: "home" as Screen, label: "Home", icon: Home }, { id: "items" as Screen, label: "My Items", icon: Box }, { id: "notifications" as Screen, label: "Notifications", icon: Bell }, { id: "profile" as Screen, label: "Profile", icon: User }];
  return <div className="relative min-h-screen pb-28 lg:min-h-[820px]">{children}<nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex h-[82px] items-start justify-around border-t border-border bg-card px-2 pt-2 lg:absolute" aria-label="Main navigation">{nav.map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" onClick={() => go(id)} className={`h-14 min-w-16 flex-col gap-1 px-2 text-[11px] ${active === id ? "text-primary" : "text-muted-foreground"}`}><Icon className="!h-5 !w-5" />{label}</Button>)}</nav></div>;
}

function PageHeader({ title, action }: { title: string; action?: ReactNode }) { return <header className="flex items-center justify-between px-5 pb-4 pt-6"><h2 className="text-2xl font-extrabold">{title}</h2>{action}</header>; }
function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) { return <div className="mb-3 flex items-center justify-between"><h3 className="text-base font-bold">{children}</h3>{action}</div>; }

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const stats = [{ label: "My Items", value: "24", icon: Box }, { label: "QR Items", value: "18", icon: QrCode }, { label: "Warranty", value: "3 expiring", icon: Warranty }, { label: "Lost", value: "1 item", icon: MapPin }];
  const actions = [{ label: "Add Item", icon: Plus, screen: "add" as Screen }, { label: "QR Code", icon: QrCode, screen: "qr" as Screen }, { label: "Lost Item", icon: MapPin, screen: "lost" as Screen }, { label: "Warranty", icon: Warranty, screen: "details" as Screen }];
  return <div className="animate-fade-up px-5 pt-6">
    <div className="flex items-center justify-between"><div><p className="text-2xl font-extrabold">Good morning, Ahmed</p><p className="mt-1 text-sm text-muted-foreground">Keep your belongings organized and protected.</p></div><div className="grid h-11 w-11 place-items-center rounded-full bg-secondary font-bold text-primary">AA</div></div>
    <div className="mt-6 grid grid-cols-2 gap-3">{stats.map(({ label, value, icon: Icon }, i) => <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-soft"><div className={`mb-4 grid h-9 w-9 place-items-center rounded-xl ${i > 1 ? "bg-warning-soft text-warning" : "bg-secondary text-primary"}`}><Icon className="h-4 w-4" /></div><p className="text-xl font-extrabold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div>
    <div className="mt-7"><SectionTitle action={<Button variant="link" className="h-auto p-0" onClick={() => go("items")}>View All</Button>}>Recent Items</SectionTitle><ItemCard go={go} /></div>
    <div className="mt-7"><SectionTitle>Quick Actions</SectionTitle><div className="grid grid-cols-4 gap-2">{actions.map(({ label, icon: Icon, screen }) => <Button key={label} variant="ghost" onClick={() => go(screen)} className="h-auto flex-col gap-2 px-1 py-3 text-[11px] text-muted-foreground"><span className="grid h-11 w-11 place-items-center rounded-xl bg-info-soft text-primary"><Icon /></span>{label}</Button>)}</div></div>
    <Button className="mt-6 w-full" size="lg" onClick={() => go("add")}><Plus /> Add New Item</Button>
  </div>;
}

function ItemCard({ go }: { go: (screen: Screen) => void }) {
  return <div className="flex gap-4 rounded-2xl border border-border bg-card p-3 shadow-soft"><img src={belongingsImage} width={1200} height={900} loading="lazy" alt="Dell Latitude laptop" className="h-24 w-24 rounded-xl object-cover object-left-top" /><div className="min-w-0 flex-1 py-1"><h4 className="truncate font-bold">Dell Latitude 5420</h4><p className="mt-1 text-xs text-muted-foreground">Electronics</p><div className="mt-3 flex flex-wrap gap-2"><Badge><QrCode /> QR Active</Badge><Badge tone="gold">4 mo. left</Badge></div></div><Button variant="ghost" size="icon" aria-label="View item" className="self-center" onClick={() => go("details")}><ChevronRight /></Button></div>;
}

function Badge({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "gold" | "red" }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${tone === "gold" ? "bg-warning-soft text-warning" : tone === "red" ? "bg-destructive/10 text-destructive" : "bg-secondary text-primary"} [&>svg]:h-3 [&>svg]:w-3`}>{children}</span>;
}

function ItemsScreen({ go }: { go: (screen: Screen) => void }) {
  const [category, setCategory] = useState("All");
  return <div className="animate-fade-up"><PageHeader title="My Items" action={<Button size="icon" onClick={() => go("add")} aria-label="Add item"><Plus /></Button>} /><div className="px-5"><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-12 rounded-[13px] bg-card pl-11" placeholder="Search your belongings..." /></div><Button variant="outline" size="icon" aria-label="Filter"><Filter /></Button></div><div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2">{["All", "Electronics", "Vehicles", "Appliances", "Documents", "Other"].map((item) => <Button key={item} variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} className="h-9 shrink-0 rounded-full px-4 text-xs">{item}</Button>)}</div><div className="mt-5 space-y-3"><ItemCard go={go} /><SimpleItem icon={<Smartphone />} title="iPhone 14 Pro" category="Electronics" status="QR Active" go={go} /><SimpleItem icon={<Car />} title="Toyota Corolla" category="Vehicles" status="Warranty expired" go={go} /><SimpleItem icon={<FileText />} title="Property Documents" category="Documents" status="QR Active" go={go} /></div></div></div>;
}

function SimpleItem({ icon, title, category, status, go }: { icon: ReactNode; title: string; category: string; status: string; go: (screen: Screen) => void }) { return <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-surface-subtle text-primary [&>svg]:h-7 [&>svg]:w-7">{icon}</div><div className="min-w-0 flex-1"><h4 className="truncate text-sm font-bold">{title}</h4><p className="mt-1 text-xs text-muted-foreground">{category}</p><div className="mt-2"><Badge tone={status.includes("expired") ? "gold" : "teal"}>{status}</Badge></div></div><Button variant="ghost" className="h-9 px-3 text-xs" onClick={() => go("details")}>View</Button></div>; }

function AddItem({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  return <div className="min-h-screen bg-card lg:min-h-[820px]"><div className="flex items-center gap-3 px-5 pt-6"><Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : go("home")} aria-label="Back"><ArrowLeft /></Button><div><h2 className="text-xl font-extrabold">Add New Item</h2><p className="text-xs text-muted-foreground">Step {step} of 4</p></div></div><div className="mt-6 flex gap-2 px-5">{[1,2,3,4].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-primary" : "bg-muted"}`} />)}</div><div className="px-5 py-7">{step === 1 ? <StepBasic /> : step === 2 ? <StepPhoto /> : step === 3 ? <StepAdditional /> : <StepPrivacy />}</div><div className="sticky bottom-0 mt-2 border-t border-border bg-card p-5"><Button className="w-full" size="lg" onClick={() => { if (step < 4) setStep(step + 1); else { notify("Item created in prototype"); go("qr"); } }}>{step < 4 ? "Continue" : "Create Item"}<ChevronRight /></Button></div></div>;
}
function StepHeading({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="mb-7"><div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div><h3 className="text-2xl font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>; }
function StepBasic() { return <><StepHeading icon={<Tag />} title="Basic Information" text="Add the details that help you identify this item." /><div className="space-y-4"><Field label="Item Name" placeholder="e.g. Dell Latitude 5420" /><Field label="Category" placeholder="Select category" /><div className="grid grid-cols-2 gap-3"><Field label="Brand" placeholder="Dell" /><Field label="Model" placeholder="Latitude 5420" /></div><Field label="Serial Number" placeholder="Enter serial number" /><Field label="Purchase Date" placeholder="DD / MM / YYYY" /></div></>; }
function StepPhoto() { return <><StepHeading icon={<Camera />} title="Item Photo" text="A clear photo makes your item easy to recognize." /><div className="grid min-h-64 place-items-center rounded-2xl border-2 border-dashed border-input bg-surface-subtle p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary"><ImagePlus /></div><p className="mt-4 font-bold">Add an item photo</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Use a well-lit photo showing the whole item.</p></div></div><div className="mt-4 grid grid-cols-2 gap-3"><Button variant="outline"><Camera /> Take Photo</Button><Button variant="outline"><ImagePlus /> Choose Photo</Button></div></>; }
function StepAdditional() { return <><StepHeading icon={<FileText />} title="Additional Information" text="Keep purchase and warranty details together." /><div className="space-y-4"><Field label="Purchase Price" placeholder="$ 0.00" /><Field label="Seller" placeholder="Store or seller name" /><Field label="Warranty Expiry" placeholder="DD / MM / YYYY" /><label className="block"><span className="mb-2 block text-sm font-semibold">Private Notes</span><textarea className="min-h-28 w-full rounded-[13px] border border-input bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Notes only you can see..." /></label></div></>; }
function StepPrivacy() { const rows = [["Item Name", true], ["Owner Name", true], ["Contact Number", true], ["Serial Number", false], ["Warranty Status", false]] as const; return <><StepHeading icon={<ShieldCheck />} title="QR Visibility" text="What should people see when they scan your QR?" /><div className="overflow-hidden rounded-2xl border border-border">{rows.map(([label, checked], index) => <label key={label} className={`flex cursor-pointer items-center justify-between p-4 ${index ? "border-t border-border" : ""}`}><span><span className="block text-sm font-semibold">{label}</span>{!checked ? <span className="text-[11px] text-muted-foreground">Optional</span> : null}</span><Checkbox defaultChecked={checked} /></label>)}</div><div className="mt-5 flex gap-3 rounded-xl bg-info-soft p-4 text-xs leading-5 text-secondary-foreground"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" /><p>Private notes, price, receipts, and documents are never shown publicly.</p></div></>; }

function TopBack({ title, go }: { title: string; go: (screen: Screen) => void }) { return <div className="flex items-center gap-3 px-5 py-5"><Button variant="ghost" size="icon" onClick={() => go("home")} aria-label="Back"><ArrowLeft /></Button><h2 className="text-xl font-extrabold">{title}</h2></div>; }
function ItemDetails({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) { return <div className="min-h-screen pb-8 lg:min-h-[820px]"><TopBack title="Item Details" go={go} /><img src={belongingsImage} width={1200} height={900} alt="Dell Latitude 5420" className="aspect-[16/10] w-full object-cover object-left-top" /><div className="px-5"><div className="py-5"><div className="flex items-start justify-between"><div><h2 className="text-2xl font-extrabold">Dell Latitude 5420</h2><p className="mt-1 text-sm text-muted-foreground">Electronics</p></div><Badge><span className="h-1.5 w-1.5 rounded-full bg-success" />Active</Badge></div></div><InfoSection title="Item Information" rows={[["Brand", "Dell"], ["Model", "Latitude 5420"], ["Serial Number", "DL-5420-AX91"], ["Purchase Date", "12 March 2026"]]} /><section className="mt-6"><SectionTitle>Warranty</SectionTitle><div className="rounded-2xl border border-border p-4"><p className="text-xs text-muted-foreground">Warranty expires</p><p className="mt-1 font-bold">12 March 2027</p><div className="mt-4 h-2 rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-warning" /></div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>8 months used</span><span>4 months left</span></div><Button variant="outline" className="mt-4 w-full" onClick={() => notify("Warranty reminder set")}><Bell /> Set Reminder</Button></div></section><section className="mt-6"><SectionTitle>QR Identity</SectionTitle><div className="rounded-2xl border border-border p-5 text-center"><QrPlaceholder /><div className="mt-4 grid grid-cols-3 gap-2"><ActionMini icon={<Download />} label="Download" onClick={() => notify("Download preview opened")} /><ActionMini icon={<Printer />} label="Print" onClick={() => notify("Print preview opened")} /><ActionMini icon={<Share2 />} label="Share" onClick={() => notify("Share preview opened")} /></div><Button className="mt-4 w-full" variant="secondary" onClick={() => go("public")}>View Public Page</Button></div></section><section className="mt-6 rounded-2xl border border-border bg-surface-subtle p-4"><div className="flex items-center gap-2 text-sm font-bold"><LockKeyhole className="h-4 w-4 text-primary" />Private — Only you can see this</div><InfoRows rows={[["Purchase Price", "$840"], ["Seller", "Tech Point"], ["Private Notes", "Work laptop — charger in desk drawer"]]} /></section></div></div>; }
function InfoSection({ title, rows }: { title: string; rows: string[][] }) { return <section><SectionTitle>{title}</SectionTitle><div className="rounded-2xl border border-border px-4"><InfoRows rows={rows} /></div></section>; }
function InfoRows({ rows }: { rows: string[][] }) { return <div>{rows.map(([key, value], i) => <div key={key} className={`flex justify-between gap-4 py-3 text-sm ${i ? "border-t border-border" : ""}`}><span className="text-muted-foreground">{key}</span><span className="text-right font-semibold">{value}</span></div>)}</div>; }

function QrPlaceholder() { return <div aria-label="QR code placeholder" className="mx-auto grid aspect-square w-44 grid-cols-7 gap-1 rounded-xl border-8 border-card bg-card p-2 shadow-soft">{Array.from({ length: 49 }).map((_, i) => <span key={i} className={`rounded-[1px] ${(i * 7 + i * i + 3) % 5 < 2 || [0,1,7,8,5,6,12,13,35,36,42,43].includes(i) ? "bg-foreground" : "bg-card"}`} />)}</div>; }
function ActionMini({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) { return <Button variant="ghost" onClick={onClick} className="h-auto flex-col gap-1.5 px-1 py-2 text-[10px] text-muted-foreground"><span className="text-primary">{icon}</span>{label}</Button>; }

function QrScreen({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) { return <div className="min-h-screen bg-card lg:min-h-[820px]"><TopBack title="Your Item QR" go={go} /><div className="px-5 pb-8 text-center"><div className="mt-6 rounded-[24px] bg-surface-subtle p-7"><QrPlaceholder /><p className="mt-5 text-lg font-bold">Attach this QR code to your item.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Anyone who scans this code can see only the information you choose to make public.</p></div><div className="mt-5 grid grid-cols-3 gap-3"><Button variant="outline" onClick={() => notify("Download preview opened")} className="h-auto flex-col py-4"><Download />Download QR</Button><Button variant="outline" onClick={() => notify("Print preview opened")} className="h-auto flex-col py-4"><Printer />Print QR</Button><Button variant="outline" onClick={() => notify("Share preview opened")} className="h-auto flex-col py-4"><Share2 />Share QR</Button></div><div className="mt-7 text-left"><SectionTitle>Public Information</SectionTitle><div className="rounded-2xl border border-border p-4">{["Item Name", "Owner Name", "Contact Number"].map((item) => <div key={item} className="flex items-center gap-3 py-2 text-sm font-semibold"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>{item}</div>)}</div></div><Button variant="secondary" className="mt-6 w-full" onClick={() => go("public")}>View Public Page</Button></div></div>; }

function PublicItem({ lost, go, notify }: { lost: boolean; go: (screen: Screen) => void; notify: (message: string) => void }) { return <div className="flex min-h-screen flex-col bg-background lg:min-h-[820px]"><header className="flex items-center justify-between border-b border-border bg-card px-5 py-4"><DaryeelLogo className="text-primary" markClassName="h-8 w-8" /><Badge><ShieldCheck />Verified item</Badge></header><div className="flex-1 px-5 py-6">{lost ? <div className="mb-5 rounded-2xl border border-warning/30 bg-warning-soft p-5 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-warning text-accent-foreground"><MapPin /></div><p className="mt-3 text-sm font-extrabold text-warning">LOST ITEM</p><h2 className="mt-2 text-xl font-extrabold">This item has been reported lost.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">If you found this item, please contact the owner.</p></div> : null}<img src={belongingsImage} width={1200} height={900} alt="Dell Latitude 5420" className="aspect-[4/3] w-full rounded-[22px] object-cover object-left-top shadow-soft" /><div className="py-6 text-center"><p className="text-xs font-bold uppercase text-primary">Personal belonging</p><h1 className="mt-2 text-2xl font-extrabold">Dell Latitude 5420</h1></div><div className="overflow-hidden rounded-2xl border border-border bg-card px-4"><InfoRows rows={[["Owner", "Ahmed Ali"], ["Contact", "+252 63 XXX XXX"]]} /></div><Button size="lg" className="mt-5 w-full" onClick={() => notify("Opening phone dialer preview")}><Phone />Contact Owner</Button>{!lost ? <Button size="lg" variant="outline" className="mt-3 w-full" onClick={() => go("lost")}><MapPin />I found this item</Button> : null}<div className="mt-5 flex gap-2 rounded-xl bg-info-soft p-3 text-xs leading-5 text-secondary-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Only information approved by the owner is shown here.</div></div><footer className="p-6 text-center text-xs text-muted-foreground">Protected by <span className="font-bold text-primary">Daryeel</span></footer></div>; }

function Notifications({ notify }: { notify: (message: string) => void }) { const data = [{ title: "Warranty expires in 7 days", text: "Dell Latitude 5420 needs your attention.", icon: Warranty, unread: true, tone: "gold" }, { title: "Your item was marked Lost", text: "Toyota Corolla public page is now updated.", icon: MapPin, unread: true, tone: "red" }, { title: "Warranty expires in 30 days", text: "Samsung refrigerator warranty is ending soon.", icon: CalendarDays, unread: false, tone: "gold" }, { title: "Car maintenance is due", text: "Scheduled maintenance is due this week.", icon: Car, unread: false, tone: "teal" }, { title: "QR settings were updated", text: "Your public information choices were saved.", icon: QrCode, unread: false, tone: "teal" }]; return <div className="animate-fade-up"><PageHeader title="Notifications" action={<Button variant="link" className="h-auto p-0 text-xs" onClick={() => notify("All notifications marked as read")}>Mark all as read</Button>} /><div className="space-y-3 px-5">{data.map(({ title, text, icon: Icon, unread, tone }) => <div key={title} className={`flex gap-3 rounded-2xl border p-4 ${unread ? "border-primary/20 bg-info-soft" : "border-border bg-card"}`}><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone === "gold" ? "bg-warning-soft text-warning" : tone === "red" ? "bg-destructive/10 text-destructive" : "bg-secondary text-primary"}`}><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-start gap-2"><h3 className="flex-1 text-sm font-bold">{title}</h3>{unread ? <span className="mt-1 h-2 w-2 rounded-full bg-primary" /> : null}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p><p className="mt-2 text-[10px] text-muted-foreground">Today</p></div></div>)}</div></div>; }

function Profile({ go }: { go: (screen: Screen) => void }) { const rows = [{ label: "Account", icon: UserRound }, { label: "Privacy", icon: ShieldCheck }, { label: "Notification Settings", icon: Bell }, { label: "QR Privacy", icon: QrCode }, { label: "Security", icon: KeyRound }, { label: "Help & Support", icon: CircleHelp }]; return <div className="animate-fade-up"><PageHeader title="Profile" /><div className="px-5"><div className="rounded-2xl bg-primary p-5 text-primary-foreground"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-primary-foreground text-xl font-extrabold text-primary">AA</div><div><h2 className="text-lg font-extrabold">Ahmed Ali</h2><p className="mt-1 text-xs text-primary-foreground/80">+252 63 000 0000</p><p className="mt-1 text-xs text-primary-foreground/80">ahmed@example.com</p></div></div></div><div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">{rows.map(({ label, icon: Icon }, index) => <Button key={label} variant="ghost" className={`h-14 w-full justify-start rounded-none px-4 ${index ? "border-t border-border" : ""}`}><span className="grid h-8 w-8 place-items-center rounded-lg bg-info-soft text-primary"><Icon className="h-4 w-4" /></span><span className="flex-1 text-left">{label}</span><ChevronRight className="text-muted-foreground" /></Button>)}</div><Button variant="ghost" className="mt-4 w-full justify-start text-destructive" onClick={() => go("welcome")}><LogOut />Logout</Button></div></div>; }

function EmptyStates({ go }: { go: (screen: Screen) => void }) { return <div className="min-h-screen px-5 py-6 lg:min-h-[820px]"><TopBack title="Empty States" go={go} /><div className="mt-12 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-primary"><PackageOpen className="h-9 w-9" /></div><h2 className="mt-5 text-xl font-extrabold">No Items Yet</h2><p className="mt-2 text-sm text-muted-foreground">You haven't added any belongings yet.</p><Button className="mt-5" onClick={() => go("add")}><Plus />Add Your First Item</Button></div><div className="my-12 h-px bg-border" /><div className="text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-subtle text-muted-foreground"><Bell className="h-9 w-9" /></div><h2 className="mt-5 text-xl font-extrabold">No Notifications</h2><p className="mt-2 text-sm text-muted-foreground">You're all caught up.</p></div></div>; }