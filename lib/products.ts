import { addDays, differenceInMonths } from "date-fns"
import plur from "plur"
import { config } from "~/config"
import { products as staticProducts, type Product, type Price } from "~/config/subscriptions"

const SYMBOLS = {
  positive: "✓ ",
  neutral: "• ",
  negative: "✗ ",
} as const

type SymbolType = keyof typeof SYMBOLS

export const getQueueLength = (queueLength: number) => {
  const queueDays = Math.ceil((queueLength / config.submissions.postingRate) * 7)
  const queueMonths = Math.max(differenceInMonths(addDays(new Date(), queueDays), new Date()), 1)

  return `${queueMonths}+ ${plur("month", queueMonths)}`
}

const getFeatureType = (featureName?: string) => {
  return Object.keys(SYMBOLS).find(key => featureName?.startsWith(SYMBOLS[key as SymbolType])) as
    | SymbolType
    | undefined
}

const removeSymbol = (featureName?: string, type?: SymbolType) => {
  return type ? featureName?.replace(SYMBOLS[type], "") : featureName
}

/**
 * Get the products for pricing.
 *
 * @param isPublished - Whether the tool is published.
 * @returns The products for pricing.
 */
export const getProducts = (
  isPublished: boolean,
) => {
  const getPriceAmount = (price?: Price | null) => {
    return price ? (price.unit_amount ?? 0) : 0
  }

  // Use static products
  return (
    staticProducts
      // Filter out products that are not listings
      .filter(({ name }) => name.includes("Listing"))

      // Sort by price
      .sort((a, b) => getPriceAmount(a.prices[0]) - getPriceAmount(b.prices[0]))

      // Filter out expedited products if the tool is published
      .filter(({ name }) => !isPublished || !name.includes("Expedited"))

      // Clean up the name
      .map(({ name, ...product }) => ({ ...product, name: name.replace("Listing", "").trim() }))
  )
}

/**
 * Get the features of a product.
 *
 * @param product - The product to get the features of.
 * @param isPublished - Whether the tool is published.
 * @param queueLength - The length of the queue.
 * @returns The features of the product.
 */
export const getProductFeatures = (
  product: Product,
  isPublished: boolean,
  queueLength: number,
) => {
  const features = product.marketing_features.filter(
    feature => !isPublished || !feature.name?.includes("processing time"),
  )

  return features.map(feature => {
    const type = getFeatureType(feature.name)
    const name = removeSymbol(feature.name, type)

    if (name?.includes("{queue}")) {
      return {
        type,
        name: name.replace("{queue}", getQueueLength(queueLength)),
        footnote: "Calculated based on the number of tools in the queue.",
      }
    }

    return { ...feature, name, type }
  })
}

/**
 * Fetch prices for a list of products and prepare them for display.
 *
 * @param products - The list of products to prepare.
 * @returns A promise that resolves to an array of products with their prices and discount status.
 */
export const prepareProductsWithPrices = async (
  products: Product[],
) => {
  return Promise.all(
    products.map(async (product, index) => {
      const prices = product.prices
      const isDiscounted = false // Placeholder

      return {
        product,
        prices: prices,
        isDiscounted,
        isFeatured: index === products.length - 1, // Simple logic for now
      }
    }),
  )
}

