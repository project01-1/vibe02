import { NextResponse } from "next/server";
import { z } from "zod";
import { assertLoginAllowed, clearLoginFailures, recordLoginFailure } from "@/lib/server/auth-rate-limit";
import { deriveRateLimitKey, deriveSupabasePassword, normalizeStudentName } from "@/lib/server/pin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  name: z.string().min(2).max(20),
  pin: z.string().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  const name = parsed.success ? normalizeStudentName(parsed.data.name) : null;
  if (!parsed.success || !name) {
    return NextResponse.json({ message: "학생 이름과 숫자 4자리 PIN을 확인해 주세요." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const rateKey = await deriveRateLimitKey(name, request);
  const limit = await assertLoginAllowed(admin, rateKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.", retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("id, display_name, phone_e164, total_xp")
    .ilike("display_name", name)
    .maybeSingle();
  if (!profile?.phone_e164) {
    await recordLoginFailure(admin, rateKey);
    return NextResponse.json({ message: "학생 이름 또는 PIN이 맞지 않아요." }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const password = await deriveSupabasePassword(profile.phone_e164, parsed.data.pin);
  const { data, error } = await supabase.auth.signInWithPassword({ phone: profile.phone_e164, password });
  if (error || !data.user) {
    await recordLoginFailure(admin, rateKey);
    return NextResponse.json({ message: "학생 이름 또는 PIN이 맞지 않아요." }, { status: 401 });
  }

  await clearLoginFailures(admin, rateKey);
  return NextResponse.json({
    user: { id: data.user.id, displayName: profile.display_name, totalXp: profile.total_xp },
  });
}
