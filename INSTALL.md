# Clean Jobs — Company Dashboard 2.0 (Stage 7/10)

This package adds a dedicated business workspace without replacing the personal `/dashboard`.

## What is included

### New
- `app/dashboard/company/page.tsx`
- `components/company-dashboard/company-workspace-nav.tsx`
- `lib/company-dashboard/copy.ts`

### Integrated/replaced
- `app/dashboard/page.tsx`
- `app/dashboard/company-leads/page.tsx`
- `app/dashboard/company-leads/actions.ts`
- `app/dashboard/company-bookings/page.tsx`
- `app/dashboard/company-bookings/actions.ts`
- `app/dashboard/websites/page.tsx`
- `app/dashboard/services/page.tsx`
- `components/site-header.tsx`
- `components/profile-dropdown.tsx`
- `components/mobile-header-menu.tsx`

## Company Dashboard features

Route:
- `/dashboard/company`

Features:
- company selector for users who own multiple companies
- new lead count
- conversion rate
- open pipeline value
- pending booking count
- confirmed cleaning occurrences in the next 7 days
- completed occurrence revenue for the current Stockholm calendar month
- "Needs attention" queue combining new leads + pending bookings
- upcoming cleaning schedule
- website / booking / recurring / domain / RUT / Premium setup status
- recent company activity
- quick links to Leads / Bookings / Website / Booking settings / Services / Billing
- public profile and published website links
- Premium status
- 5 languages: sv, en, uk, ru, pl
- mobile responsive layout
- 15 second live refresh using the existing `DashboardLiveRefresh`

## Integration

The personal `/dashboard` remains intact and now contains a Company Workspace card for company owners.

The existing company sections now have a shared workspace navigation:
- Leads
- Bookings
- Websites
- Services
- Premium

The profile dropdown and mobile menu now include "Company dashboard".

Lead and booking mutations revalidate `/dashboard/company`.

## Database

No SQL migration is required for Stage 7.

The dashboard uses the existing:
- `companies`
- `company_quote_requests`
- `company_bookings`
- `company_booking_occurrences`
- `company_booking_settings`
- `company_sites`
- existing billing entitlement layer

## Install

1. Backup:
```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Company Dashboard 2.0"
```

2. Unzip this archive into the project root:
```bash
unzip -o ~/Downloads/clean-jobs-company-dashboard-7-FLAT.zip \
  -d /home/owico/stadsokning2
```

3. Clean build:
```bash
cd /home/owico/stadsokning2
rm -rf .next
npm run build
```

4. If build is green:
```bash
npm run dev
```

5. Runtime test:
- open `/dashboard`
- verify the Company Workspace card is visible for a company owner
- open `/dashboard/company`
- verify company name/logo/status
- verify metrics load
- verify new leads appear in "Needs attention"
- verify pending bookings appear in "Needs attention"
- verify confirmed booking occurrences appear in "Upcoming cleaning"
- verify Websites / Leads / Bookings / Services / Premium tabs work
- verify company selector if the account owns more than one company
- verify desktop profile dropdown has Company dashboard
- verify mobile menu has Company dashboard

## Validation performed before packaging

- TypeScript syntax transpile over all TS/TSX package files: 0 syntax errors.
- Isolated TypeScript compatibility check with project-module stubs: passed.
- New Company Dashboard files passed strict TypeScript checking in the isolated validation; the only strict stub warning came from pre-existing SiteHeader Supabase inference and is not introduced by this package.

A real full-project `npm run build` is still required after installation.
