const excludePaths = ["/admin*", "/auth*", "/dashboard*", "/submit*"]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:5173",
  exclude: excludePaths,
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: excludePaths,
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priorities for different page types
    let priority = 0.7
    let changefreq = "weekly"

    // Homepage - highest priority
    if (path === "/") {
      priority = 1.0
      changefreq = "daily"
    }
    // Individual tool pages - very high priority (main content)
    else if (path.match(/^\/tools\/[^/]+$/)) {
      priority = 0.9
      changefreq = "weekly"
    }
    // Alternatives detail pages - high priority
    else if (path.match(/^\/alternatives\/[^/]+$/)) {
      priority = 0.85
      changefreq = "weekly"
    }
    // Category pages - high priority
    else if (path.startsWith("/categories/")) {
      priority = 0.8
      changefreq = "weekly"
    }
    // Blog posts - high priority
    else if (path.match(/^\/blog\/[^/]+$/)) {
      priority = 0.8
      changefreq = "monthly"
    }
    // Listing pages
    else if (path === "/tools" || path === "/alternatives" || path === "/categories") {
      priority = 0.75
      changefreq = "daily"
    }
    // Integrations pages
    else if (path.startsWith("/integrations/")) {
      priority = 0.7
      changefreq = "weekly"
    }
    // Static pages (about, privacy, terms)
    else if (["/about", "/privacy", "/terms", "/contact"].includes(path)) {
      priority = 0.5
      changefreq = "monthly"
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
