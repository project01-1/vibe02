import { describe, expect, it } from "vitest";
import { validateMissionCode } from "../lib/mission-validation";

describe("validateMissionCode", () => {
  it("accepts the exact three-step loop", () => {
    expect(validateMissionCode("for i in range(3):\n    move()").status).toBe("success");
  });

  it("returns a directional hint when the robot stops early", () => {
    const result = validateMissionCode("for i in range(2):\n    move()");
    expect(result.status).toBe("too-short");
    expect(result.message).toContain("1칸");
  });

  it("rejects arbitrary Python instead of executing it", () => {
    expect(validateMissionCode("import os\nos.system('echo unsafe')").status).toBe("invalid");
  });
});
