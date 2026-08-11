import { z } from "zod";

export const missionCodeSchema = z.string().trim().min(1).max(300);

export type MissionResult =
  | { status: "success"; steps: 3; message: string; focusLine?: number }
  | { status: "too-short"; steps: number; message: string; focusLine: number }
  | { status: "too-far"; steps: number; message: string; focusLine: number }
  | { status: "invalid"; steps: 0; message: string; focusLine: number };

export function validateMissionCode(rawCode: string, missionId = 1): MissionResult {
  const parsed = missionCodeSchema.safeParse(rawCode);
  if (!parsed.success) return { status: "invalid", steps: 0, message: "코드가 비어 있어요. 먼저 반복문을 확인해 볼까요?", focusLine: 1 };

  const normalized = parsed.data.replace(/\r/g, "");

  if (missionId === 2) {
    const variableMatch = normalized.match(/^energy\s*=\s*(\d+)\s*\n\s*charge\(\s*energy\s*\)\s*$/);
    if (!variableMatch) return { status: "invalid", steps: 0, message: "energy 변수에 숫자를 저장하고 다음 줄에서 charge(energy)를 실행해 보세요.", focusLine: 1 };
    const energy = Number(variableMatch[1]);
    if (energy === 5) return { status: "success", steps: 3, message: "충전 완료! energy 변수에 5를 정확히 저장했어요." };
    if (energy < 5) return { status: "too-short", steps: Math.min(energy, 2), message: `에너지가 ${5 - energy}만큼 부족해요. 목표는 5예요.`, focusLine: 1 };
    return { status: "too-far", steps: 3, message: `에너지가 ${energy - 5}만큼 넘쳤어요. 정확히 5로 맞춰 보세요.`, focusLine: 1 };
  }

  if (missionId === 3) {
    const conditionMatch = normalized.match(/^door_open\s*=\s*True\s*\nif\s+door_open\s*:\s*\n\s+move\(\s*\)\s*$/);
    if (conditionMatch) return { status: "success", steps: 3, message: "보안 문 통과! 조건이 참일 때 move()를 실행했어요." };
    return { status: "invalid", steps: 0, message: "door_open이 True일 때 if 안에서 move()를 실행해야 해요. 들여쓰기도 확인해 보세요.", focusLine: 3 };
  }

  const match = normalized.match(/^for\s+[A-Za-z_]\w*\s+in\s+range\(\s*(\d+)\s*\)\s*:\s*\n\s+move\(\s*\)\s*$/);
  if (!match) {
    const focusLine = normalized.includes("\n") && !/^\s+move\(\s*\)\s*$/m.test(normalized) ? 2 : 1;
    return { status: "invalid", steps: 0, message: "반복문 모양을 다시 살펴보세요. move()는 들여쓰기한 다음 줄에 있어야 해요.", focusLine };
  }

  const steps = Number(match[1]);
  if (steps === 3) return { status: "success", steps: 3, message: "정확해요! 반복문으로 세 번 움직였어요." };
  if (steps < 3) return { status: "too-short", steps, message: `루미가 에너지 셀까지 ${3 - steps}칸 남았어요. range() 안의 숫자를 다시 확인해 볼까요?`, focusLine: 1 };
  return { status: "too-far", steps, message: `루미가 목표를 ${steps - 3}칸 지나쳤어요. 에너지 셀까지는 정확히 3칸이에요.`, focusLine: 1 };
}
