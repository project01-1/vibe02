import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

beforeAll(() => {
  process.env.AUTH_PIN_PEPPER = "test-only-pin-pepper-with-at-least-32-characters";
});

describe("phone and PIN credentials", () => {
  it("normalizes a student login name", async () => {
    const { normalizeStudentName } = await import("../lib/server/pin-auth");
    expect(normalizeStudentName("  김미래  ")).toBe("김미래");
    expect(normalizeStudentName("미래  학생")).toBe("미래 학생");
    expect(normalizeStudentName("한")).toBeNull();
    expect(normalizeStudentName("학생_%")).toBeNull();
  });

  it("normalizes a Korean mobile phone number to E.164", async () => {
    const { normalizeKoreanPhone } = await import("../lib/server/pin-auth");
    expect(normalizeKoreanPhone("010-1234-5678")).toBe("+821012345678");
    expect(normalizeKoreanPhone("+82 10 1234 5678")).toBe("+821012345678");
  });

  it("rejects invalid mobile phone formats", async () => {
    const { normalizeKoreanPhone } = await import("../lib/server/pin-auth");
    expect(normalizeKoreanPhone("02-1234-5678")).toBeNull();
    expect(normalizeKoreanPhone("010-123-4567")).toBeNull();
  });

  it("turns a four-digit PIN into a stable Supabase password", async () => {
    const { deriveSupabasePassword } = await import("../lib/server/pin-auth");
    const first = await deriveSupabasePassword("+821012345678", "2580");
    const second = await deriveSupabasePassword("+821012345678", "2580");
    const different = await deriveSupabasePassword("+821012345678", "2581");
    expect(first).toBe(second);
    expect(first).not.toBe(different);
    expect(first.length).toBeGreaterThan(8);
  });
});
