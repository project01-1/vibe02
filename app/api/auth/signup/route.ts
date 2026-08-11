import { NextResponse } from "next/server";
import { z } from "zod";
import { assertLoginAllowed, clearLoginFailures, recordLoginFailure } from "@/lib/server/auth-rate-limit";
import { deriveRateLimitKey, deriveSupabasePassword, normalizeKoreanPhone, normalizeStudentName } from "@/lib/server/pin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(20).regex(/^[가-힣a-zA-Z0-9 ]+$/),
  phone: z.string().min(10).max(20),
  pin: z.string().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  const phone = parsed.success ? normalizeKoreanPhone(parsed.data.phone) : null;
  const name = parsed.success ? normalizeStudentName(parsed.data.name) : null;
  if (!parsed.success || !phone || !name) {
    return NextResponse.json({ message: "이름, 휴대폰 번호와 숫자 4자리 PIN을 확인해 주세요." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const rateKey = await deriveRateLimitKey(phone, request);
  const limit = await assertLoginAllowed(admin, rateKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "회원가입 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.", retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  const { data: existingName } = await admin
    .from("profiles")
    .select("id")
    .ilike("display_name", name)
    .maybeSingle();
  if (existingName) {
    await recordLoginFailure(admin, rateKey);
    return NextResponse.json({ message: "이미 사용 중인 학생 이름이에요." }, { status: 409 });
  }

  const password = await deriveSupabasePassword(phone, parsed.data.pin);
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    phone,
    password,
    phone_confirm: true,
    user_metadata: { display_name: name },
  });

  if (createError) {
    await recordLoginFailure(admin, rateKey);
    const duplicate = createError.code === "phone_exists" || /already|registered|phone/i.test(createError.message);
    return NextResponse.json(
      { message: duplicate ? "이미 가입된 휴대폰 번호예요." : "회원가입을 완료하지 못했어요." },
      { status: duplicate ? 409 : 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: session, error: loginError } = await supabase.auth.signInWithPassword({ phone, password });
  if (loginError || !session.user) {
    if (created.user) await admin.auth.admin.deleteUser(created.user.id);
    await recordLoginFailure(admin, rateKey);
    return NextResponse.json({ message: "계정 세션을 만들지 못했어요. 다시 시도해 주세요." }, { status: 500 });
  }

  await clearLoginFailures(admin, rateKey);
  const { data: profile } = await admin.from("profiles").select("display_name, total_xp").eq("id", session.user.id).single();
  return NextResponse.json({
    user: { id: session.user.id, displayName: profile?.display_name ?? name, totalXp: profile?.total_xp ?? 0 },
  }, { status: 201 });
}
