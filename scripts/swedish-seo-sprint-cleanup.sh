#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="$ROOT/app/stadfirma-stockholm/page.tsx"

if [ -f "$TARGET" ]; then
  rm "$TARGET"
  echo "removed: app/stadfirma-stockholm/page.tsx"
else
  echo "already removed: app/stadfirma-stockholm/page.tsx"
fi

echo "Swedish SEO cleanup complete."
