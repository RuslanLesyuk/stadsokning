CLEAN JOBS — SEO RECOVERY / PHASE 3C
Final authority + internal-linking quality pass

Goal
----
Close the SEO recovery plan without expanding URL inventory or changing the
indexing architecture.

Files
-----
NEW:
- lib/seo/company-links.ts

UPDATED:
- app/companies/[slug]/page.tsx
- app/[seoSlug]/page.tsx

What changes
------------
1. Company profile -> canonical SEO page links
   Company profiles now expose contextual links for services that are actually
   registered in service_types and only when the corresponding SEO page is
   indexable for the current locale.

   This completes the internal-link graph:
     city/service SEO page -> company profile -> relevant city/service SEO page

   No links are created to weak/noindex combinations.

2. Better related-company relevance
   Related company profiles are selected in this order:
   - same city + overlapping registered service_types;
   - same city;
   - global fallback only if fewer than three results exist.

   This reduces unrelated cross-site internal links while preserving the
   existing 3-card fallback behavior.

3. Clean-landing duplicate-content cleanup
   The final Clean Jobs block that repeated the exact hero intro is removed.
   The useful Phase 3A methodology, Phase 3B guide, FAQ, company cards and
   contextual internal links remain unchanged.

Safety boundaries
-----------------
- No new URLs.
- No sitemap changes.
- No index/noindex changes.
- No canonical/hreflang changes.
- No database migration or writes.
- No price/RUT/service inference.
- No new structured-data types.

Install
-------
cd /home/owico/stadsokning2
unzip -o ~/Downloads/clean-jobs-seo-phase3c.zip -d /home/owico/stadsokning2
npm run typecheck && npm run build

Do not use `git add .` later. Use targeted git add after runtime QA.
