import { nanoid } from "nanoid";
import { index, pgTable, text, vector, varchar, integer, primaryKey} from 'drizzle-orm/pg-core'
import { talentDocuments } from "./talent_documents";


export const talentVectors = pgTable(
    'talent_vectors',
    {
        talent_id: integer("talent_id").notNull().references(
            () => talentDocuments.talent_id,
            {onDelete: 'cascade'}
        ),
        vector: vector('vector', {dimensions: 1536}).notNull(),

    },
    table => ({
        pk: primaryKey({columns: [table.talent_id]}),
        // Create an index for the vector column using HNSW algorithm
        vectorIndex: index('vectorIndex').using(
            'hnsw',
            table.vector.op('vector_cosine_ops')
        )
    })
    ); 