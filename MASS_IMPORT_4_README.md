# Clean Jobs — Mass Import 4/4

Final QA / scale-control layer for the Swedish company-import pipeline.

## What this adds

- `/admin/leads/rollout` production rollout dashboard.
- Batch-specific QA using `?batch=<import_batch_id>`.
- Read-only database audit RPCs for thousands of imported leads.
- QA issue export to CSV (up to 5,000 issue rows).
- Scale indexes for publication/enrichment audits by import batch.
- Navigation from Import, Enrichment and Publication to Rollout QA.
- No outreach email is sent by this package.

## Current QA gates

The dashboard checks:

- identity/contact coverage;
- quality score distribution (`55` publication gate, `80+` strong records);
- first-scan and retryable enrichment backlog;
- exhausted enrichment attempts;
- missing cities;
- leads with no reachable contact channel;
- publication failures;
- catalog linkage/status mismatches;
- impossible `found` scan status without a saved email.

## Production rollout sizes

1. 100 real companies — inspect everything.
2. 500 companies — enrichment chunks stay at 8.
3. 1,000 companies — publish in 50–100 record runs.
4. Up to 5,000 companies — only after the earlier checkpoints remain clean.

## Install / verify

1. Unzip at project root.
2. `npx supabase db reset`
3. `npx supabase db push`
4. `npm run db:types`
5. `npm run typecheck`
6. `npm run build`
7. Open `/admin/leads/rollout`.
8. Select a real import batch and verify the QA dashboard before large publication.

After this stage is closed, the Mass Import software pipeline is complete. The next work is operational: source a lawful Swedish company dataset, start with a 100-company real batch, enrich, QA, publish, then scale.
