import { NextResponse } from "next/server";
import { clearLearningCookie } from "@/lib/server/learning-store";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearLearningCookie(response);
}
