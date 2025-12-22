"use server"

import { z } from "zod"
import { userProcedure } from "~/lib/safe-actions"

/**
 * Stub for Stripe checkout - advertising functionality disabled
 * This file provides placeholder exports to prevent build errors
 */

export const createStripeAlternativeAdsCheckout = userProcedure
    .createServerAction()
    .input(
        z.object({
            type: z.string(),
            alternatives: z.array(
                z.object({
                    slug: z.string(),
                    name: z.string(),
                    price: z.number(),
                })
            ),
        })
    )
    .handler(async () => {
        throw new Error("Stripe integration not configured. Please contact support.")
    })

export const createStripeAdsCheckout = userProcedure
    .createServerAction()
    .input(
        z.object({
            type: z.string(),
            months: z.number().optional(),
        })
    )
    .handler(async () => {
        throw new Error("Stripe integration not configured. Please contact support.")
    })
