import { getSupabase } from "../supabase";

const TABLE = "idempotency_keys";

export interface IdempotencyRecord {
  id: string;
  key: string;
  response: unknown;
  created_at: string;
  expires_at: string;
}

export async function checkIdempotency(key: string): Promise<IdempotencyRecord | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("key", key)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) throw new Error(`checkIdempotency failed: ${error.message}`);
  return data;
}

export async function setIdempotency(key: string, response: unknown): Promise<void> {
  const { error } = await getSupabase()
    .from(TABLE)
    .upsert({
      key,
      response,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

  if (error) {
    console.error(`setIdempotency failed: ${error.message}`);
  }
}
