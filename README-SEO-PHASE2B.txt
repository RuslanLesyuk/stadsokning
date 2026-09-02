CLEAN JOBS — SEO RECOVERY 2.0 / PHASE 2B

Goal:
Use Phase 2A company enrichment as real marketplace evidence on retained SEO pages.

Files replaced:
- lib/seo/marketplace.ts
- lib/seo/page.tsx
- app/[seoSlug]/page.tsx

Behavior:
- Service pages NO LONGER fall back to random companies from the city.
- A service page only shows companies whose service_types contains the
  canonical detected service label.
- serviceMatchCount is an exact Supabase count, not "matches among first 24".
- totalCityCompanies remains an exact city count.
- Swedish clean landing pages show truthful "X of Y profiles" coverage.
- When a city has companies but no confirmed service match, the page says so
  and links to the general city directory instead of pretending companies match.
- stadfirma-* pages remain city-directory pages and can show city companies.
- No sitemap/indexing/canonical/hreflang changes in Phase 2B.
- No database migration.

Install:
  cd /home/owico/stadsokning2
  unzip -o ~/Downloads/clean-jobs-seo-phase2b.zip -d /home/owico/stadsokning2

QA:
  npm run typecheck && npm run build

Then runtime QA on:
- /hemstadning-stockholm
- /flyttstadning-stockholm
- /seo/solna/byggstadning
- /en/seo/stockholm/hemstadning

Expected:
- company cards on service pages are actual service_types matches only;
- counts are real database counts;
- no random city fallback;
- clean Swedish canonical behavior remains unchanged.
