import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { talents } from "./talents";

export const talentExperience = pgTable('talent_experience', {
  id: serial('id').primaryKey(),
  talentId: integer('talent_id')
    .notNull()
    .references(() => talents.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  title: text('title').notNull(),
  years: integer('years').notNull(),
});