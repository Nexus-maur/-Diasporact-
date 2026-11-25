-- Seuls le chef de projet et les modérateurs (ou l'administrateur) peuvent passer une tâche en « fait » ou la rouvrir.
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
  update tasks set status = p_status, done_at = case when p_status = 'done' then now() end where id = p_task;
end $$;
grant execute on function set_task_status(uuid, text) to authenticated;
