"use client";

import { useState } from "react";

type PreviewField = {
  type:
    | "TEXT"
    | "TEXTAREA"
    | "EMAIL"
    | "NUMBER"
    | "SELECT"
    | "MULTI_SELECT"
    | "CHECKBOX"
    | "RATING"
    | "DATE";
  label: string;
  placeholder?: string;
  required: boolean;
  config?: {
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    maxLength?: number;
    step?: number;
  };
};
export function QuestionPreview({ field }: { field: PreviewField }) {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const common = {
    className: "theme-control w-full rounded-md border px-3 py-2 text-sm",
    "aria-label": `${field.label} (preview)`,
  };
  if (field.type === "TEXTAREA")
    return (
      <textarea
        {...common}
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={field.placeholder}
        maxLength={field.config?.maxLength}
      />
    );
  if (field.type === "SELECT")
    return (
      <select {...common} value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Choose an option</option>
        {field.config?.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  if (field.type === "MULTI_SELECT")
    return (
      <fieldset className="space-y-2">
        <legend className="sr-only">{field.label} (preview)</legend>
        {field.config?.options?.map((option) => (
          <label
            className="theme-option flex items-center gap-3 rounded-md border p-3 text-sm"
            key={option.value}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={(event) =>
                setSelected((current) =>
                  event.target.checked
                    ? [...current, option.value]
                    : current.filter((value) => value !== option.value),
                )
              }
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    );
  if (field.type === "CHECKBOX")
    return (
      <label className="theme-option flex items-center gap-3 rounded-md border p-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        {field.label}
      </label>
    );
  if (field.type === "RATING") {
    const min = Math.max(1, Math.min(10, field.config?.min ?? 1));
    const max = Math.max(min, Math.min(10, field.config?.max ?? 5));
    return (
      <div role="group" aria-label={`${field.label} (preview)`} className="flex flex-wrap gap-2">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((rating) => (
          <button
            type="button"
            className={`theme-rating-button grid size-9 place-items-center rounded-md border text-sm ${value === String(rating) ? "is-selected" : ""}`}
            aria-pressed={value === String(rating)}
            key={rating}
            onClick={() => setValue(String(rating))}
          >
            {rating}
          </button>
        ))}
      </div>
    );
  }
  return (
    <input
      {...common}
      type={
        field.type === "EMAIL"
          ? "email"
          : field.type === "NUMBER"
            ? "number"
            : field.type === "DATE"
              ? "date"
              : "text"
      }
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={field.placeholder || "Type your answer"}
      min={field.config?.min}
      max={field.config?.max}
      step={field.config?.step ?? "any"}
      maxLength={field.config?.maxLength}
    />
  );
}
