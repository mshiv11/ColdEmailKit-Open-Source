import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Check Neon
  const neonCount = await prisma.tool.count()
  console.log(`Total tools in Neon database: ${neonCount}`)

  // Check Supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && key) {
    console.log("Fetching count from Supabase...")
    const response = await fetch(`${url}/rest/v1/tools?select=count`, {
      method: "HEAD",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "count=exact",
      },
    })

    if (response.ok) {
      const contentRange = response.headers.get("content-range")
      console.log("Supabase Content-Range:", contentRange)
      // format: 0-55/56
      if (contentRange) {
        const total = contentRange.split("/")[1]
        console.log(`Total tools in Supabase: ${total}`)
      }
    } else {
      console.error("Failed to fetch count from Supabase:", response.status, response.statusText)
    }
  } else {
    console.log("Skipping Supabase check (credentials missing)")
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
