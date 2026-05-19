import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  BrainCircuit,
  Brush,
  Check,
  ChevronRight,
  Code2,
  Command,
  Gamepad2,
  Globe2,
  Layers3,
  LineChart,
  MousePointer2,
  Orbit,
  Palette,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  Wand2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ComponentType, ReactNode } from "react";

const logos = ["Google", "Discord", "Notion", "Vercel", "GitHub", "Microsoft"];
const footerLinks = {
  Product: ["Features", "Templates", "Themes", "Analytics", "API Docs"],
  Resources: ["Docs", "Blog", "Changelog", "Roadmap", "Community"],
  Socials: ["Twitter", "GitHub", "Discord", "LinkedIn"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const themes = [
  {
    name: "Cyberpunk",
    icon: Zap,
    palette: "from-[#8B5CF6] via-[#EC4899] to-[#22D3EE]",
    prompt: "Pick your launch mood.",
    answer: "Neon velocity",
    concept: "Hologram Card",
    variant: "hologram",
  },
  {
    name: "Anime Sakura",
    icon: Sparkles,
    palette: "from-[#EC4899] via-[#fb7185] to-[#f9a8d4]",
    prompt: "Choose your story arc.",
    answer: "Soft power",
    concept: "Dimension Portal",
    variant: "portal",
  },
  {
    name: "Hacker Terminal",
    icon: Terminal,
    palette: "from-[#22D3EE] via-[#10b981] to-[#8B5CF6]",
    prompt: "Authorize the mission.",
    answer: "./deploy",
    concept: "Terminal Execution",
    variant: "terminal",
  },
  {
    name: "Space Mission",
    icon: Orbit,
    palette: "from-[#22D3EE] via-[#6366f1] to-[#8B5CF6]",
    prompt: "Select your orbit.",
    answer: "Deep survey",
    concept: "Planetary Space",
    variant: "space",
  },
  {
    name: "Retro Windows XP",
    icon: Boxes,
    palette: "from-[#22D3EE] via-[#60a5fa] to-[#a3e635]",
    prompt: "What is your vibe?",
    answer: "Nostalgia.exe",
    concept: "VHS Retro Card",
    variant: "vhs",
  },
  {
    name: "Gaming Tournament",
    icon: Gamepad2,
    palette: "from-[#EC4899] via-[#f97316] to-[#8B5CF6]",
    prompt: "Lock in your role.",
    answer: "Duelist",
    concept: "Gaming Loadout",
    variant: "loadout",
  },
];

const fields = [
  { label: "AI question", icon: BrainCircuit },
  { label: "Opinion scale", icon: BarChart3 },
  { label: "Media choice", icon: Play },
  { label: "Logic jump", icon: GitBranchIcon },
];

const activity = [
  "Tokyo waitlist hit 91% completion",
  "New anime theme cloned 284 times",
  "AI rewrote 12 low-converting prompts",
  "Gaming survey trending in Explore",
];

const analyticsMetrics = [
  ["Responses", "48.2K", "+24%"],
  ["Conversion", "82.7%", "+11%"],
  ["Avg. time", "1m 14s", "-18%"],
  ["Drop-off risk", "7.4%", "-31%"],
];

const funnelStages = [
  ["Viewed", 100],
  ["Started", 86],
  ["Question 3", 72],
  ["Submitted", 58],
];

const segmentSignals = [
  ["Creators", 92, "#22D3EE"],
  ["Startups", 78, "#8B5CF6"],
  ["Communities", 66, "#EC4899"],
];

const aiInsights = [
  ["Question 2 causes hesitation", "Rewrite prompt tone"],
  ["Anime Sakura converts fastest", "Promote to top theme"],
  ["Mobile users prefer 3-step flow", "Shorten onboarding"],
];

const explore = [
  ["Anime", "Sakura polls, fan quizzes, creator drops", "from-[#EC4899] to-[#f9a8d4]"],
  ["Gaming", "Tournament signups and player feedback", "from-[#8B5CF6] to-[#f97316]"],
  ["Startups", "Waitlists, discovery, investor updates", "from-[#22D3EE] to-[#8B5CF6]"],
  ["Events", "RSVPs that feel like the main show", "from-[#f59e0b] to-[#EC4899]"],
  ["Tech", "Hackathon votes and beta research", "from-[#22D3EE] to-[#10b981]"],
  ["Communities", "Member onboarding with personality", "from-[#8B5CF6] to-[#EC4899]"],
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    copy: "Launch your first cinematic form.",
    features: ["3 active forms", "Theme gallery", "100 responses"],
  },
  {
    name: "Pro",
    price: "$19",
    copy: "For creators and teams shipping weekly.",
    features: ["Unlimited forms", "AI prompt studio", "Advanced analytics", "Custom domains"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    copy: "Control, scale, and white-glove support.",
    features: ["SSO and roles", "Private themes", "Data residency", "Dedicated success"],
  },
];

function GitBranchIcon(props: ComponentProps<typeof Code2>) {
  return <Code2 {...props} />;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02030a] text-white selection:bg-[#8B5CF6]/40">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="PollIq-mesh absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_18%_18%,rgba(139,92,246,0.20),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(236,72,153,0.16),transparent_30%),linear-gradient(180deg,rgba(2,3,10,0.20),#02030a_92%)]" />
        <div className="PollIq-grid absolute inset-0 opacity-[0.16]" />
        <div className="PollIq-particles absolute inset-0" />
      </div>

      <Header />
      <Hero />
      <TrustedBy />
      <Themes />
      <BuilderPreview />
      <Analytics />
      <ExploreForms />
      <Pricing />
      <FinalCta />
    </main>
  );
}

function Header() {
  return (
    <header className="site-header fixed left-0 right-0 top-0 z-50 px-5 pt-5 sm:px-8 lg:px-12">
      <nav className="site-header-shell relative mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-3 py-3.5">
        <a className="flex items-center gap-3 transition hover:opacity-85" href="#">
          <LogoOrb />
          <span className="text-lg font-black tracking-tight">
            Poll
            <span className="bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              IQ
            </span>
          </span>
        </a>

        <a
          className="group inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-4 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#22D3EE]/40 hover:bg-white/[0.075] hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
          href="/sign-up"
        >
          Let&apos;s Start
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </a>
      </nav>
    </header>
  );
}

function LogoOrb() {
  return (
    <span className="relative grid size-10 place-items-center overflow-hidden bg-transparent">
      <span className="absolute inset-0 bg-transparent blur-sm" />
      <Image
        src="/logo.png"
        alt="PollIQ logo"
        width={40}
        height={40}
        className="relative size-10 object-cover"
        priority
      />
    </span>
  );
}

function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen items-center px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.86fr]">
        <div className="max-w-4xl pt-16 lg:pt-0">
          <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.16)] backdrop-blur-xl">
            <Sparkles className="size-4 text-[#22D3EE]" />
            AI-native forms for creators, startups, and communities
          </div>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.96] sm:text-7xl lg:text-8xl">
            Forms that don&apos;t feel like forms.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Build immersive, interactive forms your audience actually enjoys filling.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pricing"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 font-semibold text-[#050816] shadow-[0_0_38px_rgba(139,92,246,0.5)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_58px_rgba(34,211,238,0.55)]"
            >
              <Rocket className="size-4" />
              Start Building
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#themes"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.06] px-5 font-semibold text-white backdrop-blur-xl transition duration-300 hover:border-[#22D3EE]/60 hover:bg-white/[0.10] hover:shadow-[0_0_34px_rgba(34,211,238,0.25)]"
            >
              <Palette className="size-4 text-[#EC4899]" />
              Explore Themes
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-sm text-slate-300">
            {["AI logic", "No-code motion", "Live analytics"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur"
              >
                <Check className="mb-2 size-4 text-[#22D3EE]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <FloatingIcon className="-left-5 top-16" icon={Command} />
          <FloatingIcon className="right-3 top-2" icon={Bot} delay="1.2s" />
          <FloatingIcon className="-right-4 bottom-24" icon={MousePointer2} delay="2s" />
          <FloatingIcon className="bottom-4 left-10" icon={Wand2} delay="0.5s" />
          <div className="PollIq-float relative rounded-lg border border-white/14 bg-white/[0.07] p-3 shadow-[0_0_90px_rgba(139,92,246,0.34)] backdrop-blur-2xl">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-[#8B5CF6]/60 via-transparent to-[#22D3EE]/60 opacity-60 blur-sm" />
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#050816]/90">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#EC4899]" />
                  <div className="size-2 rounded-full bg-[#facc15]" />
                  <div className="size-2 rounded-full bg-[#22D3EE]" />
                </div>
                <div className="text-xs text-slate-400">PollIq live</div>
              </div>
              <div className="relative px-6 py-8">
                <div className="absolute right-5 top-5 rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3 py-1 text-xs text-cyan-100">
                  Step 02 / 06
                </div>
                <div className="mb-8 mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="PollIq-progress h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#22D3EE]" />
                </div>
                <div className="PollIq-question min-h-[270px]">
                  <p className="mb-4 text-sm font-semibold text-[#22D3EE]">Question</p>
                  <h2 className="text-3xl font-black leading-tight">
                    What should your onboarding feel like?
                  </h2>
                  <div className="mt-7 grid gap-3">
                    {[
                      "A cinematic game lobby",
                      "A calm founder interview",
                      "A neon creator quiz",
                    ].map((answer, index) => (
                      <div
                        key={answer}
                        className="group rounded-lg border border-white/10 bg-white/[0.05] p-4 transition duration-300 hover:border-[#22D3EE]/60 hover:bg-[#22D3EE]/10"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-slate-200">{answer}</span>
                          <span className="grid size-7 place-items-center rounded-lg border border-white/10 text-xs text-slate-400 group-hover:border-[#22D3EE]/70 group-hover:text-cyan-100">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  return (
    <section className="relative z-10 border-y border-white/10 bg-white/[0.025] px-5 py-10 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-center text-xs font-semibold uppercase text-slate-500">
          Trusted by teams shaping the internet
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="rounded-lg border border-white/8 bg-white/[0.03] px-4 py-4 text-center text-sm font-bold text-slate-300 grayscale transition hover:border-white/18 hover:text-white"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Themes() {
  return (
    <section id="themes" className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <SectionHeader
        eyebrow="Interactive themes"
        title="Every form can feel like a world."
        copy="Launch polished, animated experiences for every audience without touching design tools."
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard key={theme.name} theme={theme} />
        ))}
      </div>
    </section>
  );
}

function ThemeCard({ theme }: { theme: (typeof themes)[number] }) {
  const Icon = theme.icon;

  return (
    <article className="theme-tilt group relative min-h-[380px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#22D3EE]/50 hover:shadow-[0_0_80px_rgba(139,92,246,0.25)]">
      <div
        className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-r ${theme.palette} opacity-25 blur-2xl transition group-hover:opacity-50`}
      />
      <div className="relative mb-5 flex items-center justify-between">
        <div className="grid size-11 place-items-center rounded-lg border border-white/14 bg-black/30">
          <Icon className="size-5 text-white" />
        </div>
        <span className="rounded-lg border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold uppercase text-slate-400">
          {theme.concept}
        </span>
      </div>
      <div className="relative h-[245px] overflow-hidden rounded-lg border border-white/12 bg-[#02030a]/70">
        <ThemeVisual theme={theme} />
      </div>
      <div className="relative mt-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black">{theme.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{theme.prompt}</p>
        </div>
        <div className="hidden min-w-24 rounded-lg border border-white/10 bg-black/20 p-2 text-xs text-slate-400 sm:block">
          <div className="mb-1 flex justify-between">
            <span>Energy</span>
            <span className="text-cyan-200">98</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10">
            <div className={`h-full w-[88%] rounded-full bg-gradient-to-r ${theme.palette}`} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ThemeVisual({ theme }: { theme: (typeof themes)[number] }) {
  if (theme.variant === "terminal") {
    return (
      <div className="theme-matrix relative h-full p-5 font-mono text-sm text-emerald-200">
        <div className="mb-4 flex items-center justify-between border-b border-emerald-400/20 pb-3 text-xs text-emerald-300/70">
          <span>root@PollIq</span>
          <span className="terminal-cursor">LIVE</span>
        </div>
        {[
          "> booting form...",
          "> loading questions...",
          "> encryption enabled...",
          "> audience connected...",
        ].map((line, index) => (
          <p
            key={line}
            className="terminal-line mb-3 overflow-hidden whitespace-nowrap"
            style={{ animationDelay: `${index * 0.35}s` }}
          >
            {line}
          </p>
        ))}
        <div className="absolute bottom-5 left-5 right-5 h-1 rounded-full bg-emerald-400/20">
          <div className="h-full w-4/5 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.8)]" />
        </div>
      </div>
    );
  }

  if (theme.variant === "space") {
    return (
      <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.22),transparent_25%),#02030a]">
        <div className="theme-stars absolute inset-0" />
        <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] shadow-[0_0_60px_rgba(34,211,238,0.42)]" />
        <div className="theme-orbit absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/30" />
        <div className="theme-orbit-slow absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/20" />
        <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur">
          ORBIT: DEEP SURVEY
        </div>
      </div>
    );
  }

  if (theme.variant === "vhs") {
    return (
      <div className="theme-vhs relative h-full bg-[linear-gradient(135deg,#28124a,#ec4899_48%,#22d3ee)] p-5">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_4px)] opacity-35" />
        <div className="relative flex justify-between font-mono text-xs font-bold text-white/85">
          <span>PLAY SP</span>
          <span>PM 11:20</span>
        </div>
        <div className="relative mt-8 rounded-lg border-2 border-white/60 bg-black/25 p-4 shadow-[8px_8px_0_rgba(139,92,246,0.55)]">
          <p className="text-xs font-black uppercase text-yellow-200">Limited Edition</p>
          <h4 className="mt-3 text-3xl font-black leading-none text-white">RETRO XP</h4>
          <p className="mt-3 font-mono text-xs text-white/80">TRACKING 08 • CH 03</p>
        </div>
        <div className="absolute bottom-5 right-5 rotate-[-8deg] rounded-md bg-yellow-200 px-3 py-1 font-mono text-xs font-black text-black">
          rewired
        </div>
      </div>
    );
  }

  if (theme.variant === "portal") {
    return (
      <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_48%,rgba(249,168,212,0.32),transparent_32%),linear-gradient(180deg,#13091d,#030712)] p-5">
        <div className="theme-petals absolute inset-0" />
        <div className="theme-portal absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-200/60 bg-[radial-gradient(circle,rgba(249,168,212,0.44),rgba(236,72,153,0.16)_45%,transparent_65%)] shadow-[0_0_80px_rgba(236,72,153,0.45)]" />
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 rounded-lg border border-white/12 bg-black/30 p-4 backdrop-blur-md">
          <p className="text-sm font-bold text-pink-100">What is your aura?</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <button className="rounded-lg border border-pink-200/30 bg-pink-200/10 px-3 py-2 text-pink-50 transition hover:bg-pink-200/20">
              Sakura
            </button>
            <button className="rounded-lg border border-cyan-200/30 bg-cyan-200/10 px-3 py-2 text-cyan-50 transition hover:bg-cyan-200/20">
              Storm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (theme.variant === "loadout") {
    return (
      <div className="relative h-full bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.28),transparent_35%),linear-gradient(135deg,#111827,#18051d)] p-5">
        <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        <div className="rounded-lg border border-white/12 bg-black/25 p-4">
          <p className="text-xs font-black uppercase text-orange-200">Legendary Theme</p>
          <h4 className="mt-3 text-3xl font-black">CYBER SURVEY</h4>
          <div className="mt-3 text-sm text-yellow-200">★★★★☆</div>
        </div>
        <div className="mt-4 grid gap-2 text-xs">
          {[
            ["Form Power", "98%"],
            ["Engagement", "S-TIER"],
            ["Speed", "87"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between rounded-lg bg-white/[0.06] px-3 py-2">
              <span className="text-slate-400">{label}</span>
              <span className="font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-hologram relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.24),transparent_30%),linear-gradient(180deg,#070816,#02030a)] p-5">
      <div className="theme-scanline absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-cyan-200/20 to-transparent" />
      <div className="absolute inset-5 rounded-lg border border-cyan-200/20 shadow-[0_0_44px_rgba(34,211,238,0.18),inset_0_0_30px_rgba(139,92,246,0.12)]" />
      <div className="relative grid h-full place-items-center text-center">
        <div>
          <div className="mx-auto mb-6 grid size-24 place-items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 shadow-[0_0_70px_rgba(34,211,238,0.38)]">
            <div className="size-12 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#22D3EE]" />
          </div>
          <p className="text-xs font-bold uppercase text-cyan-200">Enter Mission</p>
          <h4 className="mt-3 text-3xl font-black">CYBERPUNK</h4>
        </div>
      </div>
    </div>
  );
}

function BuilderPreview() {
  return (
    <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <SectionHeader
        eyebrow="Form builder preview"
        title="A next-generation creative tool."
        copy="Compose questions, tune motion, and preview the final mobile experience in one focused workspace."
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4 shadow-[0_0_100px_rgba(34,211,238,0.12)] backdrop-blur-2xl lg:grid-cols-[0.82fr_1.2fr_0.82fr]">
        <Panel title="Fields" icon={Layers3}>
          <div className="grid gap-3">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.label}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3"
                >
                  <div className="grid size-9 place-items-center rounded-lg bg-[#8B5CF6]/15 text-[#c4b5fd]">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{field.label}</span>
                </div>
              );
            })}
          </div>
        </Panel>
        <div className="relative min-h-[560px] rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(139,92,246,0.22),transparent_36%),#040713] p-6">
          <div className="absolute left-5 top-5 rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3 py-1 text-xs text-cyan-100">
            Live mobile preview
          </div>
          <div className="mx-auto mt-12 w-full max-w-[300px] rounded-[28px] border border-white/15 bg-black p-3 shadow-[0_0_70px_rgba(139,92,246,0.28)]">
            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#070916]">
              <div className="h-8 bg-white/[0.04]" />
              <div className="px-5 py-7">
                <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]" />
                </div>
                <p className="text-xs font-semibold text-[#EC4899]">AI follow-up</p>
                <h3 className="mt-3 text-2xl font-black leading-tight">
                  Which visual style should we generate?
                </h3>
                <div className="mt-6 grid gap-3">
                  {["Cyberpunk neon", "Soft anime", "Mission control"].map((choice) => (
                    <div
                      key={choice}
                      className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-sm text-slate-200"
                    >
                      {choice}
                    </div>
                  ))}
                </div>
                <button className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-bold text-black">
                  Continue
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Panel title="Theme studio" icon={Brush}>
          <div className="space-y-5">
            {["Glow", "Depth", "Motion"].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{item}</span>
                  <span className="text-cyan-200">{[88, 74, 61][index]}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#22D3EE]"
                    style={{ width: `${[88, 74, 61][index]}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {["#8B5CF6", "#22D3EE", "#EC4899"].map((color) => (
                <div
                  key={color}
                  className="h-12 rounded-lg border border-white/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Analytics() {
  return (
    <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <SectionHeader
        eyebrow="Analytics dashboard"
        title="Mission control for every response."
        copy="Track conversions, heat, completion, and live audience energy as it happens."
      />
      <div className="analytics-console relative mx-auto mt-12 max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_0_110px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
        <div className="analytics-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[#22D3EE]/10 to-transparent" />
        <div className="relative mb-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/10">
              <LineChart className="size-5 text-[#22D3EE]" />
            </div>
            <div>
              <h3 className="font-black">Response Intelligence Core</h3>
              <p className="text-sm text-slate-500">Live telemetry across every active form</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200">
            <span className="analytics-pulse size-2 rounded-full bg-emerald-300" />
            Streaming live
          </div>
        </div>

        <div className="relative grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {analyticsMetrics.map(([label, value, change]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/24 p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                  <p
                    className={`mt-1 text-sm ${change.startsWith("-") ? "text-emerald-300" : "text-[#22D3EE]"}`}
                  >
                    {change}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-lg border border-white/10 bg-[#030711] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-black">Conversion waveform</h3>
                    <p className="mt-1 text-sm text-slate-500">Response velocity by minute</p>
                  </div>
                  <span className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-3 py-1 text-xs font-bold text-cyan-100">
                    +1.8K/min
                  </span>
                </div>
                <div className="relative h-72 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:42px_42px]" />
                  <div className="relative flex h-full items-end gap-2">
                    {[32, 46, 42, 70, 58, 84, 66, 91, 78, 96, 86, 100].map((height, index) => (
                      <div
                        key={index}
                        className="flex flex-1 items-end rounded-md bg-white/[0.035] p-1"
                      >
                        <div
                          className="analytics-bar w-full rounded-md bg-gradient-to-t from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] shadow-[0_0_22px_rgba(34,211,238,0.28)]"
                          style={{
                            height: `${height}%`,
                            animationDelay: `${index * 70}ms`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="analytics-flow absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                <h3 className="font-black">Completion funnel</h3>
                <p className="mt-1 text-sm text-slate-500">Stage-by-stage intent</p>
                <div className="mt-6 space-y-4">
                  {funnelStages.map(([stage, value]) => (
                    <div key={stage}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-300">{stage}</span>
                        <span className="text-cyan-200">{value}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div
                          className="analytics-fill h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#22D3EE]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                <h3 className="font-black">Audience segments</h3>
                <div className="mt-5 space-y-4">
                  {segmentSignals.map(([label, value, color]) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="grid size-12 shrink-0 place-items-center rounded-full border"
                        style={{
                          borderColor: `${color}55`,
                          boxShadow: `0 0 22px ${color}33`,
                        }}
                      >
                        <span className="text-xs font-black" style={{ color }}>
                          {value}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-slate-300">{label}</span>
                          <span className="text-slate-500">{value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${value}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                <h3 className="font-black">Emotion radar</h3>
                <div className="relative mx-auto mt-5 grid aspect-square max-w-48 place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_55%)]">
                  <div className="absolute size-[78%] rounded-full border border-[#22D3EE]/20" />
                  <div className="absolute size-[54%] rounded-full border border-[#EC4899]/20" />
                  <div className="analytics-radar absolute size-[88%] rounded-full border-t border-[#22D3EE]" />
                  <div className="size-16 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] shadow-[0_0_42px_rgba(34,211,238,0.36)]" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <span>Joy 91%</span>
                  <span>Focus 84%</span>
                  <span>Trust 78%</span>
                  <span>Friction 6%</span>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                <h3 className="font-black">AI insights</h3>
                <div className="mt-5 space-y-3">
                  {aiInsights.map(([issue, action]) => (
                    <div
                      key={issue}
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
                    >
                      <p className="text-sm font-semibold text-slate-200">{issue}</p>
                      <p className="mt-1 text-xs text-[#22D3EE]">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              <div className="mb-5 flex items-center gap-2">
                <LineChart className="size-5 text-[#22D3EE]" />
                <h3 className="font-black">Interaction heatmap</h3>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 42 }).map((_, index) => (
                  <div
                    key={index}
                    className="analytics-heat aspect-square rounded-md border border-white/5"
                    style={{
                      backgroundColor: `rgba(${index % 3 === 0 ? "236,72,153" : index % 2 === 0 ? "34,211,238" : "139,92,246"}, ${
                        0.12 + (index % 7) * 0.08
                      })`,
                      animationDelay: `${index * 30}ms`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Globe2 className="size-5 text-[#EC4899]" />
                <h3 className="font-black">Geo signal</h3>
              </div>
              <div className="relative h-44 overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.16),transparent_40%),#030711]">
                {[
                  ["left-[18%] top-[36%]", "SF"],
                  ["left-[48%] top-[28%]", "LDN"],
                  ["left-[72%] top-[52%]", "TYO"],
                  ["left-[58%] top-[68%]", "BLR"],
                ].map(([pos, label]) => (
                  <div
                    key={label}
                    className={`analytics-ping absolute ${pos} flex items-center gap-2 text-xs font-bold text-cyan-100`}
                  >
                    <span className="size-2 rounded-full bg-[#22D3EE]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Globe2 className="size-5 text-[#EC4899]" />
                <h3 className="font-black">Live activity</h3>
              </div>
              <div className="space-y-3">
                {activity.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300"
                  >
                    <span className="analytics-pulse size-2 rounded-full bg-[#22D3EE]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function ExploreForms() {
  return (
    <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <SectionHeader
        eyebrow="Explore forms"
        title="Browse forms like they are shows."
        copy="Netflix-style discovery turns boring templates into living categories."
      />
      <div className="mx-auto mt-12 flex max-w-7xl gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {explore.map(([title, copy, gradient]) => (
          <article
            key={title}
            className="group relative h-[300px] min-w-[260px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#EC4899]/50"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-25 transition group-hover:opacity-45`}
            />
            <div className="absolute inset-x-6 bottom-6 top-24 rounded-lg border border-white/10 bg-black/20" />
            <div className="relative flex h-full flex-col justify-between">
              <Sparkles className="size-6 text-white" />
              <div>
                <h3 className="text-3xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <SectionHeader
        eyebrow="Pricing"
        title="Start free. Scale into a universe."
        copy="Plans for solo creators, fast-moving teams, and enterprise form fleets."
      />
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
        {pricing.map((plan) => (
          <article
            key={plan.name}
            className={`relative rounded-lg border p-6 backdrop-blur-2xl ${
              plan.featured
                ? "border-[#8B5CF6]/60 bg-[#8B5CF6]/12 shadow-[0_0_90px_rgba(139,92,246,0.34)]"
                : "border-white/10 bg-white/[0.05]"
            }`}
          >
            {plan.featured ? (
              <div className="absolute right-5 top-5 rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3 py-1 text-xs font-bold text-cyan-100">
                Most popular
              </div>
            ) : null}
            <h3 className="text-2xl font-black">{plan.name}</h3>
            <p className="mt-3 min-h-12 text-sm leading-6 text-slate-300">{plan.copy}</p>
            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-black">{plan.price}</span>
              {plan.price.startsWith("$") ? <span className="pb-2 text-slate-400">/mo</span> : null}
            </div>
            <button
              className={`mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg font-bold ${
                plan.featured
                  ? "bg-white text-black"
                  : "border border-white/12 bg-white/[0.06] text-white"
              }`}
            >
              Choose {plan.name}
              <ArrowRight className="size-4" />
            </button>
            <div className="mt-7 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="size-4 text-[#22D3EE]" />
                  {feature}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <footer className="footer-universe relative z-10 overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_80%_54%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_18%_62%,rgba(236,72,153,0.18),transparent_32%)]" />
      <div className="PollIq-particles absolute inset-0 opacity-35" />

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-[#060816]/72 shadow-[0_0_120px_rgba(139,92,246,0.18)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />

        <div className="px-5 py-16 text-center sm:px-8 lg:px-12 lg:py-20">
          <p className="mb-4 text-sm font-bold uppercase text-[#22D3EE]">
            Enter the next universe.
          </p>
          <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Build forms people remember.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Launch immersive experiences in minutes.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              className="shine-button relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#22D3EE] px-6 font-black text-white shadow-[0_0_46px_rgba(139,92,246,0.38)] transition hover:-translate-y-0.5"
              href="/sign-up"
            >
              <Rocket className="size-4" />
              Start Creating
            </a>
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.055] px-6 font-bold text-white transition hover:border-[#22D3EE]/45 hover:bg-white/[0.09]"
              href="#themes"
            >
              <Palette className="size-4 text-[#22D3EE]" />
              Explore Themes
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["Cyberpunk", "Anime", "Hacker", "Space"].map((portal) => (
              <button
                key={portal}
                className="footer-portal rounded-lg border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-300 transition hover:-translate-y-0.5 hover:border-[#22D3EE]/45 hover:text-white"
              >
                {portal}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

        <div className="grid gap-8 px-5 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:px-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <LogoOrb />
              <span className="text-xl font-black">
                Poll
                <span className="bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                  IQ
                </span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Interactive forms for the next generation.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold text-slate-300">
              <Shield className="size-4 text-[#22D3EE]" />
              Universe Grid Online
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-black uppercase text-white">{title}</h3>
              <div className="grid gap-3">
                {links.map((link) => (
                  <a
                    key={link}
                    className="text-sm text-slate-400 transition hover:text-cyan-100"
                    href="#"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-5 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>© 2026 PollIQ — Crafted for immersive experiences.</p>
          <p className="text-slate-600">Purple • Cyan • Pink signal active</p>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase text-[#22D3EE]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-slate-300">{copy}</p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#030711]/80 p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05]">
          <Icon className="size-4 text-[#22D3EE]" />
        </div>
        <h3 className="font-black">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  className,
  delay = "0s",
}: {
  icon: ComponentType<{ className?: string }>;
  className: string;
  delay?: string;
}) {
  return (
    <div
      className={`PollIq-orbit absolute z-20 grid size-12 place-items-center rounded-lg border border-white/12 bg-white/[0.08] text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.24)] backdrop-blur-xl ${className}`}
      style={{ animationDelay: delay }}
    >
      <Icon className="size-5" />
    </div>
  );
}
