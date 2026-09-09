# Clean Jobs — Step 7/12: Job Notifications / Matching

This package adds real job matching and delivery controls on top of the
existing Clean Jobs notification centre and Resend integration.

## Source audit

The collector showed:

- existing `notifications` table + notification bell/centre
- existing Resend email delivery
- 19 profiles
- 4 service profiles
- 1 current job
- service profiles already carry `city`, `service_areas`, `service_types`, `user_id`
- no dedicated job-match preference table existed
- job creation currently emailed only the job owner

The new implementation reuses those existing systems instead of creating a
second notification UI.

## Matching model

A new quality job is eligible for matching only when it passes the SAME
`evaluatePublicJobSeo()` quality gate used by public job SEO.

This deliberately prevents thin/suspicious jobs from generating notification
bursts.

Recipients come from two sources:

1. explicit `job_match_preferences`
2. owned `service_profiles` when no explicit preference exists

A service-profile owner therefore gets useful in-app matching immediately
without being automatically opted into email.

Explicit preferences override the implicit service-profile behavior.

## Match rules

City:
- exact normalized city/service-area match
- Swedish accents are normalized (`Göteborg` / `Goteborg`, etc.)

Job type:
- `home_cleaning`
- `office_cleaning`

Known free-form service labels are normalized into those two job types.
A generic service profile with no recognizable service type falls back to both.

Job owner is always excluded.

Maximum recipients per job: 50.

## Channels

### In-app
Default for service-profile matching.

Creates a normal `notifications` row:
- type: `job_match`
- href: `/jobs/<id>`
- dedupe key: `job_match:<jobId>:<userId>`

The existing notification bell and `/notifications` page display it.

### Email
OFF by default.

A user must explicitly enable email matching in `/profile`.

Email uses the existing Resend integration and includes a link back to the
profile matching settings.

## Delivery audit / dedupe

New table:
- `job_match_deliveries`

Unique key:
- `(job_id, user_id, channel)`

Statuses:
- `pending`
- `sent`
- `failed`

This prevents duplicate delivery attempts for the same job/user/channel and
makes failed delivery observable.

## Preferences

New table:
- `job_match_preferences`

Fields:
- enabled
- in_app_enabled
- email_enabled
- cities[]
- job_types[]

Users can edit only their own preferences through RLS.

`job_match_deliveries` is service-role only.

## Profile UI

`/profile` receives a new "Job matching" section with:
- master enable/disable
- cities/areas
- home cleaning
- office cleaning
- in-app notification toggle
- email notification toggle

If the user has a service profile but no explicit preferences, the form shows
the effective service-profile-based matching settings.

## Failure behavior

Job creation NEVER fails because matching/email delivery fails.

Downstream matching errors are logged and the successfully created job remains
published.

## Files

New:
- `supabase/migrations/20260909070000_job_matching_notifications.sql`
- `lib/job-matching.ts`
- `app/profile/matching-actions.ts`
- `components/job-match-preferences-form.tsx`
- `README-JOB-MATCHING-STEP-7.txt`

Updated:
- `app/jobs/create/page.tsx`
- `app/jobs/actions.ts`
- `app/profile/page.tsx`
- `components/notifications-center.tsx`

## Database workflow

Because this step adds tables, run the normal Clean Jobs DB workflow BEFORE
typecheck/build:

1. `npx supabase db reset`
2. `npx supabase db push`
3. `npm run db:types`
4. `npm run typecheck`
5. `npm run build`

Then runtime QA.

## Git safety

Do NOT use `git add .`.

The collector still showed unrelated modified/generated files including:
- `lib/database.types.ts`
- `next-env.d.ts`
- `tsconfig.tsbuildinfo`
- `supabase/.temp/*`
- historical context/report files

`lib/database.types.ts` will change again after `npm run db:types`; inspect and
stage it only as part of this migration after confirming the generated diff
contains the new Step 7 tables.
