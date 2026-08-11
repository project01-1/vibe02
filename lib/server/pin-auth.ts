import "server-only";
import { getPinPepper } from "../supabase/config";

const PHONE_PATTERN = /^010\d{8}$/;
const INTERNATIONAL_PHONE_PATTERN = /^\+8210\d{8}$/;
const PIN_PATTERN = /^\d{4}$/;
const STUDENT_NAME_PATTERN = /^[가-힣a-zA-Z0-9 ]{2,20}$/;

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function normalizeKoreanPhone(input: string) {
  const compact = input.trim().replace(/[\s()-]/g, "");
  if (INTERNATIONAL_PHONE_PATTERN.test(compact)) return compact;
  const digits = compact.replace(/\D/g, "");
  if (!PHONE_PATTERN.test(digits)) return null;
  return `+82${digits.slice(1)}`;
}

export function isFourDigitPin(pin: string) {
  return PIN_PATTERN.test(pin);
}

export function normalizeStudentName(input: string) {
  const normalized = input.trim().replace(/\s+/g, " ");
  return STUDENT_NAME_PATTERN.test(normalized) ? normalized : null;
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getPinPepper()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function deriveSupabasePassword(phone: string, pin: string) {
  if (!INTERNATIONAL_PHONE_PATTERN.test(phone) || !isFourDigitPin(pin)) {
    throw new Error("Invalid phone or PIN format.");
  }
  return `pfl_${await hmac(`password:${phone}:${pin}`)}`;
}

export async function deriveRateLimitKey(identity: string, request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return hmac(`rate-limit:${identity.toLocaleLowerCase("ko-KR")}:${ip}`);
}
