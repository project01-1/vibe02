import { NextResponse } from "next/server";
import { missions } from "@/lib/missions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ user: null, progress: [] });

  const [{ data: profile }, { data: rows }] = await Promise.all([
    supabase.from("profiles").select("display_name, total_xp").eq("id", authData.user.id).single(),
    supabase.from("user_mission_progress").select("mission_id, status, code, attempts, updated_at").eq("user_id", authData.user.id),
  ]);

  const progress = (rows ?? []).flatMap((row) => {
    const mission = missions.find((item) => item.databaseId === row.mission_id);
    return mission ? [{ ...row, mission_id: mission.id }] : [];
  });

  return NextResponse.json({
    user: {
      id: authData.user.id,
      displayName: profile?.display_name ?? "학생",
      totalXp: profile?.total_xp ?? 0,
    },
    progress,
  });
}
