CLEAN JOBS — SEO QUALITY / PHASE 3B
===================================

Scope
-----
Phase 3B strengthens visible Swedish content on the 20 strongest clean
city × service landing pages:

Cities:
- Stockholm
- Göteborg
- Malmö
- Uppsala
- Västerås

Services:
- Hemstädning
- Flyttstädning
- Kontorsstädning
- Fönsterputs

What changes
------------
1. Adds a service-specific decision guide to each of the 20 target pages.
2. Adds a data-driven catalogue paragraph using the real Phase 3A snapshot:
   service matches, city profiles, contact coverage, RUT coverage and verified
   coverage when present.
3. Adds service-specific comparison checklists.
4. Adds factual guidance about what can affect an offer/quote without inventing
   prices or market averages.
5. Adds three service-specific FAQ items on target pages.
6. Makes it explicit that missing information must be confirmed with the company.

Safety / SEO boundaries
-----------------------
- No new URLs.
- No sitemap changes.
- No index/noindex changes.
- No canonical or hreflang changes.
- No database migration.
- No fabricated prices.
- No fabricated demand, popularity, neighbourhood, population or market claims.
- No claim that a service is included unless the company profile carries it.
- RUT wording describes profile information only and tells the user to confirm
  current conditions with the company / applicable Skatteverket rules.
- Pages outside the 20 target combinations keep their Phase 3A content.

Files
-----
NEW:
- lib/seo/content-quality.ts

UPDATED:
- app/[seoSlug]/page.tsx

Install
-------
cd /home/owico/stadsokning2
unzip -o ~/Downloads/clean-jobs-seo-phase3b.zip -d /home/owico/stadsokning2
npm run typecheck && npm run build

Initial QA gate
---------------
Both typecheck and build must be green before runtime QA.
