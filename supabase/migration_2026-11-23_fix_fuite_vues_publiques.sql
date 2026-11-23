-- Faille : public_profiles / skills_directory / canal_stats / canal_mods / ann_read_counts
-- étaient accessibles à toute session "authenticated", y compris une session anonyme Supabase
-- créée sans aucune invitation (auth.signInAnonymously(), ne nécessite aucun secret).
-- Un visiteur non invité pouvait donc lire pseudo + pays + statut admin/référent + compétences
-- de tous les membres, la liste des modérateurs par canal, etc.
-- Correctif : ces vues security_invoker=false ne renvoient des lignes que si l'appelant est
-- déjà un membre enregistré (profil lié à sa session via auth_uid), comme pour les autres tables.

create or replace view public_profiles with (security_invoker = false) as
  select id, pseudo, country, show_honor, is_admin, is_ref from profiles
  where me() is not null;

create or replace view skills_directory with (security_invoker = false) as
  select id, pseudo, country, skills from profiles
  where matching and me() is not null;

create or replace view canal_stats with (security_invoker = false) as
  select canal_id, count(*) as members from canal_members
  where status = 'member' and me() is not null
  group by canal_id;

create or replace view canal_mods with (security_invoker = false) as
  select m.canal_id, p.pseudo, m.is_moderator, m.is_relay from canal_members m join profiles p on p.id = m.user_id
  where m.status = 'member' and (m.is_moderator or m.is_relay) and me() is not null;

create or replace view ann_read_counts with (security_invoker = false) as
  select ann_id, count(*) as n from ann_reads
  where me() is not null
  group by ann_id;
