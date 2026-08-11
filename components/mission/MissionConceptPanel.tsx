import { ArrowRight, Blocks, Code2, Eye, Lightbulb, Link2, PencilLine, Play, Rocket, Sparkles } from "lucide-react";
import type { MissionDefinition } from "@/lib/missions";

const learningFlow = [
  [Eye, "SEE", "블록 보기"],
  [Link2, "CONNECT", "코드 연결"],
  [PencilLine, "CHANGE", "한 곳 수정"],
  [Play, "RUN", "결과 확인"],
  [Rocket, "CODE", "직접 코딩"],
] as const;

export function MissionConceptPanel({ mission, phase, hintOpen, onToggleHint }: {
  mission: MissionDefinition;
  phase: number;
  hintOpen: boolean;
  onToggleHint: () => void;
}) {
  return (
    <aside className="learning-concept-panel" aria-label="반복문 개념 학습">
      <div className="learning-level-row"><span>LEVEL 1</span><b>블록에서 Python으로</b></div>
      <div className="learning-flow" aria-label="SEE CONNECT CHANGE RUN CODE 학습 흐름">
        {learningFlow.map(([Icon, label, description], index) => (
          <div className={`${index <= phase ? "reached" : ""} ${index === phase ? "active" : ""}`} key={label}>
            <span><Icon size={13} /></span><b>{label}</b><small>{description}</small>
          </div>
        ))}
      </div>

      <section className="concept-mission-card">
        <div className="panel-kicker"><Sparkles size={14} /> 오늘의 미션</div>
        <h1>{mission.headline}<br /><span>{mission.highlight}</span></h1>
        <p>루미가 에너지 셀까지 가려면 같은 이동을 세 번 해야 해요.</p>
      </section>

      <section className="concept-explain-card">
        <div className="concept-section-title"><Code2 size={15} /><span><small>오늘의 개념</small><b>for 반복문</b></span></div>
        <p>같은 명령을 여러 번 반복할 때 Python에서는 <code>for</code> 문을 사용해요. <code>range()</code> 안의 숫자가 반복 횟수예요.</p>
      </section>

      <section className="block-connect-card">
        <div className="concept-section-title"><Blocks size={15} /><span><small>SEE → CONNECT</small><b>블록과 코드 연결</b></span></div>
        <div className="learning-blocks" aria-label="3번 반복하여 앞으로 이동하는 블록">
          <div className="learning-loop-block"><span>↻</span><b>3번 반복하기</b></div>
          <div className="learning-move-block"><ArrowRight size={15} /><b>앞으로 이동</b></div>
        </div>
        <div className="connection-lines">
          <div><span>반복 횟수</span><ArrowRight size={13} /><code>range(횟수)</code></div>
          <div><span>앞으로 이동</span><ArrowRight size={13} /><code>move()</code></div>
        </div>
      </section>

      <section className="change-task-card">
        <span>CHANGE</span><div><b>딱 한 곳만 바꿔 보세요</b><p><code>range(2)</code>의 숫자를 목표 칸 수에 맞춰 수정해요.</p></div>
      </section>

      <button className="progressive-hint-button" type="button" onClick={onToggleHint} aria-expanded={hintOpen}>
        <Lightbulb size={16} /> {hintOpen ? "힌트 닫기" : "막혔나요? 힌트 보기"}
      </button>
      {hintOpen && <div className="progressive-hint" role="note"><b>루미의 힌트</b><p>블록에 적힌 반복 횟수와 <code>range()</code> 안의 숫자를 비교해 보세요.</p></div>}
    </aside>
  );
}
