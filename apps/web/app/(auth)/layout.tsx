import { Sparkles } from "lucide-react";

const features = ["AI Powered", "Real-time Analytics", "Beautiful Themes", "Interactive UX"];
const designCards = [
  ["Hologram Card", "scanline glass projection"],
  ["Terminal Execution", "live command interface"],
  ["Dimension Portal", "animated theme world"],
  ["AI Core Card", "reactive neural glow"],
  ["Gaming Loadout", "collectible form asset"],
  ["Form DNA", "signal-based identity"],
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#02030a] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="formverse-mesh absolute inset-0 opacity-80" />
        <div className="auth-grid absolute inset-0 opacity-30" />
        <div className="formverse-particles absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(139,92,246,0.28),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_52%_86%,rgba(236,72,153,0.18),transparent_30%),linear-gradient(90deg,rgba(2,3,10,0.1),rgba(2,3,10,0.75)_56%,#02030a)]" />
      </div>

      <div className="relative z-10 grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <BrandingPanel />
        <section className="flex min-h-svh items-center justify-center px-5 py-8 sm:px-8 lg:border-l lg:border-white/10 lg:bg-black/10 lg:backdrop-blur-sm">
          <div className="w-full max-w-md xl:max-w-lg">{children}</div>
        </section>
      </div>
    </main>
  );
}

function BrandingPanel() {
  return (
    <section className="relative hidden min-h-svh items-center overflow-hidden px-10 py-8 lg:flex xl:px-14">
      <div className="absolute left-10 top-8 flex items-center gap-3 xl:left-14">
        <LogoMark />
        <span className="text-xl font-black tracking-tight">PollIq</span>
      </div>

      <div className="absolute left-[10%] top-[18%] h-28 w-28 rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/10 blur-sm auth-spin" />
      <div className="absolute bottom-[12%] right-[10%] h-40 w-40 rounded-lg border border-[#EC4899]/20 bg-[#EC4899]/10 blur-sm auth-spin-slow" />
      <div className="absolute right-[12%] top-[16%] h-px w-56 rotate-[-24deg] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent shadow-[0_0_24px_#22D3EE]" />
      <div className="absolute bottom-[24%] left-[6%] h-px w-72 rotate-[18deg] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_24px_#8B5CF6]" />

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_36px_rgba(34,211,238,0.12)] backdrop-blur-xl">
          <Sparkles className="size-4 text-[#22D3EE]" />
          Immersive form interface system
        </div>
        <h1 className="max-w-3xl text-[clamp(3rem,5vw,5.8rem)] font-black leading-[0.95] tracking-tight">
          Create forms people love to fill.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Build immersive form experiences with themes, analytics, and interactive workflows.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-xl"
            >
              {feature}
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-3 xl:grid-cols-3">
          {designCards.map(([name, detail], index) => (
            <div
              key={name}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/45 hover:bg-white/[0.075]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent opacity-50 transition group-hover:opacity-100" />
              <div className="absolute -right-8 -top-8 size-20 rounded-full bg-[#8B5CF6]/18 blur-2xl transition group-hover:bg-[#EC4899]/24" />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">
                  UI-{String(index + 1).padStart(2, "0")}
                </span>
                <span className="size-2 rounded-full bg-[#22D3EE] shadow-[0_0_16px_#22D3EE]" />
              </div>
              <h3 className="relative mt-5 text-lg font-black">{name}</h3>
              <p className="relative mt-2 text-sm leading-6 text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
