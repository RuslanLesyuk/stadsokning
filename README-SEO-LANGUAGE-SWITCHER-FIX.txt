Clean Jobs — SEO language switcher fix

Problem:
Static SEO guide and clean landing URLs were request-scoped to a forced
English/Swedish locale on every request. The language switcher correctly
wrote clean_jobs_locale, but the proxy immediately replaced it again.

Fix:
- Prefix-localized SEO routes keep strict URL language.
- Static guides and clean landing pages use their canonical default language
  until the visitor explicitly chooses a language.
- After the user has chosen a language, clean_jobs_locale is respected on
  those non-prefixed pages.
- No sitemap, canonical, indexing, Supabase, DB, RLS or route changes.

Expected:
On /best-cleaning-companies-in-sweden:
- first canonical/default request remains English;
- selecting Svenska/Українська/etc. changes the visible site/page language;
- the language button reflects the chosen language.

On /en/seo/... and other prefix-localized SEO routes:
- URL language remains authoritative.
