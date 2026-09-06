# Clean Jobs — Acquisition Tracking 1.0

Goal:
Measure which acquisition channels produce real published jobs and where users
drop out of the four-step job creation funnel.

## What is tracked

Consent-based client events:
- landing_view
- create_job_click
- create_job_start
- create_job_step_2
- create_job_step_3
- create_job_step_4
- job_publish_click
- job_published

Events are sent only after Clean Jobs analytics consent is granted.

The event helper sends to:
- Vercel Web Analytics custom events
- Google Analytics when NEXT_PUBLIC_GA_ID is configured
- Microsoft Clarity event names when Clarity is active

## Attribution

After analytics consent, Clean Jobs stores a first-party acquisition cookie with:
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- referring hostname
- landing page

The model keeps the last non-direct attribution for 30 days. A later direct
visit does not overwrite a paid/organic campaign.

When a job is successfully published, the attribution is copied to nullable
jobs.acquisition_* columns. If analytics consent is denied, those columns stay
null/unattributed.

No address, title, job description, email, phone or other private job content
is sent in analytics events.

## Confirmed marketplace funnel

Run:

node --env-file=.env.local scripts/acquisition-funnel-report.mjs --days=30

The report derives:
- published jobs
- jobs that received at least one application
- worker selected
- job started
- job completed

and groups the result by acquisition source / medium.

## Database

Migration:
supabase/migrations/20260906094500_add_job_acquisition_attribution.sql

It only adds nullable attribution columns and the exact INSERT column grant
needed by the existing authenticated jobs creation flow.

No existing jobs or workflow statuses are changed.
No SEO routes, sitemap, canonical logic, company data or RLS policy is changed.

## Install / verification order

1. npx supabase db reset
2. npx supabase db push
3. npm run db:types
4. npm run typecheck
5. npm run build

Then test:
- allow analytics cookies;
- visit /?utm_source=qa&utm_medium=test&utm_campaign=tracking_1;
- navigate to /jobs/create;
- complete all 4 steps and publish a temporary test job;
- run the acquisition funnel report;
- confirm the test job appears under qa / test;
- delete the temporary job afterward.

If analytics consent is rejected, attribution should remain empty.
