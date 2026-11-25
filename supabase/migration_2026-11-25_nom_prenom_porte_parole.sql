-- Ajout du nom/prénom (public, optionnel) et du rôle "porte-parole" (diffusion
-- à toute la diaspora d'un pays, plusieurs porte-paroles possibles par pays).
-- À exécuter une fois dans le SQL Editor Supabase sur la base existante.
-- (Nouvelles installations : schema.sql contient déjà cette version.)

-- ============ Nom / prénom ============
alter table profiles add column if not exists first_name text not null default '';
alter table profiles add column if not exists last_name text not null default '';
alter table profiles drop constraint if exists profiles_first_name_check;
alter table profiles add constraint profiles_first_name_check check (char_length(first_name) <= 60);
alter table profiles drop constraint if exists profiles_last_name_check;
alter table profiles add constraint profiles_last_name_check check (char_length(last_name) <= 60);

revoke update on profiles from authenticated;
grant update (first_name, last_name, country, lang, skills, matching, base, show_honor) on profiles to authenticated;

create or replace view public_profiles with (security_invoker = false) as
  select id, pseudo, country, show_honor, is_admin, is_ref, first_name, last_name from profiles where me() is not null;
create or replace view skills_directory with (security_invoker = false) as
  select id, pseudo, country, skills, first_name, last_name from profiles where matching and me() is not null;

-- ============ Porte-paroles (diffusion par pays) ============
create table if not exists spokespersons (
  country text not null check (char_length(trim(country)) > 0),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (country, user_id)
);
alter table spokespersons enable row level security;
drop policy if exists spk_admin on spokespersons;
create policy spk_admin on spokespersons for all to authenticated using (is_admin()) with check (is_admin());

create or replace view spokesperson_list with (security_invoker = false) as
  select s.country, p.pseudo from spokespersons s join profiles p on p.id = s.user_id where me() is not null;
grant select on spokesperson_list to authenticated;

create or replace function is_spokesperson(p_country text) returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from spokespersons where lower(trim(country)) = lower(trim(coalesce(p_country,''))) and user_id = me()) $$;

create or replace function is_any_spokesperson() returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from spokespersons where user_id = me()) $$;

create or replace function set_spokesperson(p_pseudo text, p_country text, p_on boolean)
returns void language plpgsql security definer set search_path = public as $$
declare t uuid; ctry text := left(trim(coalesce(p_country,'')), 60);
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if ctry = '' then raise exception 'bad_country'; end if;
  select id into t from profiles where pseudo = lower(p_pseudo);
  if t is null then raise exception 'unknown_pseudo'; end if;
  if p_on then
    insert into spokespersons(country, user_id) values (ctry, t) on conflict do nothing;
  else
    delete from spokespersons where user_id = t and lower(trim(country)) = lower(trim(ctry));
  end if;
end $$;
grant execute on function set_spokesperson(text, text, boolean) to authenticated;

-- ============ Annonces : diffusion par pays ============
alter table announcements add column if not exists country text;
alter table announcements drop constraint if exists announcements_canal_id_country_check;
alter table announcements add constraint announcements_canal_id_country_check check (canal_id is null or country is null);

drop policy if exists ann_read on announcements;
drop policy if exists ann_insert on announcements;
create policy ann_read on announcements for select to authenticated using (
  me() is not null and (
    (canal_id is null and country is null) or
    (canal_id is not null and is_member(canal_id)) or
    (canal_id is null and country is not null and exists (
      select 1 from profiles pr where pr.id = me() and lower(trim(pr.country)) = lower(trim(announcements.country))
    ))
  )
);
create policy ann_insert on announcements for insert to authenticated
  with check (author_id = me() and (
    (canal_id is null and country is null and is_admin()) or
    (canal_id is not null and country is null and is_mod(canal_id)) or
    (canal_id is null and country is not null and is_spokesperson(country))
  ));
-- ann_update / ann_delete inchangées (author_id = me() ou is_admin()).

-- ============ Suppression de compte & export RGPD ============
create or replace function delete_my_account() returns void language plpgsql security definer set search_path = public as $$
declare m uuid := me();
begin
  if m is null then raise exception 'not_registered'; end if;
  delete from proposals where from_user = m or to_user = m;
  delete from comments where author_id = m;
  delete from projects where owner_id = m;          -- cascade : jalons, tâches, équipe, suivis
  delete from helps where author_id = m;
  delete from announcements where author_id = m;    -- cascade : lectures
  delete from spokespersons where user_id = m;
  update helps set claimed_by = null, status = 'open' where claimed_by = m;
  update invites set created_by = null where created_by = m;
  update badge_requests set decided_by = null where decided_by = m;
  update badge_grants set granted_by = null where granted_by = m;
  delete from profiles where id = m;                -- cascade : badges, notifications, invitations de reconnexion…
end $$;
grant execute on function delete_my_account() to authenticated;

create or replace function export_my_data() returns json language plpgsql security definer set search_path = public as $$
declare pid uuid := me();
begin
  if pid is null then raise exception 'not_registered'; end if;
  return json_build_object(
    'genere_le', now(),
    'profil', (select row_to_json(p) from (
      select pseudo, first_name, last_name, country, lang, skills, matching, base, show_honor, is_admin, is_ref, created_at
      from profiles where id = pid) p),
    'canaux', (select coalesce(json_agg(row_to_json(c)), '[]') from (
      select canal_id, status, is_moderator, is_relay, created_at
      from canal_members where user_id = pid) c),
    'porte_parole_de', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select country, created_at from spokespersons where user_id = pid) x),
    'projets_crees', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select id, canal_id, title, objective, status, created_at, archived_at
      from projects where owner_id = pid) x),
    'equipes_projet', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select project_id from project_team where user_id = pid) x),
    'taches_assignees', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select id, project_id, title, status, done_at from tasks where assignee_id = pid) x),
    'commentaires', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select id, project_id, body, created_at from comments where author_id = pid) x),
    'suivis_projet', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select project_id, level from follows where user_id = pid) x),
    'propositions_envoyees', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select project_id, status, created_at from proposals where from_user = pid) x),
    'propositions_recues', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select project_id, status, created_at from proposals where to_user = pid) x),
    'entraide_demandee', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select id, domain, country, urgent, status, body, reply, created_at from helps where author_id = pid) x),
    'entraide_prise_en_charge', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select id, domain, country, status, created_at from helps where claimed_by = pid) x),
    'annonces_publiees', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select id, canal_id, country, title, body, valid_until, created_at from announcements where author_id = pid) x),
    'annonces_lues', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select ann_id, at from ann_reads where user_id = pid) x),
    'demandes_badge', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select type, note, status, created_at from badge_requests where user_id = pid) x),
    'badges_obtenus', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select type, created_at from badge_grants where user_id = pid) x),
    'notifications', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select kind, body, read, created_at from notifications where user_id = pid) x)
  );
end $$;
grant execute on function export_my_data() to authenticated;
