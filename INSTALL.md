# Clean Jobs — Lead Generation 2.0 (Block 4/10)

This package upgrades customer quote requests (`company_quote_requests`).
It does **not** merge or replace the separate outreach CRM table `company_leads`.

## 1. Backup

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Lead Generation 2.0"
```

## 2. Extract the ZIP into the project root

```bash
unzip -o ~/Downloads/clean-jobs-lead-generation-2-FLAT.zip -d /home/owico/stadsokning2
```

## 3. Run SQL

Open and run the complete migration in Supabase SQL Editor:

```text
supabase/migrations/20260809_lead_generation_2.sql
```

Run the whole file from `begin;` through `commit;`.

## 4. Build

```bash
cd /home/owico/stadsokning2
rm -rf .next
npm run build
```

## 5. Test

1. Submit a quote request from `/companies/[slug]`.
2. Submit a quote request from `/site/[slug]`.
3. Verify source is `company_profile` vs `company_site`.
4. Verify notification links directly to `/dashboard/company-leads/[id]`.
5. Open the lead and verify `new -> viewed` automatically.
6. Change status through: viewed/contacted/qualified/quoted/won/lost/archived.
7. Save priority, score, estimated value, quoted value, follow-up, notes, and lost reason.
8. Verify activity timeline receives events.
9. Verify header new-lead counter drops after opening the lead.
10. Verify `/admin/customer-leads` shows all customer leads to admins.
11. Run `npm run build` again after testing if any local edits were made.

## Added functionality

- 8-stage customer lead pipeline.
- Priority: low / normal / high / urgent.
- Source tracking: company profile / company website / marketplace / manual / admin / SEO / Google / other.
- Lead type: direct / marketplace / distributed.
- First-view timestamp and viewer.
- Internal notes.
- Lead score 0–100.
- Estimated value and quoted value.
- Lost reason.
- Follow-up datetime.
- Activity timeline.
- Customer lead dashboard filters/search/sorting/stats.
- Admin cross-company customer lead view.
- Commercial foundation: lead access, paid flag, lead price, unlock time.
- Existing `company_leads` outreach CRM remains untouched.

## Important

The package intentionally does not yet charge for or lock customer leads. It only introduces the data model needed for the later Premium / monetization block.
