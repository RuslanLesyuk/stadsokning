# Clean Jobs — Global Navigation Loading

## What this adds

- A global delayed spinner for internal page navigation.
- The spinner appears only when a route transition takes longer than 140 ms, so fast navigation does not flash.
- It works automatically for Next.js `<Link>` and normal same-origin `<a>` navigation across the site.
- External links, new-tab links, downloads, modifier-clicks, hash links and same-page links are ignored.
- Query-string route changes are supported.
- The loader stops automatically when the App Router URL changes.
- A 12-second safety timeout prevents a stuck loader if navigation is cancelled.
- Browser back/forward and bfcache restoration clear the loader.
- The loading label follows the current site language: sv/en/uk/ru/pl.
- Existing page skeletons remain untouched and can take over after navigation starts.
- Shared form submit buttons and Google OAuth submit button now show an inline spinning ring while their server action is pending.

## Files

- app/layout.tsx
- app/globals.css
- components/navigation-loading.tsx
- components/form-submit-button.tsx
- components/auth/oauth-submit-button.tsx

## Safety

- No database changes.
- No Supabase/RLS changes.
- No route changes.
- No SEO/indexing/canonical/sitemap changes.
- Existing loading.tsx skeletons are preserved.
- Non-navigation buttons such as accordions, filter toggles and menus do not trigger the global page loader.

## Opt-out

If a future internal link should not trigger the page loader, add:

data-no-navigation-loading

to the link or one of its ancestor elements.

## QA

1. npm run typecheck
2. npm run build
3. Click several internal links on local dev/production.
4. Confirm very fast transitions do not visibly flash.
5. Confirm slower transitions show the centered spinner.
6. Confirm external links, hash links and menu-only buttons do not show it.
7. Submit a form using FormSubmitButton and confirm the inline spinner appears.
