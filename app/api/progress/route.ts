import { NextResponse } from "next/server";
import { z } from "zod";
import { getMission, missions } from "@/lib/missions";
import { validateMissionCode } from "@/lib/mission-validation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const progressSchema = z.object({
  missionId: z.number().int().min(1).max(3),
  code: z.string().max(300),
  countAttempt: z.boolean().default(false),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "저장할 학습 기록을 확인해 주세요." }, { status: 400 });

  const mission = getMission(parsed.data.missionId);
  const admin = createSupabaseAdminClient();
  if (mission.id > 1) {
    const previous = getMission(mission.id - 1);
    const { data: completedPrevious } = await admin
      .from("user_mission_progress")
      .select("id")
      .eq("user_id", authData.user.id)
      .eq("mission_id", previous.databaseId)
      .eq("status", "completed")
      .maybeSingle();
    if (!completedPrevious) return NextResponse.json({ message: "이전 단계를 먼저 완료해 주세요." }, { status: 403 });
  }

  const result = validateMissionCode(parsed.data.code, mission.id);
  const { error: saveError } = await admin.rpc("save_mission_progress", {
    p_user_id: authData.user.id,
    p_mission_id: mission.databaseId,
    p_code: parsed.data.code,
    p_completed: result.status === "success",
    p_count_attempt: parsed.data.countAttempt,
  });
  if (saveError) return NextResponse.json({ message: "학습 기록을 저장하지 못했어요." }, { status: 500 });

  const [{ data: profile }, { data: rows }] = await Promise.all([
    admin.from("profiles").select("total_xp").eq("id", authData.user.id).single(),
    admin.from("user_mission_progress").select("mission_id, status, code, attempts, updated_at").eq("user_id", authData.user.id),
  ]);
  const progress = (rows ?? []).flatMap((row) => {
    const definition = missions.find((item) => item.databaseId === row.mission_id);
    return definition ? [{ ...row, mission_id: definition.id }] : [];
  });

  return NextResponse.json({ progress, totalXp: profile?.total_xp ?? 0, result });
}
