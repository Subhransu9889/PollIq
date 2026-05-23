import { z } from "zod";
import {
  createFormFieldInput,
  updateFormFieldInput,
  createFormInput,
  updateFormInput,
  submitResponseInput,
  formVisibilitySchema,
  formStatusSchema,
} from "@repo/services/form/model";

export const createFormInputSchema = createFormInput;
export const updateFormInputSchema = updateFormInput;
export const createFormFieldInputSchema = createFormFieldInput;
export const updateFormFieldInputSchema = updateFormFieldInput;
export const submitResponseInputSchema = submitResponseInput;

export const publishFormInputSchema = z.object({
  formId: z.string().uuid(),
});

export const unpublishFormInputSchema = z.object({
  formId: z.string().uuid(),
});

export const getFormBySlugInputSchema = z.object({
  slug: z.string().min(1).max(255),
});

export const getFormByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export const deleteFormFieldInputSchema = z.object({
  id: z.string().uuid(),
});

export const getFormResponsesInputSchema = z.object({
  formId: z.string().uuid(),
});

export const createFormOutputSchema = z.object({
  id: z.string().uuid(),
});

export const formFieldOutputSchema = createFormFieldInput.extend({
  id: z.string().uuid(),
  description: z.string().nullable().optional(),
  placeholder: z.string().nullable().optional(),
  config: z.unknown().nullable().optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  slug: z.string().min(1).max(255),
  visibility: formVisibilitySchema,
  status: formStatusSchema,
  themeId: z.string().uuid().nullable().optional(),
  views: z.number().int().nullable(),
  responseCount: z.number().int().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  theme: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable().optional(),
      previewImage: z.string().nullable().optional(),
      background: z.string().nullable().optional(),
      primaryColor: z.string().nullable().optional(),
      secondaryColor: z.string().nullable().optional(),
      accentColor: z.string().nullable().optional(),
      fontFamily: z.string().nullable().optional(),
      customCss: z.string().nullable().optional(),
      isPremium: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullable()
    .optional(),
});

export const formWithFieldsOutputSchema = formOutputSchema.extend({
  fields: z.array(formFieldOutputSchema),
});

export const formResponseAnswerOutputSchema = z.object({
  id: z.string().uuid(),
  responseId: z.string().uuid(),
  fieldId: z.string().uuid(),
  value: z.string(),
});

export const formResponseOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  respondentId: z.string().uuid().nullable().optional(),
  respondentEmail: z.string().email().nullable().optional(),
  ipHash: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getFormResponsesOutputSchema = z.object({
  responses: z.array(formResponseOutputSchema),
  answers: z.array(formResponseAnswerOutputSchema),
});
