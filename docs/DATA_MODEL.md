# Data Model

## 현재 Supabase 구현

- Supabase Auth의 `auth.users.phone`을 정규화된 고유 로그인 ID로 사용한다.
- `profiles`, `learning_paths`, `missions`, `mission_steps`, `user_mission_progress`, `badges`, `user_badges`를 PostgreSQL에 저장한다.
- `auth_rate_limits`는 로그인 실패와 임시 잠금을 서버에서 관리한다.
- 진도와 XP는 `save_mission_progress` RPC가 원자적으로 저장한다.

## 예정 테이블

- `profiles(id, role, display_name, avatar_key, current_level, total_xp, created_at, updated_at)`
- `learning_paths(id, slug, title, description, order_index, is_published)`
- `missions(id, learning_path_id, slug, title, summary, concept, difficulty, order_index, starter_code, expected_result, xp_reward, is_trial, is_published, created_at, updated_at)`
- `mission_steps(id, mission_id, step_type, instruction, block_definition, code_template, validation_rule, hint, order_index)`
- `user_mission_progress(id, user_id, mission_id, status, current_step, attempts, best_result, completed_at, created_at, updated_at)`
- `badges`, `user_badges`.

## 관계와 무결성

- 학습 경로 1:N 미션, 미션 1:N 단계, 사용자 N:M 미션 진행.
- `(user_id, mission_id)` 고유 제약, slug 고유 제약, order index 양수 검증.
- 공개 콘텐츠 읽기와 관리자 쓰기를 분리한다.

## RLS

- 사용자는 자기 profile/progress/badge만 읽고 제한 필드만 수정한다.
- 공개·게시 콘텐츠는 익명 읽기 가능, 미게시 콘텐츠는 관리자만 접근한다.
