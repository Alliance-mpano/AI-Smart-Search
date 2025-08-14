// scripts/generate-docs.ts;

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { generateTalentVector } from '@/lib/actions/generateTalentVectors';
import { user } from '@/lib/db/schema/schema';
type UUID = string;

async function generateAll() {
  const talents = await db.select({ id: sql`${user.id}` }).from(user);
  for (const { id } of talents) {
    await generateTalentVector(id as UUID);
  }
  console.log(`✅ Regenerated ${talents.length} docs`);
}
    
generateAll().catch(console.error);