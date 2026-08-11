create or replace function public.save_mission_progress(
  p_user_id uuid,
  p_mission_id uuid,
  p_code text,
  p_completed boolean,
  p_count_attempt boolean
)
returns table(total_xp integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_status public.progress_status;
  next_status public.progress_status;
  reward integer := 0;
begin
  if char_length(p_code) > 300 then
    raise exception 'Code is too long';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_user_id::text || ':' || p_mission_id::text, 0)
  );

  select status
  into previous_status
  from public.user_mission_progress
  where user_id = p_user_id and mission_id = p_mission_id;

  next_status := case
    when p_completed or previous_status = 'completed' then 'completed'::public.progress_status
    else 'in_progress'::public.progress_status
  end;

  insert into public.user_mission_progress (
    user_id, mission_id, status, current_step, code, attempts, completed_at
  ) values (
    p_user_id,
    p_mission_id,
    next_status,
    case when next_status = 'completed' then 1 else 0 end,
    p_code,
    case when p_count_attempt then 1 else 0 end,
    case when next_status = 'completed' then now() else null end
  )
  on conflict (user_id, mission_id) do update set
    status = excluded.status,
    current_step = greatest(public.user_mission_progress.current_step, excluded.current_step),
    code = excluded.code,
    attempts = public.user_mission_progress.attempts + case when p_count_attempt then 1 else 0 end,
    completed_at = coalesce(public.user_mission_progress.completed_at, excluded.completed_at);

  if p_completed and previous_status is distinct from 'completed'::public.progress_status then
    select xp_reward into reward from public.missions where id = p_mission_id;
    if reward is null then
      raise exception 'Mission not found';
    end if;
    update public.profiles
    set total_xp = profiles.total_xp + reward
    where id = p_user_id;
  end if;

  return query
  select profiles.total_xp from public.profiles where id = p_user_id;
end;
$$;

revoke all on function public.save_mission_progress(uuid, uuid, text, boolean, boolean)
  from public, anon, authenticated;
grant execute on function public.save_mission_progress(uuid, uuid, text, boolean, boolean)
  to service_role;
