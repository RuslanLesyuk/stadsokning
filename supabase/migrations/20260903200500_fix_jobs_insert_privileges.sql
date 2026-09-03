-- Allow authenticated users to create jobs using only user-editable fields.
-- Workflow-controlled fields such as status and assigned_to are intentionally
-- omitted and must use database defaults / trusted workflow actions.

grant insert (
  title,
  description,
  city,
  address,
  budget,
  job_type,
  property_type,
  scheduled_date,
  scheduled_time,
  created_by
)
on table public.jobs
to authenticated;
