# Clean Jobs — Website-as-a-Service MVP (Block 3/10)

This package adds a standalone company website system without duplicating company profile data.

## What is included

- `company_sites` database model + RLS
- draft / preview / published lifecycle
- public `/site/[slug]` website
- 3 templates: Modern / Minimal / Elegant
- primary + secondary brand colors
- 5-language website content
- selectable sections
- social links
- SEO title/description per language
- custom-domain fields and domain status foundation
- quote form reuses the existing `company_quote_requests` pipeline
- owner website dashboard `/dashboard/websites`
- owner editor `/dashboard/companies/[id]/website`
- owner preview `/dashboard/companies/[id]/website/preview`
- published website link from the marketplace company page
- Website link in desktop/mobile profile navigation
- standalone company sites do not show the Clean Jobs marketplace header/footer

## Important architecture

Company facts stay in `companies`:

- logo / cover / gallery
- phone / email / address
- services / prices / RUT
- service areas / languages
- working hours / FAQ
- reviews

`company_sites` stores only website-specific configuration:

- template / colors
- marketing copy
- visible sections
- SEO
- social links
- publication state
- future custom domain

This prevents profile data and website data from going out of sync.

---

## 1. Backup current work

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before Website-as-a-Service MVP"
```

## 2. Unzip into project root

```bash
unzip -o ~/Downloads/clean-jobs-website-as-a-service-mvp.zip -d /home/owico/stadsokning2
cd /home/owico/stadsokning2
```

## 3. Run SQL migration

Open Supabase SQL Editor and run the full file:

```text
supabase/migrations/20260809_company_sites.sql
```

Verification:

```sql
select
  column_name,
  data_type,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'company_sites'
order by ordinal_position;
```

Then:

```sql
select
  policyname,
  cmd,
  roles
from pg_policies
where schemaname = 'public'
  and tablename = 'company_sites'
order by policyname;
```

Expected policies:

- Public can read published company sites
- Company owners can create company sites
- Company owners can update company sites
- Company owners can delete company sites

## 4. Build

```bash
rm -rf .next
npm run build
```

If green:

```bash
npm run dev
```

## 5. Functional test

Log in with the owner account of your test company.

Open:

```text
http://localhost:3000/dashboard/websites
```

Choose the company → Create website.

Test:

1. Set site slug, e.g. `hemfrid`.
2. Choose `Modern`.
3. Set brand colors.
4. Keep Swedish enabled/default.
5. Fill Swedish hero title/subtitle.
6. Keep all sections enabled.
7. Click **Save and preview**.
8. Verify preview has no Clean Jobs marketplace header/footer.
9. Return to editor.
10. Click **Publish website**.
11. Open:

```text
http://localhost:3000/site/hemfrid
```

12. Submit the quote form from another account or incognito.
13. Verify the lead appears in:

```text
/dashboard/company-leads
```

14. Verify owner notification/email still works.
15. Open the marketplace profile `/companies/hemfrid-stockholm` and verify the new company website button appears.

## 6. Template test

Switch and preview all three:

- `modern`
- `minimal`
- `elegant`

## 7. Language test

Enable `sv`, `en`, `uk`, then test:

```text
/site/hemfrid?lang=sv
/site/hemfrid?lang=en
/site/hemfrid?lang=uk
```

## 8. Draft protection

Click **Unpublish**.

Public URL should no longer render the website, while owner preview must still work.

## 9. Custom domain foundation

Entering e.g.:

```text
example.se
```

stores the domain and sets `domain_status = pending`.

This block does NOT yet call Vercel Domain APIs or validate DNS. That is deliberately left for the custom-domain production extension so the MVP does not depend on external DNS automation.

## Notes

The package replaces `app/layout.tsx` to suppress the Clean Jobs marketplace chrome only for:

- `/site/*`
- `/dashboard/companies/*/website/preview`

The current middleware must continue setting `x-current-path`; the version you shared already does this.
