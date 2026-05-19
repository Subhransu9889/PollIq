import {
  ArrowRight,
  Check,
  Chrome,
  Github,
  LockKeyhole,
  Mail,
  ScanLine,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <AuthCard>
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Sign in to your workspace
        </h2>
        <p className="mt-2.5 text-sm leading-6 text-slate-400">
          Continue building immersive forms, workflows, and launch-ready insights.
        </p>
      </div>

      <SocialButtons />

      <Divider />

      <form className="space-y-3.5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">Email</span>
          <span className="relative block">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-11 w-full rounded-lg border border-white/12 bg-black/25 pl-11 pr-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-slate-600 focus:border-[#22D3EE]/55 focus:ring-4 focus:ring-[#22D3EE]/10 sm:h-12"
              placeholder="you@company.com"
              type="email"
            />
          </span>
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Password</span>
            <Link
              className="text-sm font-semibold text-cyan-200 transition hover:text-white"
              href="#"
            >
              Forgot?
            </Link>
          </div>
          <span className="relative block">
            <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-11 w-full rounded-lg border border-white/12 bg-black/25 pl-11 pr-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition placeholder:text-slate-600 focus:border-[#8B5CF6]/60 focus:ring-4 focus:ring-[#8B5CF6]/12 sm:h-12"
              placeholder="Enter your password"
              type="password"
            />
          </span>
        </label>

        <button
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white font-black text-[#050816] shadow-[0_0_42px_rgba(139,92,246,0.46)] transition hover:scale-[1.01] hover:shadow-[0_0_64px_rgba(34,211,238,0.5)] sm:h-12"
          type="button"
        >
          Login
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/18 px-4 py-3 text-sm text-slate-400">
        <span>New to PollIq?</span>
        <Link className="font-bold text-[#EC4899] transition hover:text-white" href="/sign-up">
          Create account
        </Link>
      </div>

      <SecurityNote />
    </AuthCard>
  );
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.07] p-5 shadow-[0_0_100px_rgba(139,92,246,0.24)] backdrop-blur-2xl sm:p-6 xl:p-7">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-[#8B5CF6]/24 via-[#22D3EE]/18 to-[#EC4899]/24 blur-2xl" />
      <div className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_32%,rgba(255,255,255,0.04))]" />

      <div className="relative">
        <CardHeader />
        {children}
      </div>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LogoMark />
        <div>
          <p className="text-sm text-slate-400">Welcome to</p>
          <p className="text-xl font-black">PollIq</p>
        </div>
      </div>
      <div className="grid size-10 place-items-center rounded-lg border border-[#22D3EE]/25 bg-[#22D3EE]/10 text-cyan-100">
        <ScanLine className="size-5" />
      </div>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.055] text-sm font-semibold text-slate-100 transition hover:border-[#22D3EE]/45 hover:bg-white/[0.09] sm:h-11">
        <Chrome className="size-4" />
        Google
      </button>
      <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.055] text-sm font-semibold text-slate-100 transition hover:border-[#8B5CF6]/55 hover:bg-white/[0.09] sm:h-11">
        <Github className="size-4" />
        GitHub
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-xs font-semibold uppercase text-slate-500">or use email</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function SecurityNote() {
  return (
    <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
      <Check className="mt-0.5 size-4 shrink-0 text-[#22D3EE]" />
      <span>Secured with encrypted sessions and adaptive risk checks.</span>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative grid size-11 place-items-center rounded-lg border border-white/14 bg-white/[0.07] shadow-[0_0_34px_rgba(139,92,246,0.24)] backdrop-blur-xl">
      <div className="absolute inset-1 rounded-md bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] opacity-80 blur-sm" />
      <Sparkles className="relative size-5 text-white" />
    </div>
  );
}
