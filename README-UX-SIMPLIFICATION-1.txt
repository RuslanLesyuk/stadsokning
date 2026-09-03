CLEAN JOBS — UX SIMPLIFICATION 1: ENTRY & NAVIGATION

Scope
-----
1. Homepage now gives three plain-language entry paths:
   - need cleaning -> company directory
   - looking for cleaning work -> jobs
   - run a cleaning company -> company directory / claim path
2. Desktop header removes Services, Create Job and My Services from the primary navigation.
3. Mobile menu is reduced to the core public paths plus My activity, My bookings and Company workspace when relevant.
4. Login and signup now preserve a safe internal ?next=... destination for password auth, Google OAuth and cross-links between login/signup.
5. Internal label "SEO guides" is replaced by user-facing "Guides" wording.

Not changed
-----------
- Database schema
- Job workflow/status logic
- Company workspace internals
- Services routes (still available; only removed from primary navigation)
- SEO URL/indexing/canonical/sitemap architecture

QA gate
-------
npm run typecheck && npm run build

Then runtime-check:
- / homepage shows all 3 entry choices in sv/en/uk/ru/pl
- desktop header has jobs + companies + account/company entry only
- mobile menu is simplified
- /login?next=/jobs/create returns to /jobs/create after auth
- /signup?next=/jobs/create preserves next through login/signup link and Google callback
- malicious next such as //example.com falls back to /dashboard
