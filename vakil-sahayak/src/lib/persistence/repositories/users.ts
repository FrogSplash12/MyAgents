import { getSupabase } from "../supabase";

export interface User {
  id: string;
  phone: string;
  name: string | null;
  referral_source: string | null;
  city: string | null;
  language: string;
  status: "new_lead" | "onboarding" | "active" | "churned" | "blocked";
  created_at: string;
  updated_at: string;
}

const TABLE = "users";

export async function findUserByPhone(phone: string): Promise<User | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) throw new Error(`findUserByPhone failed: ${error.message}`);
  return data;
}

export async function createUser(phone: string): Promise<User> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({ phone })
    .select()
    .single();

  if (error) throw new Error(`createUser failed: ${error.message}`);
  return data;
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, "name" | "referral_source" | "city" | "language" | "status">>
): Promise<User> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updateUser failed: ${error.message}`);
  return data;
}

export async function findOrCreateUser(phone: string): Promise<User> {
  const existing = await findUserByPhone(phone);
  if (existing) return existing;
  return createUser(phone);
}
