"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Lightbulb,
  LockKeyhole,
  LogIn,
  LogOut,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { validateMissionCode, type MissionResult } from "@/lib/mission-validation";
import { getMission, missions } from "@/lib/missions";

type LearningUser = { id: string; displayName: string; totalXp: number };
type AuthMode = "login" | "signup";
type SavedProgress = {
  mission_id: number;
  status: "in_progress" | "completed";
  code: string;
  attempts: number;
  updated_at: string;
};

export function MissionLab() {
  const [missionId, setMissionId] = useState(1);
  const [code, setCode] = useState(getMission(1).starterCode);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [user, setUser] = useState<LearningUser | null>(null);
  const [progress, setProgress] = useState<SavedProgress[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginName, setLoginName] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [sessionReady, setSessionReady] = useState(false);

  const mission = getMission(missionId);
  const completedIds = useMemo(
    () => new Set(progress.filter((item) => item.status === "completed").map((item) => item.mission_id)),
    [progress],
  );
  const completedCount = completedIds.size;
  const success = result?.status === "success";
  const robotSteps = useMemo(() => {
    if (!result || result.status === "invalid") return 0;
    return Math.min(result.steps, 3);
  }, [result]);

  useEffect(() => {
    void loadSession();
  }, []);

  async function loadSession() {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await response.json() as { user: LearningUser | null; progress: SavedProgress[] };
      setUser(data.user);
      setProgress(data.progress ?? []);
      if (data.user && data.progress?.length) {
        const firstIncomplete = missions.find((item) => !data.progress.some((saved) => saved.mission_id === item.id && saved.status === "completed"));
        const targetId = firstIncomplete?.id ?? missions.length;
        const saved = data.progress.find((item) => item.mission_id === targetId);
        setMissionId(targetId);
        setCode(saved?.code ?? getMission(targetId).starterCode);
      }
    } finally {
      setSessionReady(true);
    }
  }

  function isUnlocked(id: number) {
    return id === 1 || completedIds.has(id - 1) || Boolean(user && success && id === missionId + 1);
  }

  function selectMission(id: number) {
    if (!isUnlocked(id)) return;
    const saved = progress.find((item) => item.mission_id === id);
    setMissionId(id);
    setCode(saved?.code ?? getMission(id).starterCode);
    setResult(null);
    setHintOpen(false);
    setSaveState("idle");
  }

  async function persistProgress(countAttempt: boolean) {
    setSaveState("saving");
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ missionId, code, countAttempt }),
    });
    if (response.status === 401) {
      setSaveState("idle");
      setLoginOpen(true);
      return false;
    }
    if (!response.ok) {
      setSaveState("error");
      return false;
    }
    const data = await response.json() as { progress: SavedProgress[]; totalXp: number };
    setProgress(data.progress);
    setUser((current) => current ? { ...current, totalXp: data.totalXp } : current);
    setSaveState("saved");
    window.setTimeout(() => setSaveState((current) => current === "saved" ? "idle" : current), 1800);
    return true;
  }

  function runMission() {
    setRunning(true);
    setResult(null);
    window.setTimeout(() => {
      const nextResult = validateMissionCode(code, missionId);
      setResult(nextResult);
      setRunning(false);
      if (user) void persistProgress(true);
    }, 650);
  }

  function resetMission() {
    setCode(mission.starterCode);
    setResult(null);
    setHintOpen(false);
    setSaveState("idle");
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const response = await fetch(authMode === "signup" ? "/api/auth/signup" : "/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: loginName, phone: loginPhone, pin: loginPin }),
    });
    const data = await response.json() as { user?: LearningUser; message?: string };
    setLoginLoading(false);
    if (!response.ok || !data.user) {
      setLoginError(data.message ?? "로그인하지 못했어요. 다시 확인해 주세요.");
      return;
    }
    setUser(data.user);
    setLoginOpen(false);
    await loadSession();
    if (success) await persistProgress(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProgress([]);
    setMissionId(1);
    setCode(getMission(1).starterCode);
    setResult(null);
    setSaveState("idle");
  }

  const lineNumbers = Array.from({ length: Math.max(2, code.split("\n").length) }, (_, index) => index + 1);

  return (
    <main className="mission-app">
      <header className="mission-header">
        <Link href="/" className="mission-back"><ArrowLeft size={18} /> 나가기</Link>
        <div className="mission-title"><span>MISSION {String(missionId).padStart(2, "0")}</span><strong>{mission.title}</strong></div>
        <div className="mission-account-area">
          {user ? (
            <div className="student-chip"><span><UserRound size={15} /><b>{user.displayName}</b><em>{user.totalXp} XP</em></span><button type="button" onClick={logout} aria-label="로그아웃"><LogOut size={15} /></button></div>
          ) : (
            <button className="mission-login-button" type="button" onClick={() => setLoginOpen(true)} disabled={!sessionReady}><LogIn size={15} /> 로그인</button>
          )}
        </div>
      </header>

      <nav className="mission-stepper" aria-label="단계별 학습">
        <div className="mission-stepper-inner">
          {missions.map((item) => {
            const complete = completedIds.has(item.id);
            const unlocked = isUnlocked(item.id);
            return (
              <button key={item.id} type="button" className={`${item.id === missionId ? "active" : ""} ${complete ? "complete" : ""}`} disabled={!unlocked} onClick={() => selectMission(item.id)}>
                <span>{complete ? <Check size={14} /> : unlocked ? item.id : <LockKeyhole size={12} />}</span>
                <small>STEP {item.id}</small><b>{item.shortTitle}</b>
              </button>
            );
          })}
          <div className="stepper-summary"><strong>{completedCount} / {missions.length}</strong><span>완료</span></div>
        </div>
      </nav>

      <div className="mission-layout">
        <aside className="instruction-panel">
          <div className="panel-kicker"><Sparkles size={14} /> 오늘의 실험</div>
          <h1>{mission.headline}<br /><span>{mission.highlight}</span></h1>
          <p>{mission.description}</p>
          <div className="block-stack">
            <div className="visual-block visual-loop"><b>{mission.blockPrimary}</b></div>
            <div className="visual-block visual-move">{mission.blockSecondary}</div>
          </div>
          <div className="concept-note"><Code2 size={18} /><p><b>오늘의 개념 · {mission.concept}</b>{mission.conceptBody}</p></div>
          <button className="hint-button" type="button" onClick={() => setHintOpen((value) => !value)} aria-expanded={hintOpen}><Lightbulb size={18} /> 힌트 보기</button>
          {hintOpen && <div className="hint-box">{mission.hint}</div>}
        </aside>

        <section className="editor-panel" aria-label="Python 코드 편집기">
          <div className="panel-header"><span><Code2 size={16} /> Python 코드</span><span className="editor-statuses"><span className="safe-badge">안전 모드</span>{user && <span className={`save-state save-${saveState}`}>{saveState === "saving" ? "저장 중" : saveState === "saved" ? "저장됨" : saveState === "error" ? "저장 오류" : "자동 저장"}</span>}</span></div>
          <div className="editor-wrap">
            <div className="line-numbers" aria-hidden="true">{lineNumbers.map((line) => <span key={line}>{line}</span>)}</div>
            <textarea value={code} onChange={(event) => { setCode(event.target.value); setSaveState("idle"); }} spellCheck={false} aria-label="수정할 Python 코드" maxLength={300} />
          </div>
          <div className="editor-tip"><Bot size={18} /><p><b>루미:</b> {mission.coach}</p></div>
          <div className="editor-actions">
            <button type="button" className="button button-ghost" onClick={resetMission}><RotateCcw size={17} /> 초기화</button>
            {user && <button type="button" className="button button-ghost" onClick={() => void persistProgress(false)} disabled={saveState === "saving"}><Save size={17} /> 코드 저장</button>}
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
          {success && <div className="success-card"><span><Sparkles size={19} /></span><div><b>{mission.concept} 실험 성공!</b><p>{user ? "학습 기록과 코드가 저장됐어요." : "로그인하면 결과와 코드를 저장할 수 있어요."}</p></div><strong>{completedIds.has(missionId) ? "완료" : `+${mission.reward} XP`}</strong></div>}
          {success && !user && <button className="button button-light save-progress" type="button" onClick={() => setLoginOpen(true)}>로그인하고 학습 기록 저장</button>}
          {success && user && missionId < missions.length && <button className="button button-light save-progress" type="button" onClick={() => selectMission(missionId + 1)}>다음 단계 학습 <ChevronRight size={17} /></button>}
          {success && user && missionId === missions.length && <div className="course-complete"><CheckCircle2 size={20} /><div><b>기초 코스 완료!</b><span>반복문·변수·조건문을 모두 익혔어요.</span></div></div>}
        </section>
      </div>

      {loginOpen && (
        <div className="login-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLoginOpen(false); }}>
          <section className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button className="dialog-close" type="button" onClick={() => setLoginOpen(false)} aria-label="로그인 창 닫기"><X size={19} /></button>
            <span className="login-icon"><UserRound size={24} /></span>
            <div className="panel-kicker">STUDENT LOGIN</div>
            <h2 id="login-title">{authMode === "signup" ? "새 학습 기록을 만들어요" : "학습 기록을 이어가요"}</h2>
            <p>{authMode === "signup" ? "이름과 휴대폰 번호, 숫자 PIN만 입력하면 바로 시작할 수 있어요." : "학생 이름과 숫자 4자리 PIN으로 저장한 단계부터 이어가세요."}</p>
            <div className="auth-mode-tabs" role="tablist" aria-label="계정 메뉴">
              <button type="button" role="tab" aria-selected={authMode === "login"} onClick={() => { setAuthMode("login"); setLoginError(""); }}>로그인</button>
              <button type="button" role="tab" aria-selected={authMode === "signup"} onClick={() => { setAuthMode("signup"); setLoginError(""); }}>회원가입</button>
            </div>
            <form onSubmit={handleAuth}>
              <label>학생 이름<input value={loginName} onChange={(event) => setLoginName(event.target.value)} minLength={2} maxLength={20} pattern="[가-힣a-zA-Z0-9 ]{2,20}" required autoComplete="username" /></label>
              {authMode === "signup" && <label>휴대폰 번호<input value={loginPhone} onChange={(event) => setLoginPhone(event.target.value.replace(/[^\d+\- ()]/g, ""))} minLength={10} maxLength={20} required type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" /></label>}
              <label>숫자 PIN 4자리<input value={loginPin} onChange={(event) => setLoginPin(event.target.value.replace(/\D/g, ""))} maxLength={4} pattern="\d{4}" required type="password" inputMode="numeric" autoComplete={authMode === "signup" ? "new-password" : "current-password"} /></label>
              {loginError && <div className="login-error" role="alert">{loginError}</div>}
              <button className="button button-primary" type="submit" disabled={loginLoading}><LogIn size={17} /> {loginLoading ? "확인 중..." : authMode === "signup" ? "회원가입하고 시작" : "로그인하고 이어하기"}</button>
            </form>
            <small>{authMode === "signup" ? "학생 이름과 휴대폰 번호의 중복 여부를 확인합니다." : "휴대폰 번호 입력 없이 간단히 로그인합니다."}</small>
          </section>
        </div>
      )}
    </main>
  );
}
