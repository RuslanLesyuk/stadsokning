# Clean Jobs — Mass Import 1/4 RPC runtime fix

Fixes PostgreSQL error `42702: column reference "ordinality" is ambiguous` in `public.import_company_leads_batch(uuid, jsonb)`.

The original migration applied successfully because PL/pgSQL resolves this ambiguity only when the loop query executes. This migration keeps the RPC signature and import behavior unchanged, but renames the PL/pgSQL variable to `v_ordinality` and aliases the `WITH ORDINALITY` output column as `row_ordinality`.

No application or TypeScript changes are required.
