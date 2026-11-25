-- Questionnaire de retours des testeurs : un membre enregistre ses réponses, lit les siennes ; l'administrateur lit tout.

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
