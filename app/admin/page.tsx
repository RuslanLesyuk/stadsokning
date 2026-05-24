import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin | Clean Jobs",
  description: "Clean Jobs admin moderation panel.",
}

type Job = {
  id: string
  title: string
  city: string | null
  status: string | null
  created_at: string
  created_by: string
  is_featured: boolean | null
  featured_until: string | null
}

type Profile = {
  id: string
  full_name: string | null
  city: string | null
  company_name: string | null
  is_premium: boolean | null
  verified: boolean | null
  created_at: string | null
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.")
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function formatDate(value: string | null) {
  if (!value) return "—"

  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin")