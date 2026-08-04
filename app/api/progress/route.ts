import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, saveProgress } from "@/lib/server/learning-store";

const progressSchema = z.object({
  missionId: z.number().int().min(1).max(3),
  code: z.string().max(300),
  completed: z.boolean(),
  countAttempt: z.boolean().default(false),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "저장할 학습 기록을 확인해 주세요." }, { status: 400 });
  const saved = await saveProgress({ userId: user.id, ...parsed.data });
  return NextResponse.json(saved);
}
