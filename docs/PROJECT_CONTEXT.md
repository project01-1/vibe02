# Python Future Lab — Project Context

## 2026-08-11 Mission 01 Step 1 UX 리팩터링 계획

- 핵심 학습 UX를 **개념 이해 중심 60% + 시각적 실행 피드백 40%**로 설계한다. 특정 서비스의 레이아웃·그래픽·문구는 복제하지 않는다.
- 학습 모델은 **SEE → CONNECT → CHANGE → RUN → CODE**이며, 레벨이 오를수록 블록 안내를 60%에서 0%까지 줄인다.
- 첫 구현 범위는 Mission 01 `반복 이동`만이다. Mission 02·03의 콘텐츠와 동작은 기존 상태를 유지한다.
- 보호 경계: 로그인·회원가입·로그아웃, Supabase 세션, `/api/progress`, 사용자별 코드·진도·XP, RLS와 기존 migration은 변경하지 않는다.
- DB 변경은 필요하지 않다. 기존 `missionId`, 코드 문자열, 완료 상태, 시도 횟수와 XP 계약을 그대로 사용한다.
- 수정 대상: `components/mission/MissionLab.tsx`, 신규 Mission 01 학습 UI 컴포넌트, `lib/mission-validation.ts`, `app/globals.css`, 미션 검증 테스트와 프로젝트 문서.

- 2026-08-11 Supabase 업데이트: 서울 리전의 `Python Future Lab` 프로젝트를 연결하고 Auth·PostgreSQL·RLS 기반 회원/진도 저장으로 전환했다. 회원가입은 이름·고유 휴대폰 번호·숫자 4자리 PIN, 로그인은 고유 학생 이름·PIN을 사용하며 SMS 확인은 사용하지 않는다.
- 현재 학습 범위: 반복문 → 변수 → 조건문의 3단계 미션. 이전 미션 완료 후 다음 단계가 해금된다.

- 2026-08-04 업데이트: 첫 화면을 코드 기반 모션그래픽 히어로로 개편했다. 블록 변환, 에너지 스트림, 로봇 부유, Python 코드 입력이 한 장면에서 반복 재생되며 정적 이미지·영상 파일에 의존하지 않는다.

- 목적: 블록코딩 경험이 있는 초등 4~6학년 학생이 Python 텍스트 코딩으로 자연스럽게 전환하도록 돕는다.
- 핵심 가치: **블록으로 이해하고, Python 코드로 완성해요.**
- 해결 문제: 문법·들여쓰기·직접 입력에 대한 부담과 즉각적 시각 피드백 부족.
- 현재 상태: 반응형 랜딩, 별도 로그인·회원가입 페이지, 비회원 첫 체험, Supabase 회원·영구 진도 저장과 Vercel Production 검증까지 완료했다.
- 기술: vinext 기반 Next.js App Router 호환 구조, React, TypeScript strict, Tailwind CSS, Lucide, Zod, Vitest.
- 제약: MVP에서 사용자 Python을 서버 프로세스로 실행하지 않는다. 사전 허용 문법만 로컬 검증한다.
- 현재 우선순위: Vercel 비밀 환경변수 적용 → 프로덕션 계정/진도 E2E → 대시보드.
- 다음 작업: 프로덕션 검증 → 모바일 E2E → 학생 대시보드 → 학습 콘텐츠 확장.
- 변경 금지: 검증 없는 임의 Python 실행, 비밀값 클라이언트 노출, 불명확한 라이선스 자산 추가.
