export const SEO_SITE_NAME = "Clean Jobs"

export const SEO_ORGANIZATION_NAME = "Clean Jobs"

export const SEO_SITE_URL = "https://cleansjob.com"

export const SEO_DEFAULT_LOCALE = "sv"

export const SEO_SUPPORTED_LOCALES = ["sv", "en", "uk", "ru", "pl"] as const

export const SEO_COUNTRY_CODE = "SE"

export const SEO_HOME_URL = "/"

export const SEO_SERVICES_URL = "/services"

export const SEO_PRIMARY_JOB_URL = "/jobs"

export const SEO_SIGNUP_URL = "/signup"

export const SEO_DEFAULT_REVALIDATE = 86_400

export const SEO_DEFAULT_OG_IMAGE = "/og/clean-jobs-og.jpg"

export const SEO_DEFAULT_TWITTER_IMAGE = "/og/clean-jobs-og.jpg"

export const SEO_TWITTER_CARD = "summary_large_image"

export const SEO_ROBOTS_INDEX = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
} as const