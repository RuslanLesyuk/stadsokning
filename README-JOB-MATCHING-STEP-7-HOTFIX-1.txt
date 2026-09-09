# Clean Jobs — Step 7 hotfix 1

The first Step 7 runtime QA exposed two separate issues.

## 1. Real product issue: notification dedupe upsert

The existing database schema had:

  CREATE UNIQUE INDEX notifications_dedupe_key_unique
    ON public.notifications (dedupe_key)
    WHERE dedupe_key IS NOT NULL;

Step 7 uses:

  upsert(..., { onConflict: "dedupe_key" })

A partial unique index is not a usable bare conflict target for that
PostgREST/Supabase upsert shape.

This hotfix replaces it with a normal UNIQUE index on dedupe_key.

PostgreSQL still allows multiple NULL values in a normal unique index, so
the existing nullable-dedupe behavior is preserved.

This also makes existing notification features that use the same upsert
pattern more reliable.

## 2. QA isolation issue

The first QA used real Stockholm and Göteborg city values. The database already
contains real service profiles, so `matched === 1` was not a valid assertion:
other legitimate profiles could match the temporary QA job.

The corrected QA uses unique temporary city names while still exercising:
- service-profile fallback
- explicit preference override
- Göteborg/Goteborg diacritic normalization
- quality gate
- owner exclusion
- notification creation
- delivery audit
- dedupe

No product code change is required for this QA-only issue.

## Workflow

After installing:

1. `npx supabase db reset`
2. `npx supabase db push`
3. `npm run typecheck`
4. `npm run build`
5. rerun the corrected isolated Step 7 runtime QA

No `db:types` regeneration is required because this hotfix changes only an
index, not table/function types.

Do not use `git add .`.
