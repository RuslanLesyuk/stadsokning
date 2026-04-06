import type { Metadata } from "next"
import "./globals.css"
import SiteHeader from "@/components/site-header" // ✅ FIX

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
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}