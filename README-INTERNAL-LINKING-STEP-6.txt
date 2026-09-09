# Clean Jobs — Step 6/12: Internal Linking

This package strengthens the marketplace SEO graph without recreating the old
large cartesian SEO architecture.

## Source audit

Current architecture already had:

- city hub -> quality live job links
- public job -> city hub link
- service SEO pages -> related service/city links
- company profile -> related company links
- company directory supports `?city=...`

The missing part was a consistent bridge between the job marketplace, city
hubs, canonical service landings and company directory.

## New shared internal-link layer

New files:

- `lib/seo/marketplace-links.ts`
- `components/seo/marketplace-internal-links.tsx`

The helper builds a small contextual graph from the current city/job type.

For supported cities it can link:

- city hub
- filtered active jobs
- canonical home-cleaning landing
- canonical office-cleaning landing
- company directory filtered by city
- main services directory

It uses the existing `seoLandingPages` list instead of inventing routes.

## Job type relevance

For a public job:

- `home_cleaning` -> relevant `hemstadning-<city>` landing
- `office_cleaning` -> relevant `kontorsstadning-<city>` landing

The job page therefore does not spray unrelated service links.

## City hubs

Stockholm, Göteborg and Malmö now connect to:

- their live quality jobs
- local jobs browse view
- canonical home-cleaning landing
- canonical office-cleaning landing
- city-filtered company directory
- services directory

The existing guide content, canonical metadata and live-jobs block are unchanged.

## Directory city pages

Existing `/companies/city/[city]` and `/services/city/[city]` pages now also
include the same contextual marketplace navigation.

No new city-directory routes are created.

This is important because the collector showed:

- Stockholm: 4 service profiles
- Göteborg: 0 service profiles
- Malmö: 0 service profiles

The package deliberately does NOT create/index new empty Göteborg/Malmö
service/company city routes merely for linking.

## SEO safety

This package does NOT:

- add thousands of pages
- modify sitemap logic
- modify index/noindex quality gates
- add JobPosting schema
- expose address/user IDs
- modify database/RLS
- invent company/service inventory

Faceted `/jobs?city=...` and `/companies?city=...` URLs are useful navigation
targets. Canonical service landing pages remain the indexable service targets.

## Files

- `lib/seo/marketplace-links.ts`
- `components/seo/marketplace-internal-links.tsx`
- `app/jobs/[id]/page.tsx`
- `app/stadjobb-stockholm/page.tsx`
- `app/stadjobb-goteborg/page.tsx`
- `app/stadjobb-malmo/page.tsx`
- `app/companies/city/[city]/page.tsx`
- `app/services/city/[city]/page.tsx`
- `README-INTERNAL-LINKING-STEP-6.txt`

No migration.

## Verification

1. `npm run typecheck`
2. `npm run build`
3. local runtime QA with temporary quality jobs
4. targeted commit
5. deploy
6. production QA

Do not use `git add .`.

The collector showed unrelated modified/generated files including
`lib/database.types.ts`, `next-env.d.ts`, `tsconfig.tsbuildinfo`,
`supabase/.temp/*` and historical context/report files. Do not stage them.
