# Architecture

## 구조

- `app/`: 라우트·메타데이터·전역 스타일.
- `components/mission/`: 체험 미션의 클라이언트 상호작용.
- `lib/`: UI와 분리된 검증 로직. 향후 서비스·저장소 인터페이스가 위치한다.
- `docs/`, `tests/`: 제품 기준과 회귀 검증.

## 데이터 흐름

1. 학생이 편집기의 문자열을 수정한다.
2. `validateMissionCode`가 Zod 길이 검증과 허용 정규식 검증을 수행한다.
3. UI는 결과 상태로 이동 거리와 피드백을 표현한다.
4. 로그인 사용자는 API에서 같은 코드를 다시 검증한다.
5. Supabase RPC가 진도 upsert와 최초 완료 XP 지급을 한 트랜잭션으로 처리한다.

## 현재 저장 경계

- Supabase Auth는 휴대폰 번호를 고유 로그인 ID로 사용하고 실제 비밀번호는 서버 HMAC으로 파생한다.
- 서비스 역할 키는 서버 route에서만 사용하고 사용자별 조회는 RLS로 제한한다.
- 미션 콘텐츠와 RLS는 `supabase/migrations`에서 버전 관리한다.

## 향후 경계

- Python 샌드박스는 애플리케이션 서버와 네트워크·CPU·메모리가 분리된 별도 실행 계층으로 둔다.
- 프로덕션 배포는 Vercel Next.js, 영구 데이터는 Supabase 서울 리전을 사용한다.
