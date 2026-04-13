import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/persistence/supabase";

/**
 * GET /api/health
 *
 * Health check endpoint for monitoring and uptime checks.
 * Verifies database connectivity.
 */
export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "unknown",
  };

  try {
    // Verify Supabase connection with a lightweight query
    const { error } = await getSupabase()
      .from("users")
      .select("id")
      .limit(1);

    checks.database = error ? `error: ${error.message}` : "connected";
  } catch (err) {
    checks.database = `error: ${err instanceof Error ? err.message : "unknown"}`;
  }

  const allHealthy = checks.database === "connected";

  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503,
  });
}
