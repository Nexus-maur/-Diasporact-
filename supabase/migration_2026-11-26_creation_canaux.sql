-- Création de canaux par les modérateurs (3 canaux maximum par modérateur non administrateur).
alter table canals add column if not exists created_by uuid;

create or replace function create_canal(p_name text, p_desc text default '') returns text
language plpgsql security definer set search_path = public as $$
declare nm text := btrim(coalesce(p_name,'')); ds text := btrim(coalesce(p_desc,'')); slug text; cid text; n int;
begin
  if not is_any_mod() then raise exception 'forbidden'; end if;
  if char_length(nm) < 3 or char_length(nm) > 40 then raise exception 'bad_name'; end if;
  if char_length(ds) > 200 then raise exception 'bad_desc'; end if;
  if not is_admin() then
    select count(*) into n from canals where created_by = me();
    if n >= 3 then raise exception 'canal_limit'; end if;
  end if;
  slug := regexp_replace(lower(translate(nm, 'àâäçéèêëîïôöùûüÿñœ', 'aaaceeeeiioouuuyno')), '[^a-z0-9]+', '-', 'g');
  slug := btrim(left(slug, 24), '-');
  if slug = '' then slug := 'canal'; end if;
  cid := slug || '-' || substr(md5(random()::text), 1, 4);
  insert into canals(id, ico, name_fr, name_ar, desc_fr, desc_ar, sort, created_by)
    values (cid, 'hash', nm, nm, ds, ds, coalesce((select max(sort) from canals), 0) + 1, me());
  insert into canal_members(canal_id, user_id, status, is_moderator, is_relay)
    values (cid, me(), 'member', true, false)
    on conflict (canal_id, user_id) do update set status = 'member', is_moderator = true;
  return cid;
end $$;
grant execute on function create_canal(text, text) to authenticated;
