# Clean Jobs — Stabilization 2/4: Security & Data Integrity

This package hardens the browser/PostgREST mutation surface without changing the product flows.

## Main changes

- Public company quote requests can no longer be inserted directly with the anon/authenticated Supabase key. The existing validated Next.js server action now performs the final insert with the service-role client after honeypot, validation and DB-backed rate limiting.
- `company_quote_requests` commercial/payment identity fields are protected from company-owner direct API updates.
- `companies.verified`, `companies.owner_id`, `companies.claimed_at` and `companies.rating` are platform-controlled rather than owner-editable through PostgREST.
- `service_profiles.verified` is platform-controlled; create flow relies on the DB default `false`.
- Booking payment/source/customer identity columns are protected. Company owners retain only the operational booking/status/price fields used by the dashboard.
- CRM rows cannot be relinked or have canonical email identity rewritten by a browser update.
- Removes the legacy `Users can take jobs` RLS policy that allowed any authenticated user to update any job.
- New job creation relies on DB defaults for `status = new` and `assigned_to = null`; users cannot insert assignment/featured state directly.
- Assigned workers are DB-limited to status-only job updates; owners retain normal editing within the existing RLS boundary.

## Files

- `app/companies/[slug]/actions.ts`
- `app/services/create/page.tsx`
- `app/jobs/actions.ts`
- `supabase/migrations/20260820090000_security_data_integrity.sql`

## Safe rollout order

1. Unzip into the project.
2. Run `npx supabase db reset` locally. It must apply the canonical baseline and this migration from zero.
3. Run `npm run build`.
4. Review `npx supabase db push --dry-run` if the installed CLI supports it; otherwise use `npx supabase migration list` and `npx supabase db push` only after local reset/build are green.
5. Runtime smoke: public quote request; service profile creation/edit; job create/apply/approve/status; company edit; booking owner status/price/settings; CRM edit.

Do not manually run the SQL in Supabase SQL Editor if `db push` is being used for migration history.
