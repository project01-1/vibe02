"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, Code2, Lightbulb, Play, RotateCcw, Sparkles, Zap } from "lucide-react";
import { validateMissionCode, type MissionResult } from "@/lib/mission-validation";

const starterCode = "for i in range(2):\n    move()";

export function MissionLab() {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const robotSteps = useMemo(() => {
    if (!result || result.status === "invalid") return 0;
    return Math.min(result.steps, 4);
  }, [result]);

  function runMission() {
    setRunning(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(validateMissionCode(code));
      setRunning(false);
    }, 650);
  }

  function resetMission() {
    setCode(starterCode);
    setResult(null);
    setHintOpen(false);
  }

  const success = result?.status === "success";

  return (
    <main className="mission-app">
      <header className="mission-header">
        <Link href="/" className="mission-back"><ArrowLeft size={18} /> 나가기</Link>
        <div className="mission-title"><span>MISSION 01</span><strong>에너지 셀을 회수하라</strong></div>
        <div className="mission-progress"><span>진행률</span><div><i /></div><b>1 / 1</b></div>
      </header>

      <div className="mission-layout">
        <aside className="instruction-panel">
          <div className="panel-kicker"><Sparkles size={14} /> 오늘의 실험</div>
          <h1>루미를 앞으로<br /><span>3칸</span> 이동시키세요.</h1>
          <p>반복문은 같은 명령을 여러 번 실행해요. 블록 속 숫자와 Python 코드의 숫자를 비교해 보세요.</p>
          <div className="block-stack">
            <div className="visual-block visual-loop"><span>↻</span> <b>3번 반복하기</b></div>
            <div className="visual-block visual-move"><span>➜</span> 앞으로 이동</div>
          </div>
          <div className="concept-note"><Code2 size={18} /><p><b>오늘의 개념 · 반복문</b>같은 일을 다시 쓸 필요 없이 횟수만 정할 수 있어요.</p></div>
          <button className="hint-button" type="button" onClick={() => setHintOpen((value) => !value)} aria-expanded={hintOpen}><Lightbulb size={18} /> 힌트 보기</button>
          {hintOpen && <div className="hint-box">블록에는 <b>3번</b>이라고 쓰여 있네요. 코드의 <code>range(2)</code>에서 어떤 숫자를 바꾸면 좋을까요?</div>}
        </aside>

        <section className="editor-panel" aria-label="Python 코드 편집기">
          <div className="panel-header"><span><Code2 size={16} /> Python 코드</span><span className="safe-badge">안전 모드</span></div>
          <div className="editor-wrap">
            <div className="line-numbers" aria-hidden="true">1<br />2</div>
            <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} aria-label="수정할 Python 코드" maxLength={300} />
          </div>
          <div className="editor-tip"><Bot size={18} /><p><b>루미:</b> 전체를 새로 쓰지 않아도 돼. 숫자 하나만 바꿔 봐!</p></div>
          <div className="editor-actions">
            <button type="button" className="button button-ghost" onClick={resetMission}><RotateCcw size={17} /> 초기화</button>
            <button type="button" className="button button-primary" onClick={runMission} disabled={running}><Play size={17} fill="currentColor" /> {running ? "실행 중..." : "코드 실행"}</button>
          </div>
        </section>

        <section className="result-panel" aria-label="실행 결과">
          <div className="panel-header"><span><Play size={15} /> 실행 결과</span><span className={running ? "live-dot running" : "live-dot"}>{running ? "RUNNING" : "READY"}</span></div>
          <div className="mission-stage">
            <div className="stars" aria-hidden="true" />
            <span className="stage-label start-label">START</span><span className="stage-label goal-label">GOAL</span>
            <div className="stage-path"><i /><i /><i /><i /></div>
            <div className={`mission-robot ${running ? "is-running" : ""}`} style={{ "--robot-step": robotSteps } as React.CSSProperties}><Bot size={34} /><span className="robot-shadow" /></div>
            <div className={`mission-energy ${success ? "collected" : ""}`}><Zap size={25} fill="currentColor" /></div>
          </div>
          <div className={`result-message ${result ? `result-${result.status}` : ""}`} aria-live="polite">
            {success ? <CheckCircle2 size={22} /> : <Bot size={22} />}
            <div><b>{success ? "미션 성공!" : result ? "루미의 분석" : "실행을 기다리고 있어요"}</b><p>{result?.message ?? "코드를 바꾸고 실행 버튼을 눌러 보세요."}</p></div>
          </div>
          {success && <div className="success-card"><span><Sparkles size={19} /></span><div><b>첫 Python 실험 성공!</b><p>반복문은 원하는 횟수만큼 명령을 실행해요.</p></div><strong>+40 XP</strong></div>}
          {success && <button className="button button-light save-progress" type="button">로그인하고 탐험 기록 저장</button>}
        </section>
      </div>
    </main>
  );
}
