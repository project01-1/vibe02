-- Support simple student-name + PIN login without exposing phone numbers to the client.

alter table public.profiles
  add column phone_e164 text;

update public.profiles as profiles
set phone_e164 = case
  when users.phone ~ '^8210[0-9]{8}$' then '+' || users.phone
  else users.phone
end
from auth.users as users
where users.id = profiles.id
  and users.phone is not null;

alter table public.profiles
  add constraint profiles_phone_e164_format_check
  check (phone_e164 is null or phone_e164 ~ '^\+8210[0-9]{8}$');

create unique index profiles_phone_e164_unique_idx
  on public.profiles (phone_e164)
  where phone_e164 is not null;

create unique index profiles_display_name_login_unique_idx
  on public.profiles (lower(btrim(display_name)));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, phone_e164)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'student'), 20),
    case
      when new.phone ~ '^8210[0-9]{8}$' then '+' || new.phone
      else new.phone
    end
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
