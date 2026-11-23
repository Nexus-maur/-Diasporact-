-- Archivage des projets (propriétaire et modérateurs) : à exécuter une fois dans le SQL Editor Supabase.
alter table projects add column if not exists archived_at timestamptz;
drop policy if exists proj_read on projects;
create policy proj_read on projects for select to authenticated using (is_member(canal_id) and (archived_at is null or owner_id = me() or is_mod(canal_id)));
create or replace function guard_project_archive() returns trigger language plpgsql as $$
begin
  if new.archived_at is distinct from old.archived_at and not (is_mod(old.canal_id) or old.owner_id = me()) then raise exception 'forbidden'; end if;
  return new;
end $$;
drop trigger if exists projects_guard_archive on projects;
create trigger projects_guard_archive before update on projects for each row execute function guard_project_archive();
