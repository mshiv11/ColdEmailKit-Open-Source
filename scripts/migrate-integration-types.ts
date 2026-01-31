import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

/**
 * Migration script to safely update integration types
 * Step 1: Add new enum values to the database
 * Step 2: Update existing data
 * Step 3: Remove old enum values
 */

const typeMapping: Record<string, string> = {
    Tool: "Automation",
    SaaS: "Automation",
    Cloud: "Automation",
    ETL: "DataSource",
    Language: "Webhook",
    DB: "DataSource",
    CI: "Automation",
    Framework: "Webhook",
    Hosting: "Webhook",
    API: "Webhook",
    Storage: "DataSource",
    Monitoring: "Analytics",
    App: "Automation",
    Network: "Webhook",
}

const newTypes = ["CRM", "Automation", "Leads", "DataSource", "Inbox", "Warmup", "Verification", "Analytics", "Enrichment", "Calendar", "Messaging", "Webhook"]
const oldTypes = ["Tool", "SaaS", "Cloud", "ETL", "Language", "DB", "CI", "Framework", "Hosting", "API", "Storage", "Monitoring", "App", "Network"]

async function migrateIntegrationTypes() {
    console.log("Starting integration type migration...")

    // Step 1: Add new enum values that don't exist yet
    console.log("\n--- Step 1: Adding new enum values ---")
    for (const newType of newTypes) {
        try {
            await db.$executeRawUnsafe(`ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS '${newType}'`)
            console.log(`Added enum value: ${newType}`)
        } catch (e: any) {
            if (e.message?.includes("already exists")) {
                console.log(`Enum value ${newType} already exists`)
            } else {
                console.log(`Note: ${newType} - ${e.message}`)
            }
        }
    }

    // Step 2: Update existing data to use new types
    console.log("\n--- Step 2: Updating existing data ---")
    for (const [oldType, newType] of Object.entries(typeMapping)) {
        try {
            const result = await db.$executeRawUnsafe(`
        UPDATE "Integration" SET type = '${newType}'::"IntegrationType" 
        WHERE type::text = '${oldType}'
      `)
            console.log(`Updated ${oldType} -> ${newType}`)
        } catch (e: any) {
            console.log(`Error updating ${oldType}: ${e.message}`)
        }
    }

    // Step 3: The old enum values will be removed by Prisma db push
    console.log("\n--- Step 3: Old enum values will be removed by 'bunx prisma db push' ---")
    console.log("Please run: bunx prisma db push")

    console.log("\nMigration completed!")
    await db.$disconnect()
}

migrateIntegrationTypes()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error("Migration failed:", e)
        process.exit(1)
    })
