# Python Future Lab — Project Context

- 목적: 블록코딩 경험이 있는 초등 4~6학년 학생이 Python 텍스트 코딩으로 자연스럽게 전환하도록 돕는다.
- 핵심 가치: **블록으로 이해하고, Python 코드로 완성해요.**
- 해결 문제: 문법·들여쓰기·직접 입력에 대한 부담과 즉각적 시각 피드백 부족.
- 현재 상태: 반응형 랜딩 페이지와 비회원 첫 체험 미션 구현 완료. 인증·영구 저장은 UI 경계만 제공한다.
- 기술: vinext 기반 Next.js App Router 호환 구조, React, TypeScript strict, Tailwind CSS, Lucide, Zod, Vitest.
- 제약: MVP에서 사용자 Python을 서버 프로세스로 실행하지 않는다. 사전 허용 문법만 로컬 검증한다.
- 현재 우선순위: 실제 인증·진행 저장을 Supabase 어댑터로 연결하고 미션 콘텐츠를 확장한다.
- 다음 작업: Supabase 스키마/RLS 적용 → 이메일 인증 → 학습 기록 저장 → 대시보드.
- 변경 금지: 검증 없는 임의 Python 실행, 비밀값 클라이언트 노출, 불명확한 라이선스 자산 추가.
