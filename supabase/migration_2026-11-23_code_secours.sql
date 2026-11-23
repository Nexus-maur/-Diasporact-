-- Code de secours (mot de passe perdu) : à exécuter une fois dans le SQL Editor Supabase.
create table if not exists recovery_secrets (
  profile_id uuid primary key references profiles(id) on delete cascade,
  code_hash text not null,
  fails int not null default 0,
  locked_until timestamptz
);
alter table recovery_secrets enable row level security;

create or replace function make_recovery_code() returns text language plpgsql security definer set search_path = public as $$
declare c text; pid uuid := me();
begin
  if pid is null then raise exception 'not_registered'; end if;
  if not exists (select 1 from auth.users where id = auth.uid() and email is not null) then raise exception 'need_password'; end if;
  c := upper(substr(replace(gen_random_uuid()::text,'-',''),1,20));
  insert into recovery_secrets(profile_id, code_hash) values (pid, encode(sha256(convert_to(c,'UTF8')),'hex'))
    on conflict (profile_id) do update set code_hash = excluded.code_hash, fails = 0, locked_until = null;
  return c;
end $$;
grant execute on function make_recovery_code() to authenticated;

-- Retourne un JSON {ok:true, code:<nouveau code>} ou {ok:false, reason:'bad'|'locked'|'weak'}.
-- 5 essais ratés = blocage 15 minutes pour ce pseudo.
create or replace function reset_password(p_pseudo text, p_code text, p_new text) returns json
language plpgsql security definer set search_path = public as $$
declare pr profiles; rs recovery_secrets; c text; ok boolean;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into pr from profiles where pseudo = lower(trim(coalesce(p_pseudo,'')));
  if pr.id is null then return json_build_object('ok', false, 'reason', 'bad'); end if;
  select * into rs from recovery_secrets where profile_id = pr.id for update;
  if rs.profile_id is null then return json_build_object('ok', false, 'reason', 'bad'); end if;
  if rs.locked_until is not null and rs.locked_until > now() then return json_build_object('ok', false, 'reason', 'locked'); end if;
  ok := rs.code_hash = encode(sha256(convert_to(upper(regexp_replace(coalesce(p_code,''),'[^A-Za-z0-9]','','g')),'UTF8')),'hex');
  if not ok then
    update recovery_secrets set fails = case when fails + 1 >= 5 then 0 else fails + 1 end,
      locked_until = case when fails + 1 >= 5 then now() + interval '15 minutes' else null end
      where profile_id = pr.id;
    return json_build_object('ok', false, 'reason', 'bad');
  end if;
  if char_length(coalesce(p_new,'')) < 8 then return json_build_object('ok', false, 'reason', 'weak'); end if;
  if pr.auth_uid is null or not exists (select 1 from auth.users where id = pr.auth_uid and email is not null) then
    return json_build_object('ok', false, 'reason', 'bad');
  end if;
  update auth.users set encrypted_password = extensions.crypt(p_new, extensions.gen_salt('bf')), updated_at = now() where id = pr.auth_uid;
  delete from auth.sessions where user_id = pr.auth_uid;          -- déconnecte les anciens appareils
  c := upper(substr(replace(gen_random_uuid()::text,'-',''),1,20));
  update recovery_secrets set code_hash = encode(sha256(convert_to(c,'UTF8')),'hex'), fails = 0, locked_until = null where profile_id = pr.id;
  return json_build_object('ok', true, 'code', c);
end $$;
grant execute on function reset_password(text, text, text) to authenticated;
