# Clean Jobs — Step 5/12: Live City Jobs

This package turns the existing Stockholm, Göteborg and Malmö SEO hubs into
live marketplace pages without changing their canonical URLs or existing guide content.

## What changes

New:
- `lib/seo/live-city-jobs.ts`
- `components/live-city-jobs.tsx`

Updated:
- `app/stadjobb-stockholm/page.tsx`
- `app/stadjobb-goteborg/page.tsx`
- `app/stadjobb-malmo/page.tsx`

No database migration.

## Eligibility

The live block uses the SAME `evaluatePublicJobSeo()` policy as:
- individual public job metadata
- dynamic sitemap

A job is shown only when it:
- is `new`
- has no assigned worker
- passes title/description/city/job-type quality rules
- has no public contact details or spam signals
- is not stale
- does not have a past scheduled date
- has no open moderation report

This keeps city hubs, individual job indexing and sitemap eligibility aligned.

## Privacy

The city helper selects only public-safe fields:
- id
- title
- description
- city
- budget
- job_type
- property_type
- scheduled_date
- status
- created_at

It does NOT select:
- address
- created_by
- assigned_to
- profiles
- applications
- chat/messages

The UI additionally runs title/description through the shared public redaction helper.

## Moderation

Open reports are checked server-side with the existing admin client.

If moderation state cannot be loaded, the helper fails closed and shows no jobs
rather than promoting potentially reported content.

## City aliases

Supported hub matching:
- Stockholm
- Göteborg / Goteborg / Gothenburg
- Malmö / Malmo

No new city routes are created.

## Empty inventory

The current collector reported zero open jobs.

That is expected and supported:
- the hub stays useful/indexable because its guide content remains
- the live block shows a truthful empty state
- when a quality job is published it appears automatically
- no fake/sample jobs are rendered to users

## Internal linking

Each live card links directly:

    city hub -> /jobs/<id>

The block also links to the filtered jobs UX and job creation page.

This starts the city -> job side of the internal-linking graph, while Step 6
can deepen job -> city -> service/company linking.

## Verification

1. `npm run typecheck`
2. `npm run build`
3. local runtime QA with temporary jobs in Stockholm/Göteborg/Malmö
4. targeted commit
5. deploy
6. production QA

Do not use `git add .`.

The collector already showed unrelated modified/generated files such as
`lib/database.types.ts`, `next-env.d.ts`, `tsconfig.tsbuildinfo`,
`supabase/.temp/*` and historical context/report files. Do not stage them.
