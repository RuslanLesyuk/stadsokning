# Clean Jobs — Stabilization 3/4: Performance & Scale

This package prepares the high-traffic/catalog surfaces for mass company import and reduces repeated Supabase/Vercel work.

## Main changes

- `/companies` no longer downloads the full company table into a Client Component. Search, city/status filters, sorting and pagination are server-side with 24 companies per page.
- `/companies/city/[city]` is paginated instead of loading every company in a city.
- Adds public directory facet/search RPCs and trigram/search indexes before mass import.
- `SiteHeader` replaces the previous profile + notifications + jobs + companies + claims + leads + bookings + messages query fan-out with one authenticated `get_header_snapshot()` RPC after auth resolution.
- Company Dashboard aggregate KPIs replace multiple count queries and two potentially multi-page scans with one owner-only `get_company_dashboard_metrics()` RPC.
- Dashboard refresh no longer runs a fixed 15-second `router.refresh()` loop. It refreshes only when the tab/window becomes active after a stale interval (60 seconds on the two dashboards).
- `/admin/leads` is paginated (100/page) and uses database counts instead of loading the entire outreach table to calculate stats.
- `/admin/customer-leads` is paginated (100/page) and status counts are head/count queries instead of downloading all lead statuses.
- Adds supporting indexes for company directory/admin search, job ownership and unread-message counting.

## Files

- `supabase/migrations/20260820210000_performance_scale.sql`
- `app/companies/page.tsx`
- `app/companies/city/[city]/page.tsx`
- `components/companies/companies-directory.tsx`
- `components/site-header.tsx`
- `components/dashboard-live-refresh.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/company/page.tsx`
- `app/admin/leads/page.tsx`
- `app/admin/customer-leads/page.tsx`

## Safe rollout order

1. Unzip into the project.
2. Run `npx supabase db reset` locally. Baseline + Stabilization 2 + this migration must apply from zero.
3. Run `rm -rf .next && npm run build`.
4. Check `npx supabase migration list`; the new local migration should be missing remotely.
5. Run `npx supabase db push` only after reset/build are green.
6. Runtime smoke:
   - `/companies` search/filter/page navigation;
   - `/companies/city/stockholm` pagination;
   - login/header counters;
   - personal dashboard and company dashboard;
   - admin outreach/customer-lead pagination.

The package does not change quote/booking/job business mutations introduced in Stabilization 2.
