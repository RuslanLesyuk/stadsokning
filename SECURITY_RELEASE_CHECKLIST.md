# Clean Jobs production security release checklist

## Mandatory before public production launch

- [ ] Rotate all secrets that have ever appeared in screenshots, terminal output, chat, commits, or shared files: Supabase service-role key, Stripe secret key, Stripe webhook secret, Resend API key, and BankID client secret.
- [ ] Confirm `.env*` files are ignored by git and no secrets exist in git history.
- [ ] Set the real legal operator name, organisation number, postal address, support email, and privacy email.
- [ ] In Supabase Auth, set the production Site URL to the canonical Clean Jobs HTTPS URL and keep Redirect URLs as narrow as practical. Keep localhost only for development.
- [ ] Enable appropriate Supabase Auth password policy, email confirmation, rate limits, and bot/CAPTCHA protection for signup/login if public abuse appears.
- [ ] Keep `ENABLE_EMAIL_TEST_ROUTE=false` in production.
- [ ] Keep `OUTREACH_EMAIL_ENABLED=false` until there is a documented recipient-basis process for Swedish electronic marketing. In particular, do not send unsolicited marketing email to a physical person unless valid prior consent or a statutory exception applies; do not assume a sole trader is a legal-person recipient.
- [ ] Keep `BANKID_PRODUCTION_READY=false` until production BankID/OIDC credentials and redirect URI have been verified with the provider.
- [ ] Re-test Stripe webhook signature verification after rotating the webhook secret.
- [ ] Run `npm audit --omit=dev` and review any high/critical findings before deploy; do not blindly force major upgrades.
- [ ] Verify Vercel/Cloudflare production and preview environments do not share secrets unnecessarily.
- [ ] Verify database backups/PITR appropriate for the production plan.

## Authorization / RLS smoke test with two ordinary users

- [ ] User A cannot edit User B profile.
- [ ] User A cannot read/update User B company leads, CRM customers, bookings, company website, or private claim evidence.
- [ ] A non-admin cannot call company-claim approve/reject/request-more-info RPCs.
- [ ] A non-owner cannot reset another company's website sections.
- [ ] Customer booking cancellation only affects that customer's own booking.
- [ ] Company booking actions only affect companies owned by the signed-in user.
- [ ] Billing subscription/transactions are readable only by their owner; webhook events remain service-role-only.

## Abuse / content safety

- [ ] Quote and booking forms throttle repeated submissions.
- [ ] Honeypot fields remain present in public quote/booking forms.
- [ ] Job reports throttle repeated submissions.
- [ ] Uploaded profile/service/company images accept only intended image MIME types and size limits.
- [ ] Claim evidence bucket remains private and paths are scoped to the claimant user id.
- [ ] Legacy direct job claiming is disabled; assignments happen through the application/approval flow.

## Billing

- [ ] Monthly checkout works.
- [ ] Yearly checkout works.
- [ ] Customer Portal works.
- [ ] `checkout.session.completed`, subscription updates/deletes, invoice paid, and invoice failed webhooks return 2xx when valid.
- [ ] Duplicate Stripe events are idempotent.
- [ ] `past_due` grace behavior matches the configured policy.
- [ ] Cancellation at period end keeps entitlement until the paid period ends.

## Legal / privacy

- [ ] `/privacy`, `/terms`, `/cookies`, `/contact` contain the real operator identity.
- [ ] Checkout clearly shows total price, billing interval, recurring nature, cancellation information, and applicable consumer withdrawal information before purchase.
- [ ] Privacy text matches actual production providers and data flows.
- [ ] If any non-essential cookie/tracker is later added, obtain consent before setting/reading it when required and provide a way to withdraw consent.
- [ ] Outreach emails identify Clean Jobs and include the unsubscribe confirmation link; verify an opted-out address is skipped by both single and bulk invitations.
- [ ] Every electronic marketing email contains a valid address/contact channel where the recipient can request that marketing stop, including when the recipient is a legal person.
- [ ] Before enabling outreach, document how recipients are classified and which lawful/marketing-rule basis applies; get Swedish legal review before scaling unsolicited outreach.
- [ ] Establish an internal retention/deletion schedule for accounts, chats, leads, bookings, CRM, billing records, and outreach data.
- [ ] Establish a process for GDPR access/deletion/objection requests and personal-data incidents.

## Final technical QA

- [ ] `npm run build` is green.
- [ ] Test desktop + mobile navigation.
- [ ] Test anonymous, authenticated, company-owner, and admin roles.
- [ ] Test 404/error states and invalid IDs.
- [ ] Test production HTTPS security headers.
- [ ] Test session refresh after leaving an authenticated browser session open past token expiry.
- [ ] Confirm canonical URLs, sitemap, robots, and existing SEO engine were not changed by this security pack.
