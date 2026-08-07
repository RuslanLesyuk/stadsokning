# Clean Jobs — Company Quote Notifications

## Included

- Creates an in-app notification when a new `Begär offert` request is submitted.
- Adds a notification link to the exact company request.
- Marks the notification as read when it is opened or when the lead status changes.
- Shows unread notification count on the bell.
- Shows a `Company requests` / `Offertförfrågningar` link for company owners in desktop and mobile menus.
- Shows a badge with the number of new company requests.
- Highlights the exact request opened from the notification.
- Sends an optional Resend email to the company owner's account email.
- Prevents duplicate notifications with `dedupe_key`.

## Install

1. Copy the package contents into the project root, preserving paths and replacing files.
2. Run this migration in Supabase SQL Editor:

   `supabase/migrations/20260806_company_quote_notifications.sql`

3. Optional email environment variables:

```env
RESEND_API_KEY=your_existing_key
RESEND_FROM_EMAIL=Clean Jobs <support@cleansjob.com>
NEXT_PUBLIC_SITE_URL=https://cleansjob.com
```

The in-app notification works without Resend. If `RESEND_API_KEY` is absent, email delivery is skipped without blocking the quote request.

4. Clear the Next.js cache and build:

```bash
rm -rf .next
npm run build
npm run dev
```

## Test

1. Sign in with a customer account that is not the company owner.
2. Open a claimed company profile.
3. Submit a new `Begär offert` request.
4. Sign in as the company owner.
5. Confirm:
   - the bell has a new unread badge;
   - `/notifications` contains `Ny offertförfrågan...`;
   - clicking it opens `/dashboard/company-leads?lead=...#lead-...`;
   - the exact request is highlighted;
   - the profile/mobile menu contains the company requests link and new-request badge;
   - changing the lead status from `new` marks the related notification read.

Existing quote requests are not backfilled. Submit a new test request after installing this package.
