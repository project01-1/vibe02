import { NextResponse } from "next/server";
import { getMission } from "../missions";

export const DEMO_NAME = "김하늘";
export const DEMO_PIN = "2580";
export const SESSION_COOKIE = "pfl_session";

const SESSION_DAYS = 7;
const SESSION_VERSION = 1;
const FALLBACK_DEMO_SECRET = "python-future-lab-vercel-demo-session-v1";

export type ProgressRow = {
  mission_id: number;
  status: "in_progress" | "completed";
  code: string;
  attempts: number;
  updated_at: string;
};

export type LearningState = {
  version: number;
  userId: string;
  displayName: string;
  totalXp: number;
  expiresAt: string;
  progress: ProgressRow[];
};

function getSecret() {
  return process.env.PFL_SESSION_SECRET ?? FALLBACK_DEMO_SECRET;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function encodeState(state: LearningState) {
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(state)));
  const signature = await crypto.subtle.sign("HMAC", await getSigningKey(), new TextEncoder().encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

async function decodeState(token: string): Promise<LearningState | null> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const valid = await crypto.subtle.verify(
    "HMAC",
    await getSigningKey(),
    fromBase64Url(signature),
    new TextEncoder().encode(payload),
  );
  if (!valid) return null;
  const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as LearningState;
  if (parsed.version !== SESSION_VERSION || new Date(parsed.expiresAt).getTime() <= Date.now()) return null;
  return parsed;
}

export async function hashPin(pin: string) {
  const bytes = new TextEncoder().encode(`python-future-lab-demo:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createLearningState(): LearningState {
  return {
    version: SESSION_VERSION,
    userId: "demo-kimhaneul",
    displayName: DEMO_NAME,
    totalXp: 0,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    progress: [],
  };
}

export function readSessionToken(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1) ?? null;
}

export async function readLearningState(request: Request) {
  const token = readSessionToken(request);
  if (!token) return null;
  try {
    return await decodeState(token);
  } catch {
    return null;
  }
}

export async function setLearningCookie(response: NextResponse, state: LearningState, request: Request) {
  response.cookies.set(SESSION_COOKIE, await encodeState(state), {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    expires: new Date(state.expiresAt),
  });
  return response;
}

export function clearLearningCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}

export function updateProgress(state: LearningState, input: {
  missionId: number;
  code: string;
  completed: boolean;
  countAttempt: boolean;
}) {
  const existing = state.progress.find((item) => item.mission_id === input.missionId);
  const newlyCompleted = input.completed && existing?.status !== "completed";
  const now = new Date().toISOString();
  const nextProgress: ProgressRow = {
    mission_id: input.missionId,
    status: input.completed || existing?.status === "completed" ? "completed" : "in_progress",
    code: input.code,
    attempts: (existing?.attempts ?? 0) + (input.countAttempt ? 1 : 0),
    updated_at: now,
  };
  return {
    ...state,
    totalXp: state.totalXp + (newlyCompleted ? getMission(input.missionId).reward : 0),
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    progress: [...state.progress.filter((item) => item.mission_id !== input.missionId), nextProgress]
      .sort((a, b) => a.mission_id - b.mission_id),
  };
}
