export type Plan = "free" | "pro" | "team";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  usage_tokens: number;
  usage_documents: number;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  file_name: string;
  file_size: number;
  file_path: string;
  mime_type: string;
  status: "processing" | "ready" | "failed";
  summary: string | null;
  page_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  token_count: number;
  embedding: number[] | null;
}

export interface ChatMessage {
  id: string;
  document_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface Flashcard {
  id: string;
  document_id: string;
  user_id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard" | null;
  created_at: string;
}

export interface Note {
  id: string;
  document_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const PLAN_LIMITS: Record<Plan, { documents: number; tokensPerMonth: number; maxFileMb: number }> = {
  free: { documents: 3, tokensPerMonth: 50_000, maxFileMb: 5 },
  pro: { documents: 100, tokensPerMonth: 1_000_000, maxFileMb: 25 },
  team: { documents: 1000, tokensPerMonth: 10_000_000, maxFileMb: 100 },
};
