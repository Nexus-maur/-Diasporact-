-- Préinscriptions publiques avant le lancement.

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

select (select count(*) from information_schema.tables where table_name='preregistrations') as tbl, (select count(*) from pg_proc where proname='preregister') as fn;
