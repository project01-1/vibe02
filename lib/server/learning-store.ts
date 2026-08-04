import { env } from "cloudflare:workers";
import { getMission } from "@/lib/missions";

export const DEMO_NAME = "김하늘";
export const DEMO_PIN = "2580";
export const SESSION_COOKIE = "pfl_session";

type DemoUserRow = {
  id: string;
  display_name: string;
  pin_hash: string;
  total_xp: number;
};

export type ProgressRow = {
  mission_id: number;
  status: "in_progress" | "completed";
  code: string;
  attempts: number;
  updated_at: string;
};

function getDatabase() {
  const bindings = env as typeof env & { DB?: D1Database };
  if (!bindings.DB) throw new Error("학습 기록 저장소가 연결되지 않았습니다.");
  return bindings.DB;
}

export async function initializeLearningStore() {
  const db = getDatabase();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS demo_users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      total_xp INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS learning_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES demo_users(id) ON DELETE CASCADE
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS mission_progress (
      user_id TEXT NOT NULL,
      mission_id INTEGER NOT NULL CHECK (mission_id BETWEEN 1 AND 3),
      status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
      code TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, mission_id),
      FOREIGN KEY (user_id) REFERENCES demo_users(id) ON DELETE CASCADE
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_expiry ON learning_sessions(user_id, expires_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_mission_progress_user_status ON mission_progress(user_id, status)"),
  ]);
  return db;
}

export async function hashPin(pin: string) {
  const bytes = new TextEncoder().encode(`python-future-lab-demo:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function ensureDemoUser() {
  const db = await initializeLearningStore();
  const now = new Date().toISOString();
  const pinHash = await hashPin(DEMO_PIN);
  await db.prepare(`INSERT INTO demo_users (id, display_name, pin_hash, total_xp, created_at)
    VALUES (?, ?, ?, 0, ?)
    ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, pin_hash = excluded.pin_hash`)
    .bind("demo-kimhaneul", DEMO_NAME, pinHash, now).run();
  return db;
}

export function readSessionToken(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1) ?? null;
}

export async function getAuthenticatedUser(request: Request) {
  const token = readSessionToken(request);
  if (!token) return null;
  const db = await initializeLearningStore();
  const now = new Date().toISOString();
  const user = await db.prepare(`SELECT u.id, u.display_name, u.pin_hash, u.total_xp
    FROM demo_users u JOIN learning_sessions s ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ?`).bind(token, now).first<DemoUserRow>();
  return user ? { id: user.id, displayName: user.display_name, totalXp: user.total_xp, token } : null;
}

export async function getProgress(userId: string) {
  const db = await initializeLearningStore();
  const result = await db.prepare(`SELECT mission_id, status, code, attempts, updated_at
    FROM mission_progress WHERE user_id = ? ORDER BY mission_id`).bind(userId).all<ProgressRow>();
  return result.results;
}

export async function saveProgress(input: {
  userId: string;
  missionId: number;
  code: string;
  completed: boolean;
  countAttempt: boolean;
}) {
  const db = await initializeLearningStore();
  const previous = await db.prepare("SELECT status FROM mission_progress WHERE user_id = ? AND mission_id = ?")
    .bind(input.userId, input.missionId).first<{ status: string }>();
  const newlyCompleted = input.completed && previous?.status !== "completed";
  const status = input.completed || previous?.status === "completed" ? "completed" : "in_progress";
  const now = new Date().toISOString();
  const completedAt = status === "completed" ? now : null;
  const statements = [
    db.prepare(`INSERT INTO mission_progress (user_id, mission_id, status, code, attempts, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, mission_id) DO UPDATE SET
        status = CASE WHEN mission_progress.status = 'completed' THEN 'completed' ELSE excluded.status END,
        code = excluded.code,
        attempts = mission_progress.attempts + excluded.attempts,
        completed_at = COALESCE(mission_progress.completed_at, excluded.completed_at),
        updated_at = excluded.updated_at`)
      .bind(input.userId, input.missionId, status, input.code, input.countAttempt ? 1 : 0, completedAt, now),
  ];
  if (newlyCompleted) {
    statements.push(db.prepare("UPDATE demo_users SET total_xp = total_xp + ? WHERE id = ?")
      .bind(getMission(input.missionId).reward, input.userId));
  }
  await db.batch(statements);
  const user = await db.prepare("SELECT total_xp FROM demo_users WHERE id = ?").bind(input.userId).first<{ total_xp: number }>();
  return { progress: await getProgress(input.userId), totalXp: user?.total_xp ?? 0 };
}
