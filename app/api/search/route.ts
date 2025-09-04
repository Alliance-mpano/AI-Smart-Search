import type { NextApiRequest, NextApiResponse } from 'next';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import {jobSubmission, talentDocuments, job, talentVectors} from  '@/lib/db/schema/schema'



const THRESHOLD = 0.45;

async function embedQuery(q: string): Promise<number[]> {
    const r = await embed({
        model: openai.embedding('text-embedding-ada-002'),
        value: q
    });
    return r.embedding;
}

async function hybridSearch(cleanQ: string, qVec: number[]): Promise<any[]> {

    //2nd approach
    const orgId = 'd6341654-0cc6-480a-a866-16aa47d7c368';
    const embedded = await embedQuery(cleanQ);
    const embeddedQuery = `[${Array.from(embedded).join(',')}]`;
    try{
      const topTalents = await db.execute(sql`
          WITH cand AS(
            SELECT DISTINCT ${jobSubmission.userId} AS userId
            FROM ${jobSubmission}
            JOIN ${job} ON ${job.id } = ${jobSubmission.jobId}
            WHERE ${job.organisationId} = ${orgId}
          )
          SELECT
          tv.id,
          td.summary,
          1 - (${cosineDistance(sql`tv.vector`, embeddedQuery)}) as similarity
          FROM cand
          JOIN "TalentVectors" as tv ON tv.id = cand.userId
          JOIN "TalentDocuments" as td ON td.id = tv.id
          ORDER BY (${cosineDistance(sql`tv.vector`, embeddedQuery)}::vector) ASC

        `)
    console.log(topTalents, "Top Talents")
     return topTalents?? [];
    }catch (error) {
        console.error('Error during hybrid search:', error);
        return [];
    }
}

export async function POST(req: Request) {
  
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
        { role: 'system', content: `You are a helpful assistant that, given a list of candidate talent objects (with an “id” and “summary” field) and a search query, outputs **only** a JSON array of the IDs of those candidates except those whose summaries are empty.
        if all of the candidates do not match the searched query,  output an empty JSON array: []. Do not output any other text.`.trim() },
        { role: 'user',
            content:  [{
            type: 'text',
            text: JSON.stringify({ query, candidates: hits }, null, 2)
            }]
        },
    ],
  });
  const answer = chatRes.content.map(c => c.type === 'text'? c.text: '').join(' ').trim() ?? 'Unable to generate an answer.';
  console.log(answer, "Answer from the chat model")
  const jsonOnly = answer
  .replace(/```json\s*/, '')    
  .replace(/```$/, '')         
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