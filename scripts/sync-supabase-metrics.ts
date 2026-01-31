import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

const envPath = path.resolve(process.cwd(), ".env")
dotenv.config({ path: envPath })

const prisma = new PrismaClient()

const toolsDataPath = path.resolve(process.cwd(), "scripts/supabase-tools-data.json")
const toolsData = JSON.parse(fs.readFileSync(toolsDataPath, "utf8"))

async function main() {
  console.log(`Found ${toolsData.length} tools to sync.`)
  let updatedCount = 0

  for (const tool of toolsData) {
    let price = tool.pricing_starter
    const model = tool.pricing_model

    // Simple formatting
    if (price && !["Free", "Custom"].includes(price)) {
      if (model && (model.includes("month") || model === "per user/month")) {
        if (!price.includes("/")) price += "/mo"
      } else if (model?.includes("year")) {
        if (!price.includes("/")) price += "/yr"
      }
    }

    try {
      await prisma.tool.update({
        where: { slug: tool.slug },
        data: {
          overallRating: Number(tool.rating),
          totalReviews: Number(tool.review_count),
          trustScore: Number(tool.trust_score),
          pricingStarting: price,
        },
      })
      console.log(`Updated ${tool.slug}: ${price} | ${tool.rating}/5`)
      updatedCount++
    } catch (e: any) {
      // Ignore if tool not found in Neon
      if (e.code === "P2025") {
        console.log(`Skipping ${tool.slug} (not found in Neon)`)
      } else {
        console.log(`Error updating ${tool.slug}: ${e.message}`)
      }
    }
  }
  console.log(`Sync complete. Updated ${updatedCount} tools.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
