import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";


export const formViewsTable = pgTable("form_views", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),

  ipHash: text("ip_hash"),

  userAgent: text("user_agent"),

  country: text("country"),

  city: text("city"),

  viewedAt: timestamp("viewed_at")
    .defaultNow()
    .notNull(),
});

export type SelectFormView = typeof formViewsTable.$inferSelect;
export type InsertFormView = typeof formViewsTable.$inferInsert;