import { openai, EMBEDDING_MODEL } from "./client";

export async function embed(text: string): Promise<number[]> {
  const res = await openai().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.replace(/\n/g, " "),
  });
  return res.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const res = await openai().embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts.map((t) => t.replace(/\n/g, " ")),
  });
  return res.data.map((d) => d.embedding);
}

export function cosineSim(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}
