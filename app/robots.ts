import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldemailkit.com"

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/auth/",
                "/dashboard/",
                "/submit-tool/",
                "/api/",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
