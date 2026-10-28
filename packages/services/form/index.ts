import { validateAnswers } from "./validation";
import { db, eq, and, inArray, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-fields";
import { responsesTable } from "@repo/database/models/responses";
import { responseAnswersTable } from "@repo/database/models/response-answers";
import { themesTable } from "@repo/database/models/themes";
import {
  createFormInput,
  updateFormInput,
  createFormFieldInput,
  updateFormFieldInput,
  submitResponseInput,
  CreateFormInputType,
  UpdateFormInputType,
  CreateFormFieldInputType,
  UpdateFormFieldInputType,
  SubmitResponseInputType,
  AnswerValueType,
} from "./model";

class FormService {
  private themePresets = {
    cyberpunk: {
      name: "Cyberpunk Neon City",
      background: "from-[#0B0F1A] via-[#1a0b2e] to-[#001f2f]",
      primaryColor: "#FF00FF",
      secondaryColor: "#00E5FF",
      accentColor: "#8B5CF6",
      fontFamily: "Space Grotesk",
    },
    sakura: {
      name: "Anime Sakura Dream",
      background: "from-[#FDF2F8] via-[#FBCFE8] to-[#C084FC]",
      primaryColor: "#F9A8D4",
      secondaryColor: "#C084FC",
      accentColor: "#831843",
      fontFamily: "Poppins",
    },
    hacker: {
      name: "Hacker Terminal",
      background: "from-black via-[#05140b] to-[#0D1117]",
      primaryColor: "#00FF66",
      secondaryColor: "#0D1117",
      accentColor: "#4ADE80",
      fontFamily: "JetBrains Mono",
    },
    space: {
      name: "Space Mission Control",
      background: "from-[#020617] via-[#0c1b3b] to-[#111052]",
      primaryColor: "#38BDF8",
      secondaryColor: "#818CF8",
      accentColor: "#E0F2FE",
      fontFamily: "Orbitron",
    },
    gaming: {
      name: "Gaming Arena RGB",
      background: "from-[#111827] via-[#3b1020] to-[#082619]",
      primaryColor: "#EF4444",
      secondaryColor: "#F59E0B",
      accentColor: "#10B981",
      fontFamily: "Rajdhani",
    },
    liquid: {
      name: "Apple Liquid Glass",
      background: "from-white via-[#dff7ff] to-[#f7e8ff]",
      primaryColor: "#FFFFFF",
      secondaryColor: "#DFF7FF",
      accentColor: "#7C3AED",
      fontFamily: "Geist",
    },
    startup: {
      name: "Startup Pitch Deck",
      background: "from-[#0F172A] via-[#182553] to-[#052f3b]",
      primaryColor: "#6366F1",
      secondaryColor: "#06B6D4",
      accentColor: "#F8FAFC",
      fontFamily: "Geist",
    },
    xp: {
      name: "Retro Windows XP",
      background: "from-[#245edb] via-[#3b8cff] to-[#58c241]",
      primaryColor: "#245EDB",
      secondaryColor: "#58C241",
      accentColor: "#FFFFFF",
      fontFamily: "Tahoma",
    },
    glass: {
      name: "Glassmorphic Dark",
      background: "from-[#05070d] via-[#101820] to-[#241039]",
      primaryColor: "#2DD4BF",
      secondaryColor: "#D946EF",
      accentColor: "#FFFFFF",
      fontFamily: "Geist",
    },
  } as const;

  private async getFormById(formId: string) {
    const results = await db.select().from(formsTable).where(eq(formsTable.id, formId)).limit(1);
    if (!results.length) {
      throw new Error("Form not found");
    }
    return results[0]!;
  }

  private async getFormBySlug(slug: string) {
    const results = await db.select().from(formsTable).where(eq(formsTable.slug, slug)).limit(1);
    if (!results.length) {
      throw new Error("Form not found");
    }
    return results[0]!;
  }

  private async getFormFields(formId: string) {
    return db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(formFieldsTable.order);
  }

  private async verifyOwnership(formId: string, creatorId: string) {
    const form = await this.getFormById(formId);
    if (form.creatorId !== creatorId) {
      throw new Error("Unauthorized");
    }
    return form;
  }

  private async resolveThemeId(themeSlug?: string | null, themeId?: string | null) {
    if (themeId) return themeId;
    if (!themeSlug) return undefined;

    const slug = themeSlug.toLowerCase();
    const existing = await db.select().from(themesTable).where(eq(themesTable.slug, slug)).limit(1);
    if (existing[0]) return existing[0].id;

    const preset =
      this.themePresets[slug as keyof typeof this.themePresets] ?? this.themePresets.glass;
    const created = await db
      .insert(themesTable)
      .values({
        slug,
        name: preset.name,
        background: preset.background,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        accentColor: preset.accentColor,
        fontFamily: preset.fontFamily,
      })
      .returning({ id: themesTable.id });

    return created[0]?.id;
  }

  private async attachTheme<T extends { themeId?: string | null }>(form: T) {
    if (!form.themeId) return { ...form, theme: null };
    const theme = await db
      .select()
      .from(themesTable)
      .where(eq(themesTable.id, form.themeId))
      .limit(1);
    return { ...form, theme: theme[0] ?? null };
  }

  public async createForm(payload: CreateFormInputType & { creatorId: string }) {
    const input = await createFormInput.parseAsync(payload);
    const { fields, themeSlug, ...formData } = input;
    const themeId = await this.resolveThemeId(themeSlug, formData.themeId);

    return db.transaction(async (tx) => {
      const [form] = await tx
        .insert(formsTable)
        .values({ ...formData, themeId, creatorId: payload.creatorId })
        .returning({ id: formsTable.id });
      if (!form) throw new Error("Failed to create form");
      await tx
        .insert(formFieldsTable)
        .values(
          fields.map(({ id: _id, ...field }, index) => ({
            ...field,
            formId: form.id,
            order: index,
          })),
        );
      return { id: form.id };
    });
  }

  public async updateForm(payload: UpdateFormInputType & { creatorId: string }) {
    const { id, fields, themeSlug, ...formUpdates } = await updateFormInput.parseAsync(payload);
    await this.verifyOwnership(id, payload.creatorId);
    const themeId = await this.resolveThemeId(themeSlug, formUpdates.themeId);
    const updates = themeId ? { ...formUpdates, themeId } : formUpdates;
    return db.transaction(async (tx) => {
      // Serialize edits and submissions so schema changes cannot race an answer write.
      await tx
        .select({ id: formsTable.id })
        .from(formsTable)
        .where(eq(formsTable.id, id))
        .for("update");
      if (Object.keys(updates).length)
        await tx.update(formsTable).set(updates).where(eq(formsTable.id, id));
      if (fields) {
        const existing = await tx
          .select()
          .from(formFieldsTable)
          .where(eq(formFieldsTable.formId, id));
        const existingIds = new Set(existing.map((field) => field.id));
        const incomingIds = fields.flatMap((field) => (field.id ? [field.id] : []));
        if (
          new Set(incomingIds).size !== incomingIds.length ||
          incomingIds.some((fieldId) => !existingIds.has(fieldId))
        )
          throw new Error("Invalid question identifiers");
        const removed = existing
          .filter((field) => !incomingIds.includes(field.id))
          .map((field) => field.id);
        const changedTypes = fields
          .filter(
            (field) =>
              field.id && existing.some((old) => old.id === field.id && old.type !== field.type),
          )
          .map((field) => field.id!);
        const affected = [...removed, ...changedTypes];
        if (affected.length) {
          const [answer] = await tx
            .select({ id: responseAnswersTable.id })
            .from(responseAnswersTable)
            .where(inArray(responseAnswersTable.fieldId, affected))
            .limit(1);
          if (answer)
            throw new Error(
              "Questions with responses cannot be removed or change type. Create a new form instead.",
            );
        }
        if (removed.length)
          await tx.delete(formFieldsTable).where(inArray(formFieldsTable.id, removed));
        for (const [order, field] of fields.entries()) {
          const { id: fieldId, ...data } = field;
          if (fieldId)
            await tx
              .update(formFieldsTable)
              .set({ ...data, order })
              .where(and(eq(formFieldsTable.id, fieldId), eq(formFieldsTable.formId, id)));
          else await tx.insert(formFieldsTable).values({ ...data, order, formId: id });
        }
      }
      return { id };
    });
  }

  public async publishForm(formId: string, creatorId: string) {
    const form = await this.verifyOwnership(formId, creatorId);
    if (form.visibility === "PRIVATE")
      throw new Error("Choose Public or Unlisted visibility before publishing");
    const fields = await this.getFormFields(formId);
    if (!fields.length) throw new Error("Add a question before publishing");
    await db.update(formsTable).set({ status: "PUBLISHED" }).where(eq(formsTable.id, formId));
    return { id: formId };
  }

  public async unpublishForm(formId: string, creatorId: string) {
    await this.verifyOwnership(formId, creatorId);
    await db.update(formsTable).set({ status: "DRAFT" }).where(eq(formsTable.id, formId));
    return { id: formId };
  }

  public async getFormWithFieldsBySlug(slug: string) {
    const form = await this.getFormBySlug(slug);
    const fields = await this.getFormFields(form.id);
    return { ...(await this.attachTheme(form)), fields };
  }

  public async getFormWithFieldsById(formId: string) {
    const form = await this.getFormById(formId);
    const fields = await this.getFormFields(formId);
    return { ...(await this.attachTheme(form)), fields };
  }

  public async listPublicForms() {
    const forms = await db
      .select()
      .from(formsTable)
      .where(and(eq(formsTable.visibility, "PUBLIC"), eq(formsTable.status, "PUBLISHED")))
      .orderBy(formsTable.createdAt);
    return Promise.all(forms.map((form) => this.attachTheme(form)));
  }

  public async listMyForms(creatorId: string) {
    const forms = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.creatorId, creatorId))
      .orderBy(formsTable.createdAt);
    return Promise.all(forms.map((form) => this.attachTheme(form)));
  }

  public async createField(payload: CreateFormFieldInputType & { creatorId: string }) {
    const input = await createFormFieldInput.parseAsync(payload);
    await this.verifyOwnership(input.formId, payload.creatorId);

    const result = await db
      .insert(formFieldsTable)
      .values(input)
      .returning({ id: formFieldsTable.id });

    return { id: result[0]?.id };
  }

  public async updateField(payload: UpdateFormFieldInputType & { creatorId: string }) {
    const input = await updateFormFieldInput.parseAsync(payload);
    if (!input.id) {
      throw new Error("Field id is required");
    }

    const fieldResults = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, input.id))
      .limit(1);
    if (!fieldResults[0]) {
      throw new Error("Field not found");
    }
    await this.verifyOwnership(fieldResults[0].formId, payload.creatorId);

    const { formId: _formId, id: _id, ...updates } = input;
    if (input.formId && input.formId !== fieldResults[0].formId)
      throw new Error("Cannot move a question to another form");
    if (input.type && input.type !== fieldResults[0].type) {
      const [answer] = await db
        .select({ id: responseAnswersTable.id })
        .from(responseAnswersTable)
        .where(eq(responseAnswersTable.fieldId, input.id))
        .limit(1);
      if (answer) throw new Error("Cannot change the type of a question with responses");
    }
    await db.update(formFieldsTable).set(updates).where(eq(formFieldsTable.id, input.id));

    return { id: input.id };
  }

  public async deleteField(fieldId: string, creatorId: string) {
    const fieldResults = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, fieldId))
      .limit(1);
    if (!fieldResults[0]) {
      throw new Error("Field not found");
    }
    await this.verifyOwnership(fieldResults[0].formId, creatorId);
    const [answer] = await db
      .select({ id: responseAnswersTable.id })
      .from(responseAnswersTable)
      .where(eq(responseAnswersTable.fieldId, fieldId))
      .limit(1);
    if (answer) throw new Error("Cannot delete a question with responses");
    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, fieldId));
    return { id: fieldId };
  }

  private serializeAnswerValue(value: AnswerValueType) {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
  }

  public async submitResponse(payload: SubmitResponseInputType) {
    const input = await submitResponseInput.parseAsync(payload);
    return db.transaction(async (tx) => {
      const [form] = await tx
        .select()
        .from(formsTable)
        .where(eq(formsTable.slug, input.formSlug))
        .for("update");
      if (!form || form.status !== "PUBLISHED" || form.visibility === "PRIVATE")
        throw new Error("Form not available for submission");
      const fields = await tx
        .select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, form.id))
        .orderBy(formFieldsTable.order);
      const validated = validateAnswers(fields, input.answers);
      const [response] = await tx
        .insert(responsesTable)
        .values({ formId: form.id, respondentEmail: input.respondentEmail })
        .returning({ id: responsesTable.id });
      if (!response) throw new Error("Failed to record response");
      if (validated.length)
        await tx
          .insert(responseAnswersTable)
          .values(
            validated.map((answer) => ({
              responseId: response.id,
              fieldId: answer.fieldId,
              value: this.serializeAnswerValue(answer.value),
            })),
          );
      await tx
        .update(formsTable)
        .set({ responseCount: sql`coalesce(${formsTable.responseCount}, 0) + 1` })
        .where(eq(formsTable.id, form.id));
      return { responseId: response.id };
    });
  }

  public async getResponses(formId: string, creatorId: string) {
    await this.verifyOwnership(formId, creatorId);
    const responses = await db
      .select()
      .from(responsesTable)
      .where(eq(responsesTable.formId, formId))
      .orderBy(responsesTable.createdAt);

    const responseIds = responses.map((item) => item.id);
    const answers = responseIds.length
      ? await db
          .select()
          .from(responseAnswersTable)
          .where(inArray(responseAnswersTable.responseId, responseIds))
      : [];

    return { responses, answers };
  }
}

export default FormService;
