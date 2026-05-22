import {
  pgTable,
  uuid,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { usersTable } from "../schema";
import { formsTable } from "./form";

export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),
  respondentId: uuid("respondent_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  respondentEmail: text("respondent_email"),

  ipHash: text("ip_hash"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type SelectResponse = typeof responsesTable.$inferSelect;
export type InsertResponse = typeof responsesTable.$inferInsert;