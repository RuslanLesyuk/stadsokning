# Clean Jobs — Mass Import 1/4

This package upgrades the existing Excel-only lead importer into a scalable staging pipeline for Swedish cleaning companies.

## What changes

- XLSX and CSV support.
- Up to 5,000 rows per import batch, 3 MB file limit.
- Adds `company_import_batches` for auditable import history.
- Adds canonical import fields to `company_leads`: organisation number, address, postal code, normalized name/city/email/phone, website domain, data quality score, batch metadata and fingerprint.
- Database-side normalization and deduplication.
- Existing CRM rows are backfilled with normalized values.
- Duplicate matching priority: organisation number → website domain → email → phone + name/city → company name + city.
- Existing records are never overwritten destructively; missing fields are filled only.
- Import does **not** send invitations.
- Import does **not** create public `companies` records. Publication is Mass Import 2/4.

## Required import columns

`company_name` / `Företagsnamn` is required.

At least one identity signal is also required:
- `organization_number`
- `website`
- `email`
- `phone`

Recommended additional columns: `city`, `address`, `postal_code`, `source`, `notes`.

## Installation

Unzip the package into the Clean Jobs repository root. Then run a local database reset so the new migration is applied from scratch, followed by typecheck/build.

After local QA, push the migration to the linked Supabase project and regenerate database types.

## Upload limit

The package sets Next.js Server Actions to a 4 MB request-body limit while the importer itself accepts at most 3 MB per file. This keeps multipart overhead below the hosting request ceiling while still allowing thousands of normal company rows per batch.
