import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"
import SiteHeader from "@/components/site-header"

export const metadata: Metadata = {
  metadataBase: new URL("https://cleanjobs.app"),

  title: {
    default: "Clean Jobs",
    template: "%s | Clean Jobs",
  },

  description:
    "Find cleaning jobs or hire cleaners quickly. Clean Jobs connects clients and workers in your city.",

  keywords: [
    "cleaning jobs",
    "cleaner",
    "hire cleaner",
    "jobs marketplace",
    "cleaning services",
  ],

  authors: [{ name: "Clean Jobs" }],
  creator: "Clean Jobs",

  openGraph: {
    title: "Clean Jobs",
    description:
      "Find cleaning jobs or hire cleaners quickly in your city.",
    url: "https://cleanjobs.app",
    siteName: "Clean Jobs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Clean Jobs",
    description:
      "Find cleaning jobs or hire cleaners quickly in your city.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] text-slate-900">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200/80 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
              <div>
                <div className="text-sm font-semibold tracking-tight text-slate-900">
                  Clean Jobs
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Cleaning marketplace platform.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/terms"
                  prefetch={false}
                  className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  Terms
                </Link>

                <Link
                  href="/privacy"
                  prefetch={false}
                  className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}