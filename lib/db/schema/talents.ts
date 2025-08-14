import { pgTable, serial, text } from "drizzle-orm/pg-core";


export const talents = pgTable('talents', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  location: text('location').notNull(),
  department: text('department').notNull(),
  seniority: text('seniority').notNull(),
});