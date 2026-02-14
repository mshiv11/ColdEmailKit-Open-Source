import { db } from "~/services/db"
import { allPosts } from "content-collections"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldemailkit.com"

    // Static routes
    const staticRoutes = [
        "",
        "/tools",
        "/alternatives",
        "/categories",
        "/blog",
        "/about",
        "/privacy",
        "/terms",
        "/contact",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : 0.8,
    }))

    // Blog posts
    const blogRoutes = allPosts.map((post) => ({
        url: `${baseUrl}/blog/${post._meta.path}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }))

    // Tools
    const tools = await db.tool.findMany({
        where: {
            status: "Published",
        },
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    const toolRoutes = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: tool.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }))

    // Categories
    const categories = await db.category.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }))

    // Alternatives (if they have valid pages)
    // Assuming /alternatives/[slug] exists and corresponds to tools/alternatives
    // Or referencing db.alternative
    const alternatives = await db.alternative.findMany({
        select: {
            slug: true,
            updatedAt: true
        }
    })

    const alternativeRoutes = alternatives.map(alt => ({
        url: `${baseUrl}/alternatives/${alt.slug}`,
        lastModified: alt.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.85
    }))

    return [
        ...staticRoutes,
        ...blogRoutes,
        ...toolRoutes,
        ...categoryRoutes,
        ...alternativeRoutes,
    ]
}
