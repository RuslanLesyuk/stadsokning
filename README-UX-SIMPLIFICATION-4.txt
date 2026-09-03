# Clean Jobs — UX Simplification 4

Scope: company experience only.

## Files changed

- app/dashboard/company/page.tsx
- app/dashboard/company-leads/page.tsx
- app/dashboard/company-customers/page.tsx
- components/company-dashboard/company-workspace-nav.tsx

## UX changes

1. Company workspace navigation
   - Primary navigation is reduced to Overview, Leads, Customers, Bookings.
   - Website, Services and Billing are moved under a secondary "More tools" section.
   - Existing counters for new leads and pending bookings remain.

2. Company overview
   - Adds a clear "Next steps" section.
   - Prioritises new leads, pending bookings and overdue customer follow-ups.
   - When nothing urgent exists, guides the owner toward website setup, online booking, or the public company profile.
   - Visible metrics are reduced to four operational numbers.
   - Detailed conversion, pipeline, revenue and activity are moved under a collapsible business-data section.
   - Public profile and company editing stay immediately accessible.

3. Customer leads
   - Primary filters are Search, Status and Company.
   - Priority, Source and Sort are moved under "More filters".
   - Existing query parameters, lead statuses, sorting and server-side filtering are preserved.

4. CRM customers
   - Primary filters are Search, Lifecycle stage and Company.
   - Tags, Follow-up and Sort are moved under "More filters".
   - Existing customer metrics, CRM logic and server-side filtering are preserved.

## Safety

- No database migration.
- No schema changes.
- No Supabase policy changes.
- No route deletion.
- No SEO/indexing/sitemap changes.
- No lead, customer or booking status logic changes.
- No billing logic changes.
- Existing detailed pages remain available.

## QA order

1. npm run typecheck
2. npm run build
3. Runtime QA for:
   - /dashboard/company
   - /dashboard/company-leads
   - /dashboard/company-customers
   - /dashboard/company-bookings
4. Production smoke test after deploy.
