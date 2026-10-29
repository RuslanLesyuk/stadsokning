/**
 * Read-only runtime QA against a locally running Next.js server.
 * Usage: SEO_QA_BASE_URL=http://localhost:3000 node scripts/qa-seo-recovery-pilot.mjs
 */
const base = (process.env.SEO_QA_BASE_URL || "http://localhost:3000").replace(/\/$/, "")
const checks = [
  ["PILOT hotel Stockholm", "/seo/stockholm/hotellstadning", true],
  ["PILOT garage Lund", "/seo/lund/garage-stadning", true],
  ["PILOT shop Malmö", "/seo/malmo/butiksstadning", true],
  ["CONTROL hotel Göteborg", "/seo/goteborg/hotellstadning", false],
  ["CONTROL garage Ekerö", "/seo/ekero/garage-stadning", false],
  ["LOCALIZED English unchanged", "/en/seo/stockholm/hotellstadning", false],
]

let passed = 0
for (const [name, path, expectedPilot] of checks) {
  try {
    const res = await fetch(base + path, { redirect: "manual" })
    const html = await res.text()
    const marker = html.includes('data-seo-recovery-pilot="true"')
    const canonical = html.includes(`rel="canonical" href="https://cleansjob.com${path}"`)
    const robots = /<meta[^>]*name="robots"[^>]*content="index, follow"/i.test(html)
    const ok = res.status === 200 && marker === expectedPilot && canonical && robots
    if (ok) passed++
    console.log(`${ok ? "GREEN" : "FAILED"} ${name}: HTTP ${res.status}; pilot=${marker}; canonical=${canonical}; index=${robots}`)
  } catch (error) {
    console.log(`FAILED ${name}: ${error.message}`)
  }
}
console.log(`RESULT: ${passed}/${checks.length}`)
console.log(`STATUS: ${passed === checks.length ? "GREEN" : "FAILED"}`)
process.exitCode = passed === checks.length ? 0 : 1
