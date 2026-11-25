-- Lien testeurs : modérateur de tout canal rejoint (phase test).

alter table profiles add column if not exists is_tester boolean not null default false;

alter table invites drop constraint if exists invites_kind_check;

alter table invites add constraint invites_kind_check check (kind in ('join','recovery','admin','tester'));

create or replace function redeem_invite(p_code text, p_pseudo text default null, p_country text default '')
returns json language plpgsql security definer set search_path = public as $$
declare inv invites; uid uuid := auth.uid(); pid uuid; old_uid uuid; ps text := lower(trim(coalesce(p_pseudo,'')));
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select * into inv from invites where code = p_code and active
     and (expires_at is null or expires_at > now()) and (max_uses is null or uses < max_uses) for update;
  if not found then raise exception 'invalid_invite'; end if;

  if inv.kind = 'recovery' then
    update profiles set auth_uid = null where auth_uid = uid;     -- libère cet appareil s'il avait un autre profil
    select auth_uid into old_uid from profiles where id = inv.target_user;
    update profiles set auth_uid = uid where id = inv.target_user;
    -- supprime l'ancienne identité (et son e-mail technique) : l'ancien appareil perd l'accès, le pseudo pourra recevoir un nouveau mot de passe
    if old_uid is not null and old_uid <> uid then delete from auth.users where id = old_uid; end if;
    update invites set uses = uses + 1, active = false where code = p_code;
    return json_build_object('ok', true, 'kind', 'recovery');
  end if;

  select id into pid from profiles where auth_uid = uid;
  if pid is not null and inv.kind = 'tester' then     -- déjà inscrit : devient testeur
    update profiles set is_tester = true where id = pid;
    update invites set uses = uses + 1 where code = p_code;
    return json_build_object('ok', true, 'kind', 'tester');
  end if;
  if pid is not null then      -- déjà inscrit : un lien de canal ajoute simplement l'adhésion
    if inv.kind <> 'join' or inv.canal_id is null then raise exception 'already_registered'; end if;
    insert into canal_members(canal_id, user_id, status) values (inv.canal_id, pid, 'member')
      on conflict (canal_id, user_id) do update set status = 'member';
    update invites set uses = uses + 1 where code = p_code;
    return json_build_object('ok', true, 'kind', 'join', 'canal', inv.canal_id);
  end if;
  if ps !~ '^[a-z0-9][a-z0-9._-]{2,23}$' then raise exception 'bad_pseudo'; end if;
  if exists (select 1 from profiles where pseudo = ps) then raise exception 'pseudo_taken'; end if;

  insert into profiles(auth_uid, pseudo, country, is_admin, is_tester)
    values (uid, ps, left(coalesce(p_country,''), 60), inv.kind = 'admin', inv.kind = 'tester') returning id into pid;
  if inv.canal_id is not null then
    insert into canal_members(canal_id, user_id, status) values (inv.canal_id, pid, 'member');
  end if;
  update invites set uses = uses + 1, active = (inv.kind in ('join','tester')) where code = p_code;
  insert into notifications(user_id, kind, body) values (pid, 'welcome', '');
  return json_build_object('ok', true, 'kind', inv.kind, 'canal', inv.canal_id);
end $$;
grant execute on function redeem_invite(text, text, text) to authenticated;

create or replace function request_join(p_canal text) returns void language plpgsql security definer set search_path = public as $$
begin
  if me() is null then raise exception 'not_registered'; end if;
  if (select is_tester from profiles where id = me()) then      -- testeur : accès immédiat, avec les droits de modérateur
    insert into canal_members(canal_id, user_id, status, is_moderator) values (p_canal, me(), 'member', true)
      on conflict (canal_id, user_id) do update set status = 'member', is_moderator = true;
    return;
  end if;
  insert into canal_members(canal_id, user_id, status) values (p_canal, me(), 'pending') on conflict do nothing;
end $$;
grant execute on function request_join(text) to authenticated;

create or replace function rotate_tester_invite() returns text language plpgsql security definer set search_path = public as $$
declare c text := 'testeur-' || substr(replace(gen_random_uuid()::text,'-',''),1,16);
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update invites set active = false where kind = 'tester';
  insert into invites(code, kind, created_by) values (c, 'tester', me());
  return c;
end $$;
grant execute on function rotate_tester_invite() to authenticated;

create or replace function end_test_phase() returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update canal_members set is_moderator = false
    where is_moderator and user_id in (select id from profiles where is_tester and not is_admin);
  get diagnostics n = row_count;
  update profiles set is_tester = false where is_tester;
  update invites set active = false where kind = 'tester';
  return n;
end $$;
grant execute on function end_test_phase() to authenticated;

drop policy if exists inv_read on invites;

create policy inv_read on invites for select to authenticated using ((kind = 'join' and canal_id is not null and is_mod(canal_id)) or (kind = 'tester' and is_admin()));

select (select count(*) from information_schema.columns where table_name='profiles' and column_name='is_tester') as col, (select count(*) from pg_proc where proname in ('rotate_tester_invite','end_test_phase')) as fns;
