import {
  pgTable,
  uuid,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const formAnalyticsTable = pgTable("form_analytics", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),

  totalViews: integer("total_views")
    .default(0)
    .notNull(),

  totalSubmissions: integer("total_submissions")
    .default(0)
    .notNull(),

  completionRate: real("completion_rate")
    .default(0)
    .notNull(),

  averageCompletionTime: integer("average_completion_time"),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type SelectFormAnalytics = typeof formAnalyticsTable.$inferSelect;
export type InsertFormAnalytics = typeof formAnalyticsTable.$inferInsert;