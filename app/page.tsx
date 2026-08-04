import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Bot,
  Braces,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Flag,
  Gamepad2,
  LockKeyhole,
  Play,
  Save,
  Trophy,
  Zap,
} from "lucide-react";
import { MotionHero } from "@/components/landing/MotionHero";

const steps = [
  [Blocks, "블록을 읽어요", "익숙한 명령의 뜻부터 확인해요."],
  [Braces, "코드와 연결해요", "같은 동작을 Python 문법으로 봐요."],
  [Code2, "한 줄을 바꿔요", "숫자나 명령 하나만 직접 수정해요."],
  [Play, "바로 실행해요", "로봇의 움직임으로 결과를 확인해요."],
  [Trophy, "개념을 내 것으로", "성공 경험과 함께 다음 미션을 열어요."],
] as const;

const zones = [
  ["01", "출력 실험실", "print로 로봇에게 신호 보내기", "완료", "success"],
  ["02", "변수 에너지실", "값을 저장하고 다시 사용하기", "진행 중", "active"],
  ["03", "조건 판단실", "상황에 따라 다르게 행동하기", "시작 가능", "ready"],
  ["04", "반복 제어실", "같은 일을 똑똑하게 반복하기", "시작 가능", "ready"],
  ["05", "함수 제작실", "나만의 명령 만들기", "잠금", "locked"],
  ["06", "미니게임 공방", "배운 개념으로 게임 완성하기", "잠금", "locked"],
] as const;

function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Python Future Lab 홈">
      <span className="logo-mark"><Bot size={21} strokeWidth={2.4} /></span>
      <span>Python <b>Future Lab</b></span>
    </Link>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="주요 메뉴">
            <a href="#method">학습 방법</a>
            <a href="#mission">체험 미션</a>
            <a href="#roadmap">탐험 지도</a>
          </nav>
          <div className="header-actions">
            <Link className="text-button" href="/mission">로그인</Link>
            <Link className="button button-small button-outline" href="/mission">무료 체험</Link>
          </div>
        </div>
      </header>

      <MotionHero />

      <section className="section method-section" id="method">
        <div className="shell">
          <div className="section-heading centered">
            <span className="kicker">HOW IT WORKS</span>
            <h2>코드를 외우기 전에, <span>동작으로 이해해요</span></h2>
            <p>한 번에 하나씩 바꾸고 바로 확인하는 5단계 학습 방식</p>
          </div>
          <div className="step-grid">
            {steps.map(([Icon, title, body], index) => (
              <article className="step-card" key={title}>
                <span className="step-number">0{index + 1}</span>
                <span className="step-icon"><Icon size={24} /></span>
                <h3>{title}</h3><p>{body}</p>
                {index < steps.length - 1 && <ChevronRight className="step-arrow" size={20} aria-hidden="true" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section mission-section" id="mission">
        <div className="shell mission-showcase">
          <div className="mission-copy">
            <span className="kicker">FREE MISSION</span>
            <h2>첫 번째 임무:<br /><span>에너지 셀을 회수하라</span></h2>
            <p>반복문 속 숫자를 바꿔 로봇 ‘루미’를 에너지 셀까지 이동시키세요. 실패해도 괜찮아요. 루미가 다음 단서를 알려줄 거예요.</p>
            <ul className="feature-list">
              <li><span><Gamepad2 size={18} /></span><div><b>즉각적인 반응</b><small>코드 결과를 움직임으로 확인</small></div></li>
              <li><span><Compass size={18} /></span><div><b>단계별 힌트</b><small>정답 대신 다음 생각을 안내</small></div></li>
              <li><span><LockKeyhole size={18} /></span><div><b>안전한 체험</b><small>허용된 명령만 로컬에서 검증</small></div></li>
            </ul>
            <Link className="button button-primary" href="/mission">첫 미션 시작하기 <ArrowRight size={18} /></Link>
            <span className="microcopy">회원가입 없이 바로 시작 · 약 3분</span>
          </div>
          <div className="mission-preview-card">
            <div className="preview-header"><span>미션 01</span><strong>앞으로 3칸 이동하기</strong><span>1 / 1</span></div>
            <div className="preview-body">
              <div className="space-grid" aria-hidden="true">
                <span className="planet planet-one" /><span className="planet planet-two" />
                <div className="preview-robot"><Bot size={36} /></div>
                <div className="preview-goal"><Zap size={23} fill="currentColor" /></div>
                <div className="path-dots"><i /><i /><i /></div>
              </div>
              <div className="preview-editor"><span>1</span><code><b>for</b> i <b>in</b> range(<em>3</em>):<br />&nbsp;&nbsp;move()</code></div>
            </div>
            <div className="preview-footer"><span><Bot size={16} /> 루미가 준비됐어요!</span><span className="button button-tiny"><Play size={13} fill="currentColor" /> 실행</span></div>
          </div>
        </div>
      </section>

      <section className="section roadmap-section" id="roadmap">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="kicker">LEARNING MAP</span><h2>미래 연구소의 <span>6개 구역</span></h2></div>
            <p>기초 문법부터 나만의 미니게임까지.<br />작은 성공을 연결해 한 구역씩 탐험해요.</p>
          </div>
          <div className="zone-grid">
            {zones.map(([number, title, body, status, state]) => (
              <article className={`zone-card zone-${state}`} key={number}>
                <div className="zone-top"><span>{number}</span><span className="zone-status">{state === "locked" && <LockKeyhole size={12} />} {status}</span></div>
                <div className="zone-icon">{state === "locked" ? <LockKeyhole size={23} /> : <Flag size={23} />}</div>
                <h3>{title}</h3><p>{body}</p>
                <div className="zone-progress"><span /><span /><span /><span /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section save-section">
        <div className="shell save-card">
          <div className="save-icon"><Save size={25} /></div>
          <div><span className="kicker">KEEP YOUR PROGRESS</span><h2>첫 미션을 끝냈다면,<br /><span>탐험 기록을 저장해 보세요.</span></h2></div>
          <div className="save-benefits">
            <span><Check size={15} /> 완료한 미션과 코드 저장</span>
            <span><Check size={15} /> 경험치와 배지 획득</span>
            <span><Check size={15} /> 다음 학습 지점에서 이어하기</span>
          </div>
          <Link className="button button-light" href="/mission">로그인하고 기록 저장 <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell final-inner">
          <span className="orbit-icon"><Bot size={34} /></span>
          <h2>준비됐나요?<br />첫 Python 실험을 시작해요.</h2>
          <p>틀려도 괜찮아요. 바꾸고, 실행하고, 발견하는 것이 코딩이니까요.</p>
          <Link className="button button-primary" href="/mission"><Play size={18} fill="currentColor" /> 무료 체험 미션 시작</Link>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner"><Logo /><p>블록코딩 다음 단계, Python으로 이어지는 가장 쉬운 길.</p><span>© 2026 Python Future Lab</span></div>
      </footer>
    </main>
  );
}
