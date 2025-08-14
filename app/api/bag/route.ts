import type { NextApiRequest, NextApiResponse } from 'next';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { talentVectors } from '@/lib/db/schema/talent_vectors';
import { talentDocuments } from '@/lib/db/schema/talent_documents';

const THRESHOLD = 0.45;

async function embedQuery(q: string): Promise<number[]> {
    const r = await embed({
        model: openai.embedding('text-embedding-ada-002'),
        value: q
    });
    return r.embedding;
}

async function hybridSearch(cleanQ: string, qVec: number[]): Promise<any[]> {

    const embeddedQuery = await embedQuery(cleanQ);
    const similarityExpr = sql<number>`
    1 - (${cosineDistance(talentVectors.vector, embeddedQuery)})`
    try{
      const topTalents = await db.
    select({
      talent_id: talentVectors.talent_id,
      summary: talentDocuments.summary,
      similarity: similarityExpr,
    })
    .from(talentVectors)
    .leftJoin(talentDocuments, sql`${talentVectors.talent_id} = ${talentDocuments.talent_id}`)
    .where(gt(similarityExpr, 0.5))
    .orderBy(desc(similarityExpr))
    .limit(10)
     return topTalents;
    }catch (error) {
        console.error('Error during hybrid search:', error);
        return [];
    }
}

export async function POST(req: Request) {
  // console.log(req.json())
  
  const {query} =  await req.json();
  if(typeof query !== 'string' || !query.trim()) {
    return NextResponse.json({ error: 'Invalid query' }), {status: 400};
  }
  const cleanQ = query
  const qVec = await embedQuery(query);
    const hits = await hybridSearch(cleanQ, qVec);
  if (hits.length === 0) {
    return NextResponse.json(
    { answer: 'No profiles found—try broadening your query.' },
    { status: 200 }
  );
}

  if (hits.every(h => h.dist > THRESHOLD)) {
    return NextResponse.json({ answer: 'No confident matches—please refine your query.' }, {status:200});
  }

  const context = hits.map(h => h.summary).join('\n---\n');
  // Generate an answer using the AI provider
  let ids: number[];
  try{
    const chatRes = await  openai('gpt-4o-mini').doGenerate({
    prompt: [
        { role: 'system', content: `You are a helpful assistant that, given a list of candidate talent objects (with an “id” and “summary” field) and a search query, outputs **only** a JSON array of the IDs of those candidates that satisfy the query. 
        If none match, return people with the  skills or experiences that can fit the query's search, if there's no such people,  output an empty JSON array: []. Do not output any other text.`.trim() },
        { role: 'user',
            content:  [{
            type: 'text',
            text: JSON.stringify({ query, candidates: hits }, null, 2)
            }]
        },
    ],
  });
  const answer = chatRes.content.map(c => c.type === 'text'? c.text: '').join(' ').trim() ?? 'Unable to generate an answer.';

  const jsonOnly = answer
  .replace(/```json\s*/, '')    // drop leading ```json
  .replace(/```$/, '')          // drop trailing ```
  .trim();

  const parsed = JSON.parse(jsonOnly);
 
  if (!Array.isArray(parsed)) {
    return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }
    ids = parsed;
  }catch(e){
    ids = hits.map(h=>h.id);
    console.error('Error generating answer:', e);
    return NextResponse.json({ error: 'Error generating answer' }, { status: 500});
  }
  return NextResponse.json({ ids }, {status: 200});
}