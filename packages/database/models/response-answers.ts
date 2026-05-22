import {
  pgTable,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { responsesTable } from "./responses";
import { formFieldsTable } from "./form-fields";

export const responseAnswersTable = pgTable("response_answers", {
    id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  responseId: uuid("response_id")
    .notNull()
    .references(() => responsesTable.id, {
      onDelete: "cascade",
    }),

  fieldId: uuid("field_id")
    .notNull()
    .references(() => formFieldsTable.id, {
      onDelete: "cascade",
    }),

  value: text("value")
    .notNull(),
});

export type SelectResponseAnswer = typeof responseAnswersTable.$inferSelect;
export type InsertResponseAnswer = typeof responseAnswersTable.$inferInsert;