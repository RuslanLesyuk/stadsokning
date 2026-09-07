# Clean Jobs — Step 3/12: Job Index/Noindex Gate Hardening

This package hardens the Public Jobs SEO policy introduced in Step 2.

## Why this package exists

The source audit showed two important gaps:

1. The active job creation page (`app/jobs/create/page.tsx`) did not use the
   spam/content checks that existed in the older shared action.
2. SEO indexability did not react to unresolved user moderation reports.

The existing index gate, dynamic sitemap and public privacy protections are
preserved.

## Changes

### Shared content policy

New file:

    lib/jobs/content-policy.ts

It becomes the single source for:
- max title/description/city/address/budget limits
- supported job/property types
- contact detection
- spam/scam signal detection
- public text redaction
- submission spam scoring

Both the active create flow and the older shared job action use this module.

### Phone false-positive hardening

The previous SEO phone regex treated almost any long numeric sequence as a
phone number. This caused the production QA timestamp in a title to become
`contains_contact_details`.

The hardened detector now focuses on:
- international numbers beginning with +
- Swedish-style numbers beginning with 0
- numbers explicitly introduced by phone/contact wording

A random timestamp/ID no longer becomes a phone number solely because it has
many digits.

### Active create-flow server validation

The actual `/jobs/create` server action now validates:
- title max 120
- description max 5000
- city required and max 120
- address max 300
- budget 0..10,000,000
- supported job type
- supported property type
- shared suspicious-content score

Suspicious submissions scoring >= 6 are not inserted.

No database architecture is changed.

### Moderation-aware SEO

A job with any unresolved `job_reports.status = open` becomes:

    200 + noindex,follow

and is excluded from sitemap.

If the report is later resolved/dismissed and the job still passes all other
quality rules, it can become indexable again automatically.

The public job remains accessible so moderation does not create unnecessary
404s.

### Existing quality rules retained

An indexable public job must still be:
- status new
- unassigned
- title >= 10
- description >= 80
- valid city/job type
- no obvious public contact details
- no spam/scam signal
- <= 120 days old
- scheduled date not in past
- no unresolved moderation report

Additional upper-length checks are now part of the SEO gate too.

## Files

- lib/jobs/content-policy.ts
- lib/seo/public-jobs.ts
- app/jobs/create/page.tsx
- app/jobs/actions.ts
- app/jobs/[id]/page.tsx
- app/sitemap.ts
- README-JOB-INDEX-GATE-HARDENING.txt

No migration is required.

## Verification sequence

1. npm run typecheck
2. npm run build
3. local runtime QA
4. targeted commit
5. deploy
6. production QA

Do not use `git add .`.

The collector showed unrelated modified/generated files including:
- lib/database.types.ts
- next-env.d.ts
- tsconfig.tsbuildinfo
- supabase/.temp/*
- many historical context/report files

Do not stage them with this package.
