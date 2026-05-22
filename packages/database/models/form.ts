import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "../schema";
import { themesTable } from "./themes";

export const formVisibilityEnum = pgEnum("form_visibility", ["PUBLIC", "UNLISTED", "PRIVATE"]);
export const formStatusEnum = pgEnum("form_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
   creatorId: uuid("creator_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),

  visibility: formVisibilityEnum("visibility").notNull().default("PRIVATE"),
  status: formStatusEnum("status").notNull().default("DRAFT"),
  themeId: uuid("theme_id").references(() => themesTable.id),
  views: integer("views").default(0),
  responseCount: integer("response_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
