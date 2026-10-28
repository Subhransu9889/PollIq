import Link from "next/link";
import { ArrowLeft, BarChart3, Check } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-[#111113] text-[#f2f0eb]">
      <div className="mx-auto grid min-h-svh max-w-7xl lg:grid-cols-2">
        <section className="relative flex flex-col justify-between px-6 py-7 lg:px-14 lg:py-12">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-2xl font-bold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#c9b7fb] text-[#251b36]">
              <BarChart3 size={20} />
            </span>
            polliq
          </Link>
          <div className="hidden py-16 lg:block">
            <p className="text-xs tracking-[0.2em] text-[#b9a5d7]">A LITTLE MORE HUMAN.</p>
            <h1 className="mt-6 text-6xl font-medium leading-[1.08] tracking-[-2px]">
              Good questions.
              <br />
              Great connections.
              <br />
              <span className="text-[#c9b7fb]">All yours.</span>
            </h1>
            <p className="mt-7 max-w-sm text-base leading-8 text-[#a5a4aa]">
              Your next idea deserves a better conversation. Give it a beautiful place to begin.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Build with nine question types",
                "Find your look with beautiful themes",
                "Publish, share, and review every answer",
              ].map((text) => (
                <p className="flex items-center gap-3 text-sm text-[#c2bdca]" key={text}>
                  <Check size={16} className="text-[#c9b7fb]" />
                  {text}
                </p>
              ))}
            </div>
          </div>
          <Link
            href="/"
            className="mt-5 flex w-fit items-center gap-2 text-xs text-[#a5a4aa] hover:text-white"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </section>
        <section className="flex items-center justify-center px-5 pb-12 lg:border-l lg:border-white/10 lg:bg-[#17151b] lg:px-10 lg:py-12">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
