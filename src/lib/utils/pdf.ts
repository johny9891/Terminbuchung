// Server-only PDF text extraction.
// `pdf-parse` is lazy-imported to keep it out of the edge runtime.
export async function extractPdfText(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);
  return { text: result.text, pages: result.numpages };
}
