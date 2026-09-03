# Clean Jobs — FAQ Refresh

Final UX cleanup after UX1–UX4.

Changed files:
- app/faq/page.tsx
- lib/faq.ts

What changed:
- Rewrote help content around the three current entry paths.
- Updated customer flow for the 4-step job wizard and worker selection.
- Updated worker flow for fixed-price/hourly applications and job status actions.
- Updated company help for Overview / Leads / Customers / Bookings and More tools.
- Changed the company help CTA from the legacy service-create route to /companies.
- Preserved FAQ JSON-LD, canonical metadata, OpenGraph/Twitter and the existing FAQ accordion.
- No DB, schema, RLS, sitemap or SEO architecture changes.

QA:
1. npm run typecheck
2. npm run build
3. Open /faq with sv, en, uk, ru and pl locales.
4. Check the three audience CTAs and FAQ accordion categories.
