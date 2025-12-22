import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { env } from "~/env"
import { dodo } from "~/lib/dodo"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("x-dodo-signature")

    try {
        // Verify webhook signature
        // TODO: Implement proper signature verification once Dodo SDK types are confirmed
        // const event = dodo.webhooks.constructEvent({
        //   payload: body,
        //   sigHeader: signature,
        //   secret: env.DODO_PAYMENTS_WEBHOOK_KEY,
        // })

        // Placeholder event for now
        const event = JSON.parse(body)

        // Handle event
        switch (event.type) {
            case "payment.succeeded":
                // Handle successful payment
                console.log("Payment succeeded:", event.data)
                break
            // Add other event types as needed
            default:
                console.log("Unhandled event type:", event.type)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Webhook error:", error)
        return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }
}
