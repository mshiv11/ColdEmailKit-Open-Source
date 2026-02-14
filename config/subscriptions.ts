// Product IDs for test and live modes
const isProduction = process.env.NODE_ENV === "production"

// Test mode product IDs
const TEST_PRODUCT_IDS = {
  monthly: "pdt_0NXvLWskbSavQknn3lFU5",
  yearly: "pdt_0NXvLWtm2iXBcYNOAgCG0",
  expedited: "pdt_0NXvLWvYLtJEmCdRhL1hj",
}

// Live mode product IDs
const LIVE_PRODUCT_IDS = {
  monthly: "pdt_0NXvXJm0mGvPXAKvOkjnp",
  yearly: "pdt_0NXvXJow4lQGMU1ft5Ipp",
  expedited: "pdt_0NXvXJpgvBNQzWMhVeZVH",
}

// Use appropriate product IDs based on environment
const PRODUCT_IDS = isProduction ? LIVE_PRODUCT_IDS : TEST_PRODUCT_IDS

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
        id: PRODUCT_IDS.monthly,
        unit_amount: 900, // $9
        currency: "usd",
        interval: "month",
        type: "recurring",
      },
      {
        id: PRODUCT_IDS.yearly,
        unit_amount: 3900, // $39
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
    marketing_features: [{ name: "✓ Review in 24 hours" }, { name: "✓ Priority Support" }],
    prices: [
      {
        id: PRODUCT_IDS.expedited,
        unit_amount: 4900, // $49
        currency: "usd",
        type: "one_time",
      },
    ],
  },
]
