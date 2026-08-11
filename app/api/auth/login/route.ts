import { NextResponse } from "next/server";
import { z } from "zod";
import { createLearningState, DEMO_NAME, DEMO_PIN, hashPin, setLearningCookie } from "@/lib/server/learning-store";

const loginSchema = z.object({
  name: z.string().regex(/^[가-힣]{3}$/),
  pin: z.string().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "이름 3글자와 숫자 4자리 비밀번호를 확인해 주세요." }, { status: 400 });

  const expectedPinHash = await hashPin(DEMO_PIN);
  if (parsed.data.name !== DEMO_NAME || await hashPin(parsed.data.pin) !== expectedPinHash) {
    return NextResponse.json({ message: "이름 또는 비밀번호가 맞지 않아요." }, { status: 401 });
  }

  const state = createLearningState();
  const response = NextResponse.json({ user: { id: state.userId, displayName: state.displayName, totalXp: state.totalXp } });
  return setLearningCookie(response, state, request);
}
