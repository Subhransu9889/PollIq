"use client";

import { ArrowLeft, Check, Clock3, Download, Mail, Send, Share2, Sparkles } from "lucide-react";
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
    maxLength?: number;
    pattern?: string;
    condition?: {
      fieldOrder: number;
      equals: string;
    };
    branding?: PublicBranding;
  } | null;
};

type PublicBranding = {
  logoUrl: string;
  fontFamily: string;
  glassCards: boolean;
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
  const [receiptId, setReceiptId] = useState("");

  const form = formQuery.data;
  const fields = useMemo(
    () => ((form?.fields ?? []) as PublicField[]).slice().sort((a, b) => a.order - b.order),
    [form?.fields],
  );
  const visibleFields = useMemo(() => fields.filter((field) => shouldShowField(field, fields, answers)), [answers, fields]);
  const activeTheme = resolvePublicTheme(form?.theme?.slug ?? form?.theme?.name ?? "glass");
  const branding = getBrandingFromFields(fields);
  const answeredCount = visibleFields.filter((field) => !isEmptyAnswer(answers[field.id])).length;
  const progress = visibleFields.length ? Math.round((answeredCount / visibleFields.length) * 100) : 0;

  if (formQuery.isLoading) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-8 text-white sm:px-6">
        <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
          <div className="border-b border-white/10 p-7">
            <div className="h-6 w-28 rounded bg-white/10 shimmer" />
            <div className="mt-5 h-12 max-w-xl rounded bg-white/10 shimmer" />
            <div className="mt-4 h-4 w-3/4 rounded bg-white/[0.08] shimmer" />
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-teal-300 to-fuchsia-300" />
            </div>
          </div>
          <div className="space-y-4 p-7">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="h-28 rounded-lg border border-white/10 bg-white/[0.05] shimmer" key={index} />
            ))}
          </div>
        </section>
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
    const receiptText = buildReceiptText(form.title, respondentEmail, receiptId);
    return (
      <main
        className={`theme-preview theme-${activeTheme.key} grid min-h-screen place-items-center px-6 ${branding.glassCards ? "" : "theme-solid-card"}`}
        style={{ fontFamily: branding.fontFamily }}
      >
        <ThemeAtmosphere themeKey={activeTheme.key} />
        <section className="theme-form-card relative w-full max-w-lg p-6 text-center">
          <div className="theme-success-icon success-pop mx-auto grid size-14 place-items-center">
            <Check className="size-6" />
          </div>
          <h1 className="theme-title mt-4 text-2xl font-black">
            Thanks{getFirstName(respondentEmail) ? ` ${getFirstName(respondentEmail)}` : ""}, your response was received
          </h1>
          <p className="theme-muted mt-2 text-sm leading-6">
            Your confirmation ID is {receiptId || "ready"}. You can keep a receipt or share confirmation with your team.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button asChild className="theme-submit-button">
              <a download={`polliq-receipt-${receiptId || "response"}.txt`} href={`data:text/plain;charset=utf-8,${encodeURIComponent(receiptText)}`}>
                <Download className="size-4" />
                Receipt
              </a>
            </Button>
            <Button
              className="theme-submit-button"
              onClick={() => {
                void navigator.clipboard.writeText(`Response received for ${form.title}. Confirmation: ${receiptId}`);
                toast.success("Confirmation copied");
              }}
              type="button"
            >
              <Share2 className="size-4" />
              Share
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = visibleFields.find((field) => field.required && isEmptyAnswer(answers[field.id]));
    if (missing) {
      toast.error(`Please answer: ${missing.label}`);
      return;
    }
    const invalid = visibleFields.find((field) => getValidationState(field, answers[field.id]).tone === "invalid");
    if (invalid) {
      toast.message("A field needs attention", { description: invalid.label });
      return;
    }

    const payloadAnswers = visibleFields
      .filter((field) => !isEmptyAnswer(answers[field.id]))
      .map((field) => ({
        fieldId: field.id,
        value: answers[field.id]!,
      }));

    const result = await submitResponse.mutateAsync({
      formSlug: slug,
      respondentEmail: respondentEmail.trim() || undefined,
      answers: payloadAnswers,
    });
    setReceiptId(result.responseId);
  };

  return (
    <main className={`theme-preview theme-${activeTheme.key} min-h-screen px-4 py-8 sm:px-6`}>
      <ThemeAtmosphere themeKey={activeTheme.key} />
      <div className="theme-light pointer-events-none fixed inset-0" />

      <form
        className={`theme-form-card relative mx-auto w-full max-w-3xl overflow-hidden ${branding.glassCards ? "" : "theme-solid-card"}`}
        onSubmit={submit}
        style={{ fontFamily: branding.fontFamily }}
      >
        <div className="theme-form-header p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {branding.logoUrl ? (
                <div className="size-12 rounded-lg border border-white/20 bg-cover bg-center shadow-[0_12px_40px_rgba(0,0,0,0.28)]" style={{ backgroundImage: `url(${branding.logoUrl})` }} />
              ) : null}
              <Badge className="theme-badge">{activeTheme.shortName}</Badge>
            </div>
            <div className="theme-metric flex items-center gap-2 text-xs font-semibold">
              <Clock3 className="size-4" />
              {visibleFields.length} questions
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
            {visibleFields.map((field, index) => (
              <PublicFieldControl
                answer={answers[field.id]}
                answers={answers}
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
              disabled={submitResponse.isPending || visibleFields.length === 0}
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
  answers,
  field,
  index,
  onChange,
}: {
  answer: AnswerValue | undefined;
  answers: Record<string, AnswerValue>;
  field: PublicField;
  index: number;
  onChange: (value: AnswerValue) => void;
}) {
  const validation = getValidationState(field, answer, answers);
  return (
    <section className={`theme-field-card p-4 transition ${validation.tone === "valid" ? "is-valid" : ""}`}>
      <div className="mb-3">
        <Label className="theme-label text-base font-black">
          {index + 1}. {field.label}{" "}
          {field.required ? <span className="text-teal-200">*</span> : null}
        </Label>
        {field.description ? (
          <p className="theme-muted mt-1 text-sm leading-6">{field.description}</p>
        ) : null}
      </div>
      {renderControl(field, answer, onChange)}
      <div className={`mt-3 flex items-center gap-2 text-xs font-semibold ${validation.tone === "invalid" ? "theme-muted" : "text-teal-100"}`}>
        {validation.tone === "valid" ? <Check className="success-check size-4" /> : null}
        <span>{validation.message}</span>
      </div>
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
        maxLength={field.config?.maxLength}
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
      maxLength={field.config?.maxLength}
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

function shouldShowField(field: PublicField, fields: PublicField[], answers: Record<string, AnswerValue>) {
  const condition = field.config?.condition;
  if (!condition) return true;
  const source = fields[condition.fieldOrder];
  if (!source) return true;
  const answer = answers[source.id];
  if (Array.isArray(answer)) return answer.map(String).includes(condition.equals);
  return String(answer) === condition.equals;
}

function getValidationState(field: PublicField, answer: AnswerValue | undefined, answers: Record<string, AnswerValue> = {}) {
  if (!shouldShowField(field, [], answers)) return { tone: "idle" as const, message: "Hidden until relevant." };
  if (isEmptyAnswer(answer)) {
    return {
      tone: "idle" as const,
      message: field.required ? "Required when visible." : "Optional. Add it if useful.",
    };
  }

  const text = typeof answer === "string" ? answer.trim() : "";
  if (field.type === "EMAIL" && text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    return { tone: "invalid" as const, message: "Email format is almost there." };
  }
  if (field.config?.pattern === "url" && text) {
    try {
      new URL(text);
    } catch {
      return { tone: "invalid" as const, message: "Use a full URL, like https://example.com." };
    }
  }
  if (field.config?.maxLength && text.length > field.config.maxLength) {
    return { tone: "invalid" as const, message: `${text.length}/${field.config.maxLength} characters used.` };
  }
  if (field.label.toLowerCase().includes("password") && text) {
    const score = Number(text.length >= 8) + Number(/[A-Z]/.test(text)) + Number(/[0-9]/.test(text)) + Number(/[^A-Za-z0-9]/.test(text));
    if (score < 3) return { tone: "idle" as const, message: "Password strength: building." };
    return { tone: "valid" as const, message: "Password strength looks good." };
  }
  if (field.label.toLowerCase().includes("username") && text) {
    if (text.length < 3) return { tone: "idle" as const, message: "Usernames usually need 3+ characters." };
    return { tone: "valid" as const, message: "Username looks available." };
  }
  if (field.config?.maxLength && text) {
    return { tone: "valid" as const, message: `${Math.max(0, field.config.maxLength - text.length)} characters left.` };
  }

  return { tone: "valid" as const, message: "Looks good." };
}

function getFirstName(email: string) {
  const name = email.split("@")[0]?.split(/[._-]/)[0];
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
}

function getBrandingFromFields(fields: PublicField[]): PublicBranding {
  const branding = fields[0]?.config?.branding;
  return {
    logoUrl: typeof branding?.logoUrl === "string" ? branding.logoUrl : "",
    fontFamily: typeof branding?.fontFamily === "string" ? branding.fontFamily : "Geist Sans",
    glassCards: typeof branding?.glassCards === "boolean" ? branding.glassCards : true,
  };
}

function buildReceiptText(title: string, email: string, receiptId: string) {
  return [
    "PollIq response receipt",
    `Form: ${title}`,
    `Confirmation: ${receiptId || "pending"}`,
    `Respondent: ${email || "Anonymous"}`,
    `Submitted: ${new Date().toLocaleString()}`,
  ].join("\n");
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
