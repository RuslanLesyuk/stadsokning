# Clean Jobs — Premium / Monetization 2.0 (Roadmap 6/10)

This is a flat replacement/addition package. Extract it into the project root.

## What this package adds

- hardened Premium security on `profiles` (users cannot self-assign Premium/Stripe/admin fields)
- canonical `billing_subscriptions`
- `billing_transactions` history foundation
- idempotent `billing_webhook_events`
- monthly + yearly Premium Checkout
- reuse of an existing Stripe Customer
- Checkout Session + Subscription metadata linking to the Clean Jobs user
- Stripe Customer Portal
- subscription lifecycle sync for create/update/delete
- `invoice.paid` recovery and `invoice.payment_failed` grace-period handling
- admin Premium override that does not destroy a valid Stripe subscription
- `/billing` customer billing dashboard in sv/en/uk/ru/pl
- `/admin/billing` billing visibility
- Premium company-site gates enforced both server-side and in PostgreSQL
- Premium site features: Minimal/Elegant templates, multiple languages, custom-domain foundation, remove Clean Jobs branding
- payment schema foundation for future paid leads and booking payments (no premature checkout is enabled for them)
- Lead Generation 2.0 correctness fix: `first_viewed_at` is no longer overwritten on every later status change

## 1. Backup

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Premium Monetization 2.0"
```

## 2. Extract

```bash
unzip -o ~/Downloads/clean-jobs-premium-monetization-6-FLAT.zip \
  -d /home/owico/stadsokning2
```

## 3. Run migration

In Supabase SQL Editor run the complete file:

`supabase/migrations/20260816_premium_monetization_2.sql`

Run it from `begin;` through `commit;`.

The migration intentionally hardens `profiles` INSERT/UPDATE privileges. Authenticated users can write only normal profile fields. Premium, Stripe, verification and admin-controlled columns remain server-only.

## 4. Environment variables

Existing monthly price remains backward compatible:

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PREMIUM_PRICE_ID=price_... # accepted as monthly fallback
```

Recommended explicit setup:

```env
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
BILLING_GRACE_DAYS=3
```

`STRIPE_PREMIUM_MONTHLY_PRICE_ID` takes precedence over the old `STRIPE_PREMIUM_PRICE_ID`.

`STRIPE_FEATURED_JOB_PRICE_ID` is not changed by this package.

## 5. Stripe Dashboard

Configure/enable the Customer Portal for the same Stripe mode (test/live) that you are using.

Webhook endpoint:

`https://cleansjob.com/api/stripe/webhook`

Subscribe to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

For local Stripe CLI testing, use the `whsec_...` secret printed by `stripe listen` as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## 6. Build

```bash
cd /home/owico/stadsokning2
rm -rf .next
npm run build
```

## 7. Runtime test

```bash
npm run dev
```

Test in this order:

1. `/billing` opens for an authenticated user.
2. Monthly checkout creates a subscription.
3. Stripe webhook changes Premium to active.
4. `/profile`, `/dashboard` and `/jobs` show effective Premium.
5. Customer Portal opens from `/billing`.
6. Company website editor blocks Premium-only changes for Free users.
7. Premium user can choose Minimal/Elegant, enable multiple languages, set a custom domain and remove Clean Jobs branding.
8. Failed subscription payment produces `past_due` + grace period instead of immediately removing Premium.
9. Successful invoice payment clears grace and restores/keeps Premium.
10. Configure `STRIPE_PREMIUM_YEARLY_PRICE_ID` and test annual checkout.
11. `/admin/billing` shows the subscription record.

## Important

The public `/billing/success` redirect does **not** grant Premium by itself. The signed Stripe webhook synchronizes entitlement.

Paid lead purchase and booking payment collection are deliberately not activated yet. The migration only adds the schema foundation for those later monetization flows so no customer contact data is accidentally exposed through a half-finished paywall.
