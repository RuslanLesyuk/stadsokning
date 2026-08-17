
# Clean Jobs — CRM Lite 8/10

Цей пакет додає CRM Lite поверх існуючих `company_quote_requests` і
`company_bookings`. Ліди та бронювання залишаються source of truth для
транзакцій; `company_crm_customers` зберігає тільки єдиний клієнтський профіль,
CRM metadata, tags, notes і follow-up.

## 1. Backup

```bash
cd /home/owico/stadsokning2
git add .
git commit -m "Before CRM Lite 8"
```

## 2. Розпакування

ZIP є flat package: `app/`, `components/`, `lib/`, `supabase/` лежать прямо в
корені архіву.

```bash
unzip -o ~/Downloads/clean-jobs-crm-lite-8-FLAT.zip \
  -d /home/owico/stadsokning2
```

## 3. Supabase migration

Відкрий:

```text
supabase/migrations/20260816_crm_lite.sql
```

У Supabase → SQL Editor → New query встав увесь файл від `begin;` до `commit;`
і натисни Run.

Очікуваний результат:

```text
Success. No rows returned
```

### Що робить migration

- створює `company_crm_customers`;
- створює `company_crm_customer_activity`;
- додає `crm_customer_id` до `company_quote_requests` та `company_bookings`;
- backfill існуючих клієнтів з lead/booking history;
- дедуплікація клієнта по `(company_id, lower(email))`;
- автоматично зв'язує нові leads/bookings з CRM customer;
- prospect автоматично переходить у customer після won lead або
  confirmed/in_progress/completed booking;
- VIP / inactive залишаються ручними CRM-статусами;
- підтягує початковий follow-up з відкритих leads;
- оновлює CRM recency при роботі з leads, bookings та recurring occurrences;
- RLS: CRM бачить і редагує тільки owner відповідної компанії;
- public quote request не може сам підставити `crm_customer_id` — linkage робить
  database trigger;
- історичні `updated_at`/`last_activity_at` lead/booking не переписуються під час
  CRM backfill.

## 4. Перевірка SQL

Після migration можна виконати:

```sql
select
  count(*) as crm_customers,
  count(*) filter (where lifecycle_stage = 'prospect') as prospects,
  count(*) filter (where lifecycle_stage in ('customer', 'vip')) as customers
from public.company_crm_customers;
```

І:

```sql
select
  (select count(*)
   from public.company_quote_requests
   where crm_customer_id is null
     and nullif(trim(customer_email), '') is not null) as unlinked_leads,

  (select count(*)
   from public.company_bookings
   where crm_customer_id is null
     and nullif(trim(customer_email), '') is not null) as unlinked_bookings;
```

Для валідних email очікується `0 / 0`.

## 5. Build

```bash
cd /home/owico/stadsokning2
rm -rf .next
npm run build
```

## 6. Runtime

```bash
npm run dev
```

Відкрий:

```text
http://localhost:3000/dashboard/company-customers
```

Перевір:

1. У Company Workspace з'явився пункт `Customers / Клієнти`.
2. Існуючі leads та bookings вже дали CRM customers.
3. Однаковий email у lead + booking не створює дубль.
4. Customer card показує lead count, booking count, completed count і value.
5. Customer detail показує:
   - contact;
   - lifecycle stage;
   - tags;
   - notes;
   - follow-up;
   - lead history;
   - booking history;
   - unified activity.
6. Зміни tags/notes/follow-up і натисни Save.
7. Відкрий lead detail — є кнопка Open customer.
8. Відкрий booking detail — є кнопка Open customer.
9. `/dashboard/company` показує customer count та due follow-ups.
10. Profile dropdown і mobile menu мають Company customers.

## Нові маршрути

```text
/dashboard/company-customers
/dashboard/company-customers/[id]
```

## MVP boundary

CRM не дублює leads/bookings і не переносить транзакції в окрему систему.
Customer identity = company + normalized email.

Email CRM-профілю навмисно не редагується у CRM form, щоб випадково не
розірвати історію lead/booking linkage. Якщо надалі потрібен merge/change-email
workflow, його можна додати окремим контрольованим action.
