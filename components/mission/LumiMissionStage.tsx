import { Bot, CheckCircle2, Flag, Play, Sparkles, Zap } from "lucide-react";
import type { MissionResult } from "@/lib/mission-validation";

export function LumiMissionStage({ steps, running, result, completed, reward }: {
  steps: number;
  running: boolean;
  result: MissionResult | null;
  completed: boolean;
  reward: number;
}) {
  const success = result?.status === "success";
  const distanceLabel = running ? "이동 중" : result ? `${Math.min(steps, 3)} / 3칸` : "준비 완료";

  return (
    <section className="learning-result-panel" aria-label="루미 실행 결과">
      <header className="learning-panel-header"><span><Play size={15} /> 실행 결과</span><span className={`simulation-status ${running ? "running" : success ? "success" : ""}`}><i />{running ? "RUNNING" : success ? "SUCCESS" : "READY"}</span></header>
      <div className={`lumi-simulation ${success ? "mission-cleared" : ""}`}>
        <div className="simulation-sky" aria-hidden="true" />
        <div className="simulation-hud"><span>이동 거리</span><b>{distanceLabel}</b></div>
        <div className="energy-beacon"><span>ENERGY CELL</span><Zap size={28} fill="currentColor" /></div>
        <div className="mission-route">
          {[0, 1, 2, 3].map((position) => <span className={steps >= position ? "passed" : ""} key={position}><i>{position === 0 ? <Flag size={11} /> : position}</i></span>)}
        </div>
        <div className={`lumi-character ${running ? "moving" : ""}`} style={{ "--lumi-step": Math.min(steps, 3) } as React.CSSProperties}>
          <span className="lumi-antenna" /><div className="lumi-face"><Bot size={34} /></div><span className="lumi-glow" />
        </div>
        {success && <div className="collect-burst" aria-hidden="true"><i /><i /><i /><i /><i /><Sparkles size={24} /></div>}
      </div>

      <div className={`learning-result-message ${result ? `result-${result.status}` : ""}`} aria-live="polite">
        {success ? <CheckCircle2 size={22} /> : <Bot size={22} />}
        <div>
          <b>{success ? "미션 성공!" : result ? "루미의 관찰" : "코드를 실행해 보세요"}</b>
          <p>{result?.message ?? "코드의 숫자를 바꾸면 루미가 그만큼 실제로 이동해요."}</p>
        </div>
      </div>

      {success && <div className="learning-success-card"><span><Sparkles size={19} /></span><div><b>반복문 연구 완료</b><p>블록의 반복 동작을 Python 코드로 연결했어요.</p></div><strong>{completed ? "완료" : `+${reward} XP`}</strong></div>}
    </section>
  );
}
