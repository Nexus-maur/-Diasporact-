-- Diasporact V1 — schéma Supabase (PostgreSQL)
-- À exécuter une seule fois dans Supabase > SQL Editor > New query > Run.
-- Prérequis : Authentication > Providers > activer « Allow anonymous sign-ins ».

create extension if not exists pgcrypto;

-- ============ Tables ============
create table canals (
  id text primary key,
  ico text not null default 'hash',
  name_fr text not null, name_ar text not null,
  desc_fr text not null default '', desc_ar text not null default '',
  sort int not null default 0
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,                       -- compte technique anonyme de l'appareil courant
  pseudo text not null unique check (pseudo ~ '^[a-z0-9][a-z0-9._-]{2,23}$'),
  country text not null default '',
  lang text not null default 'fr' check (lang in ('fr','ar')),
  skills text[] not null default '{}',
  matching boolean not null default false,    -- visible dans la recherche de compétences
  base text,
  show_honor boolean not null default true,   -- apparaît dans « À l'honneur »
  speaker boolean not null default false,
  is_admin boolean not null default false,
  is_ref boolean not null default false,      -- référent entraide
  created_at timestamptz not null default now()
);

create table canal_members (
  canal_id text references canals(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text not null default 'member' check (status in ('pending','member','refused')),
  is_moderator boolean not null default false,
  is_relay boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (canal_id, user_id)
);

create table invites (
  code text primary key,
  kind text not null default 'join' check (kind in ('join','recovery','admin')),
  canal_id text references canals(id) on delete cascade,
  target_user uuid references profiles(id) on delete cascade,   -- pour 'recovery'
  created_by uuid references profiles(id),
  active boolean not null default true,
  uses int not null default 0,
  max_uses int,                                -- null = illimité (join) ; 1 pour recovery/admin
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  canal_id text not null references canals(id),
  owner_id uuid not null references profiles(id),
  title text not null check (char_length(title) between 3 and 140),
  title_ar text,
  objective text not null default '' check (char_length(objective) <= 1000),
  objective_ar text,
  orig_lang text not null default 'fr',
  status text not null default 'recruit' check (status in ('recruit','progress','done')),
  needs text[] not null default '{}',
  created_at timestamptz not null default now()
);
create table milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null, due date, done boolean not null default false
);
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 200),
  status text not null default 'todo' check (status in ('todo','doing','done')),
  assignee_id uuid references profiles(id) on delete set null,
  done_at timestamptz
);
create table project_team (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (project_id, user_id)
);
create table comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id),
  body text not null check (char_length(body) between 1 and 280),
  created_at timestamptz not null default now()
);
create table follows (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  level text not null default 'all' check (level in ('all','mine','none')),
  primary key (project_id, user_id)
);
create table proposals (      -- « Connecteur » : proposer à un membre de contribuer
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  from_user uuid not null references profiles(id),
  to_user uuid not null references profiles(id),
  status text not null default 'sent' check (status in ('sent','accepted','declined')),
  created_at timestamptz not null default now()
);

create table helps (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id),
  domain text not null check (domain in ('adm','jur','ins','ret','san')),
  country text not null default '',
  urgent boolean not null default false,
  status text not null default 'open' check (status in ('open','doing','solved')),
  claimed_by uuid references profiles(id),
  body text not null check (char_length(body) between 10 and 1000),
  reply text check (char_length(reply) <= 1000),
  created_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  canal_id text references canals(id),         -- null = tous les canaux
  author_id uuid not null references profiles(id),
  title text not null check (char_length(title) between 3 and 140),
  title_ar text,
  body text not null check (char_length(body) between 3 and 2000),
  body_ar text,
  orig_lang text not null default 'fr',
  valid_until date,
  created_at timestamptz not null default now()
);
create table ann_reads (
  ann_id uuid references announcements(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  at timestamptz not null default now(),
  primary key (ann_id, user_id)
);

create table badge_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,                          -- ex. 'expert:med'
  note text not null default '' check (char_length(note) <= 280),
  status text not null default 'pending' check (status in ('pending','granted','denied')),
  decided_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create table badge_grants (
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  granted_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  primary key (user_id, type)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null, ref text, body text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index on projects(canal_id);
create index on tasks(project_id);
create index on comments(project_id, created_at);
create index on helps(status);
create index on announcements(canal_id, created_at desc);
create index on notifications(user_id, read, created_at desc);

-- ============ Fonctions d'aide (security definer : évitent la récursion RLS) ============
create or replace function me() returns uuid language sql stable security definer set search_path = public as
$$ select id from profiles where auth_uid = auth.uid() $$;

create or replace function is_admin() returns boolean language sql stable security definer set search_path = public as
$$ select coalesce((select is_admin from profiles where auth_uid = auth.uid()), false) $$;

create or replace function is_member(c text) returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from canal_members where canal_id = c and user_id = me() and status = 'member') $$;

create or replace function is_mod(c text) returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from canal_members where canal_id = c and user_id = me() and status = 'member' and is_moderator) $$;

create or replace function is_any_mod() returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from canal_members where user_id = me() and status = 'member' and is_moderator) $$;

create or replace function project_canal(p uuid) returns text language sql stable security definer set search_path = public as
$$ select canal_id from projects where id = p $$;

-- Garde-fou pour l'anti-pause (appel public sans donnée)
create or replace function ping() returns text language sql stable as $$ select 'ok' $$;
grant execute on function ping() to anon, authenticated;

-- ============ Vues publiques (pseudo uniquement, jamais d'email : il n'y en a pas) ============
create view public_profiles with (security_invoker = false) as
  select id, pseudo, country, show_honor, speaker, is_ref from profiles;
create view skills_directory with (security_invoker = false) as
  select id, pseudo, country, skills from profiles where matching;
grant select on public_profiles, skills_directory to authenticated;

create view engagement with (security_invoker = false) as
select p.id as user_id,
  (select count(*) from ann_reads r where r.user_id = p.id) as reads,
  (select count(*) from tasks t where t.assignee_id = p.id and t.status = 'done') as tasks,
  (select count(*) from projects j where j.owner_id = p.id) as proj,
  (select count(*) from helps h where h.claimed_by = p.id and h.status = 'solved') as help,
  (select count(*) from proposals x where x.from_user = p.id) as links
from profiles p;
grant select on engagement to authenticated;

-- ============ RPC : entrée, invitations ============
-- Pseudo disponible ?
create or replace function pseudo_available(p text) returns boolean language sql stable security definer set search_path = public as
$$ select not exists (select 1 from profiles where pseudo = lower(p)) $$;
grant execute on function pseudo_available(text) to authenticated;

-- Utiliser un lien d'invitation (le lien WhatsApp contient le code).
-- join : crée le profil + adhésion ; recovery : rattache le profil existant à cet appareil ; admin : premier administrateur.
create or replace function redeem_invite(p_code text, p_pseudo text default null, p_country text default '')
returns json language plpgsql security definer set search_path = public as $$
declare inv invites; uid uuid := auth.uid(); pid uuid; ps text := lower(trim(coalesce(p_pseudo,'')));
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select * into inv from invites where code = p_code and active
     and (expires_at is null or expires_at > now()) and (max_uses is null or uses < max_uses) for update;
  if not found then raise exception 'invalid_invite'; end if;

  if inv.kind = 'recovery' then
    update profiles set auth_uid = null where auth_uid = uid;     -- libère cet appareil s'il avait un autre profil
    update profiles set auth_uid = uid where id = inv.target_user;
    update invites set uses = uses + 1, active = false where code = p_code;
    return json_build_object('ok', true, 'kind', 'recovery');
  end if;

  if exists (select 1 from profiles where auth_uid = uid) then raise exception 'already_registered'; end if;
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
grant execute on function redeem_invite(text, text, text) to authenticated;

-- Aperçu d'un lien avant inscription (nom du canal) : n'expose rien d'autre.
create or replace function peek_invite(p_code text) returns json language sql stable security definer set search_path = public as $$
  select json_build_object('kind', i.kind, 'canal', i.canal_id, 'canal_fr', c.name_fr, 'canal_ar', c.name_ar)
  from invites i left join canals c on c.id = i.canal_id
  where i.code = p_code and i.active and (i.expires_at is null or i.expires_at > now())
$$;
grant execute on function peek_invite(text) to authenticated;

-- Le modérateur crée / fait tourner le lien de son canal (l'ancien cesse de fonctionner).
create or replace function rotate_canal_invite(p_canal text) returns text language plpgsql security definer set search_path = public as $$
declare c text := lower(replace(p_canal,'_','-')) || '-' || encode(gen_random_bytes(5),'hex');
begin
  if not is_mod(p_canal) then raise exception 'forbidden'; end if;
  update invites set active = false where canal_id = p_canal and kind = 'join';
  insert into invites(code, kind, canal_id, created_by) values (c, 'join', p_canal, me());
  return c;
end $$;
grant execute on function rotate_canal_invite(text) to authenticated;

-- Lien de reconnexion pour un membre qui a perdu son téléphone (valable 7 jours, usage unique).
create or replace function create_recovery_invite(p_pseudo text) returns text language plpgsql security definer set search_path = public as $$
declare t uuid; c text := 'retour-' || encode(gen_random_bytes(6),'hex');
begin
  if not is_any_mod() then raise exception 'forbidden'; end if;
  select id into t from profiles where pseudo = lower(p_pseudo);
  if t is null then raise exception 'unknown_pseudo'; end if;
  insert into invites(code, kind, target_user, created_by, max_uses, expires_at)
    values (c, 'recovery', t, me(), 1, now() + interval '7 days');
  return c;
end $$;
grant execute on function create_recovery_invite(text) to authenticated;

-- Désignation des modérateurs / relais / référents : administrateur uniquement.
create or replace function set_role(p_pseudo text, p_canal text, p_moderator boolean, p_relay boolean default false)
returns void language plpgsql security definer set search_path = public as $$
declare t uuid;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  select id into t from profiles where pseudo = lower(p_pseudo);
  if t is null then raise exception 'unknown_pseudo'; end if;
  insert into canal_members(canal_id, user_id, status, is_moderator, is_relay)
    values (p_canal, t, 'member', p_moderator, p_relay)
    on conflict (canal_id, user_id) do update set is_moderator = p_moderator, is_relay = p_relay, status = 'member';
end $$;
grant execute on function set_role(text, text, boolean, boolean) to authenticated;

create or replace function set_referent(p_pseudo text, p_on boolean) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update profiles set is_ref = p_on where pseudo = lower(p_pseudo);
end $$;
grant execute on function set_referent(text, boolean) to authenticated;

-- Demande d'adhésion à un autre canal / décision du modérateur
create or replace function request_join(p_canal text) returns void language plpgsql security definer set search_path = public as $$
begin
  if me() is null then raise exception 'not_registered'; end if;
  insert into canal_members(canal_id, user_id, status) values (p_canal, me(), 'pending') on conflict do nothing;
end $$;
grant execute on function request_join(text) to authenticated;

create or replace function decide_join(p_canal text, p_user uuid, p_accept boolean) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_mod(p_canal) then raise exception 'forbidden'; end if;
  update canal_members set status = case when p_accept then 'member' else 'refused' end where canal_id = p_canal and user_id = p_user;
  if p_accept then insert into notifications(user_id, kind, ref, body) values (p_user, 'accepted', p_canal, ''); end if;
end $$;
grant execute on function decide_join(text, uuid, boolean) to authenticated;

-- ============ RPC : projets, tâches, entraide, badges ============
create or replace function take_task(p_task uuid) returns void language plpgsql security definer set search_path = public as $$
declare pr uuid; cn text;
begin
  select project_id into pr from tasks where id = p_task; cn := project_canal(pr);
  if not is_member(cn) then raise exception 'forbidden'; end if;
  update tasks set assignee_id = me(), status = 'doing' where id = p_task and assignee_id is null;
  insert into project_team(project_id, user_id) values (pr, me()) on conflict do nothing;
end $$;
grant execute on function take_task(uuid) to authenticated;

create or replace function set_task_status(p_task uuid, p_status text) returns void language plpgsql security definer set search_path = public as $$
declare t tasks; own uuid;
begin
  select * into t from tasks where id = p_task; select owner_id into own from projects where id = t.project_id;
  if not (t.assignee_id = me() or own = me() or is_mod(project_canal(t.project_id))) then raise exception 'forbidden'; end if;
  if p_status not in ('todo','doing','done') then raise exception 'bad_status'; end if;
  update tasks set status = p_status, done_at = case when p_status = 'done' then now() end where id = p_task;
end $$;
grant execute on function set_task_status(uuid, text) to authenticated;

create or replace function claim_help(p_help uuid) returns void language plpgsql security definer set search_path = public as $$
declare a uuid;
begin
  if me() is null then raise exception 'not_registered'; end if;
  update helps set status = 'doing', claimed_by = me() where id = p_help and status = 'open' and author_id <> me() returning author_id into a;
  if a is not null then insert into notifications(user_id, kind, ref, body) values (a, 'claimed', p_help::text, (select pseudo from profiles where id = me())); end if;
end $$;
grant execute on function claim_help(uuid) to authenticated;

create or replace function solve_help(p_help uuid, p_reply text default null) returns void language plpgsql security definer set search_path = public as $$
begin
  update helps set status = 'solved', reply = coalesce(left(p_reply,1000), reply)
   where id = p_help and (claimed_by = me() or author_id = me() or is_any_mod());
end $$;
grant execute on function solve_help(uuid, text) to authenticated;

create or replace function mark_read(p_ann uuid) returns void language sql security definer set search_path = public as $$
  insert into ann_reads(ann_id, user_id) select p_ann, me() where me() is not null on conflict do nothing
$$;
grant execute on function mark_read(uuid) to authenticated;

create or replace function decide_badge(p_req uuid, p_grant boolean) returns void language plpgsql security definer set search_path = public as $$
declare r badge_requests;
begin
  if not is_any_mod() then raise exception 'forbidden'; end if;
  update badge_requests set status = case when p_grant then 'granted' else 'denied' end, decided_by = me()
   where id = p_req and status = 'pending' returning * into r;
  if r.id is not null and p_grant then
    insert into badge_grants(user_id, type, granted_by) values (r.user_id, r.type, me()) on conflict do nothing;
  end if;
end $$;
grant execute on function decide_badge(uuid, boolean) to authenticated;

-- Compte : suppression à la demande du membre (anonymise ses contenus via cascade partielle)
create or replace function delete_my_account() returns void language plpgsql security definer set search_path = public as $$
begin
  delete from profiles where id = me();
end $$;
grant execute on function delete_my_account() to authenticated;

-- ============ Notifications automatiques ============
create or replace function trg_task_assigned() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.assignee_id is not null and new.assignee_id is distinct from coalesce(old.assignee_id, null) and new.assignee_id <> coalesce(me(), '00000000-0000-0000-0000-000000000000') then
    insert into notifications(user_id, kind, ref, body) values (new.assignee_id, 'task', new.project_id::text, new.title);
  end if;
  return new;
end $$;
create trigger task_assigned after insert or update of assignee_id on tasks for each row execute function trg_task_assigned();

create or replace function trg_comment_notify() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications(user_id, kind, ref, body)
  select distinct u, 'comment', new.project_id::text, (select title from projects where id = new.project_id)
  from (select owner_id as u from projects where id = new.project_id
        union select user_id from follows where project_id = new.project_id and level = 'all') s
  where u <> new.author_id;
  return new;
end $$;
create trigger comment_notify after insert on comments for each row execute function trg_comment_notify();

-- ============ Sécurité au niveau des lignes (RLS) ============
alter table canals enable row level security;
alter table profiles enable row level security;
alter table canal_members enable row level security;
alter table invites enable row level security;
alter table projects enable row level security;
alter table milestones enable row level security;
alter table tasks enable row level security;
alter table project_team enable row level security;
alter table comments enable row level security;
alter table follows enable row level security;
alter table proposals enable row level security;
alter table helps enable row level security;
alter table announcements enable row level security;
alter table ann_reads enable row level security;
alter table badge_requests enable row level security;
alter table badge_grants enable row level security;
alter table notifications enable row level security;

-- Canaux : liste visible de tous les comptes connectés
create policy canals_read on canals for select to authenticated using (true);
create policy canals_admin on canals for all to authenticated using (is_admin()) with check (is_admin());

-- Profils : chacun lit/modifie le sien (les pseudos des autres passent par la vue public_profiles)
create policy profiles_self_read on profiles for select to authenticated using (auth_uid = auth.uid() or is_admin());
create policy profiles_self_update on profiles for update to authenticated using (auth_uid = auth.uid()) with check (auth_uid = auth.uid());
revoke update on profiles from authenticated;
grant update (country, lang, skills, matching, base, show_honor, speaker) on profiles to authenticated;

-- Adhésions : lisibles pour soi, les modérateurs du canal et les membres du canal
create policy cm_read on canal_members for select to authenticated
  using (user_id = me() or is_mod(canal_id) or (status = 'member' and is_member(canal_id)));
-- écritures uniquement via RPC (aucune policy d'écriture)

-- Invitations : lecture/écriture uniquement via RPC, sauf pour les modérateurs (lecture du lien de leur canal)
create policy inv_read on invites for select to authenticated using (kind = 'join' and canal_id is not null and is_mod(canal_id));

-- Projets
create policy proj_read on projects for select to authenticated using (is_member(canal_id));
create policy proj_insert on projects for insert to authenticated with check (owner_id = me() and is_member(canal_id));
create policy proj_update on projects for update to authenticated using (owner_id = me() or is_mod(canal_id)) with check (owner_id = me() or is_mod(canal_id));
create policy proj_delete on projects for delete to authenticated using (is_mod(canal_id));

create policy ms_read on milestones for select to authenticated using (is_member(project_canal(project_id)));
create policy ms_write on milestones for all to authenticated
  using (exists (select 1 from projects p where p.id = project_id and (p.owner_id = me() or is_mod(p.canal_id))))
  with check (exists (select 1 from projects p where p.id = project_id and (p.owner_id = me() or is_mod(p.canal_id))));

create policy task_read on tasks for select to authenticated using (is_member(project_canal(project_id)));
create policy task_write on tasks for all to authenticated
  using (exists (select 1 from projects p where p.id = project_id and (p.owner_id = me() or is_mod(p.canal_id))))
  with check (exists (select 1 from projects p where p.id = project_id and (p.owner_id = me() or is_mod(p.canal_id))));

create policy team_read on project_team for select to authenticated using (is_member(project_canal(project_id)));
create policy team_write on project_team for all to authenticated
  using (exists (select 1 from projects p where p.id = project_id and (p.owner_id = me() or is_mod(p.canal_id))))
  with check (exists (select 1 from projects p where p.id = project_id and (p.owner_id = me() or is_mod(p.canal_id))));

create policy cmt_read on comments for select to authenticated using (is_member(project_canal(project_id)));
create policy cmt_insert on comments for insert to authenticated with check (author_id = me() and is_member(project_canal(project_id)));
create policy cmt_delete on comments for delete to authenticated using (author_id = me() or is_mod(project_canal(project_id)));

create policy follow_own on follows for all to authenticated using (user_id = me()) with check (user_id = me() and is_member(project_canal(project_id)));

create policy prop_read on proposals for select to authenticated using (from_user = me() or to_user = me() or is_mod(project_canal(project_id)));
create policy prop_insert on proposals for insert to authenticated with check (from_user = me() and is_member(project_canal(project_id)));
create policy prop_update on proposals for update to authenticated using (to_user = me()) with check (to_user = me());

-- Entraide : visible de tout membre inscrit
create policy help_read on helps for select to authenticated using (me() is not null);
create policy help_insert on helps for insert to authenticated with check (author_id = me() and status = 'open' and claimed_by is null);
create policy help_delete on helps for delete to authenticated using (author_id = me() or is_any_mod());

-- Annonces : générales (canal null) pour tous, sinon pour les membres du canal ; publication par modérateurs/admin
create policy ann_read on announcements for select to authenticated using (me() is not null and (canal_id is null or is_member(canal_id)));
create policy ann_insert on announcements for insert to authenticated
  with check (author_id = me() and ((canal_id is null and is_admin()) or (canal_id is not null and is_mod(canal_id))));
create policy ann_update on announcements for update to authenticated using (author_id = me() or is_admin()) with check (author_id = me() or is_admin());
create policy ann_delete on announcements for delete to authenticated using (author_id = me() or is_admin());

create policy reads_own on ann_reads for select to authenticated using (user_id = me() or is_any_mod());

-- Badges
create policy br_read on badge_requests for select to authenticated using (user_id = me() or is_any_mod());
create policy br_insert on badge_requests for insert to authenticated with check (user_id = me() and status = 'pending');
create policy bg_read on badge_grants for select to authenticated using (me() is not null);

-- Notifications : strictement personnelles
create policy notif_own on notifications for select to authenticated using (user_id = me());
create policy notif_update on notifications for update to authenticated using (user_id = me()) with check (user_id = me());
revoke update on notifications from authenticated;
grant update (read) on notifications to authenticated;

-- ============ Données de départ : les 6 canaux ============
insert into canals(id, ico, name_fr, name_ar, desc_fr, desc_ar, sort) values
 ('edu','book','Éducation & jeunesse','التعليم والشباب','Bourses, mentorat, écoles et projets pour la jeunesse mauritanienne.','منح وإرشاد ومدارس ومشاريع لفائدة الشباب الموريتاني.',1),
 ('inv','chart','Investissement & entrepreneuriat','الاستثمار وريادة الأعمال','Créer, financer et développer des activités entre la diaspora et la Mauritanie.','إنشاء الأنشطة وتمويلها وتطويرها بين الجالية وموريتانيا.',2),
 ('san','heart','Santé & solidarité','الصحة والتضامن','Missions médicales, collectes et soutien aux familles.','بعثات طبية وحملات جمع وإسناد للأسر.',3),
 ('adm','file','Démarches & installation','الإجراءات والاستقرار','Papiers, installation à l’étranger, retour au pays.','الأوراق والاستقرار في الخارج والعودة إلى الوطن.',4),
 ('num','chip','Numérique & innovation','الرقمنة والابتكار','Outils, compétences et startups technologiques.','أدوات ومهارات ومؤسسات ناشئة تقنية.',5),
 ('cul','palm','Culture & patrimoine','الثقافة والتراث','Mémoire, langues, arts et événements culturels.','الذاكرة واللغات والفنون والفعاليات الثقافية.',6);

-- ============ Premier administrateur ============
-- 1) Remplacez le code ci-dessous par un code secret de votre choix, 2) exécutez cette ligne seule,
-- 3) ouvrez  https://VOTRE-SITE/#/i/CE-CODE  : le premier compte créé devient administrateur (usage unique).
-- insert into invites(code, kind, max_uses) values ('CHANGEZ-MOI-admin-2026', 'admin', 1);
