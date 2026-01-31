import path from "node:path"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

const envPath = path.resolve(process.cwd(), ".env")
dotenv.config({ path: envPath })

const prisma = new PrismaClient()

async function main() {
  const tool = await prisma.tool.findUnique({
    where: { slug: "plusvibe-ai" },
    select: {
      slug: true,
      totalReviews: true,
      overallRating: true,
      pricingStarting: true,
      trustScore: true,
    },
  })
  console.log(JSON.stringify(tool, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
