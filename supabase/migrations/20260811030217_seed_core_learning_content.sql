insert into public.learning_paths (
  id, slug, title, description, order_index, is_published
) values (
  '00000000-0000-4000-8000-000000001000',
  'python-foundations',
  'Python 기초 연구소',
  '블록코딩의 개념을 반복문, 변수, 조건문 순서로 Python에 연결합니다.',
  1,
  true
);

insert into public.missions (
  id, learning_path_id, slug, title, summary, concept, difficulty,
  order_index, starter_code, expected_result, xp_reward, is_trial, is_published
) values
  (
    '00000000-0000-4000-8000-000000001001',
    '00000000-0000-4000-8000-000000001000',
    'repeat-move',
    '에너지 셀을 회수하라',
    '반복문으로 루미를 앞으로 3칸 이동합니다.',
    '반복문', 1, 1,
    E'for i in range(2):\n    move()',
    '{"kind":"loop_move","steps":3}'::jsonb,
    40, true, true
  ),
  (
    '00000000-0000-4000-8000-000000001002',
    '00000000-0000-4000-8000-000000001000',
    'energy-variable',
    '에너지 코어를 충전하라',
    'energy 변수에 5를 저장해 코어를 충전합니다.',
    '변수', 1, 2,
    E'energy = 3\ncharge(energy)',
    '{"kind":"variable_value","name":"energy","value":5}'::jsonb,
    50, false, true
  ),
  (
    '00000000-0000-4000-8000-000000001003',
    '00000000-0000-4000-8000-000000001000',
    'door-condition',
    '보안 문을 통과하라',
    '문이 열렸을 때만 루미가 이동하도록 조건문을 완성합니다.',
    '조건문', 1, 3,
    E'door_open = True\nif door_open:\n    wait()',
    '{"kind":"condition_command","condition":"door_open","command":"move"}'::jsonb,
    60, false, true
  );

insert into public.mission_steps (
  mission_id, step_type, instruction, block_definition, code_template,
  validation_rule, hint, order_index
) values
  (
    '00000000-0000-4000-8000-000000001001', 'edit',
    'range 안의 숫자를 바꿔 루미를 3칸 이동시키세요.',
    '{"primary":"↻ 3번 반복하기","secondary":"➜ 앞으로 이동"}'::jsonb,
    E'for i in range(2):\n    move()',
    '{"kind":"loop_move","steps":3}'::jsonb,
    '블록에는 3번이라고 쓰여 있어요. range(2)의 숫자를 바꿔 보세요.', 1
  ),
  (
    '00000000-0000-4000-8000-000000001002', 'edit',
    'energy 변수에 5를 저장하세요.',
    '{"primary":"energy 값을 5로 정하기","secondary":"⚡ energy만큼 충전"}'::jsonb,
    E'energy = 3\ncharge(energy)',
    '{"kind":"variable_value","name":"energy","value":5}'::jsonb,
    '충전 목표는 5예요. energy 오른쪽의 숫자를 확인해 보세요.', 1
  ),
  (
    '00000000-0000-4000-8000-000000001003', 'edit',
    '문이 열렸을 때 move()가 실행되도록 조건문을 완성하세요.',
    '{"primary":"만약 door_open 이라면","secondary":"➜ 앞으로 이동"}'::jsonb,
    E'door_open = True\nif door_open:\n    wait()',
    '{"kind":"condition_command","condition":"door_open","command":"move"}'::jsonb,
    'if 안에서 wait() 대신 이동 명령을 사용해 보세요.', 1
  );
