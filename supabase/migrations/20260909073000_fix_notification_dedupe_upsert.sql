-- Clean Jobs — Step 7 hotfix 1
-- `notifications.dedupe_key` previously used a partial unique index:
--   unique (dedupe_key) where dedupe_key is not null
--
-- PostgREST/Supabase `upsert(..., { onConflict: "dedupe_key" })` needs
-- an inferable unique index/constraint on exactly that conflict target.
--
-- PostgreSQL UNIQUE indexes already allow multiple NULL values, so a normal
-- unique index preserves the intended semantics while making the conflict
-- target usable by upsert.

drop index if exists public.notifications_dedupe_key_unique;

create unique index notifications_dedupe_key_unique
  on public.notifications (dedupe_key);

notify pgrst, 'reload schema';
