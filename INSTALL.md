# Clean Jobs 10/10 — Legal / Security / Final QA

## 1. Backup

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Legal Security Final 10"
```

## 2. Install package

```bash
unzip -o ~/Downloads/clean-jobs-final-security-10-FLAT.zip \
  -d /home/owico/stadsokning2
```

## 3. Run SQL

Run the complete file in Supabase SQL Editor:

`supabase/migrations/20260817_security_final_10.sql`

Expected: `Success. No rows returned`.

This migration closes direct access to the SECURITY DEFINER company-claim review RPCs, removes direct anonymous/authenticated writes to company-claim review data, adds a private DB-backed rate limiter, and adds a private outreach email-preference table so unsubscribe choices survive future imports.

## 4. Add legal identity env values before public launch

Do not invent these values. Use the real service operator details:

```env
NEXT_PUBLIC_LEGAL_ENTITY_NAME=
NEXT_PUBLIC_LEGAL_ORG_NUMBER=
NEXT_PUBLIC_LEGAL_POSTAL_ADDRESS=
NEXT_PUBLIC_SUPPORT_EMAIL=support@cleansjob.com
NEXT_PUBLIC_PRIVACY_EMAIL=support@cleansjob.com
```

Optional rate-limit pepper (recommended; use a long random secret):

```env
SECURITY_RATE_LIMIT_SECRET=
```

Email test endpoint is OFF by default. Only enable temporarily for an authenticated admin:

```env
ENABLE_EMAIL_TEST_ROUTE=false
TEST_EMAIL_TO=
```

Company outreach email is also OFF by default:

```env
OUTREACH_EMAIL_ENABLED=false
```

Keep `OUTREACH_EMAIL_ENABLED=false` until you have a documented production recipient/compliance rule for Swedish electronic marketing. Do not assume that every company record is a legal-person recipient: a sole trader can be a physical person. Only set this to `true` after the recipient basis has been reviewed and the outbound email contains both the unsubscribe mechanism and a valid stop/contact address.

## 5. BankID production safety gate

The package intentionally refuses to mark BankID as verified in production until you explicitly confirm production configuration:

```env
BANKID_PRODUCTION_READY=false
BANKID_PROVIDER_LABEL=se_bankid_oidc
```

Keep `BANKID_PRODUCTION_READY=false` while using test/sandbox credentials. Change it to `true` only after your BankID/OIDC provider has issued production credentials and the production redirect URI is registered.

The flow now uses state + nonce + PKCE and validates issuer/audience/expiry/subject correlation from the token response.

## 6. Build

```bash
rm -rf .next
npm run build
```

## 7. Runtime smoke test

- Login/password
- Google OAuth
- logout
- `/dashboard`
- `/admin`
- `/admin/automation`
- create quote request
- create booking
- keep admin company invitation sending blocked while `OUTREACH_EMAIL_ENABLED=false`
- after the outreach recipient/compliance rule is approved, temporarily enable it and verify one invitation + unsubscribe confirmation flow
- confirm an opted-out email is skipped by future outreach
- company claim submit/review
- Stripe checkout + Customer Portal
- `/privacy`
- `/terms`
- `/cookies`
- `/contact`
- verify `/api/email/test` returns 404 while disabled
- confirm direct legacy "take job" action can no longer bypass the application flow

See `SECURITY_RELEASE_CHECKLIST.md` before production deployment.
