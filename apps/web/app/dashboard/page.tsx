"use client";

import {
  BarChart3,
  Bell,
  Bot,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  Plus,
  Settings,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useUserInfo } from "~/hooks/api/auth";

const stats = [
  { label: "Active polls", value: "12", delta: "+3 this week", icon: ClipboardList },
  { label: "Responses", value: "8.4K", delta: "+18.2%", icon: MessageSquareText },
  { label: "Completion", value: "76%", delta: "+7.1%", icon: BarChart3 },
  { label: "Audience", value: "3.2K", delta: "+420 new", icon: Users },
];

const recentPolls = [
  ["Product feedback pulse", "2,184 responses", 82],
  ["Creator community survey", "1,422 responses", 74],
  ["Event RSVP experience", "936 responses", 68],
];

const insights = [
  "AI found a 14% drop-off around question 4.",
  "Gaming theme polls are converting best this week.",
  "Mobile responses peak between 7 PM and 10 PM.",
];

export default function DashboardPage() {
  const router = useRouter();
  const { error, isLoading, user } = useUserInfo();

  useEffect(() => {
    if (error) {
      router.replace("/sign-in");
    }
  }, [error, router]);

  if (isLoading || (!user && !error)) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-semibold text-slate-200">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  if (!user) {
    return <h2>User not found</h2>;
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(236,72,153,0.16),transparent_32%),linear-gradient(180deg,#050816,#070916_62%,#050816)]" />
        <div className="PollIq-grid absolute inset-0 opacity-[0.12]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 px-5 py-6 lg:block">
          <Link className="mb-9 flex items-center gap-3" href="/">
            <LogoMark />
            <span className="text-xl font-black">PollIq</span>
          </Link>

          <nav className="space-y-1.5">
            <NavItem active icon={LayoutDashboard} label="Dashboard" />
            <NavItem icon={ClipboardList} label="Polls" />
            <NavItem icon={LineChart} label="Analytics" />
            <NavItem icon={Bot} label="AI Studio" />
            <NavItem icon={Settings} label="Settings" />
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
            <div>
              <p className="text-sm font-semibold text-cyan-200">Dashboard</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Welcome back, {user.fullName}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button className="hidden bg-white text-[#050816] hover:bg-cyan-100 sm:inline-flex">
                <FilePlus2 className="size-4" />
                New poll
              </Button>
              <Button size="icon" variant="outline" className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10">
                <Bell className="size-4" />
              </Button>
            </div>
          </header>

          <div className="space-y-6 px-5 py-6 sm:px-8">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
                  <div className="flex items-center justify-between">
                    <stat.icon className="size-5 text-cyan-200" />
                    <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                      {stat.delta}
                    </Badge>
                  </div>
                  <p className="mt-5 text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-1 text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black">Recent polls</h2>
                    <p className="mt-1 text-sm text-slate-400">Track your strongest live experiences.</p>
                  </div>
                  <Button size="sm" className="bg-white text-[#050816] hover:bg-cyan-100">
                    <Plus className="size-4" />
                    Create
                  </Button>
                </div>

                <div className="mt-5 space-y-4">
                  {recentPolls.map(([name, responses, progress]) => (
                    <div key={name} className="rounded-lg border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold">{name}</p>
                          <p className="mt-1 text-sm text-slate-400">{responses}</p>
                        </div>
                        <span className="text-sm font-black text-cyan-100">{progress}%</span>
                      </div>
                      <Progress className="mt-4 h-2 bg-white/10" value={Number(progress)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg border border-fuchsia-300/20 bg-fuchsia-400/10">
                    <Sparkles className="size-5 text-fuchsia-100" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">AI insights</h2>
                    <p className="text-sm text-slate-400">Signals worth acting on.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {insights.map((insight) => (
                    <div key={insight} className="flex gap-3 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-200">
                      <Zap className="mt-1 size-4 shrink-0 text-cyan-200" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function NavItem({
  active = false,
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <button
      className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
        active
          ? "bg-white text-[#050816]"
          : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
      }`}
      type="button"
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function LogoMark() {
  return (
    <div className="relative grid size-10 place-items-center rounded-lg border border-white/14 bg-white/[0.07] shadow-[0_0_34px_rgba(139,92,246,0.24)]">
      <div className="absolute inset-1 rounded-md bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] opacity-80 blur-sm" />
      <Sparkles className="relative size-5 text-white" />
    </div>
  );
}
