# Data Model

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
