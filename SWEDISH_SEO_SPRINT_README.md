
# Clean Jobs — Swedish SEO Sprint

This package focuses the existing SEO architecture on Swedish commercial search intent without rebuilding the marketplace.

## What changes

- Swedish metadata becomes deterministic on Swedish canonical URLs.
- Invalid hreflang references from cookie-localized `/companies`, `/services`, and Swedish landing pages are removed.
- `/services/stockholm` permanently redirects to `/services/city/stockholm`.
- The thin static `/stadfirma-stockholm` route is removed by the cleanup script so the richer generated Swedish landing page handles that slug.
- Swedish programmatic SEO is tiered: priority city/service combinations are prebuilt/indexable, while long-tail combinations remain available but use `noindex,follow`.
- The sitemap stops pushing all localized template combinations and focuses crawl budget on Swedish pages, city directories, companies, and service profiles.
- SEO-engine content gets service-specific Swedish sections for the eight highest-priority service categories.
- Related-city links prefer the same region and priority municipalities instead of always linking the first municipalities in the dataset.
- Duplicate Swedish core-service `/seo/{city}/{service}` URLs permanently redirect to the cleaner `/{service}-{city}` landing slugs when those pages exist.
- Programmatic `Service` structured data no longer claims Clean Jobs itself is the cleaning-service provider.
- FAQ remains visible to users, but FAQPage JSON-LD is removed from the SEO engine.
- SEO section arrays are rendered as real paragraphs instead of a single React array value.
- Swedish landing pages now show entries from the `companies` directory, which aligns them with the upcoming mass company import.
- `robots.txt` stops crawlers from spending crawl budget on admin/dashboard/API/auth/private routes.
- Static sitemap `lastModified` values are no longer set to "now" on every request.

## Install

1. Back up/commit the current green state.
2. Unzip this package over the project root.
3. Run:

```bash
bash scripts/swedish-seo-sprint-cleanup.sh
npm run typecheck
npm run build
```

There is no SQL migration in this package.

## Runtime checks after a green build

- `/`
- `/companies`
- `/companies/city/stockholm`
- `/services`
- `/services/city/stockholm`
- `/services/stockholm` must redirect to `/services/city/stockholm`
- `/stadfirma-stockholm` must render the richer generated landing page
- `/hemstadning-stockholm`
- `/seo/stockholm/hemstadning` must permanently redirect to `/hemstadning-stockholm`
- `/seo/stockholm/byggstadning` must render
- `/sitemap.xml`
- `/robots.txt`

## Search Console follow-up

After deployment, submit the sitemap again and inspect the priority Swedish URLs first. Do not request indexing for thousands of pages manually.
