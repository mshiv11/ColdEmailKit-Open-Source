import { env } from "~/env"

export const siteConfig = {
  name: "ColdEmailKit",
  slug: "coldemailkit",
  tagline: "Cold Email Tools",
  description:
    "A curated collection of the best cold email tools. Save money with reliable tools hand-picked for you.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",

  // TODO: Replace with your affiliate tracking domain
  affiliateUrl: "https://go.coldemailkit.com",

  blog: {
    enabled: true,
  },
}
