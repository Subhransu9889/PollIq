import { z } from "zod";
import { fieldConfigSchema, type AnswerValueType } from "./model";

type Field = { id: string; label: string; type: string; required: boolean; config?: unknown };
type Answer = { fieldId: string; value: AnswerValueType };

/** Validate against the saved form, never against client-provided field metadata. */
export function validateAnswers(fields: Field[], answers: Answer[]) {
  const byId = new Map(answers.map((answer) => [answer.fieldId, answer.value]));
  if (byId.size !== answers.length) throw new Error("Duplicate answers are not allowed");
  const ids = new Set(fields.map((field) => field.id));
  if (answers.some((answer) => !ids.has(answer.fieldId)))
    throw new Error("Answer does not belong to this form");
  const visibleIds = new Set<string>();
  for (const field of fields) {
    const config = fieldConfigSchema.parse(field.config ?? undefined);
    const condition = config?.condition;
    if (condition) {
      const source = fields[condition.fieldOrder];
      const sourceAnswer = source && visibleIds.has(source.id) ? byId.get(source.id) : undefined;
      const matches = Array.isArray(sourceAnswer)
        ? sourceAnswer.map(String).includes(condition.equals)
        : sourceAnswer !== undefined && String(sourceAnswer) === condition.equals;
      if (!matches) continue;
    }
    visibleIds.add(field.id);
    const value = byId.get(field.id);
    const empty =
      value === undefined ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && !value.length);
    if (empty) {
      if (field.required) throw new Error(`Please answer: ${field.label}`);
      continue;
    }
    let valid = true;
    switch (field.type) {
      case "TEXT":
      case "TEXTAREA":
        valid = typeof value === "string";
        break;
      case "EMAIL":
        valid = typeof value === "string" && z.email().safeParse(value).success;
        break;
      case "NUMBER":
      case "RATING":
        valid =
          typeof value === "number" &&
          Number.isFinite(value) &&
          value >= (config?.min ?? (field.type === "RATING" ? 1 : -Infinity)) &&
          value <= (config?.max ?? (field.type === "RATING" ? 5 : Infinity));
        if (valid && typeof value === "number" && config?.step)
          valid =
            Math.abs(
              (value - (config.min ?? 0)) / config.step -
                Math.round((value - (config.min ?? 0)) / config.step),
            ) < 1e-8;
        if (field.type === "RATING" && typeof value === "number")
          valid = valid && Number.isInteger(value);
        break;
      case "CHECKBOX":
        valid = typeof value === "boolean" && (!field.required || value);
        break;
      case "SELECT":
        valid =
          typeof value === "string" &&
          Boolean(config?.options?.some((option) => option.value === value));
        break;
      case "MULTI_SELECT":
        valid =
          Array.isArray(value) &&
          new Set<string | number | boolean>(value).size === value.length &&
          value.every(
            (item) =>
              typeof item === "string" && config?.options?.some((option) => option.value === item),
          );
        break;
      case "DATE":
        valid =
          typeof value === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !Number.isNaN(Date.parse(value)) &&
          new Date(value).toISOString().slice(0, 10) === value;
        break;
      default:
        valid = false;
    }
    if (typeof value === "string") {
      valid =
        valid &&
        value.length >= (config?.minLength ?? 0) &&
        value.length <= (config?.maxLength ?? 100_000);
      if (config?.pattern === "url") {
        try {
          valid = valid && ["http:", "https:"].includes(new URL(value).protocol);
        } catch {
          valid = false;
        }
      }
    }
    if (!valid) throw new Error(`Invalid answer: ${field.label}`);
  }
  return answers.filter((answer) => visibleIds.has(answer.fieldId));
}
