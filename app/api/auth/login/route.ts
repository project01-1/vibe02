import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_NAME, ensureDemoUser, hashPin, SESSION_COOKIE } from "@/lib/server/learning-store";

const loginSchema = z.object({
  name: z.string().regex(/^[가-힣]{3}$/),
  pin: z.string().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "이름 3글자와 숫자 4자리 비밀번호를 확인해 주세요." }, { status: 400 });

  const db = await ensureDemoUser();
  const user = await db.prepare("SELECT id, display_name, pin_hash, total_xp FROM demo_users WHERE display_name = ?")
    .bind(parsed.data.name).first<{ id: string; display_name: string; pin_hash: string; total_xp: number }>();
  if (!user || user.display_name !== DEMO_NAME || user.pin_hash !== await hashPin(parsed.data.pin)) {
    return NextResponse.json({ message: "이름 또는 비밀번호가 맞지 않아요." }, { status: 401 });
  }

  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll("-", "");
  const now = new Date();
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  await db.batch([
    db.prepare("DELETE FROM learning_sessions WHERE expires_at <= ?").bind(now.toISOString()),
    db.prepare("INSERT INTO learning_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
      .bind(token, user.id, expires.toISOString(), now.toISOString()),
  ]);

  const response = NextResponse.json({ user: { id: user.id, displayName: user.display_name, totalXp: user.total_xp } });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    expires,
  });
  return response;
}
