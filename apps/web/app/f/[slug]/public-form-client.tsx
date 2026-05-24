"use client";

import { ArrowLeft, Check, Clock3, Mail, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/trpc/client";

type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "EMAIL"
  | "NUMBER"
  | "SELECT"
  | "MULTI_SELECT"
  | "CHECKBOX"
  | "RATING"
  | "DATE";

type PublicField = {
  id: string;
  type: FieldType;
  label: string;
  description?: string | null;
  placeholder?: string | null;
  required: boolean;
  order: number;
  config?: {
    options?: Array<{ label: string; value: string }>;
    min?: number;
    max?: number;
    step?: number;
  } | null;
};

type ThemeKey =
  | "cyberpunk"
  | "sakura"
  | "hacker"
  | "space"
  | "gaming"
  | "liquid"
  | "startup"
  | "xp"
  | "glass";

type PublicTheme = {
  key: ThemeKey;
  name: string;
  shortName: string;
  surface: string;
  motion: string;
};

const publicThemes = [
  {
    key: "cyberpunk",
    name: "Cyberpunk Neon City",
    shortName: "Cyberpunk",
    surface: "from-[#0B0F1A] via-[#1a0b2e] to-[#001f2f]",
    motion: "Grid, holograms, particles",
  },
  {
    key: "sakura",
    name: "Anime Sakura Dream",
    shortName: "Sakura",
    surface: "from-[#FDF2F8] via-[#FBCFE8] to-[#C084FC]",
    motion: "Falling sakura petals",
  },
  {
    key: "hacker",
    name: "Hacker Terminal",
    shortName: "Terminal",
    surface: "from-black via-[#05140b] to-[#0D1117]",
    motion: "Matrix rain + typing",
  },
  {
    key: "space",
    name: "Space Mission Control",
    shortName: "Space",
    surface: "from-[#020617] via-[#0c1b3b] to-[#111052]",
    motion: "Stars, orbit lines, radar",
  },
  {
    key: "gaming",
    name: "Gaming Arena RGB",
    shortName: "Gaming",
    surface: "from-[#111827] via-[#3b1020] to-[#082619]",
    motion: "Animated glowing borders",
  },
  {
    key: "liquid",
    name: "Apple Liquid Glass",
    shortName: "Liquid",
    surface: "from-white via-[#dff7ff] to-[#f7e8ff]",
    motion: "Liquid reflection hover",
  },
  {
    key: "startup",
    name: "Startup Pitch Deck",
    shortName: "Startup",
    surface: "from-[#0F172A] via-[#182553] to-[#052f3b]",
    motion: "Clean dashboard glow",
  },
  {
    key: "xp",
    name: "Retro Windows XP",
    shortName: "Windows XP",
    surface: "from-[#245edb] via-[#3b8cff] to-[#58c241]",
    motion: "CRT blur + desktop shine",
  },
  {
    key: "glass",
    name: "Glassmorphic Dark",
    shortName: "Glass",
    surface: "from-[#05070d] via-[#101820] to-[#241039]",
    motion: "Layered glass glow",
  },
] satisfies PublicTheme[];

type AnswerValue = string | number | boolean | string[] | number[] | boolean[];

export default function PublicFormClient({ slug }: { slug: string }) {
  const formQuery = trpc.form.getFormBySlug.useQuery({ slug });
  const submitResponse = trpc.form.submitResponse.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Response submitted");
    },
    onError: (mutationError) => {
      toast.error(mutationError.message || "Could not submit response");
    },
  });
  const [respondentEmail, setRespondentEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const form = formQuery.data;
  const fields = useMemo(
    () => ((form?.fields ?? []) as PublicField[]).slice().sort((a, b) => a.order - b.order),
    [form?.fields],
  );
  const activeTheme = resolvePublicTheme(form?.theme?.slug ?? form?.theme?.name ?? "glass");
  const answeredCount = fields.filter((field) => !isEmptyAnswer(answers[field.id])).length;
  const progress = fields.length ? Math.round((answeredCount / fields.length) * 100) : 0;

  if (formQuery.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-semibold text-slate-200">
          Loading form...
        </div>
      </main>
    );
  }

  if (formQuery.error || !form) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
        <section className="w-full max-w-lg rounded-lg border border-white/10 bg-white/[0.06] p-6 text-center">
          <Sparkles className="mx-auto size-8 text-rose-200" />
          <h1 className="mt-4 text-2xl font-black">Form unavailable</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This form may be private, unpublished, or no longer available.
          </p>
          <Button asChild className="mt-5 bg-white text-[#05070d] hover:bg-teal-100">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back home
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  if (submitted) {
    return (
      <main
        className={`theme-preview theme-${activeTheme.key} grid min-h-screen place-items-center px-6`}
      >
        <ThemeAtmosphere themeKey={activeTheme.key} />
        <section className="theme-form-card relative w-full max-w-lg p-6 text-center">
          <div className="theme-success-icon mx-auto grid size-12 place-items-center">
            <Check className="size-6" />
          </div>
          <h1 className="theme-title mt-4 text-2xl font-black">Response received</h1>
          <p className="theme-muted mt-2 text-sm leading-6">
            Thanks for taking the time to answer.
          </p>
        </section>
      </main>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = fields.find((field) => field.required && isEmptyAnswer(answers[field.id]));
    if (missing) {
      toast.error(`Please answer: ${missing.label}`);
      return;
    }

    const payloadAnswers = fields
      .filter((field) => !isEmptyAnswer(answers[field.id]))
      .map((field) => ({
        fieldId: field.id,
        value: answers[field.id]!,
      }));

    await submitResponse.mutateAsync({
      formSlug: slug,
      respondentEmail: respondentEmail.trim() || undefined,
      answers: payloadAnswers,
    });
  };

  return (
    <main className={`theme-preview theme-${activeTheme.key} min-h-screen px-4 py-8 sm:px-6`}>
      <ThemeAtmosphere themeKey={activeTheme.key} />
      <div className="theme-light pointer-events-none fixed inset-0" />

      <form
        className="theme-form-card relative mx-auto w-full max-w-3xl overflow-hidden"
        onSubmit={submit}
      >
        <div className="theme-form-header p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge className="theme-badge">{activeTheme.shortName}</Badge>
            <div className="theme-metric flex items-center gap-2 text-xs font-semibold">
              <Clock3 className="size-4" />
              {fields.length} questions
            </div>
          </div>
          <h1 className="theme-title mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            {form.title}
          </h1>
          {form.description ? (
            <p className="theme-description mt-3 text-base leading-7">{form.description}</p>
          ) : null}
          <div className="mt-5">
            <div className="theme-muted mb-2 flex items-center justify-between text-xs font-semibold">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="theme-progress-track h-2 overflow-hidden">
              <div
                className="theme-progress-fill h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="theme-field-card p-4">
            <Label className="theme-label">Your email</Label>
            <div className="relative mt-2">
              <Mail className="theme-control-icon pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                className="theme-control pl-9"
                onChange={(event) => setRespondentEmail(event.target.value)}
                placeholder="name@example.com"
                type="email"
                value={respondentEmail}
              />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {fields.map((field, index) => (
              <PublicFieldControl
                answer={answers[field.id]}
                field={field}
                index={index}
                key={field.id}
                onChange={(value) => setAnswers((current) => ({ ...current, [field.id]: value }))}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="theme-muted text-xs font-semibold">{activeTheme.motion}</p>
            <Button
              className="theme-submit-button"
              disabled={submitResponse.isPending || fields.length === 0}
              type="submit"
            >
              <Send className="size-4" />
              {submitResponse.isPending ? "Submitting..." : "Submit response"}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}

function PublicFieldControl({
  answer,
  field,
  index,
  onChange,
}: {
  answer: AnswerValue | undefined;
  field: PublicField;
  index: number;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <section className="theme-field-card p-4 transition">
      <div className="mb-3">
        <Label className="theme-label text-base font-black">
          {index + 1}. {field.label}{" "}
          {field.required ? <span className="text-rose-200">*</span> : null}
        </Label>
        {field.description ? (
          <p className="theme-muted mt-1 text-sm leading-6">{field.description}</p>
        ) : null}
      </div>
      {renderControl(field, answer, onChange)}
    </section>
  );
}

function renderControl(
  field: PublicField,
  answer: AnswerValue | undefined,
  onChange: (value: AnswerValue) => void,
) {
  if (field.type === "TEXTAREA") {
    return (
      <Textarea
        className="theme-control min-h-28"
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder ?? ""}
        value={typeof answer === "string" ? answer : ""}
      />
    );
  }

  if (field.type === "SELECT") {
    return (
      <select
        className="theme-control h-10 w-full rounded-md px-3 text-sm font-semibold outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={typeof answer === "string" ? answer : ""}
      >
        <option value="">Choose an option</option>
        {(field.config?.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "MULTI_SELECT") {
    const selected = Array.isArray(answer) ? answer.map(String) : [];
    return (
      <div className="grid gap-2">
        {(field.config?.options ?? []).map((option) => (
          <OptionToggle
            checked={selected.includes(option.value)}
            key={option.value}
            label={option.label}
            onCheckedChange={(checked) => {
              onChange(
                checked
                  ? [...selected, option.value]
                  : selected.filter((value) => value !== option.value),
              );
            }}
          />
        ))}
      </div>
    );
  }

  if (field.type === "CHECKBOX") {
    return (
      <OptionToggle
        checked={answer === true}
        label="Yes, I agree"
        onCheckedChange={(checked) => onChange(checked)}
      />
    );
  }

  if (field.type === "RATING") {
    const max = field.config?.max ?? 5;
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max }, (_, index) => index + 1).map((rating) => (
          <button
            className={`theme-rating-button grid size-10 place-items-center text-sm font-black transition ${
              answer === rating ? "is-selected" : ""
            }`}
            key={rating}
            onClick={() => onChange(rating)}
            type="button"
          >
            {rating}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Input
      className="theme-control"
      onChange={(event) => {
        if (field.type === "NUMBER") {
          onChange(event.target.value === "" ? "" : Number(event.target.value));
          return;
        }
        onChange(event.target.value);
      }}
      placeholder={field.placeholder ?? ""}
      type={
        field.type === "EMAIL"
          ? "email"
          : field.type === "NUMBER"
            ? "number"
            : field.type === "DATE"
              ? "date"
              : "text"
      }
      value={typeof answer === "number" || typeof answer === "string" ? answer : ""}
    />
  );
}

function OptionToggle({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="theme-option flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-semibold transition">
      <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} />
      {label}
    </label>
  );
}

function isEmptyAnswer(value: AnswerValue | undefined) {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

function resolvePublicTheme(value: string): PublicTheme {
  const normalized = value.toLowerCase();
  return (
    publicThemes.find(
      (theme) =>
        theme.key === normalized ||
        theme.name.toLowerCase() === normalized ||
        theme.name.toLowerCase().includes(normalized),
    ) ?? publicThemes[publicThemes.length - 1]!
  );
}

function ThemeAtmosphere({ themeKey }: { themeKey: ThemeKey }) {
  const theme = resolvePublicTheme(themeKey);
  return (
    <>
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.surface}`} />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.28),transparent_18%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.52))]" />
      {themeKey === "cyberpunk" ? (
        <>
          <div className="cyber-grid fixed inset-0" />
          <div className="cyber-particles fixed inset-0" />
          <div className="theme-scanline fixed left-0 right-0 top-0 h-16 bg-gradient-to-b from-cyan-300/0 via-cyan-300/18 to-cyan-300/0" />
        </>
      ) : null}
      {themeKey === "sakura" ? (
        <>
          <div className="sakura-clouds fixed inset-0" />
          <div className="sakura-petals fixed inset-0" />
        </>
      ) : null}
      {themeKey === "hacker" ? (
        <>
          <div className="matrix-rain fixed inset-0" />
          <div className="crt-lines fixed inset-0" />
        </>
      ) : null}
      {themeKey === "space" ? (
        <>
          <div className="space-stars fixed inset-0" />
          <div className="radar-ring fixed left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2" />
        </>
      ) : null}
      {themeKey === "gaming" ? (
        <>
          <div className="gaming-hud fixed inset-0" />
          <div className="energy-particles fixed inset-0" />
        </>
      ) : null}
      {themeKey === "liquid" ? (
        <>
          <div className="liquid-reflection fixed inset-0" />
          <div className="fixed inset-12 rounded-[40%] bg-white/25 blur-3xl" />
        </>
      ) : null}
      {themeKey === "startup" ? <div className="startup-grid fixed inset-0" /> : null}
      {themeKey === "xp" ? (
        <>
          <div className="xp-clouds fixed inset-0" />
          <div className="crt-lines fixed inset-0 opacity-30" />
        </>
      ) : null}
      {themeKey === "glass" ? (
        <>
          <div className="glass-layers fixed inset-0" />
          <div className="PollIq-particles fixed inset-0" />
        </>
      ) : null}
    </>
  );
}
