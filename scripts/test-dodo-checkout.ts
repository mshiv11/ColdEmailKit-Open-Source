/**
 * Test Dodo Payments API
 *
 * Run with: npx tsx scripts/test-dodo-checkout.ts
 */

import DodoPayments from "dodopayments"
import "dotenv/config"

const API_KEY = process.env.DODO_PAYMENTS_API_KEY

if (!API_KEY) {
    console.error("❌ Error: DODO_PAYMENTS_API_KEY not set")
    process.exit(1)
}

const dodo = new DodoPayments({
    bearerToken: API_KEY,
    environment: "test_mode",
})

console.log("🔧 Environment: test_mode")
console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...\n`)

async function testSubscription() {
    console.log("🧪 Testing Subscription (Monthly)...\n")

    try {
        const productId = "pdt_0NXvLWskbSavQknn3lFU5" // Monthly subscription product

        console.log(`📦 Creating subscription for product: ${productId}`)

        const subscription = await dodo.subscriptions.create({
            billing: {
                city: "New York",
                country: "US",
                state: "NY",
                street: "123 Main St",
                zipcode: "10001",
            },
            customer: {
                email: "test@example.com",
                name: "Test Customer",
            },
            product_id: productId,
            quantity: 1,
            payment_link: true,
            return_url: "http://localhost:5173/submit/success",
        })

        console.log("\n✅ Subscription created successfully!")
        console.log("=".repeat(60))
        console.log(`   Subscription ID: ${subscription.subscription_id}`)
        console.log(`   Payment ID: ${subscription.payment_id}`)
        console.log(`   Amount: $${subscription.recurring_pre_tax_amount / 100}`)
        console.log(`   Payment Link: ${subscription.payment_link}`)
        console.log("=".repeat(60))

        return subscription
    } catch (error: any) {
        console.error("\n❌ Error creating subscription:")
        console.error(error.message)
        if (error.error) {
            console.error("API Error:", error.error)
        }
        throw error
    }
}

async function testOneTimePayment() {
    console.log("\n🧪 Testing One-Time Payment (Expedited)...\n")

    try {
        const productId = "pdt_0NXvLWvYLtJEmCdRhL1hj" // Expedited one-time product

        console.log(`📦 Creating payment for product: ${productId}`)

        const payment = await dodo.payments.create({
            billing: {
                city: "New York",
                country: "US",
                state: "NY",
                street: "123 Main St",
                zipcode: "10001",
            },
            customer: {
                email: "test@example.com",
                name: "Test Customer",
            },
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                },
            ],
            payment_link: true,
            return_url: "http://localhost:5173/submit/success",
        })

        console.log("\n✅ Payment created successfully!")
        console.log("=".repeat(60))
        console.log(`   Payment ID: ${payment.payment_id}`)
        console.log(`   Total Amount: $${payment.total_amount / 100}`)
        console.log(`   Payment Link: ${payment.payment_link}`)
        console.log("=".repeat(60))

        return payment
    } catch (error: any) {
        console.error("\n❌ Error creating payment:")
        console.error(error.message)
        if (error.error) {
            console.error("API Error:", error.error)
        }
        throw error
    }
}

async function main() {
    try {
        await testSubscription()
        await testOneTimePayment()
        console.log("\n✅ All tests passed!")
    } catch (error) {
        console.error("\n❌ Tests failed")
        process.exit(1)
    }
}

main()
