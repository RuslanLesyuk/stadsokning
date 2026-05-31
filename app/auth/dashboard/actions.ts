"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

function enc(message: string) {
  return encodeURIComponent(message)
}

export async function deleteJob(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?error=${enc("Увійдіть в систему")}`)

  const jobId = formData.get("jobId")?.toString()
  if (!jobId) redirect(`/dashboard?error=${enc("Невірний ID")}`)

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single()

  if (!job) redirect(`/dashboard?error=${enc("Оголошення не знайдено")}`)
  if (job.created_by !== user.id) redirect(`/dashboard?error=${enc("Немає прав")}`)
  if (job.assigned_to) redirect(`/dashboard?error=${enc("Не можна видалити вже взяте замовлення")}`)

  const { error } = await supabase.from("jobs").delete().eq("id", jobId)

  if (error) redirect(`/dashboard?error=${enc("Не вдалося видалити")}`)

  redirect(`/dashboard?success=${enc("Оголошення видалено")}`)
}

export async function duplicateJob(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?error=${enc("Увійдіть в систему")}`)

  const jobId = formData.get("jobId")?.toString()
  if (!jobId) redirect(`/dashboard?error=${enc("Невірний ID")}`)

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single()

  if (!job) redirect(`/dashboard?error=${enc("Оголошення не знайдено")}`)
  if (job.created_by !== user.id) redirect(`/dashboard?error=${enc("Немає прав")}`)

  const { data: inserted, error } = await supabase
    .from("jobs")
    .insert({
      title: `${job.title} (копія)`,
      description: job.description,
      city: job.city,
      address: job.address,
      budget: job.budget,
      job_type: job.job_type,
      property_type: job.property_type,
      scheduled_date: job.scheduled_date,
      scheduled_time: job.scheduled_time,
      created_by: user.id,
      assigned_to: null,
      status: "new",
    })
    .select("id")
    .single()

  if (error || !inserted) {
    redirect(`/dashboard?error=${enc("Не вдалося дублювати")}`)
  }

  redirect(`/jobs/${inserted.id}?success=${enc("Оголошення дубльовано")}`)
}