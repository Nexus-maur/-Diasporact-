-- Mise à jour pour la connexion par mot de passe : à exécuter une fois dans le SQL Editor Supabase.
-- (Nouvelles installations : schema.sql contient déjà cette version.)
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
  if pid is not null then      -- déjà inscrit : un lien de canal ajoute simplement l'adhésion
    if inv.kind <> 'join' or inv.canal_id is null then raise exception 'already_registered'; end if;
    insert into canal_members(canal_id, user_id, status) values (inv.canal_id, pid, 'member')
      on conflict (canal_id, user_id) do update set status = 'member';
    update invites set uses = uses + 1 where code = p_code;
    return json_build_object('ok', true, 'kind', 'join', 'canal', inv.canal_id);
  end if;
  if ps !~ '^[a-z0-9][a-z0-9._-]{2,23}$' then raise exception 'bad_pseudo'; end if;
  if exists (select 1 from profiles where pseudo = ps) then raise exception 'pseudo_taken'; end if;

  insert into profiles(auth_uid, pseudo, country, is_admin)
    values (uid, ps, left(coalesce(p_country,''), 60), inv.kind = 'admin') returning id into pid;
  if inv.canal_id is not null then
    insert into canal_members(canal_id, user_id, status) values (inv.canal_id, pid, 'member');
  end if;
  update invites set uses = uses + 1, active = (inv.kind = 'join') where code = p_code;
  insert into notifications(user_id, kind, body) values (pid, 'welcome', '');
  return json_build_object('ok', true, 'kind', inv.kind, 'canal', inv.canal_id);
end $$;
