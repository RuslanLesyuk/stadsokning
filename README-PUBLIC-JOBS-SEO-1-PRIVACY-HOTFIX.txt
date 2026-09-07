# Clean Jobs — Public Jobs SEO 1.0 privacy hotfix

This hotfix fixes an RSC payload privacy leak found during local QA.

Observed before fix:
- visible public HTML: clean
- Next.js RSC/script payload: contained the full private job object
- exact address and internal participant IDs could therefore appear in raw HTML

Fix:
- anonymous visitors now use a dedicated Supabase select containing only
  public-safe job fields
- exact address is never selected for the anonymous render path
- created_by and assigned_to are never selected for the anonymous render path
- PublicJobView accepts a PublicJob type that cannot contain those private fields
- authenticated owner/worker workflow still uses the existing full Job query

No database migration.
No sitemap/index-gate changes.
No canonical/robots changes.

Required QA:
1. npm run typecheck
2. npm run build
3. rerun the Public Jobs SEO QA
4. rerun the raw HTML/RSC leak check

Expected:
- TOTAL OCCURRENCES: 0
- VISIBLE HTML: CLEAN
- RSC/SCRIPT PAYLOAD: CLEAN
- PUBLIC JOBS SEO QA: 9/9 GREEN
