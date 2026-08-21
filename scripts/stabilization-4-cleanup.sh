#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

FILES=(
  "app/actions/middleware.ts"
  "components/breadcrumb-json-ld.tsx"
  "components/chat-thread-client.tsx"
  "components/companies/[slug]/page.tsx"
  "components/dashboard-owner-actions.tsx"
  "components/job-status-form.tsx"
  "components/profile-edit-form.tsx"
  "components/review-form.tsx"
  "components/reviews/actions.ts"
  "components/reviews-list.tsx"
  "components/service-json-ld.tsx"
  "components/status-action-button.tsx"
  "components/ui/button.tsx"
  "components/user-rating-badge.tsx"
  "lib/email-enrichment/index.ts"
  "lib/seo/context.ts"
  "lib/seo/internal-links.ts"
  "lib/supabase-browser.ts"
  "lib/user-rating.ts"
)

removed=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    rm -f "$file"
    echo "removed: $file"
    removed=$((removed + 1))
  fi
done

# Supabase CLI keeps the local project link in supabase/.temp. Keep it locally,
# but do not commit the generated CLI state.
if [ -f .gitignore ]; then
  if ! grep -qxF 'supabase/.temp/' .gitignore; then
    printf '\n# Supabase CLI local state\nsupabase/.temp/\n' >> .gitignore
    echo "updated: .gitignore"
  fi
else
  printf '# Supabase CLI local state\nsupabase/.temp/\n' > .gitignore
  echo "created: .gitignore"
fi

echo "Cleanup complete. Removed $removed legacy/dead source files."
