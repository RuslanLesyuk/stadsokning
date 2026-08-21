import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
let failures = 0
let warnings = 0

function ok(message) {
  console.log(`✓ ${message}`)
}
function fail(message) {
  failures += 1
  console.error(`✗ ${message}`)
}
function warn(message) {
  warnings += 1
  console.warn(`! ${message}`)
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel))
}
function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8")
}

console.log("Clean Jobs — final technical preflight\n")

const requiredFiles = [
  "proxy.ts",
  "lib/supabase-proxy.ts",
  "lib/database.types.ts",
  "supabase/migrations/20260818060000_clean_jobs_baseline.sql",
  "supabase/migrations/20260820090000_security_data_integrity.sql",
  "supabase/migrations/20260820210000_performance_scale.sql",
]
for (const file of requiredFiles) {
  exists(file) ? ok(file) : fail(`Missing ${file}`)
}

const removedLegacy = [
  "app/actions/middleware.ts",
  "components/companies/[slug]/page.tsx",
  "components/dashboard-owner-actions.tsx",
  "components/job-status-form.tsx",
  "components/status-action-button.tsx",
  "components/reviews/actions.ts",
]
for (const file of removedLegacy) {
  !exists(file) ? ok(`legacy removed: ${file}`) : fail(`Legacy file still present: ${file}`)
}

if (exists("lib/database.types.ts")) {
  const types = read("lib/database.types.ts")
  const requiredTypeMarkers = [
    "company_quote_requests",
    "company_bookings",
    "company_crm_customers",
    "get_header_snapshot",
    "get_company_dashboard_metrics",
    "search_company_directory",
  ]
  for (const marker of requiredTypeMarkers) {
    types.includes(marker)
      ? ok(`database types include ${marker}`)
      : fail(`database types missing ${marker}`)
  }
}

if (exists(".gitignore")) {
  read(".gitignore").split(/\r?\n/).includes("supabase/.temp/")
    ? ok("Supabase CLI .temp ignored")
    : warn("Add supabase/.temp/ to .gitignore")
}

if (exists("package.json")) {
  const pkg = JSON.parse(read("package.json"))
  const scripts = pkg.scripts || {}
  for (const name of ["build", "typecheck", "check", "db:types", "preflight"]) {
    scripts[name] ? ok(`npm script: ${name}`) : fail(`Missing npm script: ${name}`)
  }
}

function parseEnvFile(rel) {
  if (!exists(rel)) return null
  const out = new Map()
  for (const rawLine of read(rel).split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    out.set(match[1], value)
  }
  return out
}

const env = parseEnvFile(".env.local")
if (!env) {
  warn(".env.local not found; production configuration was not validated")
} else {
  const requiredEnv = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PREMIUM_MONTHLY_PRICE_ID",
    "STRIPE_PREMIUM_YEARLY_PRICE_ID",
    "RESEND_API_KEY",
    "ADMIN_EMAILS",
  ]
  for (const name of requiredEnv) {
    env.get(name)?.trim() ? ok(`env configured: ${name}`) : fail(`Missing env: ${name}`)
  }

  const legalEnv = [
    "NEXT_PUBLIC_LEGAL_ENTITY_NAME",
    "NEXT_PUBLIC_LEGAL_ORG_NUMBER",
    "NEXT_PUBLIC_LEGAL_POSTAL_ADDRESS",
    "NEXT_PUBLIC_SUPPORT_EMAIL",
    "NEXT_PUBLIC_PRIVACY_EMAIL",
  ]
  for (const name of legalEnv) {
    env.get(name)?.trim() ? ok(`legal env configured: ${name}`) : warn(`Production legal env missing: ${name}`)
  }

  if (!env.get("SECURITY_RATE_LIMIT_SECRET")?.trim()) {
    warn("SECURITY_RATE_LIMIT_SECRET is not explicitly configured (service-role fallback will be used)")
  }

  if (env.get("ENABLE_EMAIL_TEST_ROUTE") === "true") {
    warn("ENABLE_EMAIL_TEST_ROUTE=true; disable it for production")
  }
  if (env.get("OUTREACH_EMAIL_ENABLED") === "true") {
    warn("OUTREACH_EMAIL_ENABLED=true; keep only if the outreach compliance process is approved")
  }
  if (env.get("BANKID_PRODUCTION_READY") === "true") {
    warn("BANKID_PRODUCTION_READY=true; verify the real BankID provider configuration before release")
  }
}

console.log(`\nPreflight result: ${failures} failure(s), ${warnings} warning(s).`)
console.log("Manual production gates still required: rotate previously exposed secrets, verify Supabase redirect allow-list, and complete legal/outreach review before public monetized launch.")

if (failures > 0) process.exit(1)
