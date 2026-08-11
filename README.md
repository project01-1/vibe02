# Python Future Lab

블록코딩 경험이 있는 학생이 짧은 미션을 통해 Python 텍스트 코딩으로 전환하는 학습 플랫폼입니다.

## 요구 환경

- Node.js 22.13 이상
- pnpm 11

## 실행

```bash
pnpm install
pnpm dev
```

브라우저에서 출력된 로컬 주소를 엽니다. 랜딩의 주요 CTA 또는 `/mission`에서 로그인 없는 첫 체험을 시작할 수 있습니다.

## 검증

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test
```

## 환경변수

회원 계정과 학습 진도는 Supabase Auth/PostgreSQL에 저장합니다. `.env.example`의 공개 anon key와 서버 전용 service role key를 분리하고, 서버 전용 키와 `AUTH_PIN_PEPPER`를 `NEXT_PUBLIC_` 이름으로 만들면 안 됩니다.

## 주요 구조

- `app/`: 랜딩·미션 라우트와 디자인 시스템
- `components/mission/`: 미션 편집·실행 피드백 UI
- `lib/mission-validation.ts`: 임의 코드를 실행하지 않는 허용 문법 검증기
- `lib/supabase/`: 생성된 DB 타입과 서버·브라우저 Supabase 클라이언트
- `supabase/migrations/`: PostgreSQL 스키마·RLS·초기 콘텐츠·저장 트랜잭션
- `docs/`: 제품·아키텍처·보안·로드맵 문서
- `tests/`: 검증기 단위 테스트와 서버 렌더 테스트

상세 구현 상태와 다음 작업은 `docs/PROJECT_CONTEXT.md`, `docs/TASKS.md`를 참고하세요.
