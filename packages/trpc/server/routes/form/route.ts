import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { formService, userService } from "../../services";
import { getAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputSchema,
  updateFormInputSchema,
  createFormFieldInputSchema,
  updateFormFieldInputSchema,
  deleteFormFieldInputSchema,
  submitResponseInputSchema,
  publishFormInputSchema,
  unpublishFormInputSchema,
  getFormBySlugInputSchema,
  getFormByIdInputSchema,
  createFormOutputSchema,
  formOutputSchema,
  formWithFieldsOutputSchema,
  getFormResponsesInputSchema,
  getFormResponsesOutputSchema,
} from "./model";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

async function getAuthenticatedUserId(ctx: any) {
  const token = getAuthenticationCookie(ctx);
  if (typeof token !== "string") {
    throw new Error("Unauthorized");
  }
  const user = await userService.verifyUserToken(token);
  return user.id as string;
}

export const formRouter = router({
  createForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create"),
        tags: TAGS,
        summary: "Create a new form",
      },
    })
    .input(createFormInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      return formService.createForm({ ...input, creatorId });
    }),

  updateForm: publicProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/update"),
        tags: TAGS,
        summary: "Update an existing form",
      },
    })
    .input(updateFormInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      return formService.updateForm({ ...input, creatorId });
    }),

  publishForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/publish"),
        tags: TAGS,
        summary: "Publish a form",
      },
    })
    .input(publishFormInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      return formService.publishForm(input.formId, creatorId);
    }),

  unpublishForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/unpublish"),
        tags: TAGS,
        summary: "Unpublish a form",
      },
    })
    .input(unpublishFormInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      return formService.unpublishForm(input.formId, creatorId);
    }),

  getFormBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/slug"),
        tags: TAGS,
        summary: "Get a published form by slug",
      },
    })
    .input(getFormBySlugInputSchema)
    .output(formWithFieldsOutputSchema)
    .query(async ({ input }) => {
      const form = await formService.getFormWithFieldsBySlug(input.slug);
      if (form.status !== "PUBLISHED" || form.visibility === "PRIVATE") {
        throw new Error("Form not available");
      }
      return form;
    }),

  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/id"),
        tags: TAGS,
        summary: "Get a form by id for the authenticated form owner",
      },
    })
    .input(getFormByIdInputSchema)
    .output(formWithFieldsOutputSchema)
    .query(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      const form = await formService.getFormWithFieldsById(input.id);
      if (form.creatorId !== creatorId) {
        throw new Error("Unauthorized");
      }
      return form;
    }),

  listPublicForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/public"),
        tags: TAGS,
        summary: "List published public forms",
      },
    })
    .input(z.undefined())
    .output(z.array(formOutputSchema))
    .query(async () => {
      return formService.listPublicForms();
    }),

  listMyForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/mine"),
        tags: TAGS,
        summary: "List forms owned by the authenticated user",
      },
    })
    .input(z.undefined())
    .output(z.array(formOutputSchema))
    .query(async ({ ctx }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      return formService.listMyForms(creatorId);
    }),

  createFormField: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/fields/create"),
        tags: TAGS,
        summary: "Create a new field for an existing form",
      },
    })
    .input(createFormFieldInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      const result = await formService.createField({ ...input, creatorId });
      if (!result.id) {
        throw new Error("Failed to create field");
      }
      return { id: result.id };
    }),

  updateFormField: publicProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/fields/update"),
        tags: TAGS,
        summary: "Update a form field",
      },
    })
    .input(updateFormFieldInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      const result = await formService.updateField({ ...input, creatorId });
      if (!result.id) {
        throw new Error("Failed to update field");
      }
      return { id: result.id };
    }),

  deleteFormField: publicProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/fields/delete"),
        tags: TAGS,
        summary: "Delete a form field",
      },
    })
    .input(deleteFormFieldInputSchema)
    .output(createFormOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      const result = await formService.deleteField(input.id, creatorId);
      if (!result.id) {
        throw new Error("Failed to delete field");
      }
      return { id: result.id };
    }),

  submitResponse: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/responses/submit"),
        tags: TAGS,
        summary: "Submit a response to a form",
      },
    })
    .input(submitResponseInputSchema)
    .output(z.object({ responseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return formService.submitResponse(input);
    }),

  getFormResponses: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/responses"),
        tags: TAGS,
        summary: "Get responses for a form owned by the authenticated user",
      },
    })
    .input(getFormResponsesInputSchema)
    .output(getFormResponsesOutputSchema)
    .query(async ({ ctx, input }) => {
      const creatorId = await getAuthenticatedUserId(ctx);
      return formService.getResponses(input.formId, creatorId);
    }),
});
