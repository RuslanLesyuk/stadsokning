# Clean Jobs · SEO Recovery Pilot · Step 1

**Target:** `/home/owico/stadsokning2` — Next.js 16, current Git HEAD `946c95c` (2026-10-11).

**Status:** candidate patch, **not deployed, not compiled against your local dependencies**. This package modifies only one existing source file and adds two source files and one read-only QA script. Nothing in sitemap, robots, canonical, hreflang, metadata, SEO content generation, Step 7 matching, database or migrations is changed.

## Scope

- 12 Swedish `/seo/{city}/{service}` pages listed in `lib/seo/recovery-pilot.ts`. There are 12 GSC baseline controls, excluded from the whitelist.
- A service-specific Swedish buyer guide per six categories: hotell, industri, garage, restaurang, skola, butik. Text is practical, without invented local figures.
- Up to 4 public company cards in the city, pulled through **Supabase anonymous key + RLS**. If a company *explicitly lists* the requested service, it is prioritized and labelled accordingly. Otherwise cards are clearly labelled as companies in the same city whose specialization is **not verified**. If there are no matching public city listings, there is an honest empty state and a link to the directory.
- Original `SeoPage` is left unchanged. Only the Swedish SEO route imports/renders the additional component for whitelisted pages. Localized `/en`, `/uk`, `/ru`, `/pl` are untouched.

**Important:** The public companies lookup intentionally uses a no-cookie Supabase anon client, not `createClient()` from `lib/supabase-server.ts`, to avoid forcing cookie-dependent dynamic rendering during static page generation. `companies` RLS must be checked to confirm only publicly publishable rows are visible to `anon`.

## Install files (no commit and no deploy yet)

Move the ZIP to your Linux workstation; adjust the downloaded file path:

```bash
cd /home/owico/stadsokning2
unzip -o "$HOME/Downloads/clean-jobs-seo-recovery-pilot-step-1.zip" -d .

git diff -- 'app/seo/[city]/[service]/page.tsx'
git status --short
npm run typecheck
npm run build
```

If the build is GREEN, start the production-mode server in a terminal:

```bash
cd /home/owico/stadsokning2
npm run start
```

Then from another terminal:

```bash
cd /home/owico/stadsokning2
SEO_QA_BASE_URL=http://localhost:3000 node scripts/qa-seo-recovery-pilot.mjs
```

**Expected:** `RESULT: 6/6`, `STATUS: GREEN`. Review pilot pages visually and verify publicly rendered company profiles correspond to catalog data; if anon RLS blocks companies, the guide/links still work, but the data enrichment needs investigation before production.

Do **not** run `git add .`. Only after build, QA and manual review are GREEN, stage explicitly:

```bash
git add -- \
  'app/seo/[city]/[service]/page.tsx' \
  'components/seo-recovery-pilot.tsx' \
  'lib/seo/recovery-pilot.ts' \
  'scripts/qa-seo-recovery-pilot.mjs' \
  'SEO-PILOT-GSC-BASELINE.csv'
git diff --cached --stat
```

Do not commit/push until reviewed. **Do not roll back the entire repository.**

## Monitoring after a future reviewed deployment

Export GSC `/seo/` by URL for the pilot and controls 7/14/28 days after rollout, giving Google time to crawl. Compare **impressions and position by URL**, not just indexed URL count. Historical baselines are in `SEO-PILOT-GSC-BASELINE.csv`: 2026-07-28..2026-08-17 versus 2026-10-06..2026-10-26. Control pages have different baseline volumes, so this is a directional experiment, **not a randomized causal trial**. Log the actual Vercel deployment time to separate pre/post samples.

## Rollback of only pilot

After testing, restore original route and remove the newly added pilot files (only if they were introduced by this package and contain no subsequent work). `git restore -- 'app/seo/[city]/[service]/page.tsx'` would discard subsequent edits to that file, so inspect `git diff` and your commits first. Do not use `git reset --hard`.
