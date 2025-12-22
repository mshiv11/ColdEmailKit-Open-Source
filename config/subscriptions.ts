export type Price = {
    id: string
    unit_amount: number
    currency: string
    interval?: "month" | "year"
    type: "one_time" | "recurring"
}

export type Product = {
    id: string
    name: string
    description: string
    features: { name: string }[]
    prices: Price[]
    marketing_features: { name: string }[]
}

export const products: Product[] = [
    {
        id: "prod_listing",
        name: "Listing",
        description: "Get your tool listed on ColdEmailKit.",
        features: [{ name: "Basic Listing" }],
        marketing_features: [
            { name: "✓ SEO Optimized" },
            { name: "✓ High Domain Authority" },
            { name: "✓ Permanent Backlink" },
        ],
        prices: [
            {
                id: "price_listing_monthly",
                unit_amount: 2900,
                currency: "usd",
                interval: "month",
                type: "recurring",
            },
            {
                id: "price_listing_yearly",
                unit_amount: 29000,
                currency: "usd",
                interval: "year",
                type: "recurring",
            },
        ],
    },
    {
        id: "prod_expedited",
        name: "Expedited Listing",
        description: "Skip the queue and get listed faster.",
        features: [{ name: "Expedited Review" }],
        marketing_features: [
            { name: "✓ Review in 24 hours" },
            { name: "✓ Priority Support" },
        ],
        prices: [
            {
                id: "price_expedited",
                unit_amount: 9900,
                currency: "usd",
                type: "one_time",
            },
        ],
    },
]
