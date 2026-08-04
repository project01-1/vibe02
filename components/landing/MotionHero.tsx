"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Bot, Braces, Check, Code2, Play, Sparkles, Zap } from "lucide-react";

export function MotionHero() {
  const heroRef = useRef<HTMLElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!heroRef.current || event.pointerType === "touch") return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    heroRef.current.style.setProperty("--pointer-x", x.toFixed(3));
    heroRef.current.style.setProperty("--pointer-y", y.toFixed(3));
  }

  function resetPointer() {
    heroRef.current?.style.setProperty("--pointer-x", "0");
    heroRef.current?.style.setProperty("--pointer-y", "0");
  }

  return (
    <section
      className="motion-hero"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="motion-grid" aria-hidden="true" />
      <div className="motion-aurora motion-aurora-one" aria-hidden="true" />
      <div className="motion-aurora motion-aurora-two" aria-hidden="true" />
      <div className="motion-orbit motion-orbit-one" aria-hidden="true" />
      <div className="motion-orbit motion-orbit-two" aria-hidden="true" />

      <div className="shell motion-hero-inner">
        <div className="motion-hero-copy">
          <div className="hero-brand"><Sparkles size={15} /> Python Future Lab</div>
          <h1>블록으로 이해하고,<br /><span>Python</span>으로 완성해요.</h1>
          <p>익숙한 블록이 실제 코드로 변하는 순간을 확인하세요. 로봇 루미와 함께 첫 Python 미션을 5분 안에 완성할 수 있어요.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/mission"><Play size={18} fill="currentColor" /> 첫 미션 무료로 시작</Link>
            <a className="button button-ghost" href="#method">학습 방식 보기 <ArrowRight size={18} /></a>
          </div>
          <div className="trust-row">
            <span><Check size={15} /> 설치 없음</span>
            <span><Check size={15} /> 3~5분 체험</span>
            <span><Check size={15} /> 안전한 코드 검증</span>
          </div>
        </div>

        <div className="motion-lab" role="img" aria-label="코딩 블록이 빛 입자로 변해 로봇을 지나 Python 코드로 완성되는 애니메이션">
          <div className="lab-ceiling"><i /><i /><i /></div>

          <div className="block-console">
            <div className="console-status"><span /> BLOCK SEQUENCE</div>
            <div className="motion-block block-yellow"><Play size={16} fill="currentColor" /><i /></div>
            <div className="motion-block block-purple"><Braces size={17} /><i /></div>
            <div className="motion-block block-cyan"><ArrowRight size={17} /><i /></div>
            <div className="motion-block block-mint"><span>↻</span><i /></div>
            <div className="motion-block block-violet"><Sparkles size={16} /><i /></div>
            <div className="console-scan" />
          </div>

          <div className="conversion-stream">
            <div className="stream-core" />
            <div className="stream-arrow" />
            <i className="stream-particle particle-one" />
            <i className="stream-particle particle-two" />
            <i className="stream-particle particle-three" />
            <i className="stream-particle particle-four" />
            <i className="stream-particle particle-five" />
          </div>

          <div className="hero-robot">
            <div className="robot-antenna"><i /></div>
            <div className="robot-ear robot-ear-left" />
            <div className="robot-ear robot-ear-right" />
            <div className="robot-head">
              <div className="robot-face"><i /><i /><span /></div>
              <div className="robot-highlight" />
            </div>
            <div className="robot-neck" />
            <div className="robot-body"><Code2 size={29} /><span /></div>
            <div className="robot-arm robot-arm-left"><i /></div>
            <div className="robot-arm robot-arm-right"><i /></div>
            <div className="robot-thruster"><span /><span /></div>
            <div className="robot-platform"><i /><i /></div>
          </div>

          <div className="code-monitor">
            <div className="monitor-bar"><span><i /> LIVE TRANSLATION</span><b>PY</b></div>
            <div className="code-content">
              <span className="code-number">1</span><code><b>for</b> i <b>in</b> <em>range</em>(<strong>3</strong>):</code>
              <span className="code-number">2</span><code>&nbsp;&nbsp;<em>move</em>()</code>
              <span className="code-number">3</span><code className="code-comment"># energy cell found!</code>
              <span className="code-number">4</span><code><em>collect</em>(<strong>energy</strong>)</code>
              <span className="code-cursor" />
            </div>
            <div className="monitor-result"><span><Zap size={14} fill="currentColor" /> 실행 성공</span><b>+40 XP</b></div>
            <div className="monitor-sweep" />
          </div>

          <div className="floor-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <div className="lab-caption"><Bot size={16} /><span><b>루미가 번역 중...</b> 블록 명령을 Python 문법으로 연결하고 있어요.</span></div>
        </div>
      </div>
      <a href="#method" className="scroll-cue" aria-label="다음 섹션으로 이동"><span /> SCROLL TO EXPLORE</a>
    </section>
  );
}
