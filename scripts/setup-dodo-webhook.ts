/**
 * Setup Dodo Payments Webhook
 *
 * This script creates a webhook endpoint in Dodo Payments programmatically.
 *
 * Run with: npx tsx scripts/setup-dodo-webhook.ts --live
 */

import DodoPayments from "dodopayments"
import "dotenv/config"

// Check for --live flag
const args = process.argv.slice(2)
const isLive = args.includes("--live")
const environment = isLive ? "live_mode" : "test_mode"

// Use the appropriate API key
const API_KEY = isLive
    ? process.env.DODO_PAYMENTS_LIVE_API_KEY
    : process.env.DODO_PAYMENTS_API_KEY

if (!API_KEY) {
    console.error(`❌ Error: ${isLive ? "DODO_PAYMENTS_LIVE_API_KEY" : "DODO_PAYMENTS_API_KEY"} not set`)
    process.exit(1)
}

console.log(`🔧 Environment: ${environment}`)
if (isLive) {
    console.log("⚠️  WARNING: Setting up webhook in LIVE mode!")
}

const dodo = new DodoPayments({
    bearerToken: API_KEY,
    environment: environment,
})

// The events we need to subscribe to for our use case
const REQUIRED_EVENTS = [
    "payment.succeeded",
    "payment.failed",
    "payment.cancelled",
    "subscription.active",
    "subscription.cancelled",
    "subscription.expired",
    "subscription.renewed",
    "refund.succeeded",
]

async function setupWebhook() {
    // Get the webhook URL from args or use default
    const urlIndex = args.findIndex(arg => arg === "--url")
    const webhookUrl = urlIndex !== -1 && args[urlIndex + 1]
        ? args[urlIndex + 1]
        : "https://coldemailkit.com/api/dodo/webhook" // Default URL

    console.log(`\n🔗 Webhook URL: ${webhookUrl}`)
    console.log(`📝 Events to subscribe: ${REQUIRED_EVENTS.length}`)
    REQUIRED_EVENTS.forEach(event => console.log(`   - ${event}`))

    try {
        // List existing webhooks
        console.log("\n📃 Checking existing webhooks...")
        const existingWebhooks = await dodo.webhooks.list()
        let existingWebhook = null

        for await (const webhook of existingWebhooks) {
            if (webhook.url === webhookUrl) {
                existingWebhook = webhook
                console.log(`   Found existing webhook: ${webhook.id}`)
                break
            }
        }

        if (existingWebhook) {
            // Update existing webhook
            console.log("\n🔄 Updating existing webhook...")
            const updated = await dodo.webhooks.update(existingWebhook.id, {
                url: webhookUrl,
                description: "ColdEmailKit Payment Events",
                filter_types: REQUIRED_EVENTS,
                disabled: false,
            })
            console.log(`   ✅ Webhook updated: ${updated.id}`)
        } else {
            // Create new webhook
            console.log("\n🚀 Creating new webhook...")
            const webhook = await dodo.webhooks.create({
                url: webhookUrl,
                description: "ColdEmailKit Payment Events",
                filter_types: REQUIRED_EVENTS,
            })
            console.log(`   ✅ Webhook created: ${webhook.id}`)
        }

        // Get the webhook secret
        console.log("\n🔑 Retrieving webhook secret...")

        // List webhooks again to get the ID
        const webhooks = await dodo.webhooks.list()
        for await (const webhook of webhooks) {
            if (webhook.url === webhookUrl) {
                const secretResponse = await dodo.webhooks.retrieveSecret(webhook.id)
                console.log("\n" + "=".repeat(60))
                console.log("✅ Webhook setup complete!")
                console.log("=".repeat(60))
                console.log(`\n📋 Add this to your .env file:\n`)
                console.log(`DODO_PAYMENTS_WEBHOOK_KEY="${secretResponse.secret}"`)
                console.log("\n" + "=".repeat(60))
                return
            }
        }

        console.log("⚠️  Could not retrieve webhook secret. Please get it from the Dodo dashboard.")
    } catch (error: any) {
        console.error("\n❌ Error setting up webhook:", error.message)
        if (error.error) {
            console.error("API Error:", error.error)
        }
        throw error
    }
}

async function listWebhooks() {
    console.log("\n📃 Listing webhooks...\n")
    try {
        const webhooks = await dodo.webhooks.list()
        let count = 0
        for await (const webhook of webhooks) {
            count++
            console.log(`   ${count}. ${webhook.url}`)
            console.log(`      ID: ${webhook.id}`)
            console.log(`      Description: ${webhook.description}`)
            console.log(`      Disabled: ${webhook.disabled || false}`)
            console.log(`      Events: ${webhook.filter_types?.join(", ") || "All"}`)
            console.log()
        }
        if (count === 0) {
            console.log("   No webhooks found.")
        }
    } catch (error: any) {
        console.error("Error listing webhooks:", error.message)
    }
}

async function main() {
    if (args.includes("--list")) {
        await listWebhooks()
    } else {
        await setupWebhook()
    }
}

main().catch(console.error)
