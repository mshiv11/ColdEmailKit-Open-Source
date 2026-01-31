import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  allowedDevOrigins: ["coldemailkit.local"],

  experimental: {
    ppr: false,
    useCache: true,

    optimizePackageImports: [
      "@content-collections/core",
      "@content-collections/mdx",
      "@content-collections/next",
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    ...(process.env.NODE_ENV === "production"
      ? {
        loader: "custom",
        loaderFile: "./lib/image-loader.ts",
      }
      : {}),
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 768, 1024],
    remotePatterns: [
      { hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com` },
      { protocol: "https", hostname: "img.logo.dev" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "pub-8dbded528a58478ebbb7064bc2cad60a.r2.dev" },
      { protocol: "https", hostname: "phpsekmsbokkrtlkdtli.supabase.co" },
    ],
  },

  rewrites: async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const posthogUrl = process.env.NEXT_PUBLIC_POSTHOG_HOST

    return [
      // RSS rewrites
      {
        source: "/rss.xml",
        destination: `${siteUrl}/rss/tools.xml`,
      },
      {
        source: "/alternatives/rss.xml",
        destination: `${siteUrl}/rss/alternatives.xml`,
      },

      // for posthog proxy
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: `${posthogUrl?.replace("us", "us-assets")}/static/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: `${posthogUrl}/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: `${posthogUrl}/decide`,
      },
    ]
  },

  redirects: async () => {
    // Load dynamic blog redirects
    let blogRedirects: { source: string; destination: string; permanent: boolean }[] = []
    try {
      const redirectsData = await import("./content/blog-redirects.json")
      blogRedirects = (redirectsData.default as { from: string; to: string }[]).map(r => ({
        source: `/blog/${r.from}`,
        destination: `/blog/${r.to}`,
        permanent: true,
      }))
    } catch {
      // File doesn't exist or is invalid, use empty array
    }

    return [
      ...blogRedirects,
      {
        source: "/topics",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/latest",
        destination: "/?sort=publishedAt.desc",
        permanent: true,
      },
      {
        source: "/newsletter",
        destination: "/",
        permanent: true,
      },
      {
        source: "/hoarder",
        destination: "/karakeep",
        permanent: true,
      },
      {
        source: "/kelia",
        destination: "/keila",
        permanent: true,
      },
      {
        source: "/advertise/alternatives",
        destination: "/advertise?alternative=",
        permanent: true,
      },
      // Redirect old /using/ URLs to new /integrations/ URLs
      {
        source: "/categories/:slug/using/:integration",
        destination: "/categories/:slug/integrations/:integration",
        permanent: true,
      },
    ]
  },
}

export default withContentCollections(nextConfig)
