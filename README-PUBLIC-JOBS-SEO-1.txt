# Clean Jobs — Public Jobs SEO 1.0

Goal:
Turn real user-created cleaning requests into public, crawlable marketplace
pages without exposing exact addresses, application data, contact details or
private workflow information.

## Files

- app/jobs/[id]/page.tsx
- app/jobs/page.tsx
- app/sitemap.ts
- lib/seo/public-jobs.ts

No database migration is included.

## Public /jobs/[id]

Anonymous visitors can now open a job page instead of being redirected to login.

Public view intentionally does NOT expose:
- exact address
- applicant names or offers
- application messages or prices
- chat
- activity timeline
- reviews workflow
- private participant actions
- user profile identity

Potential contact details inside title/description are redacted in the public
render and metadata.

Authenticated owner/assigned-worker workflow is preserved. Exact address is
now shown only to the owner and the selected worker. Other authenticated users
see a privacy placeholder.

## Index gate

A job is indexable only when all of these are true:

- status = new
- assigned_to is null
- title has at least 10 trimmed characters
- description has at least 80 trimmed characters
- city is present
- job_type is home_cleaning or office_cleaning
- title/description do not contain obvious email, URL or phone patterns
- title/description do not contain the configured spam signals
- job is not older than 120 days
- scheduled_date, when present, is not in the past

Everything else remains accessible by URL when it exists but receives:

robots: noindex, follow

Deleted rows continue to return 404.

This means:
- good open job -> 200 + index
- weak open job -> 200 + noindex
- assigned/in-progress/done/cancelled -> 200 + noindex
- physically deleted job -> 404

## Sitemap

app/sitemap.ts now includes only jobs that pass the same shared index gate.
The public job sitemap contribution is capped at 5000 URLs for this phase.
Existing SEO recovery, company and service sitemap logic remains intact.

## /jobs faceted pages

The canonical jobs directory remains /jobs.

Any query-string variant such as:
- /jobs?city=Stockholm
- /jobs?view=completed
- /jobs?q=...
- /jobs?jobType=...

gets canonical /jobs and noindex,follow so filters do not create a faceted
indexation explosion.

## Structured data

No JobPosting structured data was added.

Clean Jobs user cleaning requests are service/work requests, not necessarily
employment vacancies. Mislabeling every user request as JobPosting would be
incorrect.

## Internal links

Public job pages link back to /jobs and, when available, the existing city hub:
- Stockholm -> /stadjobb-stockholm
- Göteborg/Gothenburg -> /stadjobb-goteborg
- Malmö -> /stadjobb-malmo

More city hubs are intentionally deferred to the planned Live City Jobs phase.

## Verification

After installing:

npm run typecheck
npm run build

Then create two local test jobs:

A) quality test
- status new
- city Stockholm
- title >= 10 chars
- description >= 80 chars

Expected:
- anonymous /jobs/<id> = 200
- no exact address in public HTML
- robots index
- URL appears in /sitemap.xml

B) weak test
- status new
- description < 80 chars

Expected:
- anonymous /jobs/<id> = 200
- robots noindex
- URL absent from /sitemap.xml

Then cancel the quality test:
Expected:
- page remains 200
- robots becomes noindex
- URL disappears from sitemap

Delete the tests after QA.

## Important repository note

The collector showed lib/database.types.ts already modified before this package.
This package does not modify that file. Review/stage it separately because it
likely belongs to the earlier Acquisition Tracking migration rather than this
SEO change.

Do not use git add .
