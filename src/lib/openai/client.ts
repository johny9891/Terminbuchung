import OpenAI from "openai";

let _client: OpenAI | null = null;

export function openai(): OpenAI {
  if (_client) return _client;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

export const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
