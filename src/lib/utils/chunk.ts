const DEFAULT_CHUNK_SIZE = 1200;
const DEFAULT_OVERLAP = 150;

export interface Chunk {
  index: number;
  content: string;
  tokenEstimate: number;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function chunkText(
  text: string,
  size = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP,
): Chunk[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: Chunk[] = [];
  let current = "";
  let index = 0;

  const push = (content: string) => {
    if (!content.trim()) return;
    chunks.push({
      index: index++,
      content: content.trim(),
      tokenEstimate: estimateTokens(content),
    });
  };

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length <= size) {
      current = current ? current + "\n\n" + para : para;
    } else {
      if (current) push(current);
      if (para.length <= size) {
        const tail = current.slice(Math.max(0, current.length - overlap));
        current = tail ? tail + "\n\n" + para : para;
      } else {
        for (let i = 0; i < para.length; i += size - overlap) {
          push(para.slice(i, i + size));
        }
        current = "";
      }
    }
  }
  if (current) push(current);
  return chunks;
}
