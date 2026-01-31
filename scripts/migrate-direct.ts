import path from "node:path"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

// Load env with debug
const envPath = path.resolve(process.cwd(), ".env")
dotenv.config({ path: envPath, debug: true })

const prisma = new PrismaClient()

async function main() {
  console.log("Searching for Supabase credentials in process.env...")

  let url = ""
  let key = ""

  // Find URL
  for (const k of Object.keys(process.env)) {
    if (k.includes("SUPABASE") && k.includes("URL")) {
      console.log(`Found potential URL key: ${k}`)
      if (!url) url = process.env[k] || ""
    }
  }

  // Find Key
  for (const k of Object.keys(process.env)) {
    if (
      k.includes("SUPABASE") &&
      (k.includes("KEY") || k.includes("SERVICE") || k.includes("ANON"))
    ) {
      console.log(`Found potential KEY key: ${k}`)
      // Prefer service role key
      if (k.includes("SERVICE")) {
        key = process.env[k] || ""
      } else if (!key) {
        key = process.env[k] || ""
      }
    }
  }

  if (!url || !key) {
    console.error("URL:", url)
    console.error("KEY:", key ? "Found" : "Not Found")
    throw new Error("Could not find Supabase credentials in environment variables")
  }

  console.log(`Fetching tools from ${url}...`)

  const response = await fetch(`${url}/rest/v1/tools?select=*`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch tools: ${response.statusText}`)
  }

  const tools = await response.json()
  console.log(`Found ${tools.length} tools to migrate.`)

  for (const tool of tools) {
    console.log(`Processing ${tool.name}...`)

    // Handle categories
    const categoryConnects = []
    if (tool.categories && Array.isArray(tool.categories)) {
      for (const catName of tool.categories) {
        // Simple slugify for category
        const catSlug = catName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

        await prisma.category.upsert({
          where: { slug: catSlug },
          update: {},
          create: {
            name: catName,
            slug: catSlug,
          },
        })
        categoryConnects.push({ slug: catSlug })
      }
    }

    try {
      await prisma.tool.upsert({
        where: { slug: tool.slug },
        update: {
          name: tool.name,
          description: tool.description,
          content: tool.long_description,
          websiteUrl: tool.website,
          faviconUrl: tool.logo,
          repositoryUrl: null, // Ensure this is null if not present
          pricingStarting: tool.pricing_starter,
          stars: 0,
          forks: 0,
          status: "Published", // Default to Published
          isFeatured: tool.featured || false,
          categories: {
            connect: categoryConnects,
          },
        },
        create: {
          slug: tool.slug,
          name: tool.name,
          description: tool.description,
          content: tool.long_description,
          websiteUrl: tool.website,
          faviconUrl: tool.logo,
          repositoryUrl: null,
          pricingStarting: tool.pricing_starter,
          stars: 0,
          forks: 0,
          status: "Published",
          isFeatured: tool.featured || false,
          categories: {
            connect: categoryConnects,
          },
        },
      })
    } catch (error) {
      console.error(`Failed to upsert tool ${tool.name}:`, error)
    }
  }

  console.log("Migration complete.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
