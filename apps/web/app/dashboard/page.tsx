"use client";

import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ClipboardList,
  Command,
  Compass,
  Eye,
  FilePlus2,
  Flame,
  Gauge,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Mail,
  MessageSquareText,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wand2,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useUserInfo } from "~/hooks/api/auth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Forms", icon: ClipboardList },
  { label: "Explore", icon: Compass },
  { label: "Themes", icon: Palette },
  { label: "Analytics", icon: LineChart },
  { label: "Responses", icon: MessageSquareText },
  { label: "Automations", icon: Workflow },
  { label: "API Docs", icon: BookOpen },
  { label: "Settings", icon: Settings },
];

const heroActions = [
  {
    title: "Create New Experience",
    label: "Create Form",
    icon: Sparkles,
    gradient: "from-cyan-300 via-fuchsia-400 to-violet-500",
    shadow: "group-hover:shadow-cyan-500/20",
  },
  {
    title: "Explore Themes",
    label: "Browse Themes",
    icon: Palette,
    gradient: "from-pink-300 via-rose-400 to-orange-300",
    shadow: "group-hover:shadow-fuchsia-500/20",
  },
  {
    title: "View Insights",
    label: "Analytics",
    icon: BarChart3,
    gradient: "from-emerald-300 via-cyan-300 to-blue-400",
    shadow: "group-hover:shadow-emerald-500/20",
  },
];

const quickStats = [
  { label: "Total Views", value: "24.6K", delta: "+12%", icon: Eye, spark: [28, 44, 34, 62, 54, 78, 70] },
  { label: "Responses", value: "1,420", delta: "+9%", icon: MessageSquareText, spark: [36, 30, 48, 42, 64, 58, 82] },
  { label: "Completion Rate", value: "68%", delta: "+6%", icon: Gauge, spark: [52, 42, 55, 50, 62, 74, 68] },
  { label: "Active Forms", value: "12", delta: "+3", icon: ClipboardList, spark: [24, 38, 34, 46, 58, 52, 66] },
];

const recentForms = [
  {
    name: "Anime Convention Form",
    views: "2.4K views",
    responses: "509 responses",
    completion: 67,
    theme: "Anime Sakura",
    gradient: "from-pink-400 via-rose-300 to-fuchsia-500",
  },
  {
    name: "Gaming Tournament Signup",
    views: "3.1K views",
    responses: "842 responses",
    completion: 74,
    theme: "Gaming",
    gradient: "from-violet-500 via-cyan-400 to-emerald-300",
  },
  {
    name: "Startup Pitch Form",
    views: "1.8K views",
    responses: "312 responses",
    completion: 61,
    theme: "Cyberpunk",
    gradient: "from-cyan-300 via-indigo-500 to-fuchsia-500",
  },
];

const activityFeed = [
  ["Someone from Tokyo submitted Anime Form", "2m ago", Globe2],
  ["Startup Pitch form reached 1k responses", "18m ago", TrendingUp],
  ["New user cloned your Cyberpunk template", "42m ago", Users],
  ["AI improved question 5 copy", "1h ago", Wand2],
] satisfies Array<[string, string, LucideIcon]>;

const themes = [
  { name: "Anime Sakura", icon: "🌸", gradient: "from-pink-300 via-rose-300 to-fuchsia-400" },
  { name: "Cyberpunk", icon: "⚡", gradient: "from-cyan-300 via-violet-500 to-fuchsia-500" },
  { name: "Hacker Terminal", icon: "🖥", gradient: "from-emerald-300 via-cyan-300 to-slate-900" },
  { name: "Space Mission", icon: "🚀", gradient: "from-blue-300 via-indigo-500 to-violet-500" },
];

const insights = [
  { label: "Drop-off Analysis", value: "Most users quit at Question 5", icon: Activity },
  { label: "Best Performing Form", value: "Gaming Tournament Signup", icon: Star },
  { label: "Fastest Growing Template", value: "Cyberpunk Application Form", icon: Flame },
];

const builderBlocks = [
  ["Text", Mail],
  ["Email", KeyRound],
  ["Select", ChevronRight],
  ["Rating", Star],
  ["Date", Activity],
  ["Checkbox", ClipboardList],
] satisfies Array<[string, LucideIcon]>;

export default function DashboardPage() {
  const router = useRouter();
  const { error, isLoading, user } = useUserInfo();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const displayName = user?.fullName?.split(" ")[0] ?? "Subransu";

  useEffect(() => {
    if (error) {
      router.replace("/sign-in");
    }
  }, [error, router]);

  if (isLoading || (!user && !error)) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#040713] px-6 text-white">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-semibold text-slate-200 shadow-[0_0_80px_rgba(34,211,238,0.14)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          Loading your dashboard...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#040713] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_86%_6%,rgba(236,72,153,0.15),transparent_28%),radial-gradient(circle_at_72%_80%,rgba(16,185,129,0.10),transparent_30%),linear-gradient(180deg,#040713,#090b17_56%,#040713)]" />
        <div className="PollIq-grid absolute inset-0 opacity-[0.13]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] gap-4 p-3 sm:p-4">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((current) => !current)} />

        <section className="min-w-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-cyan-200">Good evening, {displayName} 👋🏻</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">
                Build forms people actually enjoy filling.
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 text-sm font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-white md:flex">
                <Command className="size-4" />
                <span>K</span>
              </button>
              <Button className="bg-white text-[#050816] hover:bg-cyan-100">
                <FilePlus2 className="size-4" />
                New form
              </Button>
              <Button size="icon" variant="outline" className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10">
                <Bell className="size-4" />
              </Button>
            </div>
          </header>

          <div className="space-y-6 px-4 py-5 sm:px-6">
            <section className="grid gap-4 xl:grid-cols-3">
              {heroActions.map((action) => (
                <HeroAction key={action.title} {...action} />
              ))}
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <RecentForms />
              <div className="grid gap-6">
                <ActivityFeed />
                <ThemeGallery />
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
              <PerformanceInsights />
              <BuilderPreview />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside
      className={`hidden shrink-0 rounded-lg border border-white/10 bg-black/35 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-all duration-300 lg:block ${
        open ? "w-64" : "w-[78px]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <LogoMark />
          {open ? <span className="truncate text-xl font-black">PollIq</span> : null}
        </Link>
        <button
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
          onClick={onToggle}
          type="button"
        >
          {open ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </button>
      </div>

      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => (
          <NavItem key={item.label} open={open} {...item} />
        ))}
      </nav>

      <div className="mt-8 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan-300 text-[#050816]">
            <Bot className="size-4" />
          </div>
          {open ? (
            <div className="min-w-0">
              <p className="text-sm font-black">AI Theme Lab</p>
              <p className="mt-1 text-xs leading-5 text-cyan-100/75">Generate a cyberpunk anime signup form.</p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ active = false, icon: Icon, label, open }: { active?: boolean; icon: LucideIcon; label: string; open: boolean }) {
  return (
    <button
      className={`group flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
        active
          ? "bg-white text-[#050816] shadow-[0_0_34px_rgba(34,211,238,0.28)]"
          : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
      }`}
      title={label}
      type="button"
    >
      <Icon className={`size-4 shrink-0 ${active ? "text-[#050816]" : "group-hover:text-cyan-200"}`} />
      {open ? <span className="truncate">{label}</span> : null}
    </button>
  );
}

function HeroAction({ title, label, icon: Icon, gradient, shadow }: (typeof heroActions)[number]) {
  return (
    <button
      className={`group relative min-h-44 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 text-left shadow-[0_24px_90px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 ${shadow}`}
      type="button"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className={`absolute -right-16 -top-16 size-44 rounded-full bg-gradient-to-br ${gradient} opacity-25 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-40`} />
      <div className="absolute left-7 top-7 size-1.5 rounded-full bg-white/70 opacity-0 transition duration-300 group-hover:translate-x-8 group-hover:translate-y-5 group-hover:opacity-100" />
      <div className="absolute bottom-8 right-12 size-1 rounded-full bg-cyan-200 opacity-0 transition duration-500 group-hover:-translate-x-10 group-hover:-translate-y-6 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-center justify-between">
          <div className={`grid size-12 place-items-center rounded-lg bg-gradient-to-br ${gradient} text-[#050816] shadow-[0_0_34px_rgba(255,255,255,0.16)]`}>
            <Icon className="size-5" />
          </div>
          <ChevronRight className="size-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-400">{label}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">{title}</h2>
        </div>
      </div>
    </button>
  );
}

function StatCard({ label, value, delta, icon: Icon, spark }: (typeof quickStats)[number]) {
  return (
    <div className="group rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition hover:border-cyan-300/35 hover:bg-white/[0.075]">
      <div className="flex items-center justify-between gap-3">
        <div className="grid size-10 place-items-center rounded-lg border border-white/10 bg-black/25">
          <Icon className="size-5 text-cyan-200" />
        </div>
        <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">{delta}</Badge>
      </div>
      <p className="mt-4 text-sm text-slate-400">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-black">{value}</p>
        <SparkLine values={spark} />
      </div>
    </div>
  );
}

function SparkLine({ values }: { values: number[] }) {
  const points = values.map((value, index) => `${index * 14},${90 - value}`).join(" ");

  return (
    <svg aria-hidden="true" className="h-12 w-24 overflow-visible" viewBox="0 0 84 64">
      <polyline fill="none" points={points} stroke="rgba(34,211,238,0.24)" strokeWidth="8" />
      <polyline fill="none" points={points} stroke="#22D3EE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function RecentForms() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Recent Forms</h2>
          <p className="mt-1 text-sm text-slate-400">Immersive live previews, not a spreadsheet.</p>
        </div>
        <Button size="sm" className="bg-white text-[#050816] hover:bg-cyan-100">
          <Rocket className="size-4" />
          Publish
        </Button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {recentForms.map((form) => (
          <article key={form.name} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/24 p-3 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_0_60px_rgba(34,211,238,0.14)]">
            <div className={`relative h-32 overflow-hidden rounded-lg bg-gradient-to-br ${form.gradient}`}>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_30%,rgba(0,0,0,0.22))]" />
              <div className="absolute left-4 right-4 top-4 rounded-lg border border-white/30 bg-black/20 p-3 backdrop-blur-md">
                <div className="h-2 w-20 rounded-full bg-white/70" />
                <div className="mt-4 h-7 rounded-md border border-white/30 bg-white/15" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-5 rounded bg-white/20" />
                  <div className="h-5 rounded bg-white/35" />
                  <div className="h-5 rounded bg-white/20" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
            <div className="mt-4">
              <Badge className="border-white/10 bg-white/10 text-slate-100">{form.theme}</Badge>
              <h3 className="mt-3 min-h-12 text-lg font-black leading-6">{form.name}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                <span>{form.views}</span>
                <span>{form.responses}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-400">Completion</span>
                <span className="font-black text-cyan-100">{form.completion}%</span>
              </div>
              <Progress className="mt-2 h-2 bg-white/10" value={form.completion} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityFeed() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <h2 className="text-xl font-black">Live Activity</h2>
      <div className="mt-5 space-y-3">
        {activityFeed.map(([activity, time, Icon]) => (
          <div key={String(activity)} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/24 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-6 text-slate-100">{activity}</p>
              <p className="text-xs text-slate-500">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThemeGallery() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">Theme Gallery</h2>
        <Badge className="border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-100">Live</Badge>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <button key={theme.name} className={`min-h-24 rounded-lg border border-white/10 bg-gradient-to-br ${theme.gradient} p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition hover:-translate-y-1`} type="button">
            <span className="text-2xl">{theme.icon}</span>
            <p className="mt-3 text-sm font-black text-white drop-shadow">{theme.name}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function PerformanceInsights() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
          <Zap className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black">Performance Insights</h2>
          <p className="mt-1 text-sm text-slate-400">Signals judges can understand instantly.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <div key={insight.label} className="rounded-lg border border-white/10 bg-black/24 p-4">
            <div className="flex items-center gap-3">
              <insight.icon className="size-4 text-cyan-200" />
              <p className="text-sm font-bold text-slate-400">{insight.label}</p>
            </div>
            <p className="mt-2 font-black leading-6">{insight.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BuilderPreview() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Form Builder Preview</h2>
          <p className="mt-1 text-sm text-slate-400">Fields, live preview, and properties in one cinematic workspace.</p>
        </div>
        <div className="flex rounded-lg border border-white/10 bg-black/25 p-1">
          <button className="rounded-md bg-white px-3 py-1.5 text-xs font-black text-[#050816]" type="button">Desktop</button>
          <button className="px-3 py-1.5 text-xs font-black text-slate-400" type="button">Mobile</button>
        </div>
      </div>

      <div className="mt-5 grid min-h-[320px] gap-4 lg:grid-cols-[0.8fr_1.25fr_0.85fr]">
        <div className="rounded-lg border border-white/10 bg-black/25 p-3">
          <p className="text-sm font-black text-slate-300">Fields</p>
          <div className="mt-3 grid gap-2">
            {builderBlocks.map(([label, Icon]) => (
              <button key={String(label)} className="flex h-10 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-white" type="button">
                <Icon className="size-4 text-cyan-200" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-cyan-300/20 bg-gradient-to-br from-[#111827] via-[#1d1230] to-[#06131d] p-5">
          <div className="absolute inset-x-6 top-5 flex items-center justify-center">
            <div className="flex items-center gap-2 text-cyan-100">
              <span className="size-2 rounded-full bg-cyan-300" />
              <span className="h-px w-10 bg-cyan-300/40" />
              <span className="size-2 rounded-full bg-fuchsia-300" />
              <span className="h-px w-10 bg-white/20" />
              <span className="size-2 rounded-full bg-white/30" />
              <span className="h-px w-10 bg-white/20" />
              <span className="size-2 rounded-full bg-white/30" />
            </div>
          </div>
          <div className="mt-12 rounded-lg border border-white/15 bg-black/28 p-5 backdrop-blur-xl">
            <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-100">Question 1 of 4</Badge>
            <h3 className="mt-4 text-2xl font-black leading-tight">What kind of experience should your form feel like?</h3>
            <div className="mt-5 grid gap-3">
              {["Anime launch portal", "Cyberpunk application", "Startup feedback sprint"].map((option, index) => (
                <button key={option} className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition ${index === 1 ? "border-cyan-300 bg-cyan-300/15 text-white" : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/35"}`} type="button">
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/25 p-3">
          <p className="text-sm font-black text-slate-300">Properties</p>
          <div className="mt-4 space-y-3">
            {["Required", "Validation", "Placeholder", "Theme", "Logic"].map((setting) => (
              <div key={setting} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-bold text-slate-300">
                <span>{setting}</span>
                <span className="h-5 w-9 rounded-full bg-cyan-300/20 p-0.5">
                  <span className="block size-4 rounded-full bg-cyan-200" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoMark() {
  return (
    <div className="relative grid size-10 shrink-0 place-items-center rounded-lg border border-white/14 bg-white/[0.07] shadow-[0_0_34px_rgba(139,92,246,0.24)]">
      <div className="absolute inset-1 rounded-md bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] opacity-80 blur-sm" />
      <Sparkles className="relative size-5 text-white" />
    </div>
  );
}
