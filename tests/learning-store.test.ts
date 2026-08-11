import { describe, expect, it } from "vitest";
import { createLearningState, updateProgress } from "../lib/server/learning-store";

describe("Vercel-compatible learning state", () => {
  it("stores code and awards XP on first completion", () => {
    const state = createLearningState();
    const saved = updateProgress(state, {
      missionId: 1,
      code: "for i in range(3):\n    move()",
      completed: true,
      countAttempt: true,
    });

    expect(saved.totalXp).toBe(40);
    expect(saved.progress[0]).toMatchObject({ mission_id: 1, status: "completed", attempts: 1 });
  });

  it("does not award duplicate XP when a completed mission is saved again", () => {
    const first = updateProgress(createLearningState(), {
      missionId: 1,
      code: "for i in range(3):\n    move()",
      completed: true,
      countAttempt: true,
    });
    const second = updateProgress(first, {
      missionId: 1,
      code: "for i in range(3):\n    move()",
      completed: true,
      countAttempt: true,
    });

    expect(second.totalXp).toBe(40);
    expect(second.progress[0].attempts).toBe(2);
  });
});
