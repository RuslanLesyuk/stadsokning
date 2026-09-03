CLEAN JOBS — UX SIMPLIFICATION 2
Dashboard & Jobs discovery

Scope:
- app/dashboard/page.tsx
- app/jobs/page.tsx

Dashboard changes:
- Swedish title becomes "Mina ärenden" instead of technical "Dashboard".
- Adds a "Nästa steg" section before statistics.
- Shows pending job applications for jobs owned by the user.
- Shows unread job-chat messages as a direct action.
- Shows the user's active assigned/in-progress job as a direct action.
- When nothing needs attention, presents two clear paths:
  "Jag behöver städning" and "Jag söker jobb".
- Reduces the top statistics from five cards to three:
  posted jobs, taken jobs, unread messages.
- Existing company workspace, Premium/BankID area, job lists and history remain available.

Jobs discovery changes:
- Main /jobs view now means available work:
  only jobs with status "new" are shown by default.
- Assigned and in-progress jobs no longer clutter public job discovery.
- Main filters are reduced to:
  city, job type, text search.
- Property type, sorting and BankID filter move under "Fler filter".
- Completed/cancelled history stays available in its own tab.
- Removes the "create job" CTA from the worker-focused jobs page and empty state.
- Empty state now suggests resetting filters or returning home.
- Removes duplicate Featured badge rendering.
- Verification badge uses the current UI locale instead of hard-coded English.

Safety:
- No database migration.
- No schema changes.
- No SEO/indexing/sitemap changes.
- No job status workflow changes.
- No company dashboard changes.
- No deletion of existing routes.

Validation already performed on generated files:
- TypeScript transpile/syntax precheck: PASS for both TSX files.
- Structural UX assertions: PASS.
