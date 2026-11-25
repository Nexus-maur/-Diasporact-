-- L'assigné d'une tâche peut alerter le chef de projet qu'elle est terminée.
alter table tasks add column if not exists review_at timestamptz;
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
end $$;
grant execute on function request_task_review(uuid) to authenticated;

create or replace function set_task_status(p_task uuid, p_status text) returns void language plpgsql security definer set search_path = public as $$
declare t tasks; own uuid; lead boolean;
begin
  select * into t from tasks where id = p_task; select owner_id into own from projects where id = t.project_id;
  lead := (own = me() or is_mod(project_canal(t.project_id)));
  if p_status not in ('todo','doing','done') then raise exception 'bad_status'; end if;
  if p_status = 'done' or t.status = 'done' then
    if not lead then raise exception 'forbidden'; end if;
  elsif not (t.assignee_id = me() or lead) then raise exception 'forbidden'; end if;
  update tasks set status = p_status, done_at = case when p_status = 'done' then now() end, review_at = null where id = p_task;
end $$;
grant execute on function set_task_status(uuid, text) to authenticated;
