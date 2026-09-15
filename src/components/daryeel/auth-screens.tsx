import { useState } from "react";
import { ArrowLeft, ChevronRight, LockKeyhole, Mail, MailCheck, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DaryeelLogo } from "@/components/daryeel-logo";
import belongingsImage from "@/assets/daryeel-belongings.jpg";
import { useDaryeel } from "@/lib/daryeel-store";
import { FormField } from "./ui-kit";

export function Splash() {
  const { go } = useDaryeel();
  return (
    <button
      aria-label="Continue to welcome screen"
      onClick={() => go("welcome")}
      className="flex min-h-screen w-full cursor-pointer flex-col items-center justify-center bg-primary text-primary-foreground lg:min-h-[820px]"
    >
      <DaryeelLogo showWordmark={false} inverse className="animate-logo-breathe" markClassName="h-24 w-24" />
      <p className="mt-5 font-display text-3xl font-extrabold">DARYEEL</p>
      <p className="mt-3 text-sm text-primary-foreground/80">Your belongings, always connected.</p>
    </button>
  );
}

export function Welcome() {
  const { go } = useDaryeel();
  return (
    <div className="flex min-h-screen flex-col px-6 py-6 lg:min-h-[820px]">
      <DaryeelLogo className="text-primary" />
      <div className="my-auto py-7">
        <img
          src={belongingsImage}
          width={1200}
          height={900}
          alt="Personal belongings connected through Daryeel"
          className="aspect-[4/3] w-full rounded-[24px] object-cover"
        />
        <h2 className="mt-7 text-3xl font-extrabold leading-tight">Take care of what you own.</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Manage your belongings, create digital identities, and stay connected to your items.
        </p>
      </div>
      <div className="space-y-3">
        <Button className="w-full" size="lg" onClick={() => go("signup")}>
          Get Started <ChevronRight />
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

export function AuthScreen({ mode }: { mode: "signup" | "login" }) {
  const { go } = useDaryeel();
  const signup = mode === "signup";
  const [values, setValues] = useState({ name: "", phone: "", identifier: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (key: keyof typeof values) => (value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (signup) {
      if (values.name.trim().length < 2) next.name = "Enter your full name.";
      if (!phoneLike.test(values.phone.trim())) next.phone = "Enter a valid phone number.";
      if (!emailLike.test(values.identifier.trim())) next.identifier = "Enter a valid email address.";
      if (values.password.length < 6) next.password = "Use at least 6 characters.";
      if (values.confirm !== values.password) next.confirm = "Passwords do not match.";
    } else {
      const id = values.identifier.trim();
      if (!emailLike.test(id) && !phoneLike.test(id)) next.identifier = "Enter your email or phone number.";
      if (values.password.length < 6) next.password = "Enter your password.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    toast.success(signup ? "Account created." : "Welcome back, Ahmed.");
    go("home");
  };

  return (
    <div className="min-h-screen px-6 py-6 lg:min-h-[820px]">
      <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => go("welcome")}>
        <ArrowLeft />
      </Button>
      <DaryeelLogo className="mt-5 text-primary" />
      <h2 className="mt-8 text-3xl font-extrabold">{signup ? "Create your account" : "Welcome back"}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {signup ? "Start caring for the things that matter to you." : "Sign in to manage your belongings."}
      </p>
      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        {signup ? (
          <FormField label="Full Name" required value={values.name} onChange={set("name")} placeholder="Ahmed Ali" icon={<UserRound />} error={errors.name} />
        ) : null}
        {signup ? (
          <FormField label="Phone Number" required value={values.phone} onChange={set("phone")} placeholder="+252 63 000 0000" icon={<Phone />} error={errors.phone} />
        ) : null}
        <FormField
          label={signup ? "Email" : "Email or Phone"}
          required
          value={values.identifier}
          onChange={set("identifier")}
          placeholder={signup ? "ahmed@example.com" : "Email or phone number"}
          icon={<Mail />}
          error={errors.identifier}
        />
        <FormField
          label="Password"
          required
          type="password"
          value={values.password}
          onChange={set("password")}
          placeholder="Enter your password"
          icon={<LockKeyhole />}
          error={errors.password}
        />
        {signup ? (
          <FormField
            label="Confirm Password"
            required
            type="password"
            value={values.confirm}
            onChange={set("confirm")}
            placeholder="Re-enter your password"
            icon={<LockKeyhole />}
            error={errors.confirm}
          />
        ) : (
          <div className="text-right">
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => go("forgot")}>
              Forgot Password?
            </Button>
          </div>
        )}
        <Button type="submit" className="mt-3 w-full" size="lg">
          {signup ? "Create Account" : "Sign In"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {signup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button variant="link" className="h-auto p-0" onClick={() => go(signup ? "login" : "signup")}>
          {signup ? "Sign In" : "Create one"}
        </Button>
      </p>
    </div>
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
    toast.success("Reset instructions sent.");
  };

  return (
    <div className="min-h-screen px-6 py-6 lg:min-h-[820px]">
      <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => go("login")}>
        <ArrowLeft />
      </Button>
      <DaryeelLogo className="mt-5 text-primary" />
      {sent ? (
        <div className="mt-16 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-primary">
            <MailCheck className="h-9 w-9" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold">Check your inbox</h2>
          <p className="mx-auto mt-2 max-w-[19rem] text-sm leading-6 text-muted-foreground">
            We sent password reset instructions to <span className="font-semibold text-foreground">{value}</span>.
          </p>
          <Button className="mt-6 w-full" size="lg" onClick={() => go("login")}>
            Back to Sign In
          </Button>
        </div>
      ) : (
        <>
          <h2 className="mt-8 text-3xl font-extrabold">Forgot password?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter your email or phone number and we will send reset instructions.
          </p>
          <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
            <FormField label="Email or Phone" required value={value} onChange={setValue} placeholder="ahmed@example.com" icon={<Mail />} error={error} />
            <Button type="submit" className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
