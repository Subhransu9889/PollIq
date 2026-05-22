import {
  pgTable,
  uuid,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";

export const themesTable = pgTable("themes", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  name: text("name")
    .notNull(),

  slug: text("slug")
    .notNull()
    .unique(),

  description: text("description"),

  previewImage: text("preview_image"),

  background: text("background"),

  primaryColor: text("primary_color"),

  secondaryColor: text("secondary_color"),

  accentColor: text("accent_color"),

  fontFamily: text("font_family"),

  customCss: text("custom_css"),

  isPremium: boolean("is_premium")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type SelectTheme = typeof themesTable.$inferSelect;
export type InsertTheme = typeof themesTable.$inferInsert;