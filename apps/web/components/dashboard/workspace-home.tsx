"use client";

import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  ClipboardList,
  FilePlus2,
  LayoutGrid,
  List,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export type WorkspaceForm = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  responseCount?: number | null;
  createdAt?: Date | string | null;
  theme?: { name: string; slug: string } | null;
};
type Filter = "ALL" | WorkspaceForm["status"];
const filters: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All forms" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Drafts" },
  { value: "ARCHIVED", label: "Archived" },
];

export function WorkspaceHome({
  forms,
  name,
  loading,
  failed,
  onCreate,
  onTemplates,
  onOpen,
  onResponses,
}: {
  forms: WorkspaceForm[];
  name: string;
  loading: boolean;
  failed: boolean;
  onCreate: () => void;
  onTemplates: () => void;
  onOpen: (id: string) => void;
  onResponses: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"newest" | "name" | "responses">("newest");
  const visible = useMemo(
    () =>
      forms
        .filter(
          (form) =>
            (filter === "ALL" || form.status === filter) &&
            `${form.title} ${form.description ?? ""}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.title.localeCompare(b.title)
            : sort === "responses"
              ? (b.responseCount ?? 0) - (a.responseCount ?? 0)
              : new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        ),
    [forms, filter, query, sort],
  );
  const published = forms.filter((form) => form.status === "PUBLISHED").length;
  const responses = forms.reduce((sum, form) => sum + (form.responseCount ?? 0), 0);
  const metrics = [
    {
      label: "Total forms",
      value: forms.length,
      icon: ClipboardList,
      note: "Your ideas, all in one place",
    },
    { label: "Published", value: published, icon: ArrowUpRight, note: "Ready for your audience" },
    { label: "Responses", value: responses, icon: MessageSquareText, note: "Every answer counts" },
    {
      label: "Drafts",
      value: forms.filter((form) => form.status === "DRAFT").length,
      icon: FilePlus2,
      note: "Good things in the making",
    },
  ];
  return (
    <div className="workspace-home">
      <div className="workspace-heading">
        <div>
          <span className="workspace-eyebrow">YOUR WORKSPACE</span>
          <h1>
            Welcome back, {name}
            <span>.</span>
          </h1>
          <p>A little curiosity. A lot of possibility. What will you create today?</p>
        </div>
        <button className="workspace-primary" onClick={onCreate}>
          <Plus size={16} /> Create a form
        </button>
      </div>
      <section className="workspace-metrics" aria-label="Workspace overview">
        {metrics.map(({ label, value, icon: Icon, note }) => (
          <article key={label}>
            <div>
              <span>{label}</span>
              <Icon size={16} />
            </div>
            <strong>{loading || failed ? "—" : value.toLocaleString()}</strong>
            <p>{note}</p>
          </article>
        ))}
      </section>
      <section className="workspace-start">
        <div className="workspace-start-icon">
          <Sparkles size={24} />
        </div>
        <div>
          <span className="workspace-eyebrow">SKIP THE BLANK CANVAS</span>
          <h2>Your next great form starts here.</h2>
          <p>Feedback, registrations, waitlists. Pick a starting point and make it yours.</p>
        </div>
        <button className="workspace-secondary" onClick={onTemplates}>
          Explore templates <ArrowUpRight size={16} />
        </button>
        <div className="workspace-start-decoration" aria-hidden="true">
          ✳
        </div>
      </section>
      <section aria-labelledby="your-forms-title">
        <div className="workspace-section-heading">
          <h2 id="your-forms-title">
            Your forms <span>{loading ? "…" : forms.length}</span>
          </h2>
          <div className="workspace-view" role="group" aria-label="Form layout">
            <button
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List size={17} />
            </button>
          </div>
        </div>
        <div className="workspace-toolbar">
          <div className="workspace-filters" role="group" aria-label="Filter forms">
            {filters.map(({ value, label }) => (
              <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
          <div className="workspace-tools">
            <div className="workspace-search">
              <Search size={15} />
              <input
                aria-label="Search forms"
                placeholder="Search your forms…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={14} />
                </button>
              )}
            </div>
            <label className="workspace-sort">
              <ArrowDown size={13} />
              <span className="sr-only">Sort forms</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                <option value="newest">Newest first</option>
                <option value="name">Name A–Z</option>
                <option value="responses">Most responses</option>
              </select>
            </label>
          </div>
        </div>
        {loading ? (
          <div className="workspace-form-grid" aria-label="Loading forms" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div className="workspace-skeleton" key={i} />
            ))}
          </div>
        ) : failed ? (
          <div className="workspace-empty">
            <ClipboardList size={28} />
            <h3>Your forms couldn’t be loaded</h3>
            <p>Use the retry action above to reconnect to your workspace.</p>
          </div>
        ) : !visible.length ? (
          <div className="workspace-empty">
            <div>
              <ClipboardList size={28} />
            </div>
            <h3>
              {forms.length ? "No forms match your search" : "Your first conversation starts here"}
            </h3>
            <p>
              {forms.length
                ? "Try another search or change the status filter."
                : "Create a form, share a link, and give your audience a voice."}
            </p>
            <button
              className="workspace-primary"
              onClick={
                forms.length
                  ? () => {
                      setQuery("");
                      setFilter("ALL");
                    }
                  : onCreate
              }
            >
              {forms.length ? "Clear filters" : "Create your first form"}
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <div className={`workspace-form-grid ${view === "list" ? "is-list" : ""}`}>
            {visible.map((form, index) => (
              <article className="workspace-form-card" key={form.id}>
                <button
                  className={`workspace-form-art artwork-${index % 4}`}
                  aria-label={`Edit ${form.title}`}
                  onClick={() => onOpen(form.id)}
                >
                  <div className="workspace-mini-form" aria-hidden="true">
                    <span>{form.theme?.name ?? "Your next conversation"}</span>
                    <strong>{form.title}</strong>
                    <i />
                    <i />
                    <b>
                      Let’s get started <ArrowUpRight size={12} />
                    </b>
                  </div>
                  <span className="workspace-art-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </button>
                <div className="workspace-form-body">
                  <div className="workspace-form-meta">
                    <span className={`workspace-status status-${form.status.toLowerCase()}`}>
                      <span />
                      {form.status === "PUBLISHED"
                        ? "Published"
                        : form.status === "DRAFT"
                          ? "Draft"
                          : "Archived"}
                    </span>
                    <span>{form.visibility.toLowerCase()}</span>
                  </div>
                  <button className="workspace-form-title" onClick={() => onOpen(form.id)}>
                    {form.title}
                  </button>
                  <p>{form.description || "Your next great conversation."}</p>
                  <div className="workspace-form-footer">
                    <button onClick={() => onResponses(form.id)}>
                      <MessageSquareText size={14} />
                      {form.responseCount ?? 0} responses
                    </button>
                    <button aria-label={`Open ${form.title}`} onClick={() => onOpen(form.id)}>
                      Edit form <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <button className="workspace-new-card" onClick={onCreate}>
              <span>
                <Plus size={22} />
              </span>
              <strong>Room for your next idea</strong>
              <p>Create a new form</p>
            </button>
          </div>
        )}
      </section>
      <div className="workspace-bottom-note">
        <Check size={13} /> Your workspace. Your questions. Your next connection.
        <BarChart3 size={14} />
      </div>
    </div>
  );
}
