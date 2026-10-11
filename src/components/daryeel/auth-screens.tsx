import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Info,
  LockKeyhole,
  Mail,
  MailCheck,
  Phone,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DaryeelLogo } from "@/components/daryeel-logo";
import belongingsImage from "@/assets/daryeel-belongings.jpg";
import { useDaryeel } from "@/lib/daryeel-store";
import { FormField, Notice } from "./ui-kit";

export function Splash() {
  const { go } = useDaryeel();
  return (
    <button
      type="button"
      aria-label="Continue to welcome screen"
      onClick={() => go("welcome")}
      className="flex min-h-screen w-full cursor-pointer flex-col items-center justify-center bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary-foreground/60 lg:min-h-[820px]"
    >
      <DaryeelLogo
        showWordmark={false}
        inverse
        className="text-primary-foreground"
        markClassName="h-20 w-20"
      />
      <span className="mt-5 text-2xl font-semibold tracking-[0.2em]">DARYEEL</span>
      <span className="mt-2 text-sm text-primary-foreground/85">
        Your belongings, always connected.
      </span>
      <span className="mt-12 text-xs text-primary-foreground/70">Tap to continue</span>
    </button>
  );
}

export function Welcome() {
  const { go } = useDaryeel();
  return (
    <div className="flex min-h-screen flex-col bg-card px-6 py-6 lg:min-h-[820px]">
      <DaryeelLogo className="text-primary" markClassName="h-8 w-8" />
      <div className="my-auto py-8">
        <img
          src={belongingsImage}
          width={1200}
          height={900}
          alt="Personal belongings connected through Daryeel"
          className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
        />
        <h2 className="mt-8 type-display">Take care of what you own.</h2>
        <p className="mt-3 type-body text-muted-foreground">
          Manage your belongings, create digital identities, and stay connected to your items.
        </p>
      </div>
      <div className="space-y-3">
        <Button className="w-full" size="lg" onClick={() => go("signup")}>
          Get started <ChevronRight />
        </Button>
        <Button className="w-full" size="lg" variant="outline" onClick={() => go("login")}>
          I already have an account
        </Button>
      </div>
    </div>
  );
}

const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneLike = /^[+0-9][0-9\s-]{6,}$/;

const PROTOTYPE_NOTE = "Prototype: accounts aren't connected yet, so nothing is created or sent.";

function AuthLayout({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-card px-6 pb-8 pt-4 lg:min-h-[820px]">
      <Button variant="ghost" size="icon" className="-ml-2" aria-label="Go back" onClick={onBack}>
        <ArrowLeft />
      </Button>
      <div className="mx-auto max-w-sm">
        <DaryeelLogo className="mt-4 text-primary" markClassName="h-8 w-8" />
        <h2 className="mt-8 type-title">{title}</h2>
        <p className="mt-1.5 type-body text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

export function AuthScreen({ mode }: { mode: "signup" | "login" }) {
  const { go } = useDaryeel();
  const signup = mode === "signup";
  const [values, setValues] = useState({
    name: "",
    phone: "",
    identifier: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const set = (key: keyof typeof values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof typeof values, string>> = {};
    if (signup) {
      if (values.name.trim().length < 2) next.name = "Enter your full name.";
      if (!phoneLike.test(values.phone.trim())) next.phone = "Enter a valid phone number.";
      if (!emailLike.test(values.identifier.trim()))
        next.identifier = "Enter a valid email address.";
      if (values.password.length < 6) next.password = "Use at least 6 characters.";
      if (values.confirm !== values.password) next.confirm = "Passwords do not match.";
    } else {
      const id = values.identifier.trim();
      if (!emailLike.test(id) && !phoneLike.test(id))
        next.identifier = "Enter your email or phone number.";
      if (values.password.length < 6) next.password = "Enter your password.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    toast("Continuing in preview mode.", { description: "No account was created or checked." });
    go("home");
  };

  return (
    <AuthLayout
      title={signup ? "Create your account" : "Welcome back"}
      subtitle={
        signup
          ? "Start caring for the things that matter to you."
          : "Sign in to manage your belongings."
      }
      onBack={() => go("welcome")}
    >
      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        {signup ? (
          <FormField
            label="Full name"
            required
            value={values.name}
            onChange={set("name")}
            placeholder="Ahmed Ali"
            icon={<UserRound />}
            error={errors.name}
            autoComplete="name"
          />
        ) : null}
        {signup ? (
          <FormField
            label="Phone number"
            required
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="+252 63 000 0000"
            icon={<Phone />}
            error={errors.phone}
            autoComplete="tel"
          />
        ) : null}
        <FormField
          label={signup ? "Email" : "Email or phone"}
          required
          type={signup ? "email" : "text"}
          value={values.identifier}
          onChange={set("identifier")}
          placeholder={signup ? "ahmed@example.com" : "Email or phone number"}
          icon={<Mail />}
          error={errors.identifier}
          autoComplete={signup ? "email" : "username"}
        />
        <FormField
          label="Password"
          required
          type="password"
          value={values.password}
          onChange={set("password")}
          placeholder={signup ? "Create a password" : "Enter your password"}
          icon={<LockKeyhole />}
          error={errors.password}
          hint={signup ? "At least 6 characters." : undefined}
          autoComplete={signup ? "new-password" : "current-password"}
        />
        {signup ? (
          <FormField
            label="Confirm password"
            required
            type="password"
            value={values.confirm}
            onChange={set("confirm")}
            placeholder="Re-enter your password"
            icon={<LockKeyhole />}
            error={errors.confirm}
            autoComplete="new-password"
          />
        ) : (
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[13px]"
              onClick={() => go("forgot")}
            >
              Forgot password?
            </Button>
          </div>
        )}
        <Button type="submit" className="w-full" size="lg">
          {signup ? "Create account" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center type-caption text-muted-foreground">
        {signup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-[13px]"
          onClick={() => go(signup ? "login" : "signup")}
        >
          {signup ? "Sign in" : "Create one"}
        </Button>
      </p>
      <div className="mt-8">
        <Notice tone="neutral" icon={<Info />}>
          {PROTOTYPE_NOTE}
        </Notice>
      </div>
    </AuthLayout>
  );
}

export function ForgotPassword() {
  const { go } = useDaryeel();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailLike.test(value.trim()) && !phoneLike.test(value.trim())) {
      setError("Enter the email or phone on your account.");
      return;
    }
    setError(undefined);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout
        title="Reset requested"
        subtitle="Here's what would happen next."
        onBack={() => setSent(false)}
      >
        <div className="mt-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
            <MailCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mx-auto mt-4 max-w-xs type-body text-muted-foreground">
            Once accounts are connected, reset instructions will be sent to{" "}
            <span className="font-medium break-all text-foreground">{value}</span>.
          </p>
          <div className="mt-6 text-left">
            <Notice tone="neutral" icon={<Info />}>
              No email or SMS was sent — password reset isn't connected yet.
            </Notice>
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={() => go("login")}>
            Back to sign in
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email or phone number and we'll send reset instructions."
      onBack={() => go("login")}
    >
      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        <FormField
          label="Email or phone"
          required
          value={value}
          onChange={(next) => {
            setValue(next);
            if (error) setError(undefined);
          }}
          placeholder="ahmed@example.com"
          icon={<Mail />}
          error={error}
          autoComplete="username"
        />
        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
