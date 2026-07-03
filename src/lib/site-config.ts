export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "QoreHR",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "AI-Powered Human Resource Management System",
  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "The Core of Modern HR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logoText: process.env.NEXT_PUBLIC_LOGO_TEXT ?? "Q",
} as const;

export type SiteConfig = typeof siteConfig;
