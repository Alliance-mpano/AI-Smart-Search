// workers/process-doc-queue.ts
import 'dotenv/config'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { generateTalentVector } from '@/lib/actions/generateTalentVectors';

type UUID = string;

//This script regeneraates talent vectors for all talents in the doc queue
// It should be run periodically to ensure all talents in the queue are processed once updated.
async function workOnce() {
  const rows = await db.select({ id: sql`talent_id` }).from(sql`doc_queue`)
  if (rows.length === 0) return
  await Promise.all(rows.map(r => generateTalentVector(r.id as UUID)))
  await sql`DELETE FROM doc_queue WHERE talent_id = ANY(${rows.map(r => r.id)})`
}

async function loop() {
  while (true) {
    try { await workOnce() } catch (e) { console.error(e) }
    await new Promise(r => setTimeout(r, 5000))
  }
}

loop()
