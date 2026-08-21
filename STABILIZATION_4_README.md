# Clean Jobs — Stabilization 4/4: Cleanup & Final QA

This is the final stabilization package. It deliberately avoids product-flow rewrites.

## Main changes

- Adds the current checked-in Supabase `Database` TypeScript snapshot plus a safe regeneration command (`npm run db:types`).
- Replaces the obsolete Next.js 16 `next lint` package script with explicit `typecheck`, `check`, `db:types`, and `preflight` quality commands. No dependency versions change.
- Removes the old inactive `app/actions/middleware.ts`; the root Next.js 16 `proxy.ts` remains the single request/session/locale proxy.
- Removes source files confirmed by the project import graph to have no consumers after Stabilization 1–3. This includes old duplicate job-status/review components and empty legacy SEO/component stubs.
- Keeps `components/take-job-form.tsx` because the current job page still imports it; the dangerous direct-take database path was already disabled in Stabilization 2.
- Ignores `supabase/.temp/` without deleting it, so the local Supabase project link is preserved.
- Adds a final technical preflight that validates the canonical migration chain, generated type coverage, cleanup state, required core env names, and warns about production legal/security gates.

## Files added/replaced

- `lib/database.types.ts`
- `package.json`
- `scripts/generate-database-types.sh`
- `scripts/stabilization-4-cleanup.sh`
- `scripts/final-preflight.mjs`

The cleanup script deletes only the legacy/dead files listed inside it.

## No SQL

There is no migration in this package. Do not run `db push` for Stabilization 4.

## Safe rollout

1. Unzip the package into the project.
2. Run `bash scripts/stabilization-4-cleanup.sh`.
3. Run `npm run typecheck`.
4. Run `rm -rf .next && npm run build`.
5. Run `npm run preflight` and review warnings; warnings about legal identity/secrets are production-release gates rather than build failures.
6. Runtime regression: login/logout, company directory, company dashboard, quote, booking, jobs/application/approval, Stripe billing/portal, admin, standalone company site, analytics consent.
7. Commit only after the above is green.

## Intentionally not forced

`tsconfig.json` remains `strict: false` in this final stabilization. Enabling strict mode across the entire mature codebase would be a separate high-churn refactor and is not required to safely ship the current product. The generated DB type snapshot establishes the foundation for progressively typed Supabase clients without destabilizing working production flows.
