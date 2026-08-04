import { z } from "zod";

export const missionCodeSchema = z.string().trim().min(1).max(300);

export type MissionResult =
  | { status: "success"; steps: 3; message: string }
  | { status: "too-short"; steps: number; message: string }
  | { status: "too-far"; steps: number; message: string }
  | { status: "invalid"; steps: 0; message: string };

export function validateMissionCode(rawCode: string): MissionResult {
  const parsed = missionCodeSchema.safeParse(rawCode);
  if (!parsed.success) return { status: "invalid", steps: 0, message: "코드가 비어 있어요. 숫자 3을 넣어 볼까요?" };

  const normalized = parsed.data.replace(/\r/g, "");
  const match = normalized.match(/^for\s+[A-Za-z_]\w*\s+in\s+range\(\s*(\d+)\s*\)\s*:\s*\n\s+move\(\s*\)\s*$/);
  if (!match) return { status: "invalid", steps: 0, message: "반복문 모양을 다시 살펴보세요. move()는 들여쓰기한 다음 줄에 있어야 해요." };

  const steps = Number(match[1]);
  if (steps === 3) return { status: "success", steps: 3, message: "정확해요! 반복문으로 세 번 움직였어요." };
  if (steps < 3) return { status: "too-short", steps, message: `루미가 ${3 - steps}칸 모자라요. range 안의 숫자를 조금 늘려 볼까요?` };
  return { status: "too-far", steps, message: `목표를 ${steps - 3}칸 지나쳤어요. 에너지 셀까지는 정확히 3칸이에요.` };
}
