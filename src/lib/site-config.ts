export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Humantryx",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "AI-Powered Human Resource Management System",
  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ??
    "Where Technology Meets Human Resources",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logoText: process.env.NEXT_PUBLIC_LOGO_TEXT ?? "H",
} as const;

export type SiteConfig = typeof siteConfig;
