"use client";

import { ArrowLeft, Check, Mail, Send, Sparkles } from "lucide-react";
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

type AnswerValue = string | number | boolean | string[] | number[] | boolean[];

export default function PublicFormClient({ slug }: { slug: string }) {
  const formQuery = trpc.form.getFormBySlug.useQuery({ slug });
  const submitResponse = trpc.form.submitResponse.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Response submitted");
    },
  });
  const [respondentEmail, setRespondentEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const form = formQuery.data;
  const fields = useMemo(() => ((form?.fields ?? []) as PublicField[]).slice().sort((a, b) => a.order - b.order), [form?.fields]);

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
          <p className="mt-2 text-sm leading-6 text-slate-400">This form may be private, unpublished, or no longer available.</p>
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
      <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
        <section className="w-full max-w-lg rounded-lg border border-teal-300/20 bg-white/[0.06] p-6 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-lg bg-teal-300 text-[#04201d]">
            <Check className="size-6" />
          </div>
          <h1 className="mt-4 text-2xl font-black">Response received</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Thanks for taking the time to answer.</p>
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
    <main className="min-h-screen bg-[#05070d] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.13),transparent_34%),linear-gradient(225deg,rgba(244,63,94,0.11),transparent_32%),linear-gradient(180deg,#05070d,#0b1020_52%,#05070d)]" />
      <div className="PollIq-grid pointer-events-none fixed inset-0 opacity-[0.12]" />

      <form className="relative mx-auto w-full max-w-3xl rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-7" onSubmit={submit}>
        <Badge className="border-teal-300/20 bg-teal-300/10 text-teal-100">PollIq form</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{form.title}</h1>
        {form.description ? <p className="mt-3 text-base leading-7 text-slate-300">{form.description}</p> : null}

        <div className="mt-7 rounded-lg border border-white/10 bg-black/24 p-4">
          <Label className="text-slate-300">Your email</Label>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input
              className="border-white/10 bg-white/[0.04] pl-9 text-white"
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

        <div className="mt-6 flex justify-end">
          <Button className="bg-teal-300 text-[#04201d] hover:bg-teal-200" disabled={submitResponse.isPending} type="submit">
            <Send className="size-4" />
            {submitResponse.isPending ? "Submitting..." : "Submit response"}
          </Button>
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
    <section className="rounded-lg border border-white/10 bg-black/24 p-4">
      <div className="mb-3">
        <Label className="text-base font-black text-slate-100">
          {index + 1}. {field.label} {field.required ? <span className="text-rose-200">*</span> : null}
        </Label>
        {field.description ? <p className="mt-1 text-sm leading-6 text-slate-400">{field.description}</p> : null}
      </div>
      {renderControl(field, answer, onChange)}
    </section>
  );
}

function renderControl(field: PublicField, answer: AnswerValue | undefined, onChange: (value: AnswerValue) => void) {
  if (field.type === "TEXTAREA") {
    return (
      <Textarea
        className="min-h-28 border-white/10 bg-white/[0.04] text-white"
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder ?? ""}
        value={typeof answer === "string" ? answer : ""}
      />
    );
  }

  if (field.type === "SELECT") {
    return (
      <select
        className="h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={typeof answer === "string" ? answer : ""}
      >
        <option value="">Choose an option</option>
        {(field.config?.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
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
              onChange(checked ? [...selected, option.value] : selected.filter((value) => value !== option.value));
            }}
          />
        ))}
      </div>
    );
  }

  if (field.type === "CHECKBOX") {
    return <OptionToggle checked={answer === true} label="Yes" onCheckedChange={(checked) => onChange(checked)} />;
  }

  if (field.type === "RATING") {
    const max = field.config?.max ?? 5;
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max }, (_, index) => index + 1).map((rating) => (
          <button
            className={`grid size-10 place-items-center rounded-lg border text-sm font-black transition ${
              answer === rating ? "border-teal-300 bg-teal-300 text-[#04201d]" : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-teal-300/40"
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
      className="border-white/10 bg-white/[0.04] text-white"
      onChange={(event) => onChange(field.type === "NUMBER" ? Number(event.target.value) : event.target.value)}
      placeholder={field.placeholder ?? ""}
      type={field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : field.type === "DATE" ? "date" : "text"}
      value={typeof answer === "number" || typeof answer === "string" ? answer : ""}
    />
  );
}

function OptionToggle({ checked, label, onCheckedChange }: { checked: boolean; label: string; onCheckedChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-teal-300/40">
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
