CLEAN JOBS — STEP 8/12: CUSTOMER ACQUISITION LANDING

Scope
-----
Replaces only:
  app/hire-cleaner-stockholm/page.tsx

Why only one product file
-------------------------
The existing global AcquisitionTracker already:
- captures landing attribution from the initial URL/referrer after consent
- tracks create_job_click for links to /jobs/create
- tracks job_published after a successful job creation

The existing create-job flow already persists:
- acquisition_source
- acquisition_medium
- acquisition_campaign
- acquisition_content
- acquisition_term
- acquisition_referrer
- acquisition_landing_page

Therefore Step 8 does NOT need:
- a new database migration
- a second tracking system
- a new landing route
- changes to the job creation architecture

Landing behavior
----------------
Primary CTA:
  /jobs/create

If anonymous, the existing create-job page redirects to:
  /login?next=/jobs/create

The existing login/signup OAuth flow preserves the internal next path.

Secondary CTA:
  /companies?city=Stockholm

Content
-------
- Stockholm-first customer acquisition hero
- free job-posting offer
- marketplace value proposition
- 3-step process
- home / office / flexible use cases
- comparison / control messaging
- FAQ
- final CTA
- existing RelatedGuides preserved
- sv/en/uk/ru/pl locale copy
- canonical + OpenGraph + Twitter metadata
- FAQPage JSON-LD

No invented:
- ratings
- review counts
- response-time promises
- prices
- RUT claims
- provider counts

LOCAL QA
--------
1. npm run typecheck
2. npm run build
3. npm run dev
4. Open:
   http://localhost:3000/hire-cleaner-stockholm

Check:
- hero renders
- primary CTA -> /jobs/create
- secondary CTA -> /companies?city=Stockholm
- sections render on desktop/mobile
- FAQ visible
- RelatedGuides still present
- switch sv/en/uk/ru/pl and confirm copy changes

Attribution smoke test (only if analytics consent is granted):
Open:
  http://localhost:3000/hire-cleaner-stockholm?utm_source=qa&utm_medium=cpc&utm_campaign=step8

Click the primary CTA.
The existing AcquisitionTracker should record create_job_click from_path=/hire-cleaner-stockholm.
The acquisition cookie should remain available to the create-job flow.

GIT
---
Stage only:
  app/hire-cleaner-stockholm/page.tsx
  README-CUSTOMER-ACQUISITION-STEP-8.txt

Do not stage generated/unrelated files.
