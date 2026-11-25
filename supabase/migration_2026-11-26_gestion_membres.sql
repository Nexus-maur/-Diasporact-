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
