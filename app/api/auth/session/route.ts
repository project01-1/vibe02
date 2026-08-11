import { NextResponse } from "next/server";
import { readLearningState } from "@/lib/server/learning-store";

export async function GET(request: Request) {
  const state = await readLearningState(request);
  if (!state) return NextResponse.json({ user: null, progress: [] });
  return NextResponse.json({
    user: { id: state.userId, displayName: state.displayName, totalXp: state.totalXp },
    progress: state.progress,
  });
}
