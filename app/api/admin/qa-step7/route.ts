import { NextResponse } from "next/server"

import {
  getEffectiveJobMatchSettingsForUser,
  notifyMatchedUsersForJob,
  type MatchableJob,
} from "@/lib/job-matching"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Check = {
  label: string
  ok: boolean
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : String(error)
}

function futureDate(days = 14) {
  return new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .slice(0, 10)
}

export async function GET() {
  /*
   * Temporary production QA endpoint.
   * Only a logged-in Clean Jobs admin may execute it.
   */
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (
    authError ||
    !user?.email ||
    !getAdminEmails().includes(
      user.email.toLowerCase(),
    )
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    )
  }

  const admin = createAdminClient()

  const token = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`

  const homeCity = `Qa Home ${token}`
  const goteborgPreferenceCity =
    `Qa Goteborg ${token}`
  const goteborgJobCity =
    `Qa Göteborg ${token}`

  const ownerEmail =
    `qa-step7-owner-${token}@example.com`
  const recipientEmail =
    `qa-step7-recipient-${token}@example.com`

  const checks: Check[] = []
  const cleanupErrors: string[] = []

  const jobIds: string[] = []
  const userIds: string[] = []

  let ownerId: string | null = null
  let recipientId: string | null = null
  let fatalError: string | null = null

  function check(label: string, ok: boolean) {
    checks.push({ label, ok })
  }

  async function createJob({
    title,
    description,
    city,
    jobType,
    propertyType,
  }: {
    title: string
    description: string
    city: string
    jobType:
      | "home_cleaning"
      | "office_cleaning"
    propertyType: "apartment" | "office"
  }): Promise<MatchableJob> {
    if (!ownerId) {
      throw new Error("QA owner not created")
    }

    const { data, error } = await admin
      .from("jobs")
      .insert({
        title,
        description,
        city,
        address: null,
        budget: 1250,
        job_type: jobType,
        property_type: propertyType,
        scheduled_date: futureDate(),
        scheduled_time: "10:00",
        created_by: ownerId,
        assigned_to: null,
        status: "new",
      })
      .select(
        "id,title,description,city,budget,job_type,status,assigned_to,created_at,scheduled_date,created_by",
      )
      .single()

    if (error || !data) {
      throw new Error(
        `Create QA job failed: ${
          error?.message || "No row returned"
        }`,
      )
    }

    jobIds.push(data.id)

    return data as MatchableJob
  }

  try {
    // ------------------------------------------------
    // QA USERS
    // ------------------------------------------------

    const ownerCreate =
      await admin.auth.admin.createUser({
        email: ownerEmail,
        password: `Qa!${token}A1`,
        email_confirm: true,
        user_metadata: {
          full_name: "QA Step 7 Owner",
        },
      })

    if (
      ownerCreate.error ||
      !ownerCreate.data.user
    ) {
      throw new Error(
        `Create owner failed: ${
          ownerCreate.error?.message ||
          "No user returned"
        }`,
      )
    }

    ownerId = ownerCreate.data.user.id
    userIds.push(ownerId)

    const recipientCreate =
      await admin.auth.admin.createUser({
        email: recipientEmail,
        password: `Qa!${token}B2`,
        email_confirm: true,
        user_metadata: {
          full_name: "QA Step 7 Recipient",
        },
      })

    if (
      recipientCreate.error ||
      !recipientCreate.data.user
    ) {
      throw new Error(
        `Create recipient failed: ${
          recipientCreate.error?.message ||
          "No user returned"
        }`,
      )
    }

    recipientId = recipientCreate.data.user.id
    userIds.push(recipientId)

    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        [
          {
            id: ownerId,
            full_name: "QA Step 7 Owner",
            city: homeCity,
          },
          {
            id: recipientId,
            full_name: "QA Step 7 Recipient",
            city: homeCity,
          },
        ],
        { onConflict: "id" },
      )

    if (profileError) {
      throw new Error(
        `Create profiles failed: ${profileError.message}`,
      )
    }

    // ------------------------------------------------
    // IMPLICIT SERVICE PROFILE
    // ------------------------------------------------

    const { error: serviceError } = await admin
      .from("service_profiles")
      .insert({
        user_id: recipientId,
        company_name: `QA Cleaning ${token}`,
        slug: `qa-step7-${token}`,
        city: homeCity,
        service_areas: [homeCity],
        service_types: ["Hemstädning"],
        email: recipientEmail,
        verified: false,
      })

    if (serviceError) {
      throw new Error(
        `Create service profile failed: ${serviceError.message}`,
      )
    }

    // Owner intentionally also matches the job.
    // Own-job exclusion must override matching.

    const { error: ownerPreferenceError } =
      await admin
        .from("job_match_preferences")
        .insert({
          user_id: ownerId,
          enabled: true,
          in_app_enabled: true,
          email_enabled: false,
          cities: [homeCity],
          job_types: ["home_cleaning"],
        })

    if (ownerPreferenceError) {
      throw new Error(
        `Create owner preference failed: ${ownerPreferenceError.message}`,
      )
    }

    const implicit =
      await getEffectiveJobMatchSettingsForUser(
        recipientId,
      )

    check(
      "implicit settings source is service_profile",
      implicit.source === "service_profile",
    )

    check(
      "implicit matching enabled",
      implicit.enabled === true,
    )

    check(
      "implicit in-app enabled",
      implicit.inAppEnabled === true,
    )

    check(
      "implicit email disabled",
      implicit.emailEnabled === false,
    )

    check(
      "implicit city inherited",
      implicit.cities.includes(homeCity),
    )

    check(
      "Hemstädning recognized as home_cleaning",
      implicit.jobTypes.includes("home_cleaning"),
    )

    // ------------------------------------------------
    // QUALITY HOME JOB
    // ------------------------------------------------

    const qualityHomeJob = await createJob({
      title: "Noggrann hemstädning behövs",
      description:
        "Behöver hjälp med en noggrann hemstädning av bostaden. Arbetet omfattar vanliga ytor, kök, badrum och golv och ska utföras omsorgsfullt på avtalad tid.",
      city: homeCity,
      jobType: "home_cleaning",
      propertyType: "apartment",
    })

    const firstMatch =
      await notifyMatchedUsersForJob(
        qualityHomeJob,
      )

    check(
      "quality unique-city job matches exactly recipient",
      firstMatch.skipped === false &&
        firstMatch.matched === 1,
    )

    const {
      data: firstNotifications,
      error: firstNotificationError,
    } = await admin
      .from("notifications")
      .select(
        "id,user_id,type,href,dedupe_key",
      )
      .eq("job_id", qualityHomeJob.id)

    if (firstNotificationError) {
      throw new Error(
        `Read notifications failed: ${firstNotificationError.message}`,
      )
    }

    const recipientNotifications = (
      firstNotifications || []
    ).filter(
      (row) => row.user_id === recipientId,
    )

    const ownerNotifications = (
      firstNotifications || []
    ).filter(
      (row) => row.user_id === ownerId,
    )

    check(
      "recipient gets exactly one notification",
      recipientNotifications.length === 1,
    )

    check(
      "notification type is job_match",
      recipientNotifications[0]?.type ===
        "job_match",
    )

    check(
      "notification href correct",
      recipientNotifications[0]?.href ===
        `/jobs/${qualityHomeJob.id}`,
    )

    const {
      data: firstDeliveries,
      error: firstDeliveryError,
    } = await admin
      .from("job_match_deliveries")
      .select(
        "id,user_id,channel,status,error",
      )
      .eq("job_id", qualityHomeJob.id)

    if (firstDeliveryError) {
      throw new Error(
        `Read deliveries failed: ${firstDeliveryError.message}`,
      )
    }

    const inAppDeliveries = (
      firstDeliveries || []
    ).filter(
      (row) =>
        row.user_id === recipientId &&
        row.channel === "in_app",
    )

    const emailDeliveries = (
      firstDeliveries || []
    ).filter(
      (row) =>
        row.user_id === recipientId &&
        row.channel === "email",
    )

    check(
      "one in-app delivery created",
      inAppDeliveries.length === 1,
    )

    check(
      "in-app delivery status sent",
      inAppDeliveries[0]?.status === "sent",
    )

    check(
      "implicit matching creates no email delivery",
      emailDeliveries.length === 0,
    )

    check(
      "owner receives no own-job notification",
      ownerNotifications.length === 0,
    )

    // ------------------------------------------------
    // DEDUPE
    // ------------------------------------------------

    await notifyMatchedUsersForJob(
      qualityHomeJob,
    )

    const {
      data: rerunNotifications,
      error: rerunNotificationError,
    } = await admin
      .from("notifications")
      .select("id")
      .eq("job_id", qualityHomeJob.id)
      .eq("user_id", recipientId)

    if (rerunNotificationError) {
      throw new Error(
        `Read rerun notifications failed: ${rerunNotificationError.message}`,
      )
    }

    const {
      data: rerunDeliveries,
      error: rerunDeliveryError,
    } = await admin
      .from("job_match_deliveries")
      .select("id")
      .eq("job_id", qualityHomeJob.id)
      .eq("user_id", recipientId)
      .eq("channel", "in_app")

    if (rerunDeliveryError) {
      throw new Error(
        `Read rerun deliveries failed: ${rerunDeliveryError.message}`,
      )
    }

    check(
      "rerun does not duplicate notification",
      (rerunNotifications || []).length === 1,
    )

    check(
      "rerun does not duplicate in-app delivery",
      (rerunDeliveries || []).length === 1,
    )

    // ------------------------------------------------
    // WEAK JOB
    // ------------------------------------------------

    const weakJob = await createJob({
      title: "Kort jobb",
      description: "För kort.",
      city: homeCity,
      jobType: "home_cleaning",
      propertyType: "apartment",
    })

    const weakResult =
      await notifyMatchedUsersForJob(weakJob)

    check(
      "weak job skipped",
      weakResult.skipped === true,
    )

    check(
      "weak job matches zero",
      weakResult.matched === 0,
    )

    const {
      data: weakNotifications,
      error: weakNotificationError,
    } = await admin
      .from("notifications")
      .select("id")
      .eq("job_id", weakJob.id)

    if (weakNotificationError) {
      throw new Error(
        `Read weak notifications failed: ${weakNotificationError.message}`,
      )
    }

    check(
      "weak job creates no notification",
      (weakNotifications || []).length === 0,
    )

    // ------------------------------------------------
    // EXPLICIT PREFERENCE OVERRIDE
    // ------------------------------------------------

    const {
      error: explicitPreferenceError,
    } = await admin
      .from("job_match_preferences")
      .insert({
        user_id: recipientId,
        enabled: true,
        in_app_enabled: true,
        email_enabled: false,
        cities: [goteborgPreferenceCity],
        job_types: ["office_cleaning"],
      })

    if (explicitPreferenceError) {
      throw new Error(
        `Create explicit preference failed: ${explicitPreferenceError.message}`,
      )
    }

    const explicit =
      await getEffectiveJobMatchSettingsForUser(
        recipientId,
      )

    check(
      "explicit preference overrides service profile",
      explicit.source === "preference",
    )

    check(
      "explicit city/type loaded with email off",
      explicit.cities.length === 1 &&
        explicit.cities[0] ===
          goteborgPreferenceCity &&
        explicit.jobTypes.length === 1 &&
        explicit.jobTypes[0] ===
          "office_cleaning" &&
        explicit.inAppEnabled === true &&
        explicit.emailEnabled === false,
    )

    const oldHomeJob = await createJob({
      title: "Ny hemstädning efter ändrade val",
      description:
        "Behöver hjälp med återkommande hemstädning i bostaden. Uppdraget omfattar rengöring av kök, badrum, golv och övriga vanliga ytor med normal städutrustning.",
      city: homeCity,
      jobType: "home_cleaning",
      propertyType: "apartment",
    })

    const oldHomeResult =
      await notifyMatchedUsersForJob(
        oldHomeJob,
      )

    check(
      "explicit preference blocks former home match",
      oldHomeResult.skipped === false &&
        oldHomeResult.matched === 0,
    )

    const {
      data: oldHomeNotifications,
      error: oldHomeNotificationError,
    } = await admin
      .from("notifications")
      .select("id")
      .eq("job_id", oldHomeJob.id)
      .eq("user_id", recipientId)

    if (oldHomeNotificationError) {
      throw new Error(
        `Read old-home notifications failed: ${oldHomeNotificationError.message}`,
      )
    }

    check(
      "blocked home match creates no notification",
      (oldHomeNotifications || []).length === 0,
    )

    // ------------------------------------------------
    // GOTEBORG <-> GÖTEBORG NORMALIZATION
    // ------------------------------------------------

    const goteborgJob = await createJob({
      title: "Kontorsstädning för mindre lokal",
      description:
        "Vi söker hjälp med regelbunden kontorsstädning i en mindre arbetslokal. Uppdraget omfattar golv, gemensamma ytor, köksdel och toalett med noggrant utförande.",
      city: goteborgJobCity,
      jobType: "office_cleaning",
      propertyType: "office",
    })

    const goteborgResult =
      await notifyMatchedUsersForJob(
        goteborgJob,
      )

    check(
      "Goteborg preference matches Göteborg job",
      goteborgResult.skipped === false &&
        goteborgResult.matched === 1,
    )

    const {
      data: goteborgNotifications,
      error: goteborgNotificationError,
    } = await admin
      .from("notifications")
      .select("id,user_id,type,href")
      .eq("job_id", goteborgJob.id)
      .eq("user_id", recipientId)

    if (goteborgNotificationError) {
      throw new Error(
        `Read Göteborg notifications failed: ${goteborgNotificationError.message}`,
      )
    }

    const {
      data: goteborgDeliveries,
      error: goteborgDeliveryError,
    } = await admin
      .from("job_match_deliveries")
      .select(
        "id,user_id,channel,status,error",
      )
      .eq("job_id", goteborgJob.id)
      .eq("user_id", recipientId)

    if (goteborgDeliveryError) {
      throw new Error(
        `Read Göteborg deliveries failed: ${goteborgDeliveryError.message}`,
      )
    }

    const goteborgInApp = (
      goteborgDeliveries || []
    ).filter(
      (row) => row.channel === "in_app",
    )

    check(
      "Göteborg match creates sent in-app notification",
      (goteborgNotifications || []).length ===
        1 &&
        goteborgNotifications?.[0]?.type ===
          "job_match" &&
        goteborgNotifications?.[0]?.href ===
          `/jobs/${goteborgJob.id}` &&
        goteborgInApp.length === 1 &&
        goteborgInApp[0]?.status === "sent",
    )

    const goteborgEmail = (
      goteborgDeliveries || []
    ).filter(
      (row) => row.channel === "email",
    )

    check(
      "explicit email OFF creates no email delivery",
      goteborgEmail.length === 0,
    )
  } catch (error) {
    fatalError = errorMessage(error)
  } finally {
    // ------------------------------------------------
    // CLEANUP
    // ------------------------------------------------

    if (jobIds.length > 0) {
      const { error } = await admin
        .from("notifications")
        .delete()
        .in("job_id", jobIds)

      if (error) {
        cleanupErrors.push(
          `notifications: ${error.message}`,
        )
      }

      const { error: deliveriesError } =
        await admin
          .from("job_match_deliveries")
          .delete()
          .in("job_id", jobIds)

      if (deliveriesError) {
        cleanupErrors.push(
          `deliveries: ${deliveriesError.message}`,
        )
      }

      const { error: jobsError } = await admin
        .from("jobs")
        .delete()
        .in("id", jobIds)

      if (jobsError) {
        cleanupErrors.push(
          `jobs: ${jobsError.message}`,
        )
      }
    }

    if (userIds.length > 0) {
      const { error: preferencesError } =
        await admin
          .from("job_match_preferences")
          .delete()
          .in("user_id", userIds)

      if (preferencesError) {
        cleanupErrors.push(
          `preferences: ${preferencesError.message}`,
        )
      }

      const { error: servicesError } =
        await admin
          .from("service_profiles")
          .delete()
          .in("user_id", userIds)

      if (servicesError) {
        cleanupErrors.push(
          `service_profiles: ${servicesError.message}`,
        )
      }

      const { error: profilesError } =
        await admin
          .from("profiles")
          .delete()
          .in("id", userIds)

      if (profilesError) {
        cleanupErrors.push(
          `profiles: ${profilesError.message}`,
        )
      }
    }

    for (const userId of userIds) {
      const { error } =
        await admin.auth.admin.deleteUser(userId)

      if (error) {
        cleanupErrors.push(
          `auth ${userId}: ${error.message}`,
        )
      }
    }

    if (jobIds.length > 0) {
      const {
        count,
        error: verifyJobsError,
      } = await admin
        .from("jobs")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("id", jobIds)

      if (verifyJobsError) {
        cleanupErrors.push(
          `verify jobs: ${verifyJobsError.message}`,
        )
      } else if ((count || 0) !== 0) {
        cleanupErrors.push(
          `verify jobs: ${count} remaining`,
        )
      }
    }

    if (userIds.length > 0) {
      const {
        count,
        error: verifyProfilesError,
      } = await admin
        .from("profiles")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("id", userIds)

      if (verifyProfilesError) {
        cleanupErrors.push(
          `verify profiles: ${verifyProfilesError.message}`,
        )
      } else if ((count || 0) !== 0) {
        cleanupErrors.push(
          `verify profiles: ${count} remaining`,
        )
      }
    }
  }

  const expected = 26
  const passed = checks.filter(
    (item) => item.ok,
  ).length

  const qaGreen =
    !fatalError &&
    checks.length === expected &&
    passed === expected

  const cleanupGreen =
    cleanupErrors.length === 0

  return NextResponse.json({
    environment:
      process.env.VERCEL_ENV || "unknown",
    result: `${passed}/${expected}`,
    status:
      qaGreen && cleanupGreen
        ? "GREEN"
        : "FAILED",
    qa_cleanup: cleanupGreen
      ? "GREEN"
      : "FAILED",
    checks,
    fatal_error: fatalError,
    cleanup_errors: cleanupErrors,
  })
}
