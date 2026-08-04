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

describe("단계별 미션 검증", () => {
  it("변수 미션에서 energy 5를 성공 처리한다", () => {
    expect(validateMissionCode("energy = 5\ncharge(energy)", 2).status).toBe("success");
  });

  it("조건문 미션에서 열린 문을 통과한다", () => {
    expect(validateMissionCode("door_open = True\nif door_open:\n    move()", 3).status).toBe("success");
  });

  it("잘못된 조건문 명령을 거부한다", () => {
    expect(validateMissionCode("door_open = True\nif door_open:\n    wait()", 3).status).toBe("invalid");
  });
});
