import { db, eq, and, inArray } from "@repo/database";
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

    const preset = this.themePresets[slug as keyof typeof this.themePresets] ?? this.themePresets.glass;
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
    const theme = await db.select().from(themesTable).where(eq(themesTable.id, form.themeId)).limit(1);
    return { ...form, theme: theme[0] ?? null };
  }

  public async createForm(payload: CreateFormInputType & { creatorId: string }) {
    const input = await createFormInput.parseAsync(payload);
    const { fields, themeSlug, ...formData } = input;
    const themeId = await this.resolveThemeId(themeSlug, formData.themeId);

    const formResult = await db
      .insert(formsTable)
      .values({
        ...formData,
        themeId,
        creatorId: payload.creatorId,
      })
      .returning({ id: formsTable.id });

    const formId = formResult[0]?.id;
    if (!formId) {
      throw new Error("Failed to create form");
    }

    const fieldRecords = fields.map((field, index) => ({
      ...field,
      formId,
      order: field.order ?? index,
    }));

    if (fieldRecords.length) {
      await db.insert(formFieldsTable).values(fieldRecords);
    }

    return { id: formId };
  }

  public async updateForm(payload: UpdateFormInputType & { creatorId: string }) {
    const input = await updateFormInput.parseAsync(payload);
    const { id, fields, themeSlug, ...formUpdates } = input;

    if (!id) {
      throw new Error("Form id is required");
    }

    await this.verifyOwnership(id, payload.creatorId);
    const themeId = await this.resolveThemeId(themeSlug, formUpdates.themeId);
    const updates = themeId ? { ...formUpdates, themeId } : formUpdates;

    if (Object.keys(updates).length) {
      await db
        .update(formsTable)
        .set(updates)
        .where(eq(formsTable.id, id));
    }

    if (fields) {
      await db.delete(formFieldsTable).where(eq(formFieldsTable.formId, id));
      const fieldRecords = fields.map((field, index) => ({
        ...field,
        formId: id,
        order: field.order ?? index,
      }));
      if (fieldRecords.length) {
        await db.insert(formFieldsTable).values(fieldRecords);
      }
    }

    return { id };
  }

  public async publishForm(formId: string, creatorId: string) {
    await this.verifyOwnership(formId, creatorId);
    await db
      .update(formsTable)
      .set({ status: "PUBLISHED" })
      .where(eq(formsTable.id, formId));
    return { id: formId };
  }

  public async unpublishForm(formId: string, creatorId: string) {
    await this.verifyOwnership(formId, creatorId);
    await db
      .update(formsTable)
      .set({ status: "DRAFT" })
      .where(eq(formsTable.id, formId));
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

    const fieldResults = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, input.id)).limit(1);
    if (!fieldResults[0]) {
      throw new Error("Field not found");
    }
    await this.verifyOwnership(fieldResults[0].formId, payload.creatorId);

    await db
      .update(formFieldsTable)
      .set(input)
      .where(eq(formFieldsTable.id, input.id));

    return { id: input.id };
  }

  public async deleteField(fieldId: string, creatorId: string) {
    const fieldResults = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, fieldId)).limit(1);
    if (!fieldResults[0]) {
      throw new Error("Field not found");
    }
    await this.verifyOwnership(fieldResults[0].formId, creatorId);
    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, fieldId));
    return { id: fieldId };
  }

  private serializeAnswerValue(value: AnswerValueType) {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
  }

  private ensureRequiredAnswers(fields: Array<{ id: string; label: string; required: boolean }>, answers: Array<{ fieldId: string; value: AnswerValueType }>) {
    const missing = fields.find((field) => {
      if (!field.required) {
        return false;
      }
      const answer = answers.find((item) => item.fieldId === field.id);
      if (!answer) {
        return true;
      }
      const value = answer.value;
      if (value === null || value === undefined) {
        return true;
      }
      if (typeof value === "string" && value.trim() === "") {
        return true;
      }
      if (Array.isArray(value) && value.length === 0) {
        return true;
      }
      return false;
    });

    if (missing) {
      throw new Error(`Missing required answer for field: ${missing.label}`);
    }
  }

  public async submitResponse(payload: SubmitResponseInputType) {
    const input = await submitResponseInput.parseAsync(payload);
    const form = await this.getFormBySlug(input.formSlug);
    if (form.status !== "PUBLISHED" || form.visibility === "PRIVATE") {
      throw new Error("Form not available for submission");
    }

    const fields = await this.getFormFields(form.id);
    this.ensureRequiredAnswers(fields, input.answers);

    const responseResult = await db
      .insert(responsesTable)
      .values({
        formId: form.id,
        respondentEmail: input.respondentEmail,
      })
      .returning({ id: responsesTable.id });

    const responseId = responseResult[0]?.id;
    if (!responseId) {
      throw new Error("Failed to record response");
    }

    const answers = input.answers.map((answer) => ({
      responseId,
      fieldId: answer.fieldId,
      value: this.serializeAnswerValue(answer.value),
    }));

    await db.insert(responseAnswersTable).values(answers);
    await db
      .update(formsTable)
      .set({ responseCount: (form.responseCount ?? 0) + 1 })
      .where(eq(formsTable.id, form.id));

    return { responseId };
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
