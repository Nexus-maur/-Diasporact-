-- Questionnaire de retours des testeurs : un membre enregistre ses réponses, lit les siennes ; l'administrateur lit tout.

-- ============ Questionnaire de retours des testeurs ============
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  answers jsonb not null check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) < 20000),
  lang text,
  created_at timestamptz not null default now()
);
create index if not exists feedback_user_idx on feedback(user_id, created_at desc);
alter table feedback enable row level security;
drop policy if exists fb_insert on feedback;
drop policy if exists fb_read on feedback;
create policy fb_insert on feedback for insert to authenticated with check (user_id = me());
create policy fb_read on feedback for select to authenticated using (user_id = me() or is_admin());
grant select, insert on feedback to authenticated;     -- pas de modification ni de suppression par les membres

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
    'questionnaire_retours', (select coalesce(json_agg(row_to_json(x)), '[]') from (
      select answers, lang, created_at from feedback where user_id = pid) x),
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

select (select count(*) from information_schema.tables where table_name='feedback') as tbl, (select count(*) from pg_policies where tablename='feedback') as pol;
