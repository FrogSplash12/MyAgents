import { getSupabase } from "../supabase";

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  detail: Record<string, unknown>;
  created_at: string;
}

const TABLE = "audit_logs";

export async function writeAuditLog(entry: {
  user_id?: string;
  action: string;
  detail?: Record<string, unknown>;
}): Promise<void> {
  const { error } = await getSupabase()
    .from(TABLE)
    .insert({
      user_id: entry.user_id || null,
      action: entry.action,
      detail: entry.detail || {},
    });

  if (error) {
    console.error(`writeAuditLog failed: ${error.message}`);
    // Audit log failures should not crash the request
  }
}
