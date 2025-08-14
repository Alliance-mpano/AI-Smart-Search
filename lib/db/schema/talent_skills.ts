import { index, integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { talents } from "./talents";

export const talentSkills = pgTable('talent_skills', {
  id: serial('id').primaryKey(),
  talentId: integer('talent_id')
    .notNull()
    .references(() => talents.id, { onDelete: 'cascade' }),
  skillName: text('skill_name').notNull(),
},
(table) => ({
    // Unique constraint on (talent_id, skill_name)
    uniqueSkill: unique('uq_talent_skills_talent_skill').on(table.talentId, table.skillName),
  })
);