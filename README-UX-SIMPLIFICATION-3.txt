CLEAN JOBS — UX SIMPLIFICATION 3
Job workflow: create → apply → choose worker → chat → start → complete → review

Files changed:
- app/jobs/create/page.tsx
- app/jobs/[id]/page.tsx
- app/jobs/[id]/chat/page.tsx
- components/create-job-wizard.tsx (new)
- components/take-job-form.tsx
- components/job-applications-section.tsx
- components/job-status-actions.tsx

Main UX changes
1. Creating a job is now a 4-step wizard instead of one long form.
   Step 1: cleaning type + short title.
   Step 2: city/location + optional property/address.
   Step 3: optional date/time/budget.
   Step 4: description + review before publishing.
   The existing database payload and job creation workflow are preserved.

2. Job details now have one clear "Next step" panel based on role and job status.
   Owner:
   - published/no applications → wait or edit details
   - pending applications → jump to worker selection
   - assigned → open chat
   - in progress → use chat if needed
   - done → leave review
   - cancelled → option to reopen

   Worker:
   - open job → send application
   - pending → wait for customer
   - assigned → chat + start job
   - in progress → chat + mark done
   - done → leave review

3. Secondary controls are moved under "More actions".
   Edit/delete/save/report no longer compete visually with the next required action.

4. Applying for a job is simpler.
   - choose fixed price OR hourly rate, not two visible price inputs at once
   - short message stays visible
   - estimated hours and availability move under optional details
   - accepted application gives direct "Open chat" action
   - rejected/withdrawn application gives direct "Find more jobs" action

5. Application selection is clearer.
   - owner section is named "Choose a worker" / "Välj utförare"
   - main button is "Choose this worker" / "Välj som utförare"
   - confirmation before choosing
   - after selection, direct link to chat
   - localized success toasts

6. Worker can start/finish the job directly from the chat.
   The chat shows a clear next-step panel for assigned/in-progress workers.

7. Completion now has an explicit confirmation explaining that the chat becomes read-only.
   Job status success toasts are localized.

8. Raw internal values such as home_cleaning/apartment are converted to human-readable labels on job details.

Not changed
- No database migration.
- No schema changes.
- No SEO/indexing/sitemap changes.
- No changes to accept_job_application RPC.
- No changes to dashboard action authorization rules.
- No changes to review storage.
- No changes to message storage/read rules.
- Existing status workflow remains: new → assigned → in_progress → done, with owner cancellation/reopen rules preserved.

Recommended validation after unzip
1. npm run typecheck
2. npm run build
3. Runtime workflow QA using test owner + test worker accounts before production deploy.
