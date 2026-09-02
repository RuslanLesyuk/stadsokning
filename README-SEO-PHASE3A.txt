CLEAN JOBS — SEO QUALITY / PHASE 3A
===================================

Purpose
-------
Strengthen the retained SEO pages with real marketplace evidence, clearer
methodology, structured data, and stronger internal linking.

This phase DOES NOT expand the URL set and DOES NOT change:
- indexing policy
- sitemap composition
- canonical URL strategy
- hreflang strategy
- old Swedish redirects

Changes
-------
1. lib/seo/marketplace.ts
   - loads the complete current city company set once;
   - derives service matches from real service_types;
   - exposes real RUT/contact/verified/description evidence counts;
   - keeps the same city matching behavior that passed Phase 2 production QA;
   - still never fabricates prices.

2. NEW lib/seo/marketplace-schema.ts
   - emits ItemList structured data only for company cards actually rendered;
   - each item points to the real Clean Jobs company profile;
   - no synthetic ratings, prices, reviews, or LocalBusiness claims are added.

3. lib/seo/page.tsx
   - adds data-backed RUT/contact evidence metrics;
   - adds a visible methodology block explaining how service/RUT/price data is used;
   - adds ItemList JSON-LD for displayed companies;
   - preserves current service-match-only company selection.

4. app/[seoSlug]/page.tsx
   - adds real evidence cards on Swedish clean landing pages;
   - creates data-driven Swedish meta descriptions from actual company counts;
   - adds ItemList JSON-LD;
   - converts same-city service chips into real internal links;
   - separates same-city service links from same-service other-city links;
   - adds revalidate = 86400 so marketplace evidence can refresh daily.

5. lib/seo-landing-pages.ts
   - removes unsupported Swedish demand/market claims from rendered clean landings;
   - removes claims that users can compare prices when no prices are registered;
   - makes Swedish RUT/FAQ wording describe what Clean Jobs actually records.

Install
-------
cd /home/owico/stadsokning2

unzip -o ~/Downloads/clean-jobs-seo-phase3a.zip \
  -d /home/owico/stadsokning2

QA gate
-------
npm run typecheck && npm run build

Do not deploy before the QA gate is green.

After a green build, runtime QA should verify at minimum:
- /hemstadning-stockholm
- /flyttstadning-stockholm
- /kontorsstadning-goteborg
- /stadfirma-stockholm
- /seo/solna/byggstadning
- /en/seo/stockholm/hemstadning

Expected runtime behavior
-------------------------
- service pages show only companies with the exact registered service;
- evidence counters match the profiles used for the page;
- RUT/contact counts are visible and factual;
- no price is shown unless hourly_rate exists;
- ItemList JSON-LD includes only rendered company profile URLs;
- Swedish clean pages contain internal links to other services in the same city;
- canonical/lang/indexing behavior remains unchanged.


V2 QA correction
----------------
A final source review found that the previous archive still rendered legacy
city-demand/market assertions through introExtra on the Swedish clean landing
pages. Those assertions are now removed rather than merely documented as
removed. No route, canonical, indexing, sitemap, database or service-match
logic changed.
