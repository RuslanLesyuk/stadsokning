
export const CRM_CUSTOMER_STAGES = [
  "prospect",
  "customer",
  "vip",
  "inactive",
] as const

export type CrmCustomerStage = (typeof CRM_CUSTOMER_STAGES)[number]

export type CompanyCrmCustomer = {
  id: string
  company_id: string
  user_id: string | null
  customer_name: string
  email: string
  normalized_email: string
  phone: string | null
  city: string | null
  lifecycle_stage: CrmCustomerStage
  tags: string[]
  owner_notes: string | null
  follow_up_at: string | null
  first_seen_at: string
  last_seen_at: string
  last_activity_at: string
  created_at: string
  updated_at: string
}
