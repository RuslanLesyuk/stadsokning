# Clean Jobs — Bookings / Recurring Orders (Block 5/10)

## What this package adds

- One-time, weekly, biweekly and monthly bookings.
- Company booking settings: enable/disable, recurring, minimum notice, booking horizon, default duration, buffer, auto-confirm, timezone.
- Public booking form on company profiles and published Website-as-a-Service sites.
- Working-hours validation and confirmed-slot conflict detection.
- Database-level overlap guard with a per-company advisory transaction lock.
- `pending -> confirmed -> in_progress -> completed` plus `declined / cancelled`.
- Recurring occurrence generation inside the company's booking horizon.
- Company booking dashboard and detail page.
- Customer booking dashboard and detail page.
- Customer cancellation flow.
- Notifications and Resend emails for new bookings, status changes and customer cancellations.
- Convert a `quoted` or `won` customer lead into a confirmed booking.
- Source tracking: company profile, company site, lead conversion, manual/admin foundation.
- RUT request field.
- Price fields and Stripe-ready `payment_status` / `stripe_payment_intent_id` foundation.
- 5-language public/dashboard copy.

## Install

1. Back up the current working tree:

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Bookings Recurring Orders 5"
```

2. Extract the flat ZIP into the project root:

```bash
unzip -o ~/Downloads/clean-jobs-bookings-recurring-orders-5-FLAT.zip \
  -d /home/owico/stadsokning2
```

3. In Supabase SQL Editor, run the entire migration:

```text
supabase/migrations/20260809_bookings_recurring_orders.sql
```

Run it from `begin;` through `commit;`. The migration ends with a PostgREST schema reload.

4. Build:

```bash
cd /home/owico/stadsokning2
rm -rf .next
npm run build
```

5. If green, run locally:

```bash
npm run dev
```

## First runtime setup

Open:

```text
/dashboard/company-bookings
```

For the test company, open **Booking settings** and enable online booking. Defaults are intentionally safe:

- booking disabled until owner enables it;
- recurring enabled;
- minimum notice 24 hours;
- horizon 90 days;
- default duration 180 minutes;
- buffer 30 minutes;
- auto-confirm disabled;
- timezone Europe/Stockholm.

The public availability validator also follows the `working_hours` saved on the company profile.

## End-to-end test

### A. Direct booking from marketplace profile

1. Enable booking for Hemfrid.
2. Open `/companies/hemfrid-stockholm`.
3. Confirm the **Book cleaning / Boka städning** CTA is visible.
4. Submit a one-time booking for a future time inside company working hours.
5. Owner should receive a notification/email.
6. Open `/dashboard/company-bookings` and confirm the booking.
7. Logged-in customer should receive notification/email and see `/dashboard/bookings`.
8. Start and complete the occurrence from the company booking detail page.

### B. Website-as-a-Service source

1. Open the published `/site/<site-slug>`.
2. Submit a booking.
3. Confirm `source = company_site` in the company booking detail page.

### C. Recurring booking

1. Submit weekly or biweekly cleaning.
2. Open company booking detail.
3. Verify multiple occurrences were generated up to the configured booking horizon.
4. Confirm the booking and verify occurrences become confirmed.
5. Complete one occurrence and verify future occurrences remain available.

### D. Conflict protection

1. Confirm a booking at a specific time.
2. Submit/confirm another booking for overlapping time.
3. It must be rejected as unavailable/conflicting.
4. The configured buffer is included in conflict detection.

### E. Lead conversion

1. Open a `quoted` or `won` lead in `/dashboard/company-leads/[id]`.
2. Click **Create booking**.
3. Add address/time/duration.
4. Save.
5. The booking is created as confirmed and linked through `quote_request_id`.
6. The lead is marked `won`.

## MVP boundary

Guest customers can submit a booking and receive email updates, but a booking only appears in **My bookings** when it has a `customer_id` (for example, when the customer was logged in at submission or the original converted lead had a logged-in user). Account-by-email claiming can be added later without changing the booking schema.

## Tables

- `company_booking_settings`
- `company_bookings`
- `company_booking_occurrences`
- `company_booking_activity`

## Main routes

- `/dashboard/bookings`
- `/dashboard/bookings/[id]`
- `/dashboard/company-bookings`
- `/dashboard/company-bookings/[id]`
- `/dashboard/company-bookings/settings/[companyId]`
- `/dashboard/company-bookings/new?lead=<leadId>`
