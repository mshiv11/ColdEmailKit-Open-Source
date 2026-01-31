import { useState } from "react"
import type { Price } from "~/config/subscriptions"

export type ProductInterval = "month" | "year"

const getPriceForInterval = (prices: Price[], interval?: ProductInterval) => {
  if (prices.length === 0) {
    return { unit_amount: 0, id: "" } satisfies Partial<Price>
  }

  const selectedPrice = prices.find(p => p.interval === interval)
  return selectedPrice ?? prices[0]
}

const calculatePrices = (
  prices: Price[],
  interval: ProductInterval,
  coupon?: any | null, // TODO: Add Dodo coupon support if needed
) => {
  const isSubscription = prices.some(p => p.type === "recurring")
  const currentPrice = getPriceForInterval(prices, isSubscription ? interval : undefined)
  const currentPriceValue = (currentPrice.unit_amount ?? 0) / 100
  const monthlyPrice = isSubscription ? getPriceForInterval(prices, "month") : currentPrice
  const monthlyPriceValue = (monthlyPrice.unit_amount ?? 0) / 100

  const initialPrice = isSubscription
    ? currentPriceValue / (interval === "month" ? 1 : 12)
    : currentPriceValue

  const couponDiscountValue = calculateCouponDiscount(initialPrice, coupon)

  const price = Math.max(0, initialPrice - couponDiscountValue)
  const fullPrice = monthlyPriceValue > price ? monthlyPriceValue : null

  const priceToDiscount = interval === "year" ? monthlyPriceValue : currentPriceValue
  const discount = calculateDiscount(priceToDiscount, price)

  return { isSubscription, currentPrice, price, fullPrice, discount }
}

const calculateCouponDiscount = (initialPrice: number, coupon?: any | null) => {
  if (!coupon) return 0
  // Placeholder for coupon logic
  return 0
}

const calculateDiscount = (basePrice: number, price: number) => {
  return basePrice > 0 ? Math.round(((basePrice - price) / basePrice) * 100) : 0
}

export function usePlanPrices(prices: Price[], coupon?: any | null) {
  const [interval, setInterval] = useState<ProductInterval>("month")
  const calculatedPrices = calculatePrices(prices, interval, coupon)

  return {
    ...calculatedPrices,
    interval,
    setInterval,
  }
}
