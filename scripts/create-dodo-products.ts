/**
 * Create Dodo Payments Products
 *
 * This script creates the required products in Dodo Payments:
 * 1. Standard Listing - Monthly ($9/month)
 * 2. Standard Listing - Yearly ($39/year)
 * 3. Expedited Listing - One-time ($49)
 *
 * Run with: npx tsx scripts/create-dodo-products.ts
 */

import DodoPayments from "dodopayments"
import "dotenv/config"

// Check for --live flag to use production mode
const args = process.argv.slice(2)
const isLive = args.includes("--live")
const environment = isLive ? "live_mode" : "test_mode"

// Use the appropriate API key based on mode
const API_KEY = isLive
    ? process.env.DODO_PAYMENTS_LIVE_API_KEY
    : process.env.DODO_PAYMENTS_API_KEY

if (!API_KEY || API_KEY === "dummy_dodo_key") {
    console.error(`❌ Error: Please set a valid ${isLive ? "DODO_PAYMENTS_LIVE_API_KEY" : "DODO_PAYMENTS_API_KEY"} in your .env file`)
    console.log("\n📝 To get your API key:")
    console.log("   1. Go to https://app.dodopayments.com")
    console.log("   2. Navigate to Developer → API Keys")
    console.log("   3. Create a new API key and add it to your .env file")
    process.exit(1)
}

console.log(`🔧 Environment: ${environment}`)
if (isLive) {
    console.log("⚠️  WARNING: Creating products in LIVE mode!")
}

const dodo = new DodoPayments({
    bearerToken: API_KEY,
    environment: environment,
})

async function createProducts() {
    console.log(`\n🚀 Creating Dodo Payments products in ${environment}...\n`)

    try {
        // 1. Create Monthly Subscription ($9/month)
        console.log("📦 Creating Standard Listing - Monthly ($9/month)...")
        const monthlyProduct = await dodo.products.create({
            name: "Standard Listing - Monthly",
            description:
                "Get your cold email tool listed on ColdEmailKit. SEO optimized with high domain authority backlinks.",
            tax_category: "saas",
            price: {
                type: "recurring_price",
                currency: "USD",
                price: 900, // $9 in cents
                discount: 0,
                purchasing_power_parity: false,
                payment_frequency_count: 1,
                payment_frequency_interval: "Month",
                subscription_period_count: 1,
                subscription_period_interval: "Month",
            },
            metadata: {
                plan_type: "listing",
                billing_interval: "monthly",
            },
        })
        console.log(`   ✅ Created: ${monthlyProduct.product_id}`)

        // 2. Create Yearly Subscription ($39/year)
        console.log("\n📦 Creating Standard Listing - Yearly ($39/year)...")
        const yearlyProduct = await dodo.products.create({
            name: "Standard Listing - Yearly",
            description:
                "Get your cold email tool listed on ColdEmailKit for a full year. SEO optimized with high domain authority backlinks. Save with annual billing!",
            tax_category: "saas",
            price: {
                type: "recurring_price",
                currency: "USD",
                price: 3900, // $39 in cents
                discount: 0,
                purchasing_power_parity: false,
                payment_frequency_count: 1,
                payment_frequency_interval: "Year",
                subscription_period_count: 1,
                subscription_period_interval: "Year",
            },
            metadata: {
                plan_type: "listing",
                billing_interval: "yearly",
            },
        })
        console.log(`   ✅ Created: ${yearlyProduct.product_id}`)

        // 3. Create Expedited One-Time ($49)
        console.log("\n📦 Creating Expedited Listing - One-Time ($49)...")
        const expeditedProduct = await dodo.products.create({
            name: "Expedited Listing",
            description:
                "Skip the queue and get your cold email tool listed within 24 hours. Priority support included.",
            tax_category: "saas",
            price: {
                type: "one_time_price",
                currency: "USD",
                price: 4900, // $49 in cents
                discount: 0,
                purchasing_power_parity: false,
            },
            metadata: {
                plan_type: "expedited",
                billing_interval: "one_time",
            },
        })
        console.log(`   ✅ Created: ${expeditedProduct.product_id}`)

        // Summary
        console.log("\n" + "=".repeat(60))
        console.log("✅ All products created successfully!")
        console.log("=".repeat(60))
        console.log("\n📋 Product IDs to add to config/subscriptions.ts:\n")
        console.log(`   Monthly:   ${monthlyProduct.product_id}`)
        console.log(`   Yearly:    ${yearlyProduct.product_id}`)
        console.log(`   Expedited: ${expeditedProduct.product_id}`)
        console.log("\n" + "=".repeat(60))

        // Return the IDs for use in config
        return {
            monthly: monthlyProduct.product_id,
            yearly: yearlyProduct.product_id,
            expedited: expeditedProduct.product_id,
        }
    } catch (error: any) {
        console.error("\n❌ Error creating products:", error.message)
        if (error.response) {
            console.error("Response:", error.response.data)
        }
        throw error
    }
}

// List existing products
async function listProducts() {
    console.log("\n📃 Listing existing products...\n")
    try {
        const products = await dodo.products.list()
        for await (const product of products) {
            console.log(
                `   - ${product.name} (${product.product_id}) - $${(product.price ?? 0) / 100}`,
            )
        }
    } catch (error: any) {
        console.error("Error listing products:", error.message)
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2)

    if (args.includes("--list")) {
        await listProducts()
    } else {
        const productIds = await createProducts()

        // Generate the config update
        console.log("\n📝 Update your config/subscriptions.ts with:\n")
        console.log(`export const products: Product[] = [
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
        id: "${productIds.monthly}",
        unit_amount: 900,  // $9
        currency: "usd",
        interval: "month",
        type: "recurring",
      },
      {
        id: "${productIds.yearly}",
        unit_amount: 3900,  // $39
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
        id: "${productIds.expedited}",
        unit_amount: 4900,  // $49
        currency: "usd",
        type: "one_time",
      },
    ],
  },
]`)
    }
}

main().catch(console.error)
