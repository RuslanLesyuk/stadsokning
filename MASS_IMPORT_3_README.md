# Clean Jobs — Mass Import 3/4

Persistent batch email enrichment for mass-imported Swedish cleaning companies.

## What changes

- Adds `company_enrichment_batches` and `company_enrichment_batch_items`.
- Adds persistent email scan attempt fields to `company_leads`.
- Queues up to 5,000 eligible leads while processing only 4/8/12 companies per server request.
- Uses atomic DB claims with `FOR UPDATE SKIP LOCKED` so active batches do not double-process the same lead.
- Requeues abandoned processing claims after 15 minutes.
- Caps retry attempts per lead when a queue is created.
- Saves progress and result counters in the database so a batch can be reopened later.
- Reuses the existing hardened website/email scanner.
- A found email automatically recalculates the existing Mass Import quality score.
- If a lead is already linked to a public company, the email is copied only when that public profile has no email. Existing public data is not overwritten.
- No outreach email is sent by this stage.

## Recommended install order

1. Unzip at the project root.
2. `npx supabase db reset`
3. `npx supabase db push`
4. `npm run db:types`
5. `npm run typecheck`
6. `npm run build`
7. Runtime-test `/admin/leads/enrich` with a small queue first.

## Runtime model

The queue may contain thousands of companies, but the browser drives small sequential Server Action chunks. Keep the tab open while a batch is running. Pause is safe; progress is persistent and can be continued from the Recent enrichment batches table.

For normal use, keep the server chunk at **8 companies**. Use 4 for slow/unstable websites; 12 only after normal runs are proven stable in production.
