import { openai } from '@ai-sdk/openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import { embed, embedMany } from 'ai';
import { talentVectors } from '@/lib/db/schema/talent_vectors';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const  generateChunks = (input: string): string[] => {
    return input
    .trim()
    .split('.')
    .filter(i => i !== '')
}

export const generateEmbeddings = async (
    value: string
): Promise<Array<{embedding: number[], content: string}>> => {
    const chunks = generateChunks(value);
    const {embeddings} = await embedMany({
        model: embeddingModel,
        values: chunks
    });
    return embeddings.map((embedding, index) => ({ content: chunks[index], embedding: embedding}))
}

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const { text } = req.body as { text: string | string[] };
  if (!text || (Array.isArray(text) ? text.length === 0 : text.trim() === '')) {
    return res.status(400).json({ error: 'Missing `text`' });
  }
  const inputs = Array.isArray(text) ? text : [text];
  try {
    const embedRes = await embedMany({ model: embeddingModel, values: inputs });
    return res.status(200).json({ embeddings: embedRes.embeddings });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}