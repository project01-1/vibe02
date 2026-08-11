import { KeyboardEvent } from "react";
import { Bot, Code2, Crosshair, ShieldCheck } from "lucide-react";
import type { MissionResult } from "@/lib/mission-validation";

function highlightedCode(code: string) {
  const tokenPattern = /(\bfor\b|\bin\b|\brange\b|\bmove\b|\d+|[():])/g;
  return code.split("\n").map((line, lineIndex) => (
    <div className="highlight-line" key={`${lineIndex}-${line}`}>
      {line.split(tokenPattern).filter(Boolean).map((token, tokenIndex) => {
        const className = /^\d+$/.test(token)
          ? "syntax-number syntax-edit-target"
          : /^(for|in)$/.test(token)
            ? "syntax-keyword"
            : /^(range|move)$/.test(token)
              ? "syntax-function"
              : "syntax-plain";
        return <span className={className} key={`${token}-${tokenIndex}`}>{token}</span>;
      })}
      {line.length === 0 && " "}
    </div>
  ));
}

export function PythonLearningEditor({ code, onCodeChange, result, saveState }: {
  code: string;
  onCodeChange: (value: string) => void;
  result: MissionResult | null;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  const lines = Array.from({ length: Math.max(2, code.split("\n").length) }, (_, index) => index + 1);
  const errorLine = result && result.status !== "success" ? result.focusLine : undefined;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" && event.key !== "Tab") return;
    event.preventDefault();
    const input = event.currentTarget;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const before = code.slice(0, start);
    const after = code.slice(end);
    const currentLine = before.split("\n").at(-1) ?? "";
    const indentation = currentLine.match(/^\s*/)?.[0] ?? "";
    const inserted = event.key === "Tab" ? "    " : `\n${indentation}${currentLine.trimEnd().endsWith(":") ? "    " : ""}`;
    onCodeChange(before + inserted + after);
    window.requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = start + inserted.length;
    });
  }

  return (
    <section className="learning-editor-panel" aria-label="Python 코드 편집기">
      <header className="learning-panel-header">
        <span><Code2 size={16} /> Python 코드</span>
        <div><span className="edit-target-badge"><Crosshair size={12} /> 숫자 수정</span><span className="safe-badge"><ShieldCheck size={12} /> 안전 모드</span>{saveState !== "idle" && <span className={`save-state save-${saveState}`}>{saveState === "saving" ? "저장 중" : saveState === "saved" ? "저장됨" : "저장 오류"}</span>}</div>
      </header>
      <div className={`learning-code-surface ${errorLine ? "has-line-error" : ""}`} style={{ "--error-line": Math.max(0, (errorLine ?? 1) - 1) } as React.CSSProperties}>
        <div className="learning-line-numbers" aria-hidden="true">{lines.map((line) => <span className={errorLine === line ? "error" : ""} key={line}>{line}</span>)}</div>
        <div className="code-input-stack">
          <pre className="syntax-overlay" aria-hidden="true"><code>{highlightedCode(code)}</code></pre>
          <textarea value={code} onChange={(event) => onCodeChange(event.target.value)} onKeyDown={handleKeyDown} spellCheck={false} aria-label="수정할 Python 코드" maxLength={300} />
        </div>
      </div>
      <div className="edit-focus-callout"><Crosshair size={16} /><div><b>지금 수정할 곳</b><p>1번째 줄 <code>range(2)</code>의 숫자 <mark>2</mark></p></div></div>
      <div className="editor-coach"><Bot size={20} /><div><b>루미의 안내</b><p>{result && result.status !== "success" ? result.message : "전체 코드를 새로 쓰지 않아도 돼요. 숫자 하나부터 바꿔 봐요!"}</p></div></div>
    </section>
  );
}
