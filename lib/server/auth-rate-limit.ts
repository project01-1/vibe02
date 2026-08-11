import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

type AdminClient = SupabaseClient<Database>;

export async function assertLoginAllowed(admin: AdminClient, keyHash: string) {
  const { data, error } = await admin
    .from("auth_rate_limits")
    .select("locked_until")
    .eq("key_hash", keyHash)
    .maybeSingle();
  if (error) throw error;
  if (data?.locked_until && new Date(data.locked_until).getTime() > Date.now()) {
    return { allowed: false as const, retryAfterSeconds: Math.ceil((new Date(data.locked_until).getTime() - Date.now()) / 1000) };
  }
  return { allowed: true as const };
}

export async function recordLoginFailure(admin: AdminClient, keyHash: string) {
  const { data, error } = await admin
    .from("auth_rate_limits")
    .select("failed_attempts, window_started_at")
    .eq("key_hash", keyHash)
    .maybeSingle();
  if (error) throw error;

  const now = Date.now();
  const windowExpired = !data || new Date(data.window_started_at).getTime() + WINDOW_MS <= now;
  const attempts = windowExpired ? 1 : data.failed_attempts + 1;
  const lockedUntil = attempts >= MAX_FAILURES ? new Date(now + LOCK_MS).toISOString() : null;

  const { error: upsertError } = await admin.from("auth_rate_limits").upsert({
    key_hash: keyHash,
    failed_attempts: attempts,
    window_started_at: windowExpired ? new Date(now).toISOString() : data.window_started_at,
    locked_until: lockedUntil,
  });
  if (upsertError) throw upsertError;
}

export async function clearLoginFailures(admin: AdminClient, keyHash: string) {
  const { error } = await admin.from("auth_rate_limits").delete().eq("key_hash", keyHash);
  if (error) throw error;
}
