# Architecture

## 구조

- `app/`: 라우트·메타데이터·전역 스타일.
- `components/mission/`: 체험 미션의 클라이언트 상호작용.
- `lib/`: UI와 분리된 검증 로직. 향후 서비스·저장소 인터페이스가 위치한다.
- `docs/`, `tests/`: 제품 기준과 회귀 검증.

## 데이터 흐름

1. 학생이 편집기의 문자열을 수정한다.
2. `validateMissionCode`가 Zod 길이 검증과 허용 정규식 검증을 수행한다.
3. 구조가 맞으면 반복 횟수만 해석해 결과 상태를 반환한다.
4. UI는 결과 상태로 이동 거리와 피드백을 표현한다.

## 향후 경계

- `AuthService`, `ProgressRepository`, `MissionRepository` 인터페이스 뒤에 Supabase를 연결한다.
- Python 샌드박스는 애플리케이션 서버와 네트워크·CPU·메모리가 분리된 별도 실행 계층으로 둔다.
- 배포는 Sites/Cloudflare 호환 ESM 빌드를 유지한다.
