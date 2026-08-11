"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Bot, Check, KeyRound, LogIn, Phone, Sparkles, UserRound } from "lucide-react";

type AuthMode = "login" | "signup";

export function StudentAuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, pin }),
      });
      const data = await response.json().catch(() => null) as { user?: { id: string }; message?: string } | null;
      if (!response.ok || !data?.user) {
        setError(data?.message ?? `${isSignup ? "회원가입" : "로그인"}을 완료하지 못했어요.`);
        return;
      }
      router.push("/mission");
      router.refresh();
    } catch {
      setError("연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page-grid" aria-hidden="true" />
      <Link className="auth-home-link" href="/"><ArrowLeft size={17} /> 첫 화면으로</Link>

      <section className="auth-visual" aria-label="Python Future Lab 소개">
        <div className="auth-brand"><span><Bot size={22} /></span>Python <b>Future Lab</b></div>
        <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" />
        <div className="auth-robot"><Bot size={68} /><span /></div>
        <span className="auth-code-chip auth-code-one">for i in range(3):</span>
        <span className="auth-code-chip auth-code-two">&nbsp;&nbsp;move()</span>
        <div className="auth-visual-copy">
          <span><Sparkles size={14} /> LEARNING CONTINUES</span>
          <h1>{isSignup ? "나만의 학습 기록을\n만들어 보세요." : "저장한 단계부터\n다시 시작해요."}</h1>
          <p>완료한 미션과 Python 코드, 경험치를 안전하게 이어갈 수 있어요.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <span className="auth-card-icon"><UserRound size={24} /></span>
          <p className="kicker">STUDENT ACCOUNT</p>
          <h2>{isSignup ? "회원가입" : "학생 로그인"}</h2>
          <p className="auth-card-intro">
            {isSignup ? "이름, 휴대폰 번호, 숫자 PIN만 입력하면 바로 시작할 수 있어요." : "학생 이름과 숫자 4자리 PIN을 입력해 주세요."}
          </p>

          <form className="auth-form" onSubmit={submit}>
            <label>
              <span><UserRound size={15} /> 학생 이름</span>
              <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={20} pattern="[가-힣a-zA-Z0-9 ]{2,20}" autoComplete="username" placeholder="예: 김미래" required />
              {isSignup && <small>로그인할 때 사용할 고유한 이름이에요.</small>}
            </label>

            {isSignup && (
              <label>
                <span><Phone size={15} /> 휴대폰 번호</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d+\- ()]/g, ""))} minLength={10} maxLength={20} type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" required />
                <small>SMS는 보내지 않으며 중복 가입 확인에 사용해요.</small>
              </label>
            )}

            <label>
              <span><KeyRound size={15} /> 비밀번호</span>
              <input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))} maxLength={4} pattern="\d{4}" type="password" inputMode="numeric" autoComplete={isSignup ? "new-password" : "current-password"} placeholder="숫자 4자리" required />
            </label>

            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="button button-primary auth-submit" type="submit" disabled={loading}>
              {isSignup ? <Check size={18} /> : <LogIn size={18} />}
              {loading ? "확인 중..." : isSignup ? "가입하고 학습 시작" : "로그인하고 이어하기"}
            </button>
          </form>

          <div className="auth-switch">
            {isSignup ? <>이미 계정이 있나요? <Link href="/login">로그인</Link></> : <>처음 방문했나요? <Link href="/signup">회원가입</Link></>}
          </div>
        </div>
      </section>
    </main>
  );
}
