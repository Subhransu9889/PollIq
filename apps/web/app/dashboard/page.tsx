"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  ClipboardList,
  Code2,
  Command,
  Copy,
  Eye,
  FilePlus2,
  Gauge,
  Globe2,
  GripVertical,
  LayoutDashboard,
  Link2,
  Lock,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Plus,
  Rocket,
  Save,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Unlock,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
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

type SectionId = "dashboard" | "forms" | "explore" | "themes" | "analytics" | "responses" | "api" | "settings";
type FieldType = "TEXT" | "TEXTAREA" | "EMAIL" | "NUMBER" | "SELECT" | "MULTI_SELECT" | "CHECKBOX" | "RATING" | "DATE";
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

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "forms", label: "Forms", icon: ClipboardList },
  { id: "explore", label: "Explore", icon: Sparkles },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "responses", label: "Responses", icon: MessageSquareText },
  { id: "api", label: "API Docs", icon: Command },
  { id: "settings", label: "Settings", icon: Settings },
] satisfies Array<{ id: SectionId; label: string; icon: LucideIcon }>;

const fieldTypes = [
  ["TEXT", "Text", MessageSquareText],
  ["EMAIL", "Email", Users],
  ["SELECT", "Select", ChevronRight],
  ["RATING", "Rating", Star],
  ["DATE", "Date", Activity],
  ["CHECKBOX", "Checkbox", Check],
  ["TEXTAREA", "Textarea", ClipboardList],
  ["NUMBER", "Number", Gauge],
  ["MULTI_SELECT", "Multi select", ClipboardList],
] satisfies Array<[FieldType, string, LucideIcon]>;

const optionFieldTypes = new Set<FieldType>(["SELECT", "MULTI_SELECT"]);

type TemplateCategory = "Trending" | "Anime" | "Cyberpunk" | "Startup" | "Gaming";
type ThemeKey = "cyberpunk" | "sakura" | "hacker" | "space" | "gaming" | "liquid" | "startup" | "xp" | "glass";
type ThemeCategory = "All" | "Cyberpunk" | "Anime" | "Hacker" | "Space" | "Gaming" | "Premium" | "Business" | "Retro" | "Default";

type TemplateCard = {
  category: TemplateCategory;
  title: string;
  description: string;
  gradient: string;
  stats: string;
  completion: number;
  theme: string;
  fields: Array<Pick<DraftField, "type" | "label" | "placeholder" | "required" | "config"> & { description?: string }>;
};

type ThemeCard = {
  key: ThemeKey;
  category: Exclude<ThemeCategory, "All">;
  name: string;
  shortName: string;
  tone: string;
  vibe: string;
  surface: string;
  accent: string;
  conversion: string;
  motion: string;
  typography: string;
  button: string;
};

const themeCollections = [
  { key: "cyberpunk", category: "Cyberpunk", name: "Cyberpunk Neon City", shortName: "Cyberpunk", tone: "Neon city, hacker energy, futuristic nightlife.", vibe: "#0B0F1A / #FF00FF / #00E5FF / #8B5CF6", surface: "from-[#0B0F1A] via-[#1a0b2e] to-[#001f2f]", accent: "Pink / Cyan / Violet", conversion: "+31%", motion: "Grid, holograms, particles", typography: "Space Grotesk + Orbitron", button: "Pink to cyan gradient" },
  { key: "sakura", category: "Anime", name: "Anime Sakura Dream", shortName: "Sakura", tone: "Dreamy, soft, cinematic anime with falling petals.", vibe: "#FDF2F8 / #F9A8D4 / #C084FC / #FBCFE8", surface: "from-[#FDF2F8] via-[#FBCFE8] to-[#C084FC]", accent: "Pink / Lavender", conversion: "+28%", motion: "Falling sakura petals", typography: "Poppins + Satoshi", button: "Soft rose glass" },
  { key: "hacker", category: "Hacker", name: "Hacker Terminal", shortName: "Terminal", tone: "Matrix, Linux terminal, typing prompts, CRT grit.", vibe: "#000000 / #00FF66 / #0D1117", surface: "from-black via-[#05140b] to-[#0D1117]", accent: "Phosphor green", conversion: "+26%", motion: "Matrix rain + typing", typography: "JetBrains Mono + Geist Mono", button: "> continue" },
  { key: "space", category: "Space", name: "Space Mission Control", shortName: "Space", tone: "NASA dashboard, space station UI, planet exploration.", vibe: "#020617 / #38BDF8 / #818CF8 / #E0F2FE", surface: "from-[#020617] via-[#0c1b3b] to-[#111052]", accent: "Sky / Indigo", conversion: "+22%", motion: "Stars, orbit lines, radar", typography: "Geist + Orbitron", button: "Floating mission buttons" },
  { key: "gaming", category: "Gaming", name: "Gaming Arena RGB", shortName: "Gaming", tone: "Esports dashboard with HUD lines and energy particles.", vibe: "#111827 / #EF4444 / #F59E0B / #10B981", surface: "from-[#111827] via-[#3b1020] to-[#082619]", accent: "Red / Gold / Green", conversion: "+20%", motion: "Animated glowing borders", typography: "Rajdhani + Exo 2", button: "High contrast arena CTA" },
  { key: "liquid", category: "Premium", name: "Apple Liquid Glass", shortName: "Liquid", tone: "Minimal, luxury, Arc-like glass with reflective motion.", vibe: "White glass / soft gradients", surface: "from-white via-[#dff7ff] to-[#f7e8ff]", accent: "Pearl / Blue / Violet", conversion: "+24%", motion: "Liquid reflection hover", typography: "Geist + Satoshi", button: "Reflective glass pill" },
  { key: "startup", category: "Business", name: "Startup Pitch Deck", shortName: "Startup", tone: "Linear, Vercel, Framer energy for business forms.", vibe: "#0F172A / #6366F1 / #06B6D4", surface: "from-[#0F172A] via-[#182553] to-[#052f3b]", accent: "Indigo / Cyan", conversion: "+21%", motion: "Clean dashboard glow", typography: "Geist + Inter", button: "Premium SaaS action" },
  { key: "xp", category: "Retro", name: "Retro Windows XP", shortName: "Windows XP", tone: "Old internet nostalgia with pixel shadows and XP buttons.", vibe: "Bliss blue / grass green / chrome", surface: "from-[#245edb] via-[#3b8cff] to-[#58c241]", accent: "XP blue / Meadow", conversion: "+17%", motion: "CRT blur + desktop shine", typography: "Tahoma + system", button: "Classic XP button" },
  { key: "glass", category: "Default", name: "Glassmorphic Dark", shortName: "Glass", tone: "Premium futuristic default with layered blur and subtle glow.", vibe: "Dark blur / smooth gradients", surface: "from-[#05070d] via-[#101820] to-[#241039]", accent: "Teal / Fuchsia", conversion: "+23%", motion: "Layered glass glow", typography: "Geist Sans", button: "Clean glass action" },
] satisfies ThemeCard[];

const templateCards = [
  {
    category: "Trending",
    title: "Creator Drop Waitlist",
    description: "Launch signup with audience intent, email capture, and hype scoring.",
    gradient: "from-teal-300 via-sky-400 to-fuchsia-500",
    stats: "8.4K uses",
    completion: 82,
    theme: "Cyberpunk Neon City",
    fields: [
      { type: "EMAIL", label: "Where should we send your invite?", placeholder: "name@example.com", required: true },
      { type: "SELECT", label: "What are you most excited about?", placeholder: "Choose one", required: true, config: { options: [{ label: "Early access", value: "early-access" }, { label: "Community", value: "community" }, { label: "Creator tools", value: "creator-tools" }] } },
      { type: "RATING", label: "How excited are you?", placeholder: "", required: true, config: { min: 1, max: 5, step: 1 } },
    ],
  },
  {
    category: "Anime",
    title: "Anime Convention Form",
    description: "Cosplay, panels, merch interest, and attendee preferences in one cinematic flow.",
    gradient: "from-pink-400 via-rose-300 to-fuchsia-500",
    stats: "5.9K uses",
    completion: 76,
    theme: "Anime Sakura Dream",
    fields: [
      { type: "TEXT", label: "What name should appear on your badge?", placeholder: "Your display name", required: true },
      { type: "SELECT", label: "Which panel are you most interested in?", placeholder: "Choose a panel", required: true, config: { options: [{ label: "Voice actors", value: "voice-actors" }, { label: "Cosplay showcase", value: "cosplay" }, { label: "Manga workshop", value: "manga" }] } },
      { type: "TEXTAREA", label: "What would make the event unforgettable?", placeholder: "Tell us your idea", required: false },
    ],
  },
  {
    category: "Cyberpunk",
    title: "Beta Access Application",
    description: "High-signal beta signup with persona routing and urgency indicators.",
    gradient: "from-cyan-300 via-violet-500 to-fuchsia-500",
    stats: "7.1K uses",
    completion: 88,
    theme: "Cyberpunk Neon City",
    fields: [
      { type: "EMAIL", label: "Enter your access email", placeholder: "operator@domain.com", required: true },
      { type: "SELECT", label: "What describes you best?", placeholder: "Choose role", required: true, config: { options: [{ label: "Founder", value: "founder" }, { label: "Designer", value: "designer" }, { label: "Engineer", value: "engineer" }] } },
      { type: "TEXTAREA", label: "What workflow are you trying to upgrade?", placeholder: "Describe your current pain", required: true },
    ],
  },
  {
    category: "Startup",
    title: "Customer Discovery Sprint",
    description: "Interview-ready form for validating pain, budget, urgency, and segments.",
    gradient: "from-teal-300 via-sky-400 to-indigo-500",
    stats: "3.8K uses",
    completion: 71,
    theme: "Startup Pitch Deck",
    fields: [
      { type: "TEXT", label: "What job are you trying to get done?", placeholder: "Describe the job", required: true },
      { type: "RATING", label: "How painful is this today?", placeholder: "", required: true, config: { min: 1, max: 10, step: 1 } },
      { type: "EMAIL", label: "Can we follow up?", placeholder: "name@company.com", required: false },
    ],
  },
  {
    category: "Gaming",
    title: "Tournament Signup",
    description: "Player registration with roles, platform, team preference, and skill rating.",
    gradient: "from-violet-500 via-orange-400 to-rose-400",
    stats: "4.6K uses",
    completion: 79,
    theme: "Gaming Arena RGB",
    fields: [
      { type: "TEXT", label: "What is your gamer tag?", placeholder: "PlayerOne", required: true },
      { type: "SELECT", label: "Primary role", placeholder: "Choose role", required: true, config: { options: [{ label: "Duelist", value: "duelist" }, { label: "Support", value: "support" }, { label: "Strategist", value: "strategist" }] } },
      { type: "CHECKBOX", label: "I can join the Discord before match day", placeholder: "", required: true },
    ],
  },
] satisfies TemplateCard[];

const quickActivity = [
  ["Someone from Tokyo submitted your form", "2m ago", Globe2],
  ["Cyberpunk theme was applied", "11m ago", Palette],
  ["Startup Pitch reached 1K responses", "28m ago", TrendingUp],
  ["Question 5 drop-off insight generated", "1h ago", Wand2],
] satisfies Array<[string, string, LucideIcon]>;

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

const newDraftForm = (): DraftForm => ({
  title: "Customer feedback form",
  description: "Collect clear, useful answers from your audience.",
  slug: `form-${Date.now().toString(36)}`,
  visibility: "PRIVATE",
  status: "DRAFT",
  fields: [
    { ...emptyField(0, "EMAIL"), required: true },
    { ...emptyField(1, "TEXTAREA"), label: "What should we improve next?", required: true },
  ],
});

export default function DashboardPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { error, isLoading, user } = useUserInfo();
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftForm>(() => newDraftForm());
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState("");
  const [device, setDevice] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");
  const [theme, setTheme] = useState("Glassmorphic Dark");

  const formsQuery = trpc.form.listMyForms.useQuery(undefined, { enabled: Boolean(user) });
  const selectedFormQuery = trpc.form.getFormById.useQuery({ id: selectedFormId ?? "" }, { enabled: Boolean(selectedFormId && user) });
  const responsesQuery = trpc.form.getFormResponses.useQuery({ formId: selectedFormId ?? "" }, { enabled: Boolean(selectedFormId && user) });

  const createForm = trpc.form.createForm.useMutation({
    onSuccess: async (result) => {
      toast.success("Form created");
      setSelectedFormId(result.id);
      await utils.form.listMyForms.invalidate();
    },
    onError: (mutationError) => toast.error(mutationError.message || "Could not create form"),
  });
  const updateForm = trpc.form.updateForm.useMutation({
    onSuccess: async () => {
      toast.success("Form saved");
      await Promise.all([utils.form.listMyForms.invalidate(), utils.form.getFormById.invalidate()]);
    },
    onError: (mutationError) => toast.error(mutationError.message || "Could not save form"),
  });
  const publishForm = trpc.form.publishForm.useMutation({
    onSuccess: async () => {
      toast.success("Form published");
      await Promise.all([utils.form.listMyForms.invalidate(), utils.form.getFormById.invalidate()]);
    },
    onError: (mutationError) => toast.error(mutationError.message || "Could not publish form"),
  });
  const unpublishForm = trpc.form.unpublishForm.useMutation({
    onSuccess: async () => {
      toast.success("Form moved to draft");
      await Promise.all([utils.form.listMyForms.invalidate(), utils.form.getFormById.invalidate()]);
    },
    onError: (mutationError) => toast.error(mutationError.message || "Could not unpublish form"),
  });

  const forms = useMemo(() => (formsQuery.data ?? []) as FormSummary[], [formsQuery.data]);
  const responseData = responsesQuery.data as FormResponse | undefined;
  const selectedField = draft.fields[selectedFieldIndex] ?? draft.fields[0];
  const displayName = user?.fullName?.split(" ")[0] ?? "there";
  const draftSnapshot = useMemo(() => JSON.stringify(toPayload(draft)), [draft]);
  const hasUnsavedChanges = draftSnapshot !== lastSavedSnapshot;
  const isMutating = createForm.isPending || updateForm.isPending || publishForm.isPending || unpublishForm.isPending;
  const publicUrl = typeof window === "undefined" ? `/f/${draft.slug}` : `${window.location.origin}/f/${draft.slug}`;
  const totals = useMemo(() => getTotals(forms), [forms]);

  useEffect(() => {
    if (error) router.replace("/sign-in");
  }, [error, router]);

  useEffect(() => {
    if (!selectedFormId && forms[0]) setSelectedFormId(forms[0].id);
  }, [forms, selectedFormId]);

  useEffect(() => {
    const form = selectedFormQuery.data;
    if (!form) return;

    const nextDraft = {
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
    };
    setDraft(nextDraft);
    setLastSavedSnapshot(JSON.stringify(toPayload(nextDraft)));
    setSelectedFieldIndex(0);
  }, [selectedFormQuery.data]);

  if (isLoading || (!user && !error)) return <LoadingState />;
  if (!user) return null;

  const saveDraft = async () => {
    const payload = toPayload(draft);
    if (draft.id) {
      await updateForm.mutateAsync({ ...payload, id: draft.id });
      setLastSavedSnapshot(JSON.stringify(payload));
      return draft.id;
    }
    const result = await createForm.mutateAsync(payload);
    setDraft((current) => ({ ...current, id: result.id }));
    setLastSavedSnapshot(JSON.stringify(payload));
    return result.id;
  };

  const togglePublish = async () => {
    if (draft.visibility === "PRIVATE" && draft.status !== "PUBLISHED") {
      toast.error("Set visibility to Public or Unlisted before publishing");
      return;
    }
    if (!draft.id) {
      const formId = await saveDraft();
      await publishForm.mutateAsync({ formId });
      setDraft((current) => ({ ...current, status: "PUBLISHED" }));
      return;
    }
    if (draft.status === "PUBLISHED") {
      await unpublishForm.mutateAsync({ formId: draft.id });
      setDraft((current) => ({ ...current, status: "DRAFT" }));
      return;
    }
    await publishForm.mutateAsync({ formId: draft.id });
    setDraft((current) => ({ ...current, status: "PUBLISHED" }));
  };

  const createNew = () => {
    setSelectedFormId(null);
    setDraft(newDraftForm());
    setSelectedFieldIndex(0);
    setLastSavedSnapshot("");
    setActiveSection("forms");
  };

  const copyPublicUrl = async () => {
    if (!draft.id) {
      toast.error("Save the form before copying a share link");
      return;
    }
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied");
  };

  const addField = (type: FieldType) => {
    setDraft((current) => {
      const fields = [...current.fields, emptyField(current.fields.length, type)];
      setSelectedFieldIndex(fields.length - 1);
      return { ...current, fields };
    });
    setActiveSection("forms");
  };

  const useTemplate = (template: TemplateCard) => {
    const nextDraft: DraftForm = {
      title: template.title,
      description: template.description,
      slug: slugify(`${template.title}-${Date.now().toString(36)}`),
      visibility: "PRIVATE",
      status: "DRAFT",
      fields: template.fields.map((field, order) => ({
        type: field.type,
        label: field.label,
        description: field.description ?? "",
        placeholder: field.placeholder ?? "",
        required: field.required,
        order,
        config: field.config,
      })),
    };
    setDraft(nextDraft);
    setSelectedFormId(null);
    setSelectedFieldIndex(0);
    setLastSavedSnapshot("");
    setTheme(template.theme);
    setActiveSection("forms");
    toast.success(`${template.title} loaded into the builder`);
  };

  const applyTheme = (themeCard: ThemeCard) => {
    setTheme(themeCard.name);
    setActiveSection("forms");
    toast.success(`${themeCard.name} applied to the preview`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.13),transparent_34%),linear-gradient(225deg,rgba(244,63,94,0.11),transparent_32%),linear-gradient(180deg,#05070d,#0b1020_52%,#05070d)]" />
      <div className="PollIq-grid pointer-events-none fixed inset-0 opacity-[0.12]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1580px] gap-4 p-3 sm:p-4">
        <Sidebar activeSection={activeSection} onSelect={setActiveSection} open={sidebarOpen} onToggle={() => setSidebarOpen((current) => !current)} />

        <section className="min-w-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <Topbar displayName={displayName} hasUnsavedChanges={hasUnsavedChanges} />
          <div className="space-y-6 px-4 py-5 sm:px-6">
            {activeSection === "dashboard" ? (
              <DashboardHome forms={forms} totals={totals} onCreate={createNew} onExplore={() => setActiveSection("themes")} onOpenForms={() => setActiveSection("forms")} />
            ) : null}
            {activeSection === "forms" ? (
              <FormsWorkspace
                addField={addField}
                copyPublicUrl={copyPublicUrl}
                device={device}
                draft={draft}
                forms={forms}
                hasValidDraft={hasValidDraft(draft)}
                isLoadingForms={formsQuery.isLoading}
                isMutating={isMutating}
                onCreate={createNew}
                onDeviceChange={setDevice}
                onPublish={togglePublish}
                onSave={saveDraft}
                onSelectForm={setSelectedFormId}
                onThemeChange={setTheme}
                publicUrl={publicUrl}
                responseData={responseData}
                selectedField={selectedField}
                selectedFieldIndex={selectedFieldIndex}
                selectedFormId={selectedFormId}
                setDraft={setDraft}
                setSelectedFieldIndex={setSelectedFieldIndex}
                theme={theme}
              />
            ) : null}
            {activeSection === "explore" ? <ExploreSection onUseTemplate={useTemplate} /> : null}
            {activeSection === "themes" ? <ThemesSection onApplyTheme={applyTheme} selectedTheme={theme} /> : null}
            {activeSection === "analytics" ? <AnalyticsSection totals={totals} /> : null}
            {activeSection === "responses" ? <ResponsesSection data={responseData} fields={draft.fields} isLoading={responsesQuery.isLoading} /> : null}
            {activeSection === "api" ? <ApiDocsSection /> : null}
            {activeSection === "settings" ? <SettingsSection /> : null}
          </div>
        </section>
      </div>

      <MobileNav activeSection={activeSection} onSelect={setActiveSection} onCreate={createNew} />
    </main>
  );
}

function Topbar({ displayName, hasUnsavedChanges }: { displayName: string; hasUnsavedChanges: boolean }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-teal-200">Good evening, {displayName}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Dashboard</h1>
          {hasUnsavedChanges ? <Badge className="border-amber-300/20 bg-amber-300/10 text-amber-100">Unsaved</Badge> : <Badge className="border-teal-300/20 bg-teal-300/10 text-teal-100">Saved</Badge>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="hidden h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 text-sm font-bold text-slate-300 transition hover:border-teal-300/40 hover:text-white md:flex" type="button">
          <Search className="size-4" />
          Search
          <span className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">K</span>
        </button>
        <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" size="icon" variant="outline">
          <Bell className="size-4" />
        </Button>
        <div className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-sm font-black text-teal-100 shadow-[0_0_28px_rgba(20,184,166,0.16)]">
          S
        </div>
      </div>
    </header>
  );
}

function Sidebar({ activeSection, onSelect, open, onToggle }: { activeSection: SectionId; onSelect: (section: SectionId) => void; open: boolean; onToggle: () => void }) {
  return (
    <aside className={`hidden shrink-0 rounded-lg border border-white/10 bg-black/30 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.42),0_0_60px_rgba(20,184,166,0.08)] backdrop-blur-2xl transition-all duration-300 lg:block ${open ? "w-64" : "w-[78px]"}`}>
      <div className="flex items-center justify-between gap-2">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <LogoMark />
          {open ? <span className="truncate text-xl font-black">PollIq</span> : null}
        </Link>
        <button aria-label={open ? "Collapse sidebar" : "Expand sidebar"} className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-teal-300/40 hover:text-white" onClick={onToggle} type="button">
          {open ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </button>
      </div>

      {open ? <p className="mt-7 px-3 text-xs font-black uppercase tracking-[0.24em] text-slate-500">Navigation</p> : null}
      <nav className="mt-3 space-y-1.5">
        {navigation.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              className={`group relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-lg px-3 text-sm font-bold transition ${
                active ? "bg-gradient-to-r from-white via-teal-100 to-white text-[#05070d] shadow-[0_0_34px_rgba(20,184,166,0.22)]" : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
              }`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={item.label}
              type="button"
            >
              <span className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full transition ${active ? "bg-teal-400 opacity-100" : "bg-teal-300 opacity-0 group-hover:opacity-60"}`} />
              <item.icon className={`size-4 shrink-0 ${active ? "text-[#05070d]" : "group-hover:text-teal-200"}`} />
              {open ? <span className="truncate">{item.label}</span> : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function DashboardHome({ forms, totals, onCreate, onExplore, onOpenForms }: { forms: FormSummary[]; totals: ReturnType<typeof getTotals>; onCreate: () => void; onExplore: () => void; onOpenForms: () => void }) {
  return (
    <>
      <HeroPanel onCreate={onCreate} onExplore={onExplore} />
      <Stats totals={totals} />
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <RecentForms forms={forms} onOpenForms={onOpenForms} />
        <LiveActivity />
      </section>
    </>
  );
}

function HeroPanel({ onCreate, onExplore }: { onCreate: () => void; onExplore: () => void }) {
  return (
    <section className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.34)] sm:p-6 xl:grid xl:min-h-[340px] xl:grid-cols-[1fr_420px] xl:gap-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.24),transparent_26%),radial-gradient(circle_at_78%_20%,rgba(244,63,94,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative flex min-h-[280px] flex-col justify-center">
        <Badge className="w-fit border-teal-300/20 bg-teal-300/10 text-teal-100">Immersive form OS</Badge>
        <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Build forms people actually enjoy filling.</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Create immersive experiences with futuristic themes, live previews, analytics, and a sharing flow that feels ready for real users.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button className="bg-white text-[#05070d] hover:bg-teal-100" onClick={onCreate}>
            <Sparkles className="size-4" />
            Create Experience
          </Button>
          <Button className="border-white/12 bg-white/[0.08] text-white hover:bg-white/12" onClick={onExplore} variant="outline">
            <Palette className="size-4" />
            Explore Themes
          </Button>
        </div>
      </div>
      <div className="relative mt-6 xl:mt-0">
        <LiveFormPreview />
      </div>
    </section>
  );
}

function LiveFormPreview() {
  return (
    <div className="relative mx-auto flex h-full min-h-[300px] max-w-[420px] items-center">
      <div className="absolute inset-8 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="relative w-full rounded-lg border border-white/15 bg-black/45 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-500 group-hover:-translate-y-1">
        <div className="flex items-center justify-between gap-3">
          <Badge className="border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-100">Question 1 of 4</Badge>
          <span className="text-xs font-bold text-slate-500">Live</span>
        </div>
        <h3 className="mt-8 text-3xl font-black leading-tight">What kind of experience should your form feel like?</h3>
        <div className="mt-6 grid gap-3">
          {["Anime launch portal", "Cyberpunk application", "Startup feedback sprint"].map((option, index) => (
            <button className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition ${index === 1 ? "border-teal-300 bg-teal-300/15 text-white" : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-teal-300/35"}`} key={option} type="button">
              {option}
            </button>
          ))}
        </div>
        <div className="mt-7 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Press Enter</span>
          <span className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-2/3 rounded-full bg-teal-300" /></span>
        </div>
      </div>
    </div>
  );
}

function Stats({ totals }: { totals: ReturnType<typeof getTotals> }) {
  const items = [
    { label: "Total Forms", value: totals.forms, icon: ClipboardList, spark: [30, 44, 36, 70, 54, 82, 74] },
    { label: "Responses", value: totals.responses, icon: MessageSquareText, spark: [22, 48, 40, 60, 76, 62, 88] },
    { label: "Completion Rate", value: `${totals.completion}%`, icon: Gauge, spark: [42, 50, 48, 64, 58, 72, 68] },
    { label: "Active Views", value: `${totals.views} live`, icon: Eye, spark: [18, 32, 46, 40, 58, 68, 84] },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div className="group rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.20)] transition hover:-translate-y-1 hover:border-teal-300/35 hover:shadow-[0_0_70px_rgba(20,184,166,0.12)]" key={item.label}>
          <div className="flex items-center justify-between gap-3">
            <div className="grid size-10 place-items-center rounded-lg border border-white/10 bg-black/25">
              <item.icon className="size-5 text-teal-200" />
            </div>
            <SparkLine values={item.spark} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-400">{item.label}</p>
          <p className="mt-1 text-3xl font-black">{typeof item.value === "number" ? formatCompactNumber(item.value) : item.value}</p>
        </div>
      ))}
    </section>
  );
}

function RecentForms({ forms, onOpenForms }: { forms: FormSummary[]; onOpenForms: () => void }) {
  const cards = forms.length ? forms.slice(0, 3) : demoForms;
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Recent Forms</h2>
          <p className="mt-1 text-sm text-slate-400">Cards with live status, not a spreadsheet.</p>
        </div>
        <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" onClick={onOpenForms} size="sm" variant="outline">
          Open builder
        </Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {cards.map((form, index) => (
          <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/24 p-3 transition duration-300 hover:-translate-y-1 hover:border-teal-300/35 hover:shadow-[0_0_70px_rgba(20,184,166,0.14)]" key={form.id}>
            <div className={`relative h-32 overflow-hidden rounded-lg bg-gradient-to-br ${["from-pink-400 via-rose-300 to-fuchsia-500", "from-cyan-300 via-violet-500 to-fuchsia-500", "from-teal-300 via-sky-400 to-indigo-500"][index % 3]}`}>
              <div className="absolute left-4 right-4 top-4 rounded-lg border border-white/30 bg-black/20 p-3 backdrop-blur-md">
                <div className="h-2 w-20 rounded-full bg-white/70" />
                <div className="mt-4 h-7 rounded-md border border-white/30 bg-white/15" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-5 rounded bg-white/20" />
                  <div className="h-5 rounded bg-white/35" />
                  <div className="h-5 rounded bg-white/20" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <StatusBadge status={form.status} />
              <h3 className="mt-3 min-h-12 text-lg font-black leading-6">{form.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                <span>{form.views ?? 0} views</span>
                <span>{form.responseCount ?? 0} responses</span>
              </div>
              <Progress className="mt-4 h-2 bg-white/10" value={Math.min(92, 42 + index * 16)} />
              <div className="mt-4 grid grid-cols-4 gap-2">
                {["Edit", "Preview", "Analytics", "Share"].map((action) => (
                  <button className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[11px] font-bold text-slate-300 transition hover:border-teal-300/35 hover:text-white" key={action} type="button">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LiveActivity() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <h2 className="text-xl font-black">Live Activity</h2>
      <div className="mt-5 space-y-3">
        {quickActivity.map(([activity, time, Icon]) => (
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/24 p-3" key={activity}>
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-300/10 text-teal-100">
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

function FormsWorkspace(props: {
  addField: (type: FieldType) => void;
  copyPublicUrl: () => void;
  device: "Desktop" | "Tablet" | "Mobile";
  draft: DraftForm;
  forms: FormSummary[];
  hasValidDraft: boolean;
  isLoadingForms: boolean;
  isMutating: boolean;
  onCreate: () => void;
  onDeviceChange: (device: "Desktop" | "Tablet" | "Mobile") => void;
  onPublish: () => void;
  onSave: () => Promise<string>;
  onSelectForm: (id: string) => void;
  onThemeChange: (theme: string) => void;
  publicUrl: string;
  responseData?: FormResponse;
  selectedField?: DraftField;
  selectedFieldIndex: number;
  selectedFormId: string | null;
  setDraft: Dispatch<SetStateAction<DraftForm>>;
  setSelectedFieldIndex: (index: number) => void;
  theme: string;
}) {
  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Form Builder</h2>
          <p className="mt-1 text-sm text-slate-400">Fields, live preview, and properties divided by purpose.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-white text-[#05070d] hover:bg-teal-100" disabled={props.isMutating} onClick={props.onCreate}>
            <FilePlus2 className="size-4" />
            New
          </Button>
          <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" disabled={props.isMutating || !props.hasValidDraft} onClick={props.onSave} variant="outline">
            <Save className="size-4" />
            Save
          </Button>
          <Button className="bg-teal-300 text-[#04201d] hover:bg-teal-200" disabled={props.isMutating || !props.hasValidDraft} onClick={props.onPublish}>
            {props.draft.status === "PUBLISHED" ? <Unlock className="size-4" /> : <Rocket className="size-4" />}
            {props.draft.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <FormList forms={props.forms} isLoading={props.isLoadingForms} selectedId={props.selectedFormId} onSelect={props.onSelectForm} />
        <FormDetails draft={props.draft} publicUrl={props.publicUrl} setDraft={props.setDraft} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <FieldLibrary addField={props.addField} fields={props.draft.fields} selectedFieldIndex={props.selectedFieldIndex} setSelectedFieldIndex={props.setSelectedFieldIndex} />
        <BuilderPreview device={props.device} draft={props.draft} onDeviceChange={props.onDeviceChange} onThemeChange={props.onThemeChange} theme={props.theme} />
        {props.selectedField ? (
          <FieldSettings
            field={props.selectedField}
            onChange={(field) => updateFieldAt(props.selectedFieldIndex, field, props.setDraft)}
            onDelete={() => removeFieldAt(props.selectedFieldIndex, props.setDraft, props.setSelectedFieldIndex)}
          />
        ) : null}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(300px,0.72fr)_minmax(420px,1.28fr)]">
        <PublishPanel draft={props.draft} publicUrl={props.publicUrl} onCopy={props.copyPublicUrl} />
        <ResponsesPanel data={props.responseData} fields={props.draft.fields} isLoading={false} />
      </section>
    </div>
  );
}

function FieldLibrary({ addField, fields, selectedFieldIndex, setSelectedFieldIndex }: { addField: (type: FieldType) => void; fields: DraftField[]; selectedFieldIndex: number; setSelectedFieldIndex: (index: number) => void }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <h3 className="text-lg font-black">Fields</h3>
      <p className="mt-1 text-sm text-slate-400">Add blocks, then pick one to edit.</p>
      <div className="mt-4 grid gap-2">
        {fieldTypes.map(([type, label, Icon]) => (
          <button className="group flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-black/24 px-3 text-left text-sm font-bold text-slate-300 transition hover:border-teal-300/40 hover:bg-teal-300/10 hover:text-white" key={type} onClick={() => addField(type)} type="button">
            <Icon className="size-4 text-teal-200 transition group-hover:scale-110" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-sm font-black text-slate-300">Current flow</p>
        <div className="mt-3 space-y-2">
          {fields.map((field, index) => (
            <button className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${selectedFieldIndex === index ? "border-teal-300/50 bg-teal-300/10" : "border-white/10 bg-black/24 hover:border-white/20"}`} key={`${field.id ?? "new"}-${index}`} onClick={() => setSelectedFieldIndex(index)} type="button">
              <GripVertical className="size-4 shrink-0 text-slate-500" />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{field.label}</span>
              {field.required ? <Check className="size-4 shrink-0 text-teal-200" /> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuilderPreview({ device, draft, onDeviceChange, onThemeChange, theme }: { device: "Desktop" | "Tablet" | "Mobile"; draft: DraftForm; onDeviceChange: (device: "Desktop" | "Tablet" | "Mobile") => void; onThemeChange: (theme: string) => void; theme: string }) {
  const width = device === "Mobile" ? "max-w-[360px]" : device === "Tablet" ? "max-w-[560px]" : "max-w-3xl";
  const firstField = draft.fields[0];
  const activeTheme = resolveTheme(theme);
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">Live Preview</h3>
          <p className="mt-1 text-sm text-slate-400">One question at a time, Typeform-style.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["Desktop", "Tablet", "Mobile"] as const).map((item) => (
            <button className={`rounded-md px-3 py-1.5 text-xs font-black transition ${device === item ? "bg-white text-[#05070d]" : "border border-white/10 bg-black/24 text-slate-400 hover:text-white"}`} key={item} onClick={() => onDeviceChange(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {themeCollections.map((item) => (
          <button className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-black transition ${activeTheme.key === item.key ? "border-teal-300 bg-teal-300/15 text-white" : "border-white/10 bg-black/20 text-slate-400 hover:text-white"}`} key={item.key} onClick={() => onThemeChange(item.name)} type="button">
            {item.shortName}
          </button>
        ))}
      </div>
      <div className="mt-5 flex justify-center rounded-lg border border-teal-300/20 bg-[#101820] p-5">
        <ThemeFormPreview className={`min-h-[430px] w-full ${width}`} field={firstField} questionCount={draft.fields.length} themeCard={activeTheme} />
      </div>
    </section>
  );
}

function FormList({ forms, isLoading, selectedId, onSelect }: { forms: FormSummary[]; isLoading: boolean; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black">Your forms</h3>
        <Badge className="border-white/10 bg-white/10 text-slate-100">{forms.length}</Badge>
      </div>
      <div className="mt-4 space-y-2">
        {isLoading ? <p className="text-sm text-slate-400">Loading forms...</p> : null}
        {!isLoading && !forms.length ? <p className="rounded-lg border border-dashed border-white/15 bg-black/20 p-4 text-sm leading-6 text-slate-400">Create your first form to start collecting responses.</p> : null}
        {forms.map((form) => (
          <button className={`w-full rounded-lg border p-3 text-left transition ${selectedId === form.id ? "border-teal-300/50 bg-teal-300/10" : "border-white/10 bg-black/24 hover:border-white/20"}`} key={form.id} onClick={() => onSelect(form.id)} type="button">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-100">{form.title}</p>
                <p className="mt-1 truncate text-xs text-slate-500">/{form.slug}</p>
              </div>
              <StatusBadge status={form.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
              <span>{form.responseCount ?? 0} responses</span>
              <span>{form.views ?? 0} views</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FormDetails({ draft, publicUrl, setDraft }: { draft: DraftForm; publicUrl: string; setDraft: Dispatch<SetStateAction<DraftForm>> }) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055]">
      <div className="border-b border-white/10 bg-black/20 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">Form Details</h3>
            <p className="mt-1 text-sm text-slate-400">Metadata, link, and visibility.</p>
          </div>
          <StatusBadge status={draft.status} />
        </div>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_190px_150px]">
        <FieldShell label="Title">
          <Input className="border-white/10 bg-black/25 text-white" onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} value={draft.title} />
        </FieldShell>
        <FieldShell label="Slug">
          <Input className="border-white/10 bg-black/25 text-white" onChange={(event) => setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))} value={draft.slug} />
        </FieldShell>
        <FieldShell label="Visibility">
          <select className="h-9 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm font-semibold text-white outline-none" onChange={(event) => setDraft((current) => ({ ...current, visibility: event.target.value as Visibility }))} value={draft.visibility}>
            <option value="PRIVATE">Private</option>
            <option value="UNLISTED">Unlisted</option>
            <option value="PUBLIC">Public</option>
          </select>
        </FieldShell>
        <div className="lg:col-span-3">
          <FieldShell label="Description">
            <Textarea className="min-h-20 border-white/10 bg-black/25 text-white" onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} value={draft.description} />
          </FieldShell>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/24 px-3 py-2 text-xs font-semibold text-slate-400">
            <Link2 className="size-4 shrink-0 text-teal-200" />
            <span className="break-all">{publicUrl}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div>
      <Label className="mb-2 block text-slate-300">{label}</Label>
      {children}
    </div>
  );
}

function FieldSettings({ field, onChange, onDelete }: { field: DraftField; onChange: (field: DraftField) => void; onDelete: () => void }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">Properties</h3>
          <p className="mt-1 text-sm text-slate-400">Controls for the selected field.</p>
        </div>
        <Button className="border-rose-300/20 bg-rose-300/10 text-rose-100 hover:bg-rose-300/20" onClick={onDelete} size="icon-sm" variant="outline">
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        <FieldShell label="Type">
          <select className="h-9 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm font-semibold text-white outline-none" onChange={(event) => onChange(normalizeFieldForType(field, event.target.value as FieldType))} value={field.type}>
            {fieldTypes.map(([type, label]) => <option key={type} value={type}>{label}</option>)}
          </select>
        </FieldShell>
        <FieldShell label="Label">
          <Input className="border-white/10 bg-black/25 text-white" onChange={(event) => onChange({ ...field, label: event.target.value })} value={field.label} />
        </FieldShell>
        <FieldShell label="Placeholder">
          <Input className="border-white/10 bg-black/25 text-white" onChange={(event) => onChange({ ...field, placeholder: event.target.value })} value={field.placeholder ?? ""} />
        </FieldShell>
        <FieldShell label="Help text">
          <Textarea className="min-h-16 border-white/10 bg-black/25 text-white" onChange={(event) => onChange({ ...field, description: event.target.value })} value={field.description ?? ""} />
        </FieldShell>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/24 p-3">
          <div>
            <p className="text-sm font-black">Required</p>
            <p className="mt-1 text-xs text-slate-500">Validated when a response is submitted.</p>
          </div>
          <Switch checked={field.required} onCheckedChange={(checked) => onChange({ ...field, required: checked })} />
        </div>
        {optionFieldTypes.has(field.type) ? <OptionsEditor field={field} onChange={onChange} /> : null}
        {field.type === "RATING" ? <RatingSettings field={field} onChange={onChange} /> : null}
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
        <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" onClick={() => onChange({ ...field, config: { ...field.config, options: [...options, { label: `Option ${options.length + 1}`, value: `option-${options.length + 1}` }] } })} size="sm" type="button" variant="outline">
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      <div className="mt-2 space-y-2">
        {options.map((option, index) => (
          <div className="flex gap-2" key={`${option.value}-${index}`}>
            <Input className="border-white/10 bg-black/25 text-white" onChange={(event) => {
              const next = [...options];
              next[index] = { label: event.target.value, value: slugify(event.target.value) || `option-${index + 1}` };
              onChange({ ...field, config: { ...field.config, options: next } });
            }} value={option.label} />
            <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" onClick={() => onChange({ ...field, config: { ...field.config, options: options.filter((_, optionIndex) => optionIndex !== index) } })} size="icon" type="button" variant="outline">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingSettings({ field, onChange }: { field: DraftField; onChange: (field: DraftField) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldShell label="Min">
        <Input className="border-white/10 bg-black/25 text-white" min={0} onChange={(event) => onChange({ ...field, config: { ...field.config, min: Number(event.target.value) } })} type="number" value={field.config?.min ?? 1} />
      </FieldShell>
      <FieldShell label="Max">
        <Input className="border-white/10 bg-black/25 text-white" min={1} onChange={(event) => onChange({ ...field, config: { ...field.config, max: Number(event.target.value) } })} type="number" value={field.config?.max ?? 5} />
      </FieldShell>
    </div>
  );
}

function PublishPanel({ draft, publicUrl, onCopy }: { draft: DraftForm; publicUrl: string; onCopy: () => void }) {
  const publicReady = draft.status === "PUBLISHED" && draft.visibility !== "PRIVATE";
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black">Publish Flow</h3>
        <StatusBadge status={draft.status} />
      </div>
      <div className="mt-4 space-y-3 rounded-lg border border-white/10 bg-black/24 p-3">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
          {publicReady ? <Globe2 className="size-4 text-teal-200" /> : draft.visibility === "PRIVATE" ? <Lock className="size-4 text-rose-200" /> : <ShieldAlert className="size-4 text-amber-200" />}
          {publicReady ? "Your form is live and ready to share." : draft.visibility === "PRIVATE" ? "Choose Public or Unlisted before publishing." : "Save and publish to activate the share link."}
        </div>
        <div className="break-all text-xs leading-5 text-slate-500">{publicUrl}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button className="border-white/12 bg-white/[0.06] text-white hover:bg-white/10" disabled={!draft.id} onClick={onCopy} variant="outline">
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

function ResponsesPanel({ data, fields, isLoading }: { data?: FormResponse; fields: DraftField[]; isLoading: boolean }) {
  const latest = data?.responses.slice(-4).reverse() ?? [];
  const answersByResponse = new Map<string, number>();
  data?.answers.forEach((answer) => answersByResponse.set(answer.responseId, (answersByResponse.get(answer.responseId) ?? 0) + 1));
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black">Responses</h3>
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

function ExploreSection({ onUseTemplate }: { onUseTemplate: (template: TemplateCard) => void }) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("Trending");
  const [query, setQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateCard>(templateCards[0]!);
  const categories = ["Trending", "Anime", "Cyberpunk", "Startup", "Gaming"] satisfies TemplateCategory[];
  const visibleTemplates = templateCards.filter((template) => {
    const matchesCategory = activeCategory === "Trending" ? template.category === "Trending" || template.completion >= 78 : template.category === activeCategory;
    const matchesQuery = `${template.title} ${template.description} ${template.theme}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <SectionShell title="Explore" subtitle="Production-ready templates with real builder handoff, search, and cinematic previews.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input className="border-white/10 bg-black/25 pl-9 text-white" onChange={(event) => setQuery(event.target.value)} placeholder="Search templates, use cases, themes..." value={query} />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    className={`rounded-md border px-3 py-2 text-xs font-black transition ${
                      activeCategory === category ? "border-teal-300 bg-teal-300/15 text-white" : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
                    }`}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {visibleTemplates.map((template) => (
              <TemplateCardView
                key={template.title}
                onSelect={() => setSelectedTemplate(template)}
                onUse={() => onUseTemplate(template)}
                selected={selectedTemplate.title === template.title}
                template={template}
              />
            ))}
          </div>

          {!visibleTemplates.length ? (
            <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
              <Sparkles className="mx-auto size-7 text-teal-200" />
              <h3 className="mt-4 text-xl font-black">No templates found</h3>
              <p className="mt-2 text-sm text-slate-400">Try a different search or category.</p>
            </div>
          ) : null}
        </div>

        <TemplatePreviewPanel onUseTemplate={onUseTemplate} template={selectedTemplate} />
      </div>
    </SectionShell>
  );
}

function TemplateCardView({ onSelect, onUse, selected, template }: { onSelect: () => void; onUse: () => void; selected: boolean; template: TemplateCard }) {
  return (
    <article className={`group overflow-hidden rounded-lg border bg-white/[0.055] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(20,184,166,0.14)] ${selected ? "border-teal-300/50" : "border-white/10 hover:border-teal-300/35"}`}>
      <button className="block w-full text-left" onClick={onSelect} type="button">
        <div className={`relative h-40 overflow-hidden rounded-lg bg-gradient-to-br ${template.gradient}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.38),transparent_18%),linear-gradient(135deg,rgba(0,0,0,0.04),rgba(0,0,0,0.34))]" />
          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/25 bg-black/20 p-3 backdrop-blur-md transition duration-300 group-hover:-translate-y-1">
            <div className="h-2 w-24 rounded-full bg-white/70" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="h-6 rounded bg-white/20" />
              <div className="h-6 rounded bg-white/35" />
              <div className="h-6 rounded bg-white/20" />
            </div>
          </div>
          <Badge className="absolute left-3 top-3 border-black/10 bg-black/25 text-white backdrop-blur">{template.category}</Badge>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">{template.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{template.description}</p>
          </div>
          <span className="shrink-0 rounded-md border border-teal-300/20 bg-teal-300/10 px-2 py-1 text-xs font-black text-teal-100">{template.completion}%</span>
        </div>
      </button>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs font-semibold text-slate-500">
        <span>{template.stats}</span>
        <span>{template.fields.length} fields</span>
      </div>
      <Button className="mt-4 w-full bg-white text-[#05070d] hover:bg-teal-100" onClick={onUse} size="sm">
        <FilePlus2 className="size-4" />
        Use template
      </Button>
    </article>
  );
}

function TemplatePreviewPanel({ onUseTemplate, template }: { onUseTemplate: (template: TemplateCard) => void; template: TemplateCard }) {
  return (
    <aside className="sticky top-4 h-fit rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
      <div className={`relative h-56 overflow-hidden rounded-lg bg-gradient-to-br ${template.gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.36),transparent_18%),linear-gradient(180deg,transparent,rgba(0,0,0,0.45))]" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="border-white/20 bg-black/25 text-white backdrop-blur">{template.theme}</Badge>
          <h3 className="mt-3 text-2xl font-black leading-tight">{template.title}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{template.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <MetricPill label="Uses" value={template.stats} />
        <MetricPill label="Complete" value={`${template.completion}%`} />
        <MetricPill label="Fields" value={String(template.fields.length)} />
      </div>
      <div className="mt-5 space-y-2">
        {template.fields.map((field, index) => (
          <div className="rounded-lg border border-white/10 bg-black/24 p-3" key={`${template.title}-${field.label}`}>
            <p className="text-xs font-bold text-slate-500">Question {index + 1}</p>
            <p className="mt-1 text-sm font-black">{field.label}</p>
          </div>
        ))}
      </div>
      <Button className="mt-5 w-full bg-teal-300 text-[#04201d] hover:bg-teal-200" onClick={() => onUseTemplate(template)}>
        <Rocket className="size-4" />
        Load into builder
      </Button>
    </aside>
  );
}

function ThemesSection({ onApplyTheme, selectedTheme }: { onApplyTheme: (theme: ThemeCard) => void; selectedTheme: string }) {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>("All");
  const [selected, setSelected] = useState<ThemeCard>(resolveTheme(selectedTheme));
  const categories = ["All", "Cyberpunk", "Anime", "Hacker", "Space", "Gaming", "Premium", "Business", "Retro", "Default"] satisfies ThemeCategory[];
  const visibleThemes = activeCategory === "All" ? themeCollections : themeCollections.filter((themeCard) => themeCard.category === activeCategory);

  return (
    <SectionShell title="Themes" subtitle="A live gallery where cards wake up on hover and apply directly to the form preview.">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(244,63,94,0.14),transparent_30%)]" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_450px]">
          <div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  className={`shrink-0 rounded-md border px-3 py-2 text-xs font-black transition ${
                    activeCategory === category ? "border-teal-300 bg-teal-300/15 text-white" : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
                  }`}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-5 grid auto-rows-fr gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {visibleThemes.map((themeCard) => (
                <ThemeCardView
                  active={selected.key === themeCard.key}
                  applied={resolveTheme(selectedTheme).key === themeCard.key}
                  key={themeCard.name}
                  onApply={() => onApplyTheme(themeCard)}
                  onSelect={() => setSelected(themeCard)}
                  themeCard={themeCard}
                />
              ))}
            </div>
          </div>
          <ThemePreviewPanel onApplyTheme={onApplyTheme} selected={selected} selectedTheme={selectedTheme} />
        </div>
      </section>
    </SectionShell>
  );
}

function ThemeCardView({ active, applied, onApply, onSelect, themeCard }: { active: boolean; applied: boolean; onApply: () => void; onSelect: () => void; themeCard: ThemeCard }) {
  return (
    <article className={`group theme-tilt overflow-hidden rounded-lg border bg-black/24 p-4 transition duration-300 hover:shadow-[0_0_70px_rgba(20,184,166,0.14)] ${active ? "border-teal-300/50" : "border-white/10 hover:border-teal-300/35"}`}>
      <button className="block w-full text-left" onClick={onSelect} type="button">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{themeCard.category}</p>
        <div className={`theme-hologram relative mt-4 h-44 overflow-hidden rounded-lg bg-gradient-to-br ${themeCard.surface}`}>
          <ThemeAtmosphere themeKey={themeCard.key} compact />
          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/25 bg-black/20 p-3 backdrop-blur-md transition group-hover:-translate-y-1">
            <div className="h-2 w-20 rounded-full bg-white/70" />
            <div className="mt-3 h-8 rounded-md border border-white/25 bg-white/15" />
          </div>
          {applied ? <Badge className="absolute right-3 top-3 border-teal-300/20 bg-teal-300/20 text-teal-50">Applied</Badge> : null}
        </div>
        <h3 className="mt-4 text-xl font-black">{themeCard.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{themeCard.tone}</p>
      </button>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs font-semibold text-slate-500">
        <span>{themeCard.motion}</span>
        <span className="text-teal-100">{themeCard.conversion}</span>
      </div>
      <Button className="mt-4 w-full border-white/12 bg-white/[0.06] text-white hover:bg-white/10" onClick={onApply} size="sm" variant="outline">
        <Palette className="size-4" />
        Apply theme
      </Button>
    </article>
  );
}

function ThemePreviewPanel({ onApplyTheme, selected, selectedTheme }: { onApplyTheme: (theme: ThemeCard) => void; selected: ThemeCard; selectedTheme: string }) {
  return (
    <aside className="sticky top-4 h-fit rounded-lg border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
      <ThemeFormPreview className="min-h-[420px]" questionCount={4} themeCard={selected} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <MetricPill label="Accent" value={selected.accent} />
        <MetricPill label="Type" value={selected.typography} />
        <MetricPill label="Motion" value={selected.motion} />
      </div>
      <Button className="mt-5 w-full bg-white text-[#05070d] hover:bg-teal-100" onClick={() => onApplyTheme(selected)}>
        <Wand2 className="size-4" />
        {resolveTheme(selectedTheme).key === selected.key ? "Applied" : "Apply to builder"}
      </Button>
    </aside>
  );
}

function ThemeFormPreview({ className = "", field, questionCount, themeCard }: { className?: string; field?: DraftField; questionCount: number; themeCard: ThemeCard }) {
  const [light, setLight] = useState({ x: 48, y: 28 });
  const prompt = field?.label || samplePrompt(themeCard.key);
  const style = {
    "--mouse-x": `${light.x}%`,
    "--mouse-y": `${light.y}%`,
  } as CSSProperties;

  const updateLight = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setLight({
      x: Math.round(((event.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((event.clientY - rect.top) / rect.height) * 100),
    });
  };

  return (
    <div
      className={`theme-preview theme-${themeCard.key} relative overflow-hidden rounded-lg border p-6 transition-all ${className}`}
      onMouseMove={updateLight}
      style={style}
    >
      <ThemeAtmosphere themeKey={themeCard.key} />
      <div className="theme-light pointer-events-none absolute inset-0" />
      <div className="relative flex min-h-[360px] flex-col justify-center">
        <Badge className="theme-badge w-fit border-white/20 bg-black/25 text-white backdrop-blur">Question 1 of {questionCount}</Badge>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] opacity-70">{themeCard.shortName} mode</p>
        <h4 className="theme-title mt-5 text-3xl font-black leading-tight sm:text-4xl">{prompt}</h4>
        <div className="mt-7">{field ? renderPreviewControl(field) : <ThemeSampleInput themeKey={themeCard.key} />}</div>
        <div className="mt-8 flex items-center justify-between gap-3 text-xs font-semibold opacity-75">
          <span>{themeCard.motion}</span>
          <span className="theme-key rounded-md border px-2 py-1">{themeCard.key === "hacker" ? "RETURN" : "Enter"}</span>
        </div>
      </div>
    </div>
  );
}

function ThemeAtmosphere({ compact = false, themeKey }: { compact?: boolean; themeKey: ThemeKey }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${resolveTheme(themeKey).surface}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.28),transparent_18%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.52))]" />
      {themeKey === "cyberpunk" ? <><div className="cyber-grid absolute inset-0" /><div className="cyber-particles absolute inset-0" /><div className="theme-scanline absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-cyan-300/0 via-cyan-300/18 to-cyan-300/0" /></> : null}
      {themeKey === "sakura" ? <><div className="sakura-clouds absolute inset-0" /><div className="sakura-petals absolute inset-0" /></> : null}
      {themeKey === "hacker" ? <><div className="matrix-rain absolute inset-0" /><div className="crt-lines absolute inset-0" /></> : null}
      {themeKey === "space" ? <><div className="space-stars absolute inset-0" /><div className="radar-ring absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2" /><div className="theme-orbit absolute left-1/2 top-1/2 size-72 rounded-full border border-sky-300/25" /></> : null}
      {themeKey === "gaming" ? <><div className="gaming-hud absolute inset-0" /><div className="energy-particles absolute inset-0" /></> : null}
      {themeKey === "liquid" ? <><div className="liquid-reflection absolute inset-0" /><div className="absolute inset-8 rounded-[40%] bg-white/25 blur-3xl" /></> : null}
      {themeKey === "startup" ? <div className="startup-grid absolute inset-0" /> : null}
      {themeKey === "xp" ? <><div className="xp-clouds absolute inset-0" /><div className="crt-lines absolute inset-0 opacity-30" /></> : null}
      {themeKey === "glass" ? <><div className="glass-layers absolute inset-0" /><div className="PollIq-particles absolute inset-0" /></> : null}
      {compact ? <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" /> : null}
    </>
  );
}

function ThemeSampleInput({ themeKey }: { themeKey: ThemeKey }) {
  if (themeKey === "hacker") {
    return (
      <div className="font-mono">
        <p className="terminal-line overflow-hidden whitespace-nowrap text-sm text-[#00FF66]">operator@polliq:~$ answer --now</p>
        <button className="mt-4 w-full rounded-md border border-[#00FF66]/50 bg-[#00FF66]/10 px-4 py-3 text-left text-sm font-black text-[#00FF66]" type="button">&gt; continue</button>
      </div>
    );
  }
  return (
    <div className="theme-input rounded-lg border px-4 py-3 text-sm font-semibold">
      {themeKey === "sakura" ? "A soft cinematic moment" : themeKey === "xp" ? "Type your answer here..." : "Immersive and fast"}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/24 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-100">{value}</p>
    </div>
  );
}

function AnalyticsSection({ totals }: { totals: ReturnType<typeof getTotals> }) {
  return (
    <SectionShell title="Analytics" subtitle="Mission-control style metrics for form performance.">
      <Stats totals={totals} />
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
          <h3 className="text-xl font-black">Responses Over Time</h3>
          <div className="mt-6 h-64 rounded-lg border border-white/10 bg-black/24 p-5">
            <SparkLineLarge />
          </div>
        </section>
        <section className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-5">
          <ShieldAlert className="size-6 text-amber-100" />
          <h3 className="mt-4 text-xl font-black">Most users leave at Question 5</h3>
          <p className="mt-2 text-sm leading-6 text-amber-50/80">Shorten the question, add helper text, or move it later in the flow.</p>
        </section>
      </div>
    </SectionShell>
  );
}

function ResponsesSection({ data, fields, isLoading }: { data?: FormResponse; fields: DraftField[]; isLoading: boolean }) {
  return (
    <SectionShell title="Responses" subtitle="Submission list on the left, beautiful response preview on the right.">
      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <ResponsesPanel data={data} fields={fields} isLoading={isLoading} />
        <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
          <h3 className="text-xl font-black">Response Preview</h3>
          <div className="mt-5 space-y-4">
            {fields.slice(0, 4).map((field, index) => (
              <div className="rounded-lg border border-white/10 bg-black/24 p-4" key={`${field.id ?? field.label}-${index}`}>
                <p className="text-sm font-bold text-slate-400">Question</p>
                <p className="mt-1 font-black">{field.label}</p>
                <p className="mt-4 text-sm font-bold text-slate-400">Answer</p>
                <p className="mt-1 text-teal-100">{field.type === "EMAIL" ? "name@example.com" : "Sample respondent answer"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SectionShell>
  );
}

function ApiDocsSection() {
  return (
    <SectionShell title="API Docs" subtitle="Endpoint explorer for teams connecting PollIq to their stack.">
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
          <Code2 className="size-7 text-teal-200" />
          <h3 className="mt-4 text-xl font-black">Scalar Docs</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Open the generated API reference from your running backend.</p>
          <Button asChild className="mt-5 bg-white text-[#05070d] hover:bg-teal-100">
            <a href="http://localhost:8000/docs" rel="noreferrer" target="_blank">
              Open Docs
            </a>
          </Button>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/35 p-5 font-mono text-sm text-slate-300">
          <p className="text-teal-200">GET /health</p>
          <p className="mt-4 text-fuchsia-200">POST /api/forms/create</p>
          <p className="mt-4 text-sky-200">POST /trpc/form.submitResponse</p>
        </div>
      </section>
    </SectionShell>
  );
}

function SettingsSection() {
  const sections = ["Profile", "Workspace", "Appearance", "Billing", "API Keys"];
  return (
    <SectionShell title="Settings" subtitle="Minimal workspace controls grouped by responsibility.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => (
          <button className="rounded-lg border border-white/10 bg-white/[0.055] p-5 text-left transition hover:-translate-y-1 hover:border-teal-300/35" key={section} type="button">
            <Settings className="size-5 text-teal-200" />
            <p className="mt-4 font-black">{section}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Manage {section.toLowerCase()} preferences.</p>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

function SectionShell({ children, subtitle, title }: { children: ReactNode; subtitle: string; title: string }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function MobileNav({ activeSection, onCreate, onSelect }: { activeSection: SectionId; onCreate: () => void; onSelect: (section: SectionId) => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 lg:hidden">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/70 p-2 backdrop-blur-2xl">
        {navigation.slice(0, 5).map((item) => (
          <button className={`grid size-10 place-items-center rounded-lg transition ${activeSection === item.id ? "bg-white text-[#05070d]" : "text-slate-400 hover:text-white"}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
            <item.icon className="size-4" />
          </button>
        ))}
        <button className="grid size-11 place-items-center rounded-lg bg-teal-300 text-[#04201d]" onClick={onCreate} type="button">
          <Plus className="size-5" />
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
      <div className="rounded-lg border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-semibold text-slate-200">Loading your dashboard...</div>
    </main>
  );
}

function renderPreviewControl(field: DraftField) {
  if (field.type === "TEXTAREA") return <div className="h-24 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-500">{field.placeholder}</div>;
  if (optionFieldTypes.has(field.type)) {
    return (
      <div className="grid gap-2">
        {(field.config?.options ?? []).map((option) => (
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300" key={option.value}>{option.label}</div>
        ))}
      </div>
    );
  }
  if (field.type === "RATING") return <Progress className="h-2 bg-white/10" value={72} />;
  return <div className="h-10 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-500">{field.placeholder}</div>;
}

function StatusBadge({ status }: { status: Status }) {
  const className = status === "PUBLISHED" ? "border-teal-300/20 bg-teal-300/10 text-teal-100" : status === "ARCHIVED" ? "border-slate-300/20 bg-slate-300/10 text-slate-100" : "border-amber-300/20 bg-amber-300/10 text-amber-100";
  return <Badge className={className}>{status.toLowerCase()}</Badge>;
}

function LogoMark() {
  return (
    <div className="relative grid size-10 shrink-0 place-items-center rounded-lg border border-white/14 bg-white/[0.07] shadow-[0_0_34px_rgba(20,184,166,0.22)]">
      <Sparkles className="relative size-5 text-white" />
    </div>
  );
}

function SparkLine({ values }: { values: number[] }) {
  const points = values.map((value, index) => `${index * 14},${90 - value}`).join(" ");
  return (
    <svg aria-hidden="true" className="h-12 w-24 overflow-visible" viewBox="0 0 84 64">
      <polyline fill="none" points={points} stroke="rgba(20,184,166,0.18)" strokeWidth="8" />
      <polyline fill="none" points={points} stroke="#2DD4BF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function SparkLineLarge() {
  return (
    <svg className="h-full w-full" viewBox="0 0 640 220">
      <path d="M20 170 C 90 120, 120 150, 180 92 S 300 110, 360 58 S 500 80, 620 34" fill="none" stroke="rgba(45,212,191,0.9)" strokeLinecap="round" strokeWidth="5" />
      <path d="M20 190 H620" stroke="rgba(255,255,255,0.08)" />
      <path d="M20 140 H620" stroke="rgba(255,255,255,0.08)" />
      <path d="M20 90 H620" stroke="rgba(255,255,255,0.08)" />
    </svg>
  );
}

function updateFieldAt(index: number, field: DraftField, setDraft: Dispatch<SetStateAction<DraftForm>>) {
  setDraft((current) => ({ ...current, fields: current.fields.map((item, itemIndex) => (itemIndex === index ? { ...field, order: itemIndex } : item)) }));
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
    config: optionFieldTypes.has(type) ? field.config?.options?.length ? field.config : { options: [{ label: "Option 1", value: "option-1" }] } : type === "RATING" ? { min: 1, max: 5, step: 1 } : undefined,
  };
}

function normalizeConfig(config: unknown, type: FieldType): DraftField["config"] {
  if (config && typeof config === "object") return config as DraftField["config"];
  if (optionFieldTypes.has(type)) return { options: [{ label: "Option 1", value: "option-1" }] };
  if (type === "RATING") return { min: 1, max: 5, step: 1 };
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
      options: (field.config?.options ?? []).filter((option) => option.label.trim()).map((option) => ({ label: option.label.trim(), value: slugify(option.value || option.label) || "option" })),
    };
  }
  if (field.type === "RATING") return { min: field.config?.min ?? 1, max: field.config?.max ?? 5, step: field.config?.step ?? 1 };
  return field.config;
}

function hasValidDraft(draft: DraftForm) {
  return Boolean(draft.title.trim() && slugify(draft.slug) && draft.fields.length && draft.fields.every((field) => field.label.trim()));
}

function getTotals(forms: FormSummary[]) {
  const views = forms.reduce((sum, item) => sum + (item.views ?? 0), 0);
  const responses = forms.reduce((sum, item) => sum + (item.responseCount ?? 0), 0);
  const published = forms.filter((item) => item.status === "PUBLISHED").length;
  return { views, responses, published, forms: forms.length, completion: forms.length ? Math.min(92, 58 + published * 5) : 68 };
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function resolveTheme(value: string): ThemeCard {
  const normalized = value.toLowerCase();
  return themeCollections.find((themeCard) => themeCard.key === normalized || themeCard.name.toLowerCase() === normalized || themeCard.shortName.toLowerCase() === normalized || themeCard.name.toLowerCase().includes(normalized)) ?? themeCollections[0]!;
}

function samplePrompt(themeKey: ThemeKey) {
  switch (themeKey) {
    case "cyberpunk":
      return "What access level should your neon city pass unlock?";
    case "sakura":
      return "Which dreamy detail would make this event unforgettable?";
    case "hacker":
      return "Enter your root objective for this mission";
    case "space":
      return "Which planet should this mission explore first?";
    case "gaming":
      return "What role are you queueing for in the arena?";
    case "liquid":
      return "What should this premium request feel like?";
    case "startup":
      return "What pain point should this pitch solve first?";
    case "xp":
      return "Which classic internet memory should we bring back?";
    case "glass":
      return "What kind of experience should this form create?";
  }
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const demoForms: FormSummary[] = [
  { id: "demo-1", creatorId: "demo", title: "Anime Convention Form", slug: "anime-convention", visibility: "PUBLIC", status: "PUBLISHED", views: 2400, responseCount: 509 },
  { id: "demo-2", creatorId: "demo", title: "Gaming Tournament Signup", slug: "gaming-tournament", visibility: "UNLISTED", status: "PUBLISHED", views: 3100, responseCount: 842 },
  { id: "demo-3", creatorId: "demo", title: "Startup Pitch Form", slug: "startup-pitch", visibility: "PRIVATE", status: "DRAFT", views: 1800, responseCount: 312 },
] as unknown as FormSummary[];
