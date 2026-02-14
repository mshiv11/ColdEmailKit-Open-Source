import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { env } from "~/env"
import { dodo } from "~/lib/dodo"
import { db } from "~/services/db"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()

  // Get all headers as a record
  const headersRecord: Record<string, string> = {}
  headersList.forEach((value, key) => {
    headersRecord[key] = value
  })

  try {
    // Verify webhook signature using SDK's built-in method
    const event = dodo.webhooks.unwrap(body, {
      headers: headersRecord,
      key: env.DODO_PAYMENTS_WEBHOOK_KEY,
    })

    console.log("📥 Webhook event received:", event.type)

    // Handle different event types
    switch (event.type) {
      case "payment.succeeded":
        // Handle successful payment
        console.log("✅ Payment succeeded:", event.data.payment_id)
        // You can update database records, send emails, etc.
        break

      case "subscription.active":
        // Handle subscription activation
        console.log("✅ Subscription activated:", event.data.subscription_id)
        // Update tool to featured status
        const subscriptionData = event.data
        if (subscriptionData.metadata?.tool_slug) {
          await db.tool.updateMany({
            where: { slug: subscriptionData.metadata.tool_slug },
            data: { isFeatured: true },
          })
          console.log(`   Tool ${subscriptionData.metadata.tool_slug} marked as featured`)
        }
        break

      case "subscription.cancelled":
        // Handle subscription cancellation
        console.log("⚠️ Subscription cancelled:", event.data.subscription_id)
        break

      case "subscription.expired":
        // Handle subscription expiration
        console.log("⚠️ Subscription expired:", event.data.subscription_id)
        break

      case "subscription.renewed":
        // Handle subscription renewal
        console.log("✅ Subscription renewed:", event.data.subscription_id)
        break

      case "refund.succeeded":
        // Handle refund
        console.log("💸 Refund processed:", event.data.refund_id)
        break

      default:
        console.log("ℹ️ Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("❌ Webhook error:", error.message)
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 })
  }
}
