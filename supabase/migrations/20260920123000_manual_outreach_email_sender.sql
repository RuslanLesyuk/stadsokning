-- Clean Jobs — manual admin outreach email sender
-- Stores successful manual sends so admins can avoid contacting the same
-- address repeatedly. Sending itself stays server-only through the service role.

create table if not exists public.manual_outreach_emails (
  id uuid primary key default gen_random_uuid(),
  email_normalized text not null,
  subject text not null,
  message text not null,
  resend_email_id text,
  sent_by uuid references auth.users(id) on delete set null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint manual_outreach_emails_email_check check (
    email_normalized = lower(btrim(email_normalized))
    and position('@' in email_normalized) > 1
  )
);

create index if not exists manual_outreach_emails_email_sent_at_idx
  on public.manual_outreach_emails (email_normalized, sent_at desc);

alter table public.manual_outreach_emails enable row level security;

revoke all on table public.manual_outreach_emails from anon, authenticated;
grant all on table public.manual_outreach_emails to service_role;
