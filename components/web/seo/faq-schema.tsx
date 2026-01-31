import { generateFAQPageSchema, jsonLdScriptProps, wrapInGraph } from "~/lib/schemas"

type FAQItem = {
    question: string
    answer: string
}

type FAQSchemaProps = {
    faqs: FAQItem[]
}

/**
 * Reusable FAQ Schema component that renders FAQPage JSON-LD
 * for rich FAQ results in Google Search
 */
export function FAQSchema({ faqs }: FAQSchemaProps) {
    if (!faqs.length) return null

    const faqSchema = generateFAQPageSchema(faqs)
    const jsonLd = wrapInGraph(faqSchema)

    return <script {...jsonLdScriptProps(jsonLd)} />
}

/**
 * Generate common FAQ items for cold email tools
 */
export function generateToolFAQs(toolName: string, options?: {
    pricing?: string | null
    category?: string | null
    hasFreeTrial?: boolean
}): FAQItem[] {
    const faqs: FAQItem[] = [
        {
            question: `What is ${toolName}?`,
            answer: `${toolName} is a cold email ${options?.category || 'outreach'} tool that helps businesses automate and scale their email campaigns. It provides features for email deliverability, personalization, and campaign analytics.`,
        },
        {
            question: `Is ${toolName} worth it?`,
            answer: `${toolName} is valuable for sales teams and marketers who need to scale cold email outreach. Consider your volume needs, budget, and required integrations when evaluating if it's the right fit.`,
        },
    ]

    if (options?.pricing) {
        faqs.push({
            question: `How much does ${toolName} cost?`,
            answer: `${toolName} starts at ${options.pricing}. Pricing typically varies based on the number of email accounts, sending volume, and features included.`,
        })
    }

    if (options?.hasFreeTrial) {
        faqs.push({
            question: `Does ${toolName} offer a free trial?`,
            answer: `Yes, ${toolName} offers a free trial so you can test the platform before committing to a paid plan.`,
        })
    }

    faqs.push({
        question: `What are the best alternatives to ${toolName}?`,
        answer: `Popular alternatives to ${toolName} include other cold email tools on ColdEmailKit. Compare features, pricing, and reviews to find the best fit for your needs.`,
    })

    return faqs
}

/**
 * Generate common FAQ items for category pages
 */
export function generateCategoryFAQs(categoryName: string): FAQItem[] {
    return [
        {
            question: `What are ${categoryName} tools?`,
            answer: `${categoryName} tools are software solutions designed to help businesses with cold email campaigns. They typically include features for email automation, deliverability, personalization, and analytics.`,
        },
        {
            question: `Which ${categoryName} tool is best for beginners?`,
            answer: `The best tool for beginners depends on your specific needs and budget. Look for tools with intuitive interfaces, good documentation, and responsive support. Compare options on ColdEmailKit to find the right fit.`,
        },
        {
            question: `How do I choose a ${categoryName} tool?`,
            answer: `Consider factors like pricing, ease of use, integration options, email deliverability rates, and customer support. Read reviews and compare features across multiple tools before making a decision.`,
        },
        {
            question: `Are ${categoryName} tools worth the investment?`,
            answer: `Yes, for businesses focused on cold email outreach, these tools can significantly improve efficiency, deliverability, and response rates, leading to better ROI on your outreach efforts.`,
        },
    ]
}

/**
 * Generate homepage FAQ items
 */
export function generateHomepageFAQs(): FAQItem[] {
    return [
        {
            question: "What is ColdEmailKit?",
            answer: "ColdEmailKit is a curated directory of the best cold email tools, helping you compare features, pricing, and reviews to find the perfect solutions for your outreach campaigns.",
        },
        {
            question: "How are tools ranked on ColdEmailKit?",
            answer: "Tools are ranked based on a combination of factors including user reviews, feature completeness, pricing value, deliverability rates, and overall popularity in the cold email community.",
        },
        {
            question: "Are the reviews on ColdEmailKit verified?",
            answer: "Yes, we aggregate and verify reviews from multiple trusted sources to provide accurate and reliable ratings for each tool.",
        },
        {
            question: "How often is ColdEmailKit updated?",
            answer: "We continuously update our listings with new tools, pricing changes, and feature updates to ensure you have the most current information available.",
        },
        {
            question: "Is ColdEmailKit free to use?",
            answer: "Yes, ColdEmailKit is completely free to browse. We help you discover and compare cold email tools at no cost.",
        },
    ]
}
