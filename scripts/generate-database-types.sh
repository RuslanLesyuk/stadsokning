#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

mkdir -p lib
TMP_FILE="lib/database.types.ts.tmp"

cleanup() {
  rm -f "$TMP_FILE"
}
trap cleanup EXIT

echo "Generating Supabase database types from the linked project..."
npx supabase gen types typescript --linked > "$TMP_FILE"

if ! grep -q "export type Database" "$TMP_FILE"; then
  echo "Generated output does not look like Supabase TypeScript types."
  exit 1
fi

mv "$TMP_FILE" lib/database.types.ts
trap - EXIT

echo "Updated lib/database.types.ts"
