import { NextResponse } from "next/server"
import { z } from "zod"
import { env } from "~/env"
import { dodo } from "~/lib/dodo"

const checkoutSchema = z.object({
  productId: z.string(),
  quantity: z.number().default(1),
  email: z.string().email().optional(),
  returnUrl: z.string().url().optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { productId, quantity, email, returnUrl } = checkoutSchema.parse(json)

    // Create payment
    const payment = await dodo.payments.create({
      billing: {
        email,
        country: "US", // Default or from user
      },
      product_cart: [
        {
          product_id: productId,
          quantity,
        },
      ],
      return_url: returnUrl || `${env.NEXT_PUBLIC_SITE_URL}/success`,
    })

    return NextResponse.json({ url: payment.payment_link })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
