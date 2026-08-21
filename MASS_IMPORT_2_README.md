# Clean Jobs — Mass Import 2/4

This package adds controlled publication from `company_leads` into the public `companies` directory.

## Guarantees

- `company_leads` and `companies` remain separate systems.
- Only records created through Mass Import (`import_batch_id IS NOT NULL`) are eligible.
- Publication requires a city and `data_quality_score >= 55`.
- Existing public companies are matched and linked rather than duplicated.
- Newly created companies are always `owner_id = NULL` and `verified = false`.
- Claim Company remains the only ownership path.
- No outreach email is sent by publication.
- Re-running publication is idempotent for already-linked leads.

## Matching order

1. Swedish organisation number
2. Website domain
3. Email
4. Phone + company/city signal
5. Normalized company name + city

## Install

```bash
unzip -o ~/Downloads/clean-jobs-mass-import-2-FLAT.zip -d /home/owico/stadsokning2
npx supabase db reset
```

After the local reset is green, push the migration, regenerate database types, then run typecheck/build.

## Runtime

Open `/admin/leads/publish`. Start with 10 companies. A batch-specific URL can be opened from the import success card.
