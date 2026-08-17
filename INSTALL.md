# Clean Jobs — Admin Automation 9/10

## What this package adds

- `/admin/automation` live operational health center.
- SLA queue for stale company claims.
- Stale pending booking queue.
- Overdue confirmed/in-progress occurrence detection.
- Unattended customer-lead detection.
- Overdue CRM follow-up detection.
- Billing subscription exceptions.
- Failed / stuck Stripe webhook visibility.
- Expired admin Premium override detection + safe reconciliation action.
- Failed / stale-pending custom-domain detection.
- Email-enrichment retry, never-scanned and stale-invitation counters.
- Link from the main `/admin` page.
- Query indexes for the operational health queues.

## Install

1. Back up the current project:

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Admin Automation 9"
```

2. Unzip this package into the project root.

3. Run the SQL migration in Supabase SQL Editor:

`supabase/migrations/20260817_admin_automation.sql`

Expected result:

`Success. No rows returned`

4. Clear Next cache and build:

```bash
rm -rf .next
npm run build
```

5. Runtime test:

```bash
npm run dev
```

Open:

`http://localhost:3000/admin/automation`

## Runtime checks

- The main Admin page contains an `Automation` link.
- The automation page opens only for an email included in `ADMIN_EMAILS`.
- Counts load for claims, bookings, CRM, billing, domains and outreach.
- Existing queues link to the current admin pages instead of duplicating their business logic.
- If an expired admin Premium override exists, `Reconcile expired Premium` updates it back to the underlying Stripe / legacy / free entitlement.
- No customer lead, booking, claim or CRM record is automatically changed by the health page.

## Important

This package does not add cron jobs or external scheduled infrastructure. The health snapshot is calculated from live database state every time `/admin/automation` loads. This keeps Block 9 deterministic and avoids introducing a background worker immediately before the final Security / QA stage.
