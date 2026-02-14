"use server"

import { AdType } from "@prisma/client"
import { z } from "zod"
import { userProcedure } from "~/lib/safe-actions"
import { env } from "~/env"
import { dodo } from "~/lib/dodo"

// Types for checkout data
type AdCheckoutItem = {
    type: AdType
    price: number
    duration: number
    metadata: {
        startDate: number
        endDate: number
    }
}

type AlternativeCheckoutItem = {
    slug: string
    name: string
    price: number
}

/**
 * Create a Dodo checkout session for ads
 */
export const createDodoAdsCheckout = userProcedure
    .createServerAction()
    .input(
        z.array(
            z.object({
                type: z.nativeEnum(AdType),
                price: z.number(),
                duration: z.number(),
                metadata: z.object({
                    startDate: z.number(),
                    endDate: z.number(),
                }),
            })
        )
    )
    .handler(async ({ input }: { input: AdCheckoutItem[] }) => {
        // Create a one-time payment for ads
        const payment = await dodo.payments.create({
            billing: {
                city: "New York",
                country: "US",
                state: "NY",
                street: "123 Main St",
                zipcode: "10001",
            },
            customer: {
                email: "advertiser@example.com",
                name: "Advertiser",
            },
            product_cart: input.map(() => ({
                product_id: "ad_purchase", // We'll use metadata for the actual details
                quantity: 1,
            })),
            payment_link: true,
            return_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/success`,
            metadata: {
                type: "ad_purchase",
                items: JSON.stringify(input),
            },
        })

        if (!payment.payment_link) {
            throw new Error("Failed to create payment link")
        }

        return payment.payment_link
    })

/**
 * Create a Dodo checkout session for alternative page ads
 */
export const createDodoAlternativeAdsCheckout = userProcedure
    .createServerAction()
    .input(
        z.object({
            type: z.nativeEnum(AdType),
            alternatives: z.array(
                z.object({
                    slug: z.string(),
                    name: z.string(),
                    price: z.number(),
                })
            ),
        })
    )
    .handler(async ({ input }: { input: { type: AdType; alternatives: AlternativeCheckoutItem[] } }) => {
        // Create a subscription for monthly alternative ads
        const subscription = await dodo.subscriptions.create({
            billing: {
                city: "New York",
                country: "US",
                state: "NY",
                street: "123 Main St",
                zipcode: "10001",
            },
            customer: {
                email: "advertiser@example.com",
                name: "Advertiser",
            },
            product_id: "alternative_ad_monthly", // Placeholder - should create actual product
            quantity: 1,
            payment_link: true,
            return_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/success`,
            metadata: {
                type: input.type,
                alternatives: JSON.stringify(input.alternatives),
            },
        })

        if (!subscription.payment_link) {
            throw new Error("Failed to create subscription link")
        }

        return subscription.payment_link
    })

/**
 * Create an ad from a checkout session (called after payment success)
 */
export const createAdFromCheckout = userProcedure
    .createServerAction()
    .input(
        z.object({
            sessionId: z.string(),
            name: z.string().min(1),
            websiteUrl: z.string().url(),
            description: z.string().min(1).max(160),
            buttonLabel: z.string().optional(),
        })
    )
    .handler(async ({ input }) => {
        // Import db inline to avoid circular dependencies
        const { db } = await import("~/services/db")

        // Check if ad already exists for this session
        const existingAd = await db.ad.findFirst({
            where: { sessionId: input.sessionId },
        })

        if (existingAd) {
            // Update existing ad
            return await db.ad.update({
                where: { id: existingAd.id },
                data: {
                    name: input.name,
                    websiteUrl: input.websiteUrl,
                    description: input.description,
                    buttonLabel: input.buttonLabel || null,
                },
            })
        }

        // Create new ad
        return await db.ad.create({
            data: {
                sessionId: input.sessionId,
                name: input.name,
                websiteUrl: input.websiteUrl,
                description: input.description,
                buttonLabel: input.buttonLabel || null,
                email: "", // Email will be collected separately
                type: AdType.Banner, // Default type
                startsAt: new Date(),
                endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
            },
        })
    })

// Legacy exports for backward compatibility - these now use Dodo
export const createStripeAdsCheckout = createDodoAdsCheckout
export const createStripeAlternativeAdsCheckout = createDodoAlternativeAdsCheckout
