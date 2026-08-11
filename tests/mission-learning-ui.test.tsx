import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LumiMissionStage } from "../components/mission/LumiMissionStage";
import { MissionConceptPanel } from "../components/mission/MissionConceptPanel";
import { PythonLearningEditor } from "../components/mission/PythonLearningEditor";
import { getMission } from "../lib/missions";

describe("Mission 01 learning experience", () => {
  it("renders the five-step learning model and the block-to-code connection", () => {
    const html = renderToStaticMarkup(
      <MissionConceptPanel mission={getMission(1)} phase={2} hintOpen={false} onToggleHint={vi.fn()} />,
    );

    for (const label of ["SEE", "CONNECT", "CHANGE", "RUN", "CODE"]) expect(html).toContain(label);
    expect(html).toContain("3번 반복하기");
    expect(html).toContain("range(횟수)");
  });

  it("shows the focused edit target and a visual result stage", () => {
    const editor = renderToStaticMarkup(
      <PythonLearningEditor code={getMission(1).starterCode} onCodeChange={vi.fn()} result={null} saveState="idle" />,
    );
    const stage = renderToStaticMarkup(
      <LumiMissionStage steps={2} running={false} result={{ status: "too-short", steps: 2, message: "1칸 남았어요.", focusLine: 1 }} completed={false} reward={40} />,
    );

    expect(editor).toContain("learning-line-numbers");
    expect(editor).toContain("range(2)");
    expect(editor).toContain("지금 수정할 곳");
    expect(stage).toContain("2 / 3칸");
    expect(stage).toContain("루미의 관찰");
  });
});
