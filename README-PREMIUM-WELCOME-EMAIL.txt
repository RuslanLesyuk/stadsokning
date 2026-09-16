Clean Jobs — complimentary Premium welcome email

Changed:
- app/admin/actions.ts

Behavior:
- Existing admin "Set premium" still grants 1 month of admin Premium.
- After the database update succeeds, the registered user's auth email is loaded.
- A Swedish welcome email is sent through the existing Resend integration.
- Premium grant does NOT fail if the email fails.
- No Stripe subscription/payment is created.
- No database migration is required.
