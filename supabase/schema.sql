-- Diasporact V1 — schéma Supabase (PostgreSQL)
-- À exécuter une seule fois dans Supabase > SQL Editor > New query > Run.
-- Prérequis : Authentication > Providers > activer « Allow anonymous sign-ins ».


-- ============ Tables ============
create table canals (
  id text primary key,
  ico text not null default 'hash',
  name_fr text not null, name_ar text not null,
  desc_fr text not null default '', desc_ar text not null default '',
  wa_link text check (wa_link is null or wa_link ~ '^https://chat\.whatsapp\.com/[A-Za-z0-9]+'),
  sort int not null default 0
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,                       -- compte technique anonyme de l'appareil courant
  pseudo text not null unique check (pseudo ~ '^[a-z0-9][a-z0-9._-]{2,23}$'),
  first_name text not null default '' check (char_length(first_name) <= 60),
  last_name text not null default '' check (char_length(last_name) <= 60),
  country text not null default '',
  lang text not null default 'fr' check (lang in ('fr','en','ar')),
  skills text[] not null default '{}',
  matching boolean not null default false,    -- visible dans la recherche de compétences
  base text,
  show_honor boolean not null default true,   -- apparaît dans « À l'honneur »
  is_admin boolean not null default false,
  is_ref boolean not null default false,      -- référent entraide
  is_tester boolean not null default false,   -- testeur : modérateur de tout canal qu'il rejoint (phase test)
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
  kind text not null default 'join' check (kind in ('join','recovery','admin','tester')),
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
  archived_at timestamptz,
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
  done_at timestamptz,
  review_at timestamptz   -- l'assigné a signalé la tâche au chef de projet pour validation
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
  canal_id text references canals(id),         -- null = tous les canaux (ou tout un pays, voir "country")
  country text,                                -- diffusion à toute la diaspora d'un pays (canal_id doit alors être null)
  author_id uuid not null references profiles(id),
  title text not null check (char_length(title) between 3 and 140),
  title_ar text,
  body text not null check (char_length(body) between 3 and 2000),
  body_ar text,
  orig_lang text not null default 'fr',
  valid_until date,
  created_at timestamptz not null default now(),
  check (canal_id is null or country is null)
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

create table spokespersons (                  -- porte-paroles : peuvent diffuser à toute la diaspora d'un pays
  country text not null check (char_length(trim(country)) > 0),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (country, user_id)
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

create or replace function is_ref() returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or coalesce((select is_ref from profiles where auth_uid = auth.uid()), false) $$;

-- Porte-parole d'un pays : peut publier une annonce visible de toute la diaspora de ce pays (pas seulement son canal).
create or replace function is_spokesperson(p_country text) returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from spokespersons where lower(trim(country)) = lower(trim(coalesce(p_country,''))) and user_id = me()) $$;

create or replace function is_any_spokesperson() returns boolean language sql stable security definer set search_path = public as
$$ select is_admin() or exists (select 1 from spokespersons where user_id = me()) $$;

create or replace function project_canal(p uuid) returns text language sql stable security definer set search_path = public as
$$ select canal_id from projects where id = p $$;

-- Garde-fou pour l'anti-pause (appel public sans donnée)
create or replace function ping() returns text language sql stable as $$ select 'ok' $$;
grant execute on function ping() to anon, authenticated;

-- ============ Vues publiques (pseudo uniquement, jamais d'email : il n'y en a pas) ============
-- security_invoker = false fait tourner ces vues avec les privilèges du propriétaire (hors RLS sur profiles/…),
-- donc chacune doit vérifier elle-même que l'appelant est déjà un membre enregistré (me() is not null) :
-- sans ce filtre, n'importe quelle session authentifiée (y compris une session anonyme Supabase créée
-- sans la moindre invitation) pourrait les lire.
create view public_profiles with (security_invoker = false) as
  select id, pseudo, country, show_honor, is_admin, is_ref, first_name, last_name from profiles where me() is not null;
create view skills_directory with (security_invoker = false) as
  select id, pseudo, country, skills, first_name, last_name from profiles where matching and me() is not null;
grant select on public_profiles, skills_directory to authenticated;

-- Porte-paroles d'un pays : visibles de tous les membres (comme les modérateurs de canal).
create view spokesperson_list with (security_invoker = false) as
  select s.country, p.pseudo from spokespersons s join profiles p on p.id = s.user_id where me() is not null;
grant select on spokesperson_list to authenticated;

create view canal_stats with (security_invoker = false) as
  select canal_id, count(*) as members from canal_members where status = 'member' and me() is not null group by canal_id;
create view canal_mods with (security_invoker = false) as
  select m.canal_id, p.pseudo, m.is_moderator, m.is_relay from canal_members m join profiles p on p.id = m.user_id
  where m.status = 'member' and (m.is_moderator or m.is_relay) and me() is not null;
create view ann_read_counts with (security_invoker = false) as
  select ann_id, count(*) as n from ann_reads where me() is not null group by ann_id;
grant select on canal_stats, canal_mods, ann_read_counts to authenticated;

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

-- Aperçu d'un lien avant inscription (nom du canal) : n'expose rien d'autre.
create or replace function peek_invite(p_code text) returns json language sql stable security definer set search_path = public as $$
  select json_build_object('kind', i.kind, 'canal', i.canal_id, 'canal_fr', c.name_fr, 'canal_ar', c.name_ar)
  from invites i left join canals c on c.id = i.canal_id
  where i.code = p_code and i.active and (i.expires_at is null or i.expires_at > now())
$$;
grant execute on function peek_invite(text) to authenticated;

-- Le modérateur crée / fait tourner le lien de son canal (l'ancien cesse de fonctionner).
create or replace function rotate_canal_invite(p_canal text) returns text language plpgsql security definer set search_path = public as $$
declare c text := lower(replace(p_canal,'_','-')) || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,16);
begin
  if not is_mod(p_canal) then raise exception 'forbidden'; end if;
  update invites set active = false where canal_id = p_canal and kind = 'join';
  insert into invites(code, kind, canal_id, created_by) values (c, 'join', p_canal, me());
  return c;
end $$;
grant execute on function rotate_canal_invite(text) to authenticated;

-- Lien testeurs (administrateur) : le testeur rejoint les canaux de son choix, sans validation, avec les droits de modérateur.
create or replace function rotate_tester_invite() returns text language plpgsql security definer set search_path = public as $$
declare c text := 'testeur-' || substr(replace(gen_random_uuid()::text,'-',''),1,16);
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update invites set active = false where kind = 'tester';
  insert into invites(code, kind, created_by) values (c, 'tester', me());
  return c;
end $$;
grant execute on function rotate_tester_invite() to authenticated;

-- Fin de la phase test : retire les droits de modérateur des testeurs (sauf administrateurs) et ferme le lien.
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

-- Lien de reconnexion pour un membre qui a perdu son téléphone (valable 7 jours, usage unique).
create or replace function create_recovery_invite(p_pseudo text) returns text language plpgsql security definer set search_path = public as $$
declare t uuid; c text := 'retour-' || substr(replace(gen_random_uuid()::text,'-',''),1,24);
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

-- Désignation des porte-paroles d'un pays (plusieurs possibles par pays) : administrateur uniquement.
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

-- ============ Fonctions IA (phase test) ============
create table if not exists ai_testers (
  user_id uuid primary key references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists ai_usage (
  user_id uuid references profiles(id) on delete cascade,
  day date not null default current_date,
  n int not null default 0,
  primary key (user_id, day)
);
alter table ai_testers enable row level security;
alter table ai_usage enable row level security;      -- aucune policy : lisible uniquement via les fonctions ci-dessous
revoke all on ai_usage from anon, authenticated;
drop policy if exists ait_admin on ai_testers;
drop policy if exists ait_self on ai_testers;
create policy ait_admin on ai_testers for all to authenticated using (is_admin()) with check (is_admin());
create policy ait_self on ai_testers for select to authenticated using (user_id = me());
grant select on ai_testers to authenticated;      -- l'écriture passe uniquement par set_ai_tester()

-- Consomme une utilisation IA (20 par jour et par testeur). Erreurs : not_tester, quota.
create or replace function ai_consume() returns int language plpgsql security definer set search_path = public as $$
declare m uuid := me(); used int;
begin
  if m is null or not exists (select 1 from ai_testers where user_id = m) then raise exception 'not_tester'; end if;
  insert into ai_usage(user_id, day, n) values (m, current_date, 1)
    on conflict (user_id, day) do update set n = ai_usage.n + 1 where ai_usage.n < 20
    returning n into used;
  if used is null then raise exception 'quota'; end if;
  return 20 - used;
end $$;
grant execute on function ai_consume() to authenticated;

-- Désigne ou retire un testeur IA (admin uniquement).
create or replace function set_ai_tester(p_pseudo text, p_on boolean) returns void language plpgsql security definer set search_path = public as $$
declare t uuid;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  select id into t from profiles where pseudo = lower(p_pseudo);
  if t is null then raise exception 'unknown_pseudo'; end if;
  if p_on then insert into ai_testers(user_id) values (t) on conflict do nothing;
  else delete from ai_testers where user_id = t; end if;
end $$;
grant execute on function set_ai_tester(text, boolean) to authenticated;


-- Demande d'adhésion à un autre canal / décision du modérateur
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

create or replace function decide_join(p_canal text, p_user uuid, p_accept boolean) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_mod(p_canal) then raise exception 'forbidden'; end if;
  update canal_members set status = case when p_accept then 'member' else 'refused' end where canal_id = p_canal and user_id = p_user;
  if p_accept then insert into notifications(user_id, kind, ref, body) values (p_user, 'accepted', p_canal, ''); end if;
end $$;
grant execute on function decide_join(text, uuid, boolean) to authenticated;


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


-- ============ Préinscriptions (avant le lancement) ============
-- Ouvert aux visiteurs non connectés, uniquement via la fonction preregister (contrôles + limite d'abus). Lecture et suppression : administrateur.
create table if not exists preregistrations (
  id uuid primary key default gen_random_uuid(),
  first_name text check (char_length(first_name) <= 60),
  contact text not null check (char_length(contact) between 5 and 120),
  country text check (char_length(country) <= 60),
  canals text[] not null default '{}',
  lang text,
  created_at timestamptz not null default now()
);
create unique index if not exists preregistrations_contact_uq on preregistrations (lower(contact));
alter table preregistrations enable row level security;
drop policy if exists pre_read on preregistrations;
drop policy if exists pre_delete on preregistrations;
create policy pre_read on preregistrations for select to authenticated using (is_admin());
create policy pre_delete on preregistrations for delete to authenticated using (is_admin());
grant select, delete on preregistrations to authenticated;

create or replace function preregister(p_first text, p_contact text, p_country text, p_canals text[], p_lang text)
returns json language plpgsql security definer set search_path = public as $$
declare c text := trim(coalesce(p_contact,'')); cs text[];
begin
  if c !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and c !~ '^\+?[0-9 ().-]{8,20}$' then raise exception 'bad_contact'; end if;
  if char_length(coalesce(p_first,'')) > 60 or char_length(coalesce(p_country,'')) > 60 then raise exception 'too_long'; end if;
  if (select count(*) from preregistrations where created_at > now() - interval '1 hour') >= 300 then raise exception 'busy'; end if;
  select coalesce(array_agg(left(x, 30)), '{}') into cs from (select x from unnest(coalesce(p_canals,'{}')) x limit 12) s;
  insert into preregistrations(first_name, contact, country, canals, lang)
    values (nullif(trim(coalesce(p_first,'')),''), c, nullif(trim(coalesce(p_country,'')),''), cs, left(coalesce(p_lang,''), 5))
    on conflict (lower(contact)) do nothing;          -- déjà inscrit : même réponse, rien n'est révélé
  return json_build_object('ok', true);
end $$;
grant execute on function preregister(text, text, text, text[], text) to anon, authenticated;

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
declare t tasks; own uuid; lead boolean;
begin
  select * into t from tasks where id = p_task; select owner_id into own from projects where id = t.project_id;
  lead := (own = me() or is_mod(project_canal(t.project_id)));
  if p_status not in ('todo','doing','done') then raise exception 'bad_status'; end if;
  -- Passer une tâche en « fait » (ou la rouvrir) est réservé au chef de projet et aux modérateurs.
  if p_status = 'done' or t.status = 'done' then
    if not lead then raise exception 'forbidden'; end if;
  elsif not (t.assignee_id = me() or lead) then raise exception 'forbidden'; end if;
  update tasks set status = p_status, done_at = case when p_status = 'done' then now() end, review_at = null where id = p_task;
end $$;
grant execute on function set_task_status(uuid, text) to authenticated;

-- L'assigné d'une tâche peut signaler au chef de projet qu'elle est terminée (une fois par heure et par tâche).
create or replace function request_task_review(p_task uuid) returns void language plpgsql security definer set search_path = public as $$
declare t tasks; own uuid;
begin
  select * into t from tasks where id = p_task;
  if t.id is null or t.assignee_id is distinct from me() then raise exception 'forbidden'; end if;
  if t.status = 'done' then raise exception 'already_done'; end if;
  if t.review_at is not null and t.review_at > now() - interval '1 hour' then raise exception 'too_soon'; end if;
  update tasks set review_at = now() where id = p_task;
  select owner_id into own from projects where id = t.project_id;
  if own is not null and own <> me() then
    insert into notifications(user_id, kind, ref, body)
    values (own, 'review', t.project_id::text, (select pseudo from profiles where id = me()) || ' · ' || t.title);
  end if;
  -- Les modérateurs du canal sont informés aussi (sans doublon avec le chef de projet).
  insert into notifications(user_id, kind, ref, body)
  select cm.user_id, 'review', t.project_id::text, (select pseudo from profiles where id = me()) || ' · ' || t.title
  from canal_members cm
  where cm.canal_id = project_canal(t.project_id) and cm.status = 'member' and cm.is_moderator
    and cm.user_id <> me() and cm.user_id is distinct from own;
end $$;
grant execute on function request_task_review(uuid) to authenticated;

create or replace function claim_help(p_help uuid) returns void language plpgsql security definer set search_path = public as $$
declare a uuid;
begin
  if me() is null then raise exception 'not_registered'; end if;
  if not (is_ref() or is_admin()) then raise exception 'forbidden'; end if;
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

create or replace function set_canal_wa(p_canal text, p_link text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_mod(p_canal) then raise exception 'forbidden'; end if;
  update canals set wa_link = nullif(trim(p_link), '') where id = p_canal;
end $$;
grant execute on function set_canal_wa(text, text) to authenticated;

create or replace function join_team(p_project uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_member(project_canal(p_project)) then raise exception 'forbidden'; end if;
  insert into project_team(project_id, user_id) values (p_project, me()) on conflict do nothing;
  insert into notifications(user_id, kind, ref, body)
    select owner_id, 'joined', p_project::text, (select pseudo from profiles where id = me())
    from projects where id = p_project and owner_id <> me();
end $$;
grant execute on function join_team(uuid) to authenticated;

-- Archivage des projets : propriétaire, modérateurs du canal et administrateur. Suppression : modérateurs seulement (policy proj_delete).
create or replace function guard_project_archive() returns trigger language plpgsql as $$
begin
  if new.archived_at is distinct from old.archived_at and not (is_mod(old.canal_id) or old.owner_id = me()) then raise exception 'forbidden'; end if;
  return new;
end $$;
drop trigger if exists projects_guard_archive on projects;
create trigger projects_guard_archive before update on projects for each row execute function guard_project_archive();

-- Code de secours : permet au membre de changer lui-même son mot de passe perdu (sans e-mail).
-- Seul l'empreinte (sha256) du code est conservée ; la table n'est lisible par personne côté application.
create table if not exists recovery_secrets (
  profile_id uuid primary key references profiles(id) on delete cascade,
  code_hash text not null,
  fails int not null default 0,
  locked_until timestamptz
);
alter table recovery_secrets enable row level security;
revoke all on recovery_secrets from anon, authenticated;

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

-- Compte : suppression à la demande du membre (anonymise ses contenus via cascade partielle)
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

-- RGPD : droit à la portabilité. Chaque membre peut récupérer l'intégralité
-- de ses données personnelles en JSON (rien d'autre : ni données d'un tiers,
-- ni les secrets internes comme le hash du code de récupération).
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
grant execute on function export_my_data() to authenticated;

-- ============ Notifications automatiques ============
create or replace function trg_task_assigned() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.assignee_id is not null and new.assignee_id is distinct from coalesce(old.assignee_id, null) and new.assignee_id <> coalesce(me(), '00000000-0000-0000-0000-000000000000') then
    insert into notifications(user_id, kind, ref, body) values (new.assignee_id, 'task', new.project_id::text, new.title);
  end if;
  return new;
end $$;
create trigger task_assigned after insert or update of assignee_id on tasks for each row execute function trg_task_assigned();

-- Destinataires d'un projet : propriétaire + suiveurs, selon le niveau de suivi choisi (all / mine = jalons seulement / none)
create or replace function project_audience(p_project uuid, p_levels text[]) returns setof uuid language sql stable security definer set search_path = public as $$
  select u from (
    select owner_id as u from projects where id = p_project
    union select user_id from follows where project_id = p_project and level = any(p_levels)
  ) s
  where not exists (select 1 from follows f where f.project_id = p_project and f.user_id = s.u and f.level <> all(p_levels))
$$;

create or replace function trg_comment_notify() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications(user_id, kind, ref, body)
  select u, 'comment', new.project_id::text, (select title from projects where id = new.project_id)
  from project_audience(new.project_id, array['all']) u where u <> new.author_id;
  return new;
end $$;
create trigger comment_notify after insert on comments for each row execute function trg_comment_notify();

create or replace function trg_milestone_notify() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.done and not old.done then
    insert into notifications(user_id, kind, ref, body)
    select u, 'milestone', new.project_id::text, new.title
    from project_audience(new.project_id, array['all','mine']) u where u <> coalesce(me(), '00000000-0000-0000-0000-000000000000');
  end if;
  return new;
end $$;
create trigger milestone_notify after update of done on milestones for each row execute function trg_milestone_notify();

create or replace function trg_proposal_notify() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications(user_id, kind, ref, body)
  values (new.to_user, 'proposal', new.project_id::text, (select title from projects where id = new.project_id));
  return new;
end $$;
create trigger proposal_notify after insert on proposals for each row execute function trg_proposal_notify();

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
-- Réservé aux membres déjà enregistrés : avant redeem_invite, une session authentifiée (même anonyme) n'a pas de profil.
create policy canals_read on canals for select to authenticated using (me() is not null);
create policy canals_admin on canals for all to authenticated using (is_admin()) with check (is_admin());

-- Profils : chacun lit/modifie le sien (les pseudos des autres passent par la vue public_profiles)
create policy profiles_self_read on profiles for select to authenticated using (auth_uid = auth.uid() or is_admin());
create policy profiles_self_update on profiles for update to authenticated using (auth_uid = auth.uid()) with check (auth_uid = auth.uid());
revoke update on profiles from authenticated;
grant update (first_name, last_name, country, lang, skills, matching, base, show_honor) on profiles to authenticated;

-- Adhésions : lisibles pour soi, les modérateurs du canal et les membres du canal
create policy cm_read on canal_members for select to authenticated
  using (user_id = me() or is_mod(canal_id) or (status = 'member' and is_member(canal_id)));
-- écritures uniquement via RPC (aucune policy d'écriture)

-- Invitations : lecture/écriture uniquement via RPC, sauf pour les modérateurs (lecture du lien de leur canal)
create policy inv_read on invites for select to authenticated using ((kind = 'join' and canal_id is not null and is_mod(canal_id)) or (kind = 'tester' and is_admin()));

-- Projets
create policy proj_read on projects for select to authenticated using (is_member(canal_id) and (archived_at is null or owner_id = me() or is_mod(canal_id)));
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

-- Entraide : visible de l'auteur, de la personne qui la prend en charge, des référents et des modérateurs
create policy help_read on helps for select to authenticated using (author_id = me() or claimed_by = me() or is_ref() or is_any_mod());
create policy help_insert on helps for insert to authenticated with check (author_id = me() and status = 'open' and claimed_by is null);
create policy help_delete on helps for delete to authenticated using (author_id = me() or is_any_mod());

-- Annonces : générales (canal et pays null) pour tous ; par canal pour ses membres ; par pays pour la diaspora
-- de ce pays. Publication : admin (générale ou par pays, les deux réservées à l'admin sauf pays où les
-- porte-paroles de ce pays peuvent aussi publier), modérateurs (leur canal), porte-paroles (leur pays).
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
create policy ann_update on announcements for update to authenticated using (author_id = me() or is_admin()) with check (author_id = me() or is_admin());
create policy ann_delete on announcements for delete to authenticated using (author_id = me() or is_admin());

alter table spokespersons enable row level security;
create policy spk_admin on spokespersons for all to authenticated using (is_admin()) with check (is_admin());

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

-- ============ Privilèges sur les tables ============
-- Les nouveaux projets Supabase n'accordent plus automatiquement l'accès aux tables : on le fait ici.
-- La confidentialité reste assurée par les règles RLS ci-dessus (sans règle, une écriture est refusée).
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
grant select, insert, update, delete on canals, profiles, canal_members, invites, projects, milestones, tasks, project_team,
  comments, follows, proposals, helps, announcements, ann_reads, badge_requests, badge_grants, notifications to authenticated;
revoke update on profiles, notifications from authenticated;
grant update (first_name, last_name, country, lang, skills, matching, base, show_honor) on profiles to authenticated;
grant update (read) on notifications to authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

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
-- Gestion des membres par les modérateurs : retirer un membre, nommer un modérateur.
-- Règles : on n'agit pas sur soi-même ni sur un administrateur ; seuls les administrateurs
-- peuvent retirer ou rétrograder un modérateur ; tout modérateur peut en nommer un autre.
create or replace function member_remove(p_canal text, p_pseudo text) returns void
language plpgsql security definer set search_path = public as $$
declare t uuid; tmod boolean; tadm boolean;
begin
  if not (is_admin() or is_mod(p_canal)) then raise exception 'forbidden'; end if;
  select id, is_admin into t, tadm from profiles where pseudo = lower(p_pseudo);
  if t is null then raise exception 'unknown_pseudo'; end if;
  if t = me() or tadm then raise exception 'forbidden'; end if;
  select is_moderator into tmod from canal_members where canal_id = p_canal and user_id = t and status = 'member';
  if not found then raise exception 'not_member'; end if;
  if tmod and not is_admin() then raise exception 'forbidden'; end if;
  delete from canal_members where canal_id = p_canal and user_id = t;
end $$;
grant execute on function member_remove(text, text) to authenticated;

create or replace function member_set_mod(p_canal text, p_pseudo text, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
declare t uuid; tmod boolean; tadm boolean;
begin
  if not (is_admin() or is_mod(p_canal)) then raise exception 'forbidden'; end if;
  select id, is_admin into t, tadm from profiles where pseudo = lower(p_pseudo);
  if t is null then raise exception 'unknown_pseudo'; end if;
  if t = me() or tadm then raise exception 'forbidden'; end if;
  select is_moderator into tmod from canal_members where canal_id = p_canal and user_id = t and status = 'member';
  if not found then raise exception 'not_member'; end if;
  if not p_on and tmod and not is_admin() then raise exception 'forbidden'; end if;
  update canal_members set is_moderator = p_on where canal_id = p_canal and user_id = t;
end $$;
grant execute on function member_set_mod(text, text, boolean) to authenticated;
