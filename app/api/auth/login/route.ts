import { NextResponse } from "next/server";
import { z } from "zod";
import { assertLoginAllowed, clearLoginFailures, recordLoginFailure } from "@/lib/server/auth-rate-limit";
import { deriveRateLimitKey, deriveSupabasePassword, normalizeKoreanPhone } from "@/lib/server/pin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  phone: z.string().min(10).max(20),
  pin: z.string().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  const phone = parsed.success ? normalizeKoreanPhone(parsed.data.phone) : null;
  if (!parsed.success || !phone) {
    return NextResponse.json({ message: "휴대폰 번호와 숫자 4자리 PIN을 확인해 주세요." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const rateKey = await deriveRateLimitKey(phone, request);
  const limit = await assertLoginAllowed(admin, rateKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.", retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  const supabase = await createSupabaseServerClient();
  const password = await deriveSupabasePassword(phone, parsed.data.pin);
  const { data, error } = await supabase.auth.signInWithPassword({ phone, password });
  if (error || !data.user) {
    await recordLoginFailure(admin, rateKey);
    return NextResponse.json({ message: "휴대폰 번호 또는 PIN이 맞지 않아요." }, { status: 401 });
  }

  await clearLoginFailures(admin, rateKey);
  const { data: profile } = await admin.from("profiles").select("display_name, total_xp").eq("id", data.user.id).single();
  return NextResponse.json({
    user: { id: data.user.id, displayName: profile?.display_name ?? "학생", totalXp: profile?.total_xp ?? 0 },
  });
}
