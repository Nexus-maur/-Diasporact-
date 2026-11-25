-- Fonctions IA (traduction FR/AR, discussion -> projet) réservées aux testeurs désignés par l'admin,
-- avec un quota quotidien par testeur. L'appel à l'IA passe par la fonction serveur api/ai.js, qui
-- appelle ai_consume() avec la session du membre avant de contacter le service d'IA.
-- À exécuter une fois dans le SQL Editor Supabase sur la base existante.
-- (Nouvelles installations : schema.sql contient déjà cette version.)

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
