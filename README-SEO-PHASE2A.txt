CLEAN JOBS — SEO RECOVERY 2.0 / PHASE 2A
Public company website enrichment

Цей ZIP НЕ змінює існуючі Next.js сторінки і НЕ потребує міграції БД.

Додається:
  scripts/seo-company-enrichment.mjs

Що робить:
- сканує тільки public company profiles з website;
- за замовчуванням SKIP:
  - claimed profiles;
  - profiles з owner_id;
  - verified profiles;
- не переписує існуючі service_types, service_areas або description;
- rut_available змінює тільки false -> true, і тільки якщо на сайті знайдено явний RUT evidence;
- hourly_rate НІКОЛИ не змінює;
- не копіює текст із сайту;
- description створюється як короткий factual summary з назви компанії, міста і реально знайдених service keywords;
- поважає robots.txt Disallow у простій безпечній формі;
- блокує localhost/private IP;
- обмежує кількість сторінок, timeout і concurrency;
- завжди створює JSON + CSV audit report.

ГОЛОВНЕ:
Dry-run є режимом за замовчуванням.
Без --apply база НЕ змінюється.

1. Розпакувати:
   cd /home/owico/stadsokning2
   unzip -o ~/Downloads/clean-jobs-seo-phase2a.zip -d /home/owico/stadsokning2

2. Self-test:
   node scripts/seo-company-enrichment.mjs --self-test

   Очікування:
   SELF-TEST: PASS

3. Перший QA dry-run — Stockholm, 25 profiles:
   node --env-file=.env.local scripts/seo-company-enrichment.mjs \
     --city=Stockholm \
     --limit=25

   Наприкінці буде SUMMARY + шляхи JSON/CSV.
   НІЧОГО в БД не записується.

4. Після перевірки dry-run можна застосувати той самий scope:
   node --env-file=.env.local scripts/seo-company-enrichment.mjs \
     --city=Stockholm \
     --limit=25 \
     --apply \
     --confirm=SEO_COMPANY_ENRICHMENT

5. Після Stockholm можна зробити dry-run ширше:
   node --env-file=.env.local scripts/seo-company-enrichment.mjs \
     --limit=250 \
     --concurrency=3

6. І лише після QA застосувати:
   node --env-file=.env.local scripts/seo-company-enrichment.mjs \
     --limit=250 \
     --concurrency=3 \
     --apply \
     --confirm=SEO_COMPANY_ENRICHMENT

REPORTS:
  tmp/seo-company-enrichment/*.json
  tmp/seo-company-enrichment/*.csv

ПОЛЯ, ЯКІ МОЖУТЬ БУТИ ЗАПОВНЕНІ:
- service_types: тільки якщо зараз порожній масив;
- service_areas: тільки якщо зараз порожній масив і сайт явно пов'язує company city із service area;
- description: тільки якщо зараз порожній;
- rut_available: тільки false -> true за явним evidence.

ПОЛЯ, ЯКІ НЕ ЧІПАЄМО:
- hourly_rate
- owner_id
- claimed_at
- verified
- organization_number
- contact fields
- user-authored existing descriptions/services

ПРИМІТКА:
Phase 2A навмисно консервативний. Краще пропустити частину даних,
ніж додати вигадані service matches. Після першого 25-company QA
можна безпечно масштабувати.


V2 QA HARDENING
- Minimum accepted service score is now 30.
- Weak one-off mentions such as scores 4, 6, 8, 10, 12, 16, 20, 24, 26
  are not written to service_types.
- Descriptions list at most six detected services and use "bland annat"
  when more services are confidently detected.
- RUT and service-area logic is unchanged.

Після оновлення повторити ТІЛЬКИ dry-run Stockholm перед apply:
  node --env-file=.env.local scripts/seo-company-enrichment.mjs     --city=Stockholm     --limit=25
