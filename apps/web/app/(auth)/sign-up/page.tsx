"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ScanLine,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useSignUp, useUserInfo } from "~/hooks/api/auth";

export default function SignUpPage() {
  const router = useRouter();
  const { createUserWithEmailAndPasswordAsync, error, status } = useSignUp();
  const { user } = useUserInfo();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [router, user]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "pending") return;
    try {
      await createUserWithEmailAndPasswordAsync({
        email: formValues.email,
        fullName: formValues.name,
        password: formValues.password,
      });
      router.replace("/sign-in");
    } catch {
      /* The mutation error is displayed in the form. */
    }
  };

  const isSubmitting = status === "pending";

  const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <AuthCard>
      <div className="mb-7">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Create your PollIq workspace
        </h2>
        <p className="mt-2.5 text-sm leading-6 text-slate-400">
          Build a form that feels like you. Collect answers that move your ideas forward.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm font-medium text-red-200"
          >
            <span className="mt-0.5 size-4 shrink-0 rounded-full bg-red-500/20 text-center text-xs leading-4">
              !
            </span>
            {error.message}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">Full name</span>
          <span className="relative block">
            <UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-slate-600 focus:border-[#EC4899]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#EC4899]/10"
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              onChange={handleChange}
              placeholder="Your full name"
              type="text"
              value={formValues.name}
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">Email address</span>
          <span className="relative block">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-slate-600 focus:border-[#22D3EE]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#22D3EE]/10"
              name="email"
              required
              autoComplete="email"
              onChange={handleChange}
              placeholder="you@company.com"
              type="email"
              value={formValues.email}
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">Password</span>
          <span className="relative block">
            <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] pl-11 pr-12 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-slate-600 focus:border-[#8B5CF6]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#8B5CF6]/12"
              name="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              onChange={handleChange}
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
          {formValues.password.length > 0 && (
            <div className="mt-2.5">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              {passwordStrength > 0 && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Password strength:{" "}
                  <span
                    className={`font-semibold ${
                      passwordStrength === 4
                        ? "text-emerald-400"
                        : passwordStrength >= 3
                          ? "text-yellow-400"
                          : "text-orange-400"
                    }`}
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </p>
              )}
            </div>
          )}
        </label>

        <button
          disabled={isSubmitting}
          className="btn-ripple group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white font-black text-[#050816] shadow-[0_0_42px_rgba(139,92,246,0.38)] transition hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(34,211,238,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              Creating account...
            </span>
          ) : (
            <>
              Create account
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
        <span>Already have an account?</span>
        <Link className="font-bold text-[#EC4899] transition hover:text-white" href="/sign-in">
          Sign in →
        </Link>
      </div>

      <SecurityNote />
    </AuthCard>
  );
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_0_100px_rgba(139,92,246,0.22)] backdrop-blur-2xl xl:p-8">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#8B5CF6]/18 via-[#22D3EE]/10 to-transparent blur-2xl" />
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_32%,rgba(255,255,255,0.03))]" />

      <div className="relative">
        <CardHeader />
        {children}
      </div>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="mb-7 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LogoMark />
        <div>
          <p className="text-xs text-slate-500">Join</p>
          <p className="text-xl font-black">PollIq</p>
        </div>
      </div>
      <div className="grid size-10 place-items-center rounded-xl border border-[#EC4899]/20 bg-[#EC4899]/[0.08] text-pink-200">
        <ScanLine className="size-5" />
      </div>
    </div>
  );
}

function SecurityNote() {
  return (
    <div className="mt-5 flex items-start gap-2.5 text-xs leading-5 text-slate-600">
      <Check className="mt-0.5 size-3.5 shrink-0 text-[#22D3EE]" />
      <span>Sign in with your email and password to access your forms.</span>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative grid size-10 place-items-center rounded-xl border border-white/12 bg-white/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.22)] backdrop-blur-xl">
      <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] opacity-80 blur-sm" />
      <Sparkles className="relative size-4 text-white" />
    </div>
  );
}
