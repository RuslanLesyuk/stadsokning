# Clean Jobs — Claim Company 2.0

## What this pack adds

- claim statuses: `pending`, `needs_info`, `approved`, `rejected`, `cancelled`
- private verification evidence uploads (PDF/JPG/PNG/WebP, max 5 files, 8 MB each)
- automatic company-domain vs business-email-domain signal
- claimant cancellation
- resubmission after `needs_info`
- new claims after `rejected` or `cancelled`
- admin search + status filters
- Approve / Request more information / Reject
- atomic ownership assignment via RPC
- automatic `companies.verified = true` on approval
- competing active claims automatically rejected when one claim is approved
- audit trail in `company_claim_audit`
- notification + email after admin decisions
- dedicated onboarding page after approval
- links to company claims in desktop and mobile account menus
- 5-language claimant UI (sv/en/uk/ru/pl)

## Install

From the project root:

```bash
unzip -o ~/Downloads/clean-jobs-claim-company-2.0-complete.zip
```

Then run this SQL file in Supabase SQL Editor:

```text
supabase/migrations/20260807_claim_company_2.sql
```

Required environment variables for admin/email behavior:

```env
ADMIN_EMAILS=your-admin@email.com
RESEND_API_KEY=...
NEXT_PUBLIC_SITE_URL=https://cleansjob.com
```

`RESEND_API_KEY` is optional for the core claim flow. If it is missing, decisions still work and in-app notifications still work; email delivery is skipped.

Then:

```bash
rm -rf .next
npm run build
```

If the build is green:

```bash
npm run dev
```

## Main verification flow

1. Use an unclaimed company.
2. Sign in as a normal user.
3. Open `/companies/COMPANY_SLUG/claim`.
4. Submit business email, phone, message and optionally 1 verification file.
5. Confirm the claim appears in `/dashboard/company-claims`.
6. Open `/admin` as an admin.
7. Search for the company in Company Claims 2.0.
8. Test **Request information**.
9. Confirm the claimant receives a bell notification and email (if Resend is configured).
10. As claimant, open the claim and resubmit additional information.
11. In admin, approve the resubmitted claim.
12. Confirm:
    - `companies.owner_id` equals the claimant user ID
    - `companies.verified = true`
    - claim status is `approved`
    - claimant gets a notification
    - notification opens `/dashboard/companies/COMPANY_ID/onboarding`
13. Complete onboarding and open the company editor.
14. Test a second claim and reject it with a reason.
15. Confirm the claimant can submit a new claim after rejection.
16. Test cancellation of a `pending` claim.

## Important

The proof-document bucket is private. Evidence links shown in the user dashboard and admin are short-lived signed URLs.
