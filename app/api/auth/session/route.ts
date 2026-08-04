import { NextResponse } from "next/server";
import { getAuthenticatedUser, getProgress } from "@/lib/server/learning-store";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ user: null, progress: [] });
  const progress = await getProgress(user.id);
  return NextResponse.json({
    user: { id: user.id, displayName: user.displayName, totalXp: user.totalXp },
    progress,
  });
}
