import { NextResponse } from "next/server";
import { initializeLearningStore, readSessionToken, SESSION_COOKIE } from "@/lib/server/learning-store";

export async function POST(request: Request) {
  const token = readSessionToken(request);
  if (token) {
    const db = await initializeLearningStore();
    await db.prepare("DELETE FROM learning_sessions WHERE token = ?").bind(token).run();
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
