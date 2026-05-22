import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  integer,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";


export const fieldTypeEnum = pgEnum("field_type", [
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


export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),
   type: fieldTypeEnum("type")
    .notNull(),
   label: text("label")
    .notNull(),

  description: text("description"),

  placeholder: text("placeholder"),

  required: boolean("required")
    .notNull()
    .default(false),

  order: integer("order")
    .notNull()
    .default(0),

  config: jsonb("config"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;