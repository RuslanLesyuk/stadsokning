# Clean Jobs — Stabilization 1/4: Core / P0

This package contains the application-side part of the first stabilization block.
The canonical Supabase baseline migration was created, locally reset-tested, committed,
and separately marked as applied in the linked remote migration history before this package.

## Included

- Restores `x-current-path` in the active Next.js 16 root Proxy so standalone company sites and website previews are detected correctly.
- Preserves Stage 10 security headers and Supabase session refresh behaviour.
- Makes Swedish (`sv`) the single application default locale, aligned with canonical unprefixed SEO routes.
- Forces unprefixed `/seo/...` requests to use the Swedish shell even if an old language cookie exists.
- Makes the resolved locale visible to Server Components in the same request.
- Hardens locale redirect handling with the existing internal-redirect sanitizer.
- Adds explicit analytics consent before Microsoft Clarity or optional Google Analytics load.
- Adds a 180-day analytics-consent preference cookie and a settings/revocation flow.
- Keeps Vercel Analytics as the existing separate integration.
- Does not render the Clean Jobs analytics consent manager, Clarity, or Google Analytics on standalone company websites.
- Updates `/cookies` and `/privacy` to match the actual analytics behaviour.

## Environment

Optional:

```env
NEXT_PUBLIC_CLARITY_ID=wzu4anu3qc
NEXT_PUBLIC_GA_ID=...
```

If `NEXT_PUBLIC_CLARITY_ID` is absent, the package preserves the currently configured Clarity project id.
If `NEXT_PUBLIC_GA_ID` is absent, Google Analytics is not loaded even after consent.

## No database command

There is no SQL in this ZIP. Do not run `db push` for this package.

## Validation after install

1. `rm -rf .next && npm run build`
2. First visit without the consent cookie: banner appears and Clarity/Google Analytics are not requested before consent.
3. Reject: analytics stays unloaded.
4. `/cookies` -> reopen settings -> allow: configured analytics loads.
5. `/site/[slug]`: no Clean Jobs header/footer/consent banner.
6. `/seo/[city]/[service]` first visit: Swedish shell.
7. Login/logout/session regression smoke test.
