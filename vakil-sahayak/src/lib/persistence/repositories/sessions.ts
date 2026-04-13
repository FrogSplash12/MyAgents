import { getSupabase } from "../supabase";

export interface ConversationSession {
  id: string;
  user_id: string;
  state: string;
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const TABLE = "conversation_sessions";

export async function getActiveSession(userId: string): Promise<ConversationSession | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`getActiveSession failed: ${error.message}`);
  return data;
}

export async function createSession(userId: string, state: string = "NEW_LEAD"): Promise<ConversationSession> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({ user_id: userId, state, context: {} })
    .select()
    .single();

  if (error) throw new Error(`createSession failed: ${error.message}`);
  return data;
}

export async function updateSession(
  id: string,
  updates: { state?: string; context?: Record<string, unknown> }
): Promise<ConversationSession> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updateSession failed: ${error.message}`);
  return data;
}

export async function getOrCreateSession(userId: string): Promise<ConversationSession> {
  const existing = await getActiveSession(userId);
  if (existing) return existing;
  return createSession(userId);
}
