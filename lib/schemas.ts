import { config } from "~/config"

/**
 * Centralized JSON-LD Schema generation utilities for SEO
 * All schemas follow Schema.org standards
 */

const siteUrl = config.site.url

// ============================================================================
// Organization Schema
// ============================================================================

export function generateOrganizationSchema() {
    return {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: config.site.name,
        url: siteUrl,
        logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/favicon.png`,
            width: "480",
            height: "480",
        },
        sameAs: [
            config.links.twitter,
            config.links.bluesky,
            config.links.linkedin,
        ].filter(Boolean),
    }
}

// ============================================================================
// Website Schema with SearchAction
// ============================================================================

export function generateWebsiteSchema() {
    return {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: config.site.name,
        description: config.site.description,
        inLanguage: "en-US",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    }
}

// ============================================================================
// BreadcrumbList Schema
// ============================================================================

type BreadcrumbItem = {
    name: string
    href: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.name,
                item: `${siteUrl}${item.href}`,
            })),
        ],
    }
}

// ============================================================================
// SoftwareApplication Schema (for tool pages)
// ============================================================================

type ToolSchemaInput = {
    name: string
    slug: string
    description: string | null
    screenshotUrl?: string | null
    faviconUrl?: string | null
    overallRating?: number | null
    totalReviews?: number | null
    pricingStarting?: string | null
    categories?: { name: string }[]
    isSelfHosted?: boolean
    repositoryUrl?: string | null
}

export function generateSoftwareApplicationSchema(tool: ToolSchemaInput) {
    return {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/tools/${tool.slug}#software`,
        name: tool.name,
        description: tool.description,
        url: `${siteUrl}/tools/${tool.slug}`,
        applicationCategory: tool.categories?.[0]?.name || "Business Application",
        operatingSystem: "Web",
        ...(tool.screenshotUrl && {
            image: {
                "@type": "ImageObject",
                url: tool.screenshotUrl,
                width: "1280",
                height: "720",
            },
        }),
        ...(tool.faviconUrl && { logo: tool.faviconUrl }),
        ...(tool.overallRating &&
            tool.totalReviews && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: tool.overallRating,
                ratingCount: tool.totalReviews,
                bestRating: 5,
                worstRating: 1,
            },
        }),
        ...(tool.pricingStarting && {
            offers: {
                "@type": "Offer",
                price: tool.pricingStarting.replace(/[^0-9.]/g, "") || "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
            },
        }),
        ...(tool.isSelfHosted &&
            tool.repositoryUrl && {
            downloadUrl: tool.repositoryUrl,
        }),
    }
}

// ============================================================================
// ItemList Schema (for listing pages)
// ============================================================================

type ListItemInput = {
    name: string
    slug: string
    description?: string | null
    screenshotUrl?: string | null
    overallRating?: number | null
    totalReviews?: number | null
}

export function generateItemListSchema(
    items: ListItemInput[],
    options: {
        name: string
        description?: string
        url: string
        itemType?: "SoftwareApplication" | "ListItem"
        maxItems?: number
    }
) {
    const maxItems = options.maxItems ?? 10

    return {
        "@type": "ItemList",
        name: options.name,
        description: options.description,
        url: `${siteUrl}${options.url}`,
        numberOfItems: items.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: items.slice(0, maxItems).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item:
                options.itemType === "SoftwareApplication"
                    ? {
                        "@type": "SoftwareApplication",
                        name: item.name,
                        description: item.description,
                        url: `${siteUrl}/tools/${item.slug}`,
                        ...(item.screenshotUrl && { image: item.screenshotUrl }),
                        ...(item.overallRating && {
                            aggregateRating: {
                                "@type": "AggregateRating",
                                ratingValue: item.overallRating,
                                ratingCount: item.totalReviews || 1,
                            },
                        }),
                    }
                    : {
                        "@type": "Thing",
                        name: item.name,
                        url: `${siteUrl}/tools/${item.slug}`,
                    },
        })),
    }
}

// ============================================================================
// CollectionPage Schema (for category/listing pages)
// ============================================================================

export function generateCollectionPageSchema(options: {
    name: string
    description: string
    url: string
    numberOfItems?: number
    mainEntity?: object
}) {
    return {
        "@type": "CollectionPage",
        "@id": `${siteUrl}${options.url}#collection`,
        name: options.name,
        description: options.description,
        url: `${siteUrl}${options.url}`,
        isPartOf: { "@id": `${siteUrl}/#website` },
        ...(options.numberOfItems && { numberOfItems: options.numberOfItems }),
        ...(options.mainEntity && { mainEntity: options.mainEntity }),
    }
}

// ============================================================================
// Article Schema (for blog posts)
// ============================================================================

type ArticleSchemaInput = {
    title: string
    description?: string
    slug: string
    image?: string | null
    publishedAt?: string | null
    updatedAt?: string | null
    author: {
        name: string
        twitterHandle?: string
        image?: string | null
    }
    wordCount?: number
    section?: string
}

export function generateArticleSchema(article: ArticleSchemaInput) {
    return {
        "@type": "Article",
        "@id": `${siteUrl}/blog/${article.slug}#article`,
        headline: article.title,
        description: article.description,
        url: `${siteUrl}/blog/${article.slug}`,
        ...(article.image && { image: article.image }),
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
            "@type": "Person",
            name: article.author.name,
            ...(article.author.twitterHandle && {
                url: `https://twitter.com/${article.author.twitterHandle}`,
                sameAs: [`https://twitter.com/${article.author.twitterHandle}`],
            }),
            ...(article.author.image && { image: article.author.image }),
        },
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${article.slug}`,
        },
        ...(article.wordCount && { wordCount: article.wordCount }),
        articleSection: article.section || "Cold Email Tools",
        inLanguage: "en-US",
    }
}

// ============================================================================
// FAQPage Schema
// ============================================================================

type FAQItem = {
    question: string
    answer: string
}

export function generateFAQPageSchema(faqs: FAQItem[]) {
    return {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    }
}

// ============================================================================
// Review Schema (for user reviews on tools)
// ============================================================================

type ReviewInput = {
    author: string
    rating: number
    reviewBody: string
    datePublished?: string
}

export function generateReviewSchema(
    reviews: ReviewInput[],
    itemReviewed: { name: string; url: string }
) {
    return reviews.map((review) => ({
        "@type": "Review",
        author: {
            "@type": "Person",
            name: review.author,
        },
        reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished,
        itemReviewed: {
            "@type": "SoftwareApplication",
            name: itemReviewed.name,
            url: itemReviewed.url,
        },
    }))
}

// ============================================================================
// Graph Wrapper (combines multiple schemas)
// ============================================================================

export function wrapInGraph(...schemas: object[]) {
    return {
        "@context": "https://schema.org",
        "@graph": schemas,
    }
}

// ============================================================================
// JSON-LD Script Component Helper
// ============================================================================

export function jsonLdScriptProps(schema: object) {
    return {
        type: "application/ld+json" as const,
        dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
    }
}
