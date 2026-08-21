select
  id,
  company_name,
  website,
  email,
  email_scan_status,
  email_scan_attempt_count,
  email_scan_last_attempt_at,
  email_scan_last_batch_id,
  import_batch_id,
  created_at
from public.company_leads
where company_name = 'Enrichment Test Company'
order by created_at desc;