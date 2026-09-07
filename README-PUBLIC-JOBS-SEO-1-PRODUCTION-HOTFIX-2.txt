# Clean Jobs — Public Jobs SEO 1.0 production hotfix 2

This patch addresses the three production QA failures from the first deployment.

## What the QA showed

Production privacy checks were GREEN:
- exact address absent from raw HTML/RSC
- owner internal ID absent from raw HTML/RSC
- weak job noindex
- cancelled job 200 + noindex

Three checks failed:
1. quality open job was reported noindex
2. /jobs base page was reported noindex
3. newly created quality job was missing from sitemap

## Fixes

### 1. Job metadata DB lookup

`app/jobs/[id]/page.tsx` now uses the server-only Supabase admin client inside
`generateMetadata()`.

Reason:
SEO metadata must evaluate the actual database row reliably and must not fall
back to the "missing job => noindex" metadata branch because of anonymous
request context/RLS/session differences.

The rendered public page still uses the public-safe anonymous select introduced
by the privacy hotfix. No private fields are added to the public RSC payload.

### 2. /jobs faceted noindex

`app/jobs/page.tsx` previously treated ANY query parameter as a facet.

The production QA adds `_qa=<timestamp>` to bypass caches, so even the base
`/jobs` request was incorrectly classified as faceted/noindex.

Now only these real filter parameters trigger noindex:
- view
- q
- city
- status
- jobType
- propertyType
- sort
- bankidOnly

Unknown operational/tracking query parameters no longer change indexability.

### 3. Dynamic sitemap

`app/sitemap.ts` now exports:

    export const dynamic = "force-dynamic"

This makes the generated sitemap reflect current marketplace state at request
time, including newly created quality jobs and jobs whose status changed.

The same shared quality gate still determines which jobs are included.

No DB migration.
No RLS changes.
No route changes.
No JobPosting structured data.

## Verification

Run:

npm run typecheck
npm run build

Then deploy and repeat the production QA.

Expected:
RESULT: 14/14
STATUS: GREEN
TEST JOBS DELETE: GREEN
