begin;

alter table public.notifications
  add column if not exists href text,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists dedupe_key text;

create unique index if not exists notifications_dedupe_key_unique
  on public.notifications (dedupe_key);

create index if not exists notifications_user_unread_created_idx
  on public.notifications (user_id, is_read, created_at desc);

create index if not exists notifications_entity_idx
  on public.notifications (entity_type, entity_id);

alter table public.notifications enable row level security;

grant select, update
on public.notifications
to authenticated;

drop policy if exists "Users can read own notifications"
on public.notifications;

create policy "Users can read own notifications"
on public.notifications
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can update own notifications"
on public.notifications;

create policy "Users can update own notifications"
on public.notifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

notify pgrst, 'reload schema';

commit;
