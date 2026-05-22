import { db, eq, and, inArray } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-fields";
import { responsesTable } from "@repo/database/models/responses";
import { responseAnswersTable } from "@repo/database/models/response-answers";
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

  public async createForm(payload: CreateFormInputType & { creatorId: string }) {
    const input = await createFormInput.parseAsync(payload);
    const { fields, ...formData } = input;

    const formResult = await db
      .insert(formsTable)
      .values({
        ...formData,
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
    const { id, fields, ...formUpdates } = input;

    if (!id) {
      throw new Error("Form id is required");
    }

    await this.verifyOwnership(id, payload.creatorId);

    if (Object.keys(formUpdates).length) {
      await db
        .update(formsTable)
        .set(formUpdates)
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
    return { ...form, fields };
  }

  public async getFormWithFieldsById(formId: string) {
    const form = await this.getFormById(formId);
    const fields = await this.getFormFields(formId);
    return { ...form, fields };
  }

  public async listPublicForms() {
    return db
      .select()
      .from(formsTable)
      .where(and(eq(formsTable.visibility, "PUBLIC"), eq(formsTable.status, "PUBLISHED")))
      .orderBy(formsTable.createdAt);
  }

  public async listMyForms(creatorId: string) {
    return db
      .select()
      .from(formsTable)
      .where(eq(formsTable.creatorId, creatorId))
      .orderBy(formsTable.createdAt);
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
