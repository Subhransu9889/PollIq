import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "TEXT",
  "TEXTAREA",
  "EMAIL",
  "NUMBER",
  "SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "RATING",
  "DATE",
]);

export const formVisibilitySchema = z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]);
export const formStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const fieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const fieldConfigSchema = z
  .object({
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
    defaultValue: z.string().optional(),
    options: z.array(fieldOptionSchema).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    minLength: z.number().int().positive().optional(),
    maxLength: z.number().int().positive().optional(),
    pattern: z.string().optional(),
    allowOther: z.boolean().optional(),
    multiple: z.boolean().optional(),
  })
  .passthrough()
  .optional();

export const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.array(z.number()),
  z.array(z.boolean()),
]);

export const createFormFieldInput = z.object({
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  config: fieldConfigSchema,
});

export const updateFormFieldInput = createFormFieldInput.partial().extend({
  id: z.string().uuid(),
});

export const createFormInput = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  slug: z.string().min(1).max(255).regex(/^[a-zA-Z0-9-_]+$/),
  visibility: formVisibilitySchema.default("PRIVATE"),
  status: formStatusSchema.default("DRAFT"),
  themeId: z.string().uuid().optional(),
  themeSlug: z.string().min(1).max(64).optional(),
  fields: z.array(createFormFieldInput.omit({ formId: true })).min(1),
});

export const updateFormInput = createFormInput.partial().extend({
  id: z.string().uuid(),
});

export const submitResponseInput = z.object({
  formSlug: z.string().min(1),
  respondentEmail: z.string().email().optional(),
  answers: z.array(
    z.object({
      fieldId: z.string().uuid(),
      value: answerValueSchema,
    }),
  ).min(1),
});

export const formListQueryInput = z.object({
  limit: z.number().int().positive().optional(),
  cursor: z.string().uuid().optional(),
});

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;
export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;
export type CreateFormInputType = z.infer<typeof createFormInput>;
export type UpdateFormInputType = z.infer<typeof updateFormInput>;
export type SubmitResponseInputType = z.infer<typeof submitResponseInput>;
export type AnswerValueType = z.infer<typeof answerValueSchema>;
