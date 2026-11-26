-- Acceptation des préinscriptions par l'administrateur : génère un lien d'invitation personnel (1 usage, 30 jours).
alter table preregistrations add column if not exists status text not null default 'pending' check (status in ('pending','accepted'));
alter table preregistrations add column if not exists accepted_at timestamptz;
alter table preregistrations add column if not exists invite_code text;

create or replace function accept_preregistration(p_id uuid) returns text
language plpgsql security definer set search_path = public as $$
declare r preregistrations; cid text; c text;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  select * into r from preregistrations where id = p_id for update;
  if not found then raise exception 'not_found'; end if;
  if r.invite_code is not null and exists (select 1 from invites where code = r.invite_code and active and uses = 0 and (expires_at is null or expires_at > now())) then
    return r.invite_code;
  end if;
  select id into cid from canals where id = any(r.canals) order by sort limit 1;
  if cid is null then select id into cid from canals order by sort limit 1; end if;
  c := cid || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,12);
  insert into invites(code, kind, canal_id, created_by, max_uses, expires_at)
    values (c, 'join', cid, me(), 1, now() + interval '30 days');
  update preregistrations set status = 'accepted', accepted_at = now(), invite_code = c where id = p_id;
  return c;
end $$;
grant execute on function accept_preregistration(uuid) to authenticated;
