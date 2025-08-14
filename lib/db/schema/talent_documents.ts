import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, integer, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";


import { talents } from "./talents";

export const talentDocuments = pgTable("talent_documents", {
  talent_id: integer("talent_id").notNull()
    .references(() => talents.id, {onDelete: 'cascade'}),

  summary: text("summary").notNull(),
  metadata: jsonb("metadata").notNull(),
//   createdAt: timestamp("created_at")
//     .notNull()
//     .default(sql`now()`),
//   updatedAt: timestamp("updated_at")
//     .notNull()
//     .default(sql`now()`),
},
  (table) => ({
    pk: primaryKey({columns: [table.talent_id]}),
  })
);

// // Schema for document - used to validate API requests
// export const insertDocumentchema = createSelectSchema(talentDocuments)
//   .extend({})
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//   });

// // Type for document - used to type API request params and within Components
// export type NewResourceParams = z.infer<typeof insertDocumentchema>;
