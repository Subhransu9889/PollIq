"use client";

import {
  BarChart3,
  Check,
  ClipboardList,
  Copy,
  Eye,
  FilePlus2,
  Globe2,
  GripVertical,
  LayoutDashboard,
  Link2,
  Lock,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Rocket,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Unlock,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { useUserInfo } from "~/hooks/api/auth";
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
type Visibility = "PUBLIC" | "UNLISTED" | "PRIVATE";
type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type DraftField = {
  id?: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  order: number;
  config?: {
    options?: Array<{ label: string; value: string }>;
    min?: number;
    max?: number;
    step?: number;
    helpText?: string;
    allowOther?: boolean;
  };
};

type DraftForm = {
  id?: string;
  title: string;
  description: string;
  slug: string;
  visibility: Visibility;
  status: Status;
  fields: DraftField[];
};

type FormSummary = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  visibility: Visibility;
  status: Status;
  views?: number | null;
  responseCount?: number | null;
  createdAt?: Date | string | null;
};

type FormResponse = {
  responses: Array<{ id: string; createdAt: Date | string; respondentEmail?: string | null }>;
  answers: Array<{ responseId: string; fieldId: string; value: string }>;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Forms", icon: ClipboardList, active: true },
  { label: "Responses", icon: MessageSquareText },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
] satisfies Array<{ label: string; icon: LucideIcon; active?: boolean }>;

const fieldTypes = [
  ["TEXT", "Short text"],
  ["TEXTAREA", "Long text"],
  ["EMAIL", "Email"],
  ["NUMBER", "Number"],
  ["SELECT", "Single select"],
  ["MULTI_SELECT", "Multi select"],
  ["CHECKBOX", "Checkbox"],
  ["RATING", "Rating"],
  ["DATE", "Date"],
] satisfies Array<[FieldType, string]>;

const emptyField = (order: number, type: FieldType = "TEXT"): DraftField => ({
  type,
  label: type === "EMAIL" ? "Email address" : "Untitled question",
  description: "",
  placeholder: type === "EMAIL" ? "name@example.com" : "Type your answer",
  required: false,
  order,
  config: optionFieldTypes.has(type)
    ? {
        options: [
          { label: "Option 1", value: "option-1" },
          { label: "Option 2", value: "option-2" },
        ],
      }
    : type === "RATING"
      ? { min: 1, max: 5, step: 1 }
      : undefined,
});

const optionFieldTypes = new Set<FieldType>(["SELECT", "MULTI_SELECT", "CHECKBOX"]);

const newDraftForm = (): DraftForm => ({
  title: "Customer feedback form",
  description: "Collect clear, useful answers from your audience.",
  slug: `form-${Date.now().toString(36)}`,
  visibility: "PRIVATE",
  status: "DRAFT",
  fields: [
    {
      ...emptyField(0, "EMAIL"),
      required: true,
    },
    {
      ...emptyField(1, "TEXTAREA"),
      label: "What should we improve next?",
      required: true,
    },
  ],
});

export default function DashboardPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { error, isLoading, user } = useUserInfo();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftForm>(() => newDraftForm());
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);

  const formsQuery = trpc.form.listMyForms.useQuery(undefined, { enabled: Boolean(user) });
  const selectedFormQuery = trpc.form.getFormById.useQuery(
    { id: selectedFormId ?? "" },
    { enabled: Boolean(selectedFormId && user) },
  );
  const responsesQuery = trpc.form.getFormResponses.useQuery(
    { formId: selectedFormId ?? "" },
    { enabled: Boolean(selectedFormId && user) },
  );

  const createForm = trpc.form.createForm.useMutation({
    onSuccess: async (result) => {
      toast.success("Form created");
      setSelectedFormId(result.id);
      await utils.form.listMyForms.invalidate();
    },
  });
  const updateForm = trpc.form.updateForm.useMutation({
    onSuccess: async () => {
      toast.success("Form saved");
      await Promise.all([utils.form.listMyForms.invalidate(), utils.form.getFormById.invalidate()]);
    },
  });
  const publishForm = trpc.form.publishForm.useMutation({
    onSuccess: async () => {
      toast.success("Form published");
      await Promise.all([utils.form.listMyForms.invalidate(), utils.form.getFormById.invalidate()]);
    },
  });
  const unpublishForm = trpc.form.unpublishForm.useMutation({
    onSuccess: async () => {
      toast.success("Form moved to draft");
      await Promise.all([utils.form.listMyForms.invalidate(), utils.form.getFormById.invalidate()]);
    },
  });

  const forms = useMemo(() => (formsQuery.data ?? []) as FormSummary[], [formsQuery.data]);
  const responseData = responsesQuery.data as FormResponse | undefined;
  const displayName = user?.fullName?.split(" ")[0] ?? "there";
  const selectedField = draft.fields[selectedFieldIndex] ?? draft.fields[0];

  const totals = useMemo(() => {
    const views = forms.reduce((sum, item) => sum + (item.views ?? 0), 0);
    const responses = forms.reduce((sum, item) => sum + (item.responseCount ?? 0), 0);
    const published = forms.filter((item) => item.status === "PUBLISHED").length;
    return { views, responses, published, forms: forms.length };
  }, [forms]);

  useEffect(() => {
    if (error) {
      router.replace("/sign-in");
    }
  }, [error, router]);

  useEffect(() => {
    if (!selectedFormId && forms[0]) {
      setSelectedFormId(forms[0].id);
    }
  }, [forms, selectedFormId]);

  useEffect(() => {
    const form = selectedFormQuery.data;
    if (!form) {
      return;
    }

    setDraft({
      id: form.id,
      title: form.title,
      description: form.description ?? "",
      slug: form.slug,
      visibility: form.visibility as Visibility,
      status: form.status as Status,
      fields: form.fields.map((field, index) => ({
        id: field.id,
        type: field.type as FieldType,
        label: field.label,
        description: field.description ?? "",
        placeholder: field.placeholder ?? "",
        required: field.required,
        order: field.order ?? index,
        config: normalizeConfig(field.config, field.type as FieldType),
      })),
    });
    setSelectedFieldIndex(0);
  }, [selectedFormQuery.data]);

  if (isLoading || (!user && !error)) {
    return <LoadingState />;
  }

  if (!user) {
    return null;
  }

  const saveDraft = async () => {
    const payload = toPayload(draft);
    if (draft.id) {
      await updateForm.mutateAsync({ ...payload, id: draft.id });
      return draft.id;
    } else {
      const result = await createForm.mutateAsync(payload);
      setDraft((current) => ({ ...current, id: result.id }));
      return result.id;
    }
  };

  const togglePublish = async () => {
    if (!draft.id) {
      const formId = await saveDraft();
      await publishForm.mutateAsync({ formId });
      setDraft((current) => ({ ...current, status: "PUBLISHED" }));
      return;
    }
    if (draft.status === "PUBLISHED") {
      await unpublishForm.mutateAsync({ formId: draft.id });
      setDraft((current) => ({ ...current, status: "DRAFT" }));
    } else {
      await publishForm.mutateAsync({ formId: draft.id });
      setDraft((current) => ({ ...current, status: "PUBLISHED" }));
    }
  };

  const publicUrl = typeof window === "undefined" ? `/f/${draft.slug}` : `${window.location.origin}/f/${draft.slug}`;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.13),transparent_34%),linear-gradient(225deg,rgba(244,63,94,0.11),transparent_32%),linear-gradient(180deg,#05070d,#0b1020_52%,#05070d)]" />
      <div className="PollIq-grid pointer-events-none fixed inset-0 opacity-[0.12]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1540px] gap-4 p-3 sm:p-4">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((current) => !current)} />

        <section className="min-w-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-teal-200">Good evening, {displayName}</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">Form workspace</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="bg-white text-[#05070d] hover:bg-teal-100" onClick={() => {
                setSelectedFormId(null);
                setDraft(newDraftForm());
                setSelectedFieldIndex(0);
              }}>
                <FilePlus2 className="size-4" />
                New form
              </Button>
              <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" onClick={saveDraft} variant="outline">
                <Save className="size-4" />
                {draft.id ? "Save" : "Create"}
              </Button>
              <Button className="bg-teal-300 text-[#04201d] hover:bg-teal-200" onClick={togglePublish}>
                {draft.status === "PUBLISHED" ? <Unlock className="size-4" /> : <Rocket className="size-4" />}
                {draft.status === "PUBLISHED" ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </header>

          <div className="grid gap-4 px-4 py-5 sm:px-6 xl:grid-cols-[290px_minmax(0,1fr)_340px]">
            <aside className="space-y-4">
              <Stats totals={totals} />
              <FormList
                forms={forms}
                isLoading={formsQuery.isLoading}
                selectedId={selectedFormId}
                onSelect={setSelectedFormId}
              />
            </aside>

            <section className="min-w-0 space-y-4">
              <FormDetails draft={draft} setDraft={setDraft} publicUrl={publicUrl} />
              <Builder
                draft={draft}
                selectedFieldIndex={selectedFieldIndex}
                setDraft={setDraft}
                setSelectedFieldIndex={setSelectedFieldIndex}
              />
            </section>

            <aside className="space-y-4">
              <PublishPanel draft={draft} publicUrl={publicUrl} onCopy={copyPublicUrl} />
              {selectedField ? (
                <FieldSettings
                  field={selectedField}
                  onChange={(field) => updateFieldAt(selectedFieldIndex, field, setDraft)}
                  onDelete={() => removeFieldAt(selectedFieldIndex, setDraft, setSelectedFieldIndex)}
                />
              ) : null}
              <ResponsesPanel data={responseData} fields={draft.fields} isLoading={responsesQuery.isLoading} />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );

  async function copyPublicUrl() {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied");
  }
}

function LoadingState() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
      <div className="rounded-lg border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-semibold text-slate-200">
        Loading your dashboard...
      </div>
    </main>
  );
}

function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside className={`hidden shrink-0 rounded-lg border border-white/10 bg-black/35 p-3 backdrop-blur-2xl transition-all duration-300 lg:block ${open ? "w-64" : "w-[78px]"}`}>
      <div className="flex items-center justify-between gap-2">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <LogoMark />
          {open ? <span className="truncate text-xl font-black">PollIq</span> : null}
        </Link>
        <button
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-teal-300/40 hover:text-white"
          onClick={onToggle}
          type="button"
        >
          {open ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </button>
      </div>

      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => (
          <button
            className={`group flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
              item.active ? "bg-white text-[#05070d]" : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
            }`}
            key={item.label}
            title={item.label}
            type="button"
          >
            <item.icon className={`size-4 shrink-0 ${item.active ? "text-[#05070d]" : "group-hover:text-teal-200"}`} />
            {open ? <span className="truncate">{item.label}</span> : null}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Stats({ totals }: { totals: { views: number; responses: number; published: number; forms: number } }) {
  const items = [
    { label: "Forms", value: totals.forms, icon: ClipboardList },
    { label: "Published", value: totals.published, icon: Globe2 },
    { label: "Views", value: totals.views, icon: Eye },
    { label: "Responses", value: totals.responses, icon: MessageSquareText },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3" key={item.label}>
          <item.icon className="size-4 text-teal-200" />
          <p className="mt-3 text-2xl font-black">{item.value}</p>
          <p className="text-xs font-semibold text-slate-400">{item.label}</p>
        </div>
      ))}
    </section>
  );
}

function FormList({
  forms,
  isLoading,
  selectedId,
  onSelect,
}: {
  forms: FormSummary[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">Your forms</h2>
        <Badge className="border-white/10 bg-white/10 text-slate-100">{forms.length}</Badge>
      </div>
      <div className="mt-4 space-y-2">
        {isLoading ? <p className="text-sm text-slate-400">Loading forms...</p> : null}
        {!isLoading && !forms.length ? <p className="text-sm leading-6 text-slate-400">Create your first form to start collecting responses.</p> : null}
        {forms.map((form) => (
          <button
            className={`w-full rounded-lg border p-3 text-left transition ${
              selectedId === form.id ? "border-teal-300/50 bg-teal-300/10" : "border-white/10 bg-black/24 hover:border-white/20"
            }`}
            key={form.id}
            onClick={() => onSelect(form.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-100">{form.title}</p>
                <p className="mt-1 truncate text-xs text-slate-500">/{form.slug}</p>
              </div>
              <StatusBadge status={form.status} />
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-400">
              <span>{form.responseCount ?? 0} responses</span>
              <span>{form.visibility.toLowerCase()}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FormDetails({ draft, publicUrl, setDraft }: { draft: DraftForm; publicUrl: string; setDraft: Dispatch<SetStateAction<DraftForm>> }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_190px_150px]">
        <div>
          <Label className="text-slate-300">Title</Label>
          <Input
            className="mt-2 border-white/10 bg-black/25 text-white"
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            value={draft.title}
          />
        </div>
        <div>
          <Label className="text-slate-300">Slug</Label>
          <Input
            className="mt-2 border-white/10 bg-black/25 text-white"
            onChange={(event) => setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))}
            value={draft.slug}
          />
        </div>
        <div>
          <Label className="text-slate-300">Visibility</Label>
          <select
            className="mt-2 h-9 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm font-semibold text-white outline-none"
            onChange={(event) => setDraft((current) => ({ ...current, visibility: event.target.value as Visibility }))}
            value={draft.visibility}
          >
            <option value="PRIVATE">Private</option>
            <option value="UNLISTED">Unlisted</option>
            <option value="PUBLIC">Public</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <Label className="text-slate-300">Description</Label>
        <Textarea
          className="mt-2 min-h-20 border-white/10 bg-black/25 text-white"
          onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
          value={draft.description}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
        <Link2 className="size-4 text-teal-200" />
        <span className="break-all">{publicUrl}</span>
      </div>
    </section>
  );
}

function Builder({
  draft,
  selectedFieldIndex,
  setDraft,
  setSelectedFieldIndex,
}: {
  draft: DraftForm;
  selectedFieldIndex: number;
  setDraft: Dispatch<SetStateAction<DraftForm>>;
  setSelectedFieldIndex: (index: number) => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Builder</h2>
          <p className="mt-1 text-sm text-slate-400">Edit fields and preview the respondent flow in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {fieldTypes.slice(0, 5).map(([type, label]) => (
            <Button
              className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10"
              key={type}
              onClick={() => {
                setDraft((current) => {
                  const fields = [...current.fields, emptyField(current.fields.length, type)];
                  setSelectedFieldIndex(fields.length - 1);
                  return { ...current, fields };
                });
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="size-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-2">
          {draft.fields.map((field, index) => (
            <button
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                selectedFieldIndex === index ? "border-teal-300/50 bg-teal-300/10" : "border-white/10 bg-black/24 hover:border-white/20"
              }`}
              key={`${field.id ?? "new"}-${index}`}
              onClick={() => setSelectedFieldIndex(index)}
              type="button"
            >
              <GripVertical className="size-4 shrink-0 text-slate-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black">{field.label}</p>
                <p className="mt-1 text-xs text-slate-500">{field.type.replace("_", " ").toLowerCase()}</p>
              </div>
              {field.required ? <Check className="size-4 shrink-0 text-teal-200" /> : null}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-teal-300/20 bg-[#101820] p-5">
          <Badge className="border-teal-300/20 bg-teal-300/10 text-teal-100">Preview</Badge>
          <h3 className="mt-4 text-2xl font-black">{draft.title || "Untitled form"}</h3>
          {draft.description ? <p className="mt-2 text-sm leading-6 text-slate-300">{draft.description}</p> : null}
          <div className="mt-6 space-y-4">
            {draft.fields.map((field, index) => (
              <PreviewField field={field} index={index} key={`${field.id ?? "new"}-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewField({ field, index }: { field: DraftField; index: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/24 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">
            {index + 1}. {field.label || "Untitled question"} {field.required ? <span className="text-rose-200">*</span> : null}
          </p>
          {field.description ? <p className="mt-1 text-xs leading-5 text-slate-400">{field.description}</p> : null}
        </div>
        <Badge className="border-white/10 bg-white/10 text-slate-200">{field.type.replace("_", " ")}</Badge>
      </div>
      <div className="mt-4">
        {renderPreviewControl(field)}
      </div>
    </div>
  );
}

function renderPreviewControl(field: DraftField) {
  if (field.type === "TEXTAREA") {
    return <div className="h-24 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-500">{field.placeholder}</div>;
  }
  if (optionFieldTypes.has(field.type)) {
    return (
      <div className="grid gap-2">
        {(field.config?.options ?? []).map((option) => (
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300" key={option.value}>
            {option.label}
          </div>
        ))}
      </div>
    );
  }
  if (field.type === "RATING") {
    return <Progress className="h-2 bg-white/10" value={72} />;
  }
  return <div className="h-10 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-500">{field.placeholder}</div>;
}

function PublishPanel({ draft, publicUrl, onCopy }: { draft: DraftForm; publicUrl: string; onCopy: () => void }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">Publish flow</h2>
        <StatusBadge status={draft.status} />
      </div>
      <div className="mt-4 space-y-3 rounded-lg border border-white/10 bg-black/24 p-3">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
          {draft.visibility === "PRIVATE" ? <Lock className="size-4 text-rose-200" /> : <Globe2 className="size-4 text-teal-200" />}
          {draft.visibility === "PRIVATE" ? "Private forms cannot be submitted publicly." : "Published forms are available at the public link."}
        </div>
        <div className="break-all text-xs leading-5 text-slate-500">{publicUrl}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" onClick={onCopy} variant="outline">
          <Copy className="size-4" />
          Copy
        </Button>
        <Button asChild className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" variant="outline">
          <Link href={`/f/${draft.slug}`}>
            <Eye className="size-4" />
            Preview
          </Link>
        </Button>
      </div>
    </section>
  );
}

function FieldSettings({ field, onChange, onDelete }: { field: DraftField; onChange: (field: DraftField) => void; onDelete: () => void }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">Field settings</h2>
        <Button className="border-rose-300/20 bg-rose-300/10 text-rose-100 hover:bg-rose-300/20" onClick={onDelete} size="icon-sm" variant="outline">
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        <div>
          <Label className="text-slate-300">Type</Label>
          <select
            className="mt-2 h-9 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm font-semibold text-white outline-none"
            onChange={(event) => onChange(normalizeFieldForType(field, event.target.value as FieldType))}
            value={field.type}
          >
            {fieldTypes.map(([type, label]) => (
              <option key={type} value={type}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-slate-300">Label</Label>
          <Input className="mt-2 border-white/10 bg-black/25 text-white" onChange={(event) => onChange({ ...field, label: event.target.value })} value={field.label} />
        </div>
        <div>
          <Label className="text-slate-300">Placeholder</Label>
          <Input className="mt-2 border-white/10 bg-black/25 text-white" onChange={(event) => onChange({ ...field, placeholder: event.target.value })} value={field.placeholder ?? ""} />
        </div>
        <div>
          <Label className="text-slate-300">Help text</Label>
          <Textarea className="mt-2 min-h-16 border-white/10 bg-black/25 text-white" onChange={(event) => onChange({ ...field, description: event.target.value })} value={field.description ?? ""} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/24 p-3">
          <div>
            <p className="text-sm font-black">Required</p>
            <p className="mt-1 text-xs text-slate-500">Backend validates required answers on submit.</p>
          </div>
          <Switch checked={field.required} onCheckedChange={(checked) => onChange({ ...field, required: checked })} />
        </div>
        {optionFieldTypes.has(field.type) ? <OptionsEditor field={field} onChange={onChange} /> : null}
      </div>
    </section>
  );
}

function OptionsEditor({ field, onChange }: { field: DraftField; onChange: (field: DraftField) => void }) {
  const options = field.config?.options ?? [];
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Label className="text-slate-300">Options</Label>
        <Button
          className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10"
          onClick={() => onChange({ ...field, config: { ...field.config, options: [...options, { label: `Option ${options.length + 1}`, value: `option-${options.length + 1}` }] } })}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      <div className="mt-2 space-y-2">
        {options.map((option, index) => (
          <div className="flex gap-2" key={`${option.value}-${index}`}>
            <Input
              className="border-white/10 bg-black/25 text-white"
              onChange={(event) => {
                const next = [...options];
                next[index] = { label: event.target.value, value: slugify(event.target.value) || `option-${index + 1}` };
                onChange({ ...field, config: { ...field.config, options: next } });
              }}
              value={option.label}
            />
            <Button
              className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10"
              onClick={() => onChange({ ...field, config: { ...field.config, options: options.filter((_, optionIndex) => optionIndex !== index) } })}
              size="icon"
              type="button"
              variant="outline"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponsesPanel({ data, fields, isLoading }: { data?: FormResponse; fields: DraftField[]; isLoading: boolean }) {
  const latest = data?.responses.slice(-4).reverse() ?? [];
  const answersByResponse = new Map<string, number>();
  data?.answers.forEach((answer) => answersByResponse.set(answer.responseId, (answersByResponse.get(answer.responseId) ?? 0) + 1));

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">Responses</h2>
        <Badge className="border-teal-300/20 bg-teal-300/10 text-teal-100">{data?.responses.length ?? 0}</Badge>
      </div>
      <div className="mt-4 space-y-2">
        {isLoading ? <p className="text-sm text-slate-400">Loading responses...</p> : null}
        {!isLoading && !latest.length ? <p className="text-sm leading-6 text-slate-400">Responses will appear here after people submit your published form.</p> : null}
        {latest.map((response) => (
          <div className="rounded-lg border border-white/10 bg-black/24 p-3" key={response.id}>
            <div className="flex items-center gap-3">
              <Users className="size-4 text-teal-200" />
              <p className="text-sm font-black">{response.respondentEmail ?? "Anonymous response"}</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">{answersByResponse.get(response.id) ?? 0} of {fields.length} answers</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const className =
    status === "PUBLISHED"
      ? "border-teal-300/20 bg-teal-300/10 text-teal-100"
      : status === "ARCHIVED"
        ? "border-slate-300/20 bg-slate-300/10 text-slate-100"
        : "border-amber-300/20 bg-amber-300/10 text-amber-100";
  return <Badge className={className}>{status.toLowerCase()}</Badge>;
}

function LogoMark() {
  return (
    <div className="relative grid size-10 shrink-0 place-items-center rounded-lg border border-white/14 bg-white/[0.07] shadow-[0_0_34px_rgba(20,184,166,0.22)]">
      <Sparkles className="relative size-5 text-white" />
    </div>
  );
}

function updateFieldAt(index: number, field: DraftField, setDraft: Dispatch<SetStateAction<DraftForm>>) {
  setDraft((current) => ({
    ...current,
    fields: current.fields.map((item, itemIndex) => (itemIndex === index ? { ...field, order: itemIndex } : item)),
  }));
}

function removeFieldAt(index: number, setDraft: Dispatch<SetStateAction<DraftForm>>, setSelectedFieldIndex: (index: number) => void) {
  setDraft((current) => {
    if (current.fields.length === 1) {
      toast.error("A form needs at least one field");
      return current;
    }
    const fields = current.fields.filter((_, itemIndex) => itemIndex !== index).map((field, order) => ({ ...field, order }));
    setSelectedFieldIndex(Math.max(0, index - 1));
    return { ...current, fields };
  });
}

function normalizeFieldForType(field: DraftField, type: FieldType): DraftField {
  return {
    ...field,
    type,
    config: optionFieldTypes.has(type)
      ? field.config?.options?.length
        ? field.config
        : { options: [{ label: "Option 1", value: "option-1" }] }
      : type === "RATING"
        ? { min: 1, max: 5, step: 1 }
        : undefined,
  };
}

function normalizeConfig(config: unknown, type: FieldType): DraftField["config"] {
  if (config && typeof config === "object") {
    return config as DraftField["config"];
  }
  if (optionFieldTypes.has(type)) {
    return { options: [{ label: "Option 1", value: "option-1" }] };
  }
  if (type === "RATING") {
    return { min: 1, max: 5, step: 1 };
  }
  return undefined;
}

function toPayload(draft: DraftForm) {
  return {
    title: draft.title.trim() || "Untitled form",
    description: draft.description.trim() || undefined,
    slug: slugify(draft.slug) || `form-${Date.now().toString(36)}`,
    visibility: draft.visibility,
    status: draft.status,
    fields: draft.fields.map((field, order) => ({
      type: field.type,
      label: field.label.trim() || `Question ${order + 1}`,
      description: field.description?.trim() || undefined,
      placeholder: field.placeholder?.trim() || undefined,
      required: field.required,
      order,
      config: cleanConfig(field),
    })),
  };
}

function cleanConfig(field: DraftField) {
  if (optionFieldTypes.has(field.type)) {
    return {
      ...(field.config ?? {}),
      options: (field.config?.options ?? []).filter((option) => option.label.trim()).map((option) => ({
        label: option.label.trim(),
        value: slugify(option.value || option.label) || "option",
      })),
    };
  }
  if (field.type === "RATING") {
    return {
      min: field.config?.min ?? 1,
      max: field.config?.max ?? 5,
      step: field.config?.step ?? 1,
    };
  }
  return field.config;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
