import { NextResponse } from "next/server"
import { z } from "zod"
import { env } from "~/env"
import { dodo } from "~/lib/dodo"

const checkoutSchema = z.object({
  productId: z.string(),
  quantity: z.number().default(1),
  email: z.string().email().optional(),
  returnUrl: z.string().url().optional(),
  isSubscription: z.boolean().default(true), // Most of our products are subscriptions
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { productId, quantity, email, returnUrl, isSubscription } = checkoutSchema.parse(json)

    const billingAddress = {
      city: "New York",
      country: "US" as const,
      state: "NY",
      street: "123 Main St",
      zipcode: "10001",
    }

    const customerInfo = {
      email: email || "customer@example.com",
      name: "Customer",
    }

    const successUrl = returnUrl || `${env.NEXT_PUBLIC_SITE_URL}/submit/success`

    let paymentLink: string | null | undefined

    if (isSubscription) {
      // For recurring products (subscriptions), use subscriptions.create
      const subscription = await dodo.subscriptions.create({
        billing: billingAddress,
        customer: customerInfo,
        product_id: productId,
        quantity,
        payment_link: true,
        return_url: successUrl,
      })
      paymentLink = subscription.payment_link
    } else {
      // For one-time products, use payments.create
      const payment = await dodo.payments.create({
        billing: billingAddress,
        customer: customerInfo,
        product_cart: [
          {
            product_id: productId,
            quantity,
          },
        ],
        payment_link: true,
        return_url: successUrl,
      })
      paymentLink = payment.payment_link
    }

    if (!paymentLink) {
      throw new Error("Failed to generate payment link")
    }

    return NextResponse.json({ url: paymentLink })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
