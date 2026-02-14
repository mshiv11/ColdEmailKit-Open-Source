import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { calculateRating, fetchToolData, generateContent } from "~/lib/intelligence"
import { db } from "~/services/db"

export const maxDuration = 300 // 5 minutes

// Verify Vercel cron secret to prevent unauthorized access
async function verifyCronSecret(req: Request): Promise<boolean> {
  const headersList = await headers()
  const cronSecret = headersList.get("authorization")
  const expectedSecret = process.env.CRON_SECRET

  // If CRON_SECRET is not set, reject all requests in production
  if (!expectedSecret) {
    console.warn("CRON_SECRET not configured")
    return process.env.NODE_ENV !== "production"
  }

  return cronSecret === `Bearer ${expectedSecret}`
}

export async function GET(req: Request) {
  // Verify the request is from Vercel Cron
  if (!(await verifyCronSecret(req))) {
    console.error("Unauthorized cron request attempted")
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Find tools that haven't been updated in 7 days or have no description
    const toolsToUpdate = await db.tool.findMany({
      where: {
        OR: [
          { updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          { description: null },
        ],
        status: "Published", // Only update published tools? Or all?
      },
      take: 5, // Process 5 at a time to avoid timeouts
    })

    if (toolsToUpdate.length === 0) {
      return NextResponse.json({ message: "No tools to update" })
    }

    const results = []

    for (const tool of toolsToUpdate) {
      try {
        console.log(`Processing tool: ${tool.name}`)

        // 1. Gather data from Perplexity
        const rawData = await fetchToolData(tool.websiteUrl)

        // 2. Generate structured content with Mistral
        const structuredData = await generateContent(tool.name, rawData)

        // 3. Calculate rating
        const rating = calculateRating(structuredData)

        // 4. Format content
        const content = `
## Features
${structuredData.features.map(f => `- ${f}`).join("\n")}

## Pros
${structuredData.pros.map(p => `- ${p}`).join("\n")}

## Cons
${structuredData.cons.map(c => `- ${c}`).join("\n")}
        `.trim()

        // 5. Update database
        await db.tool.update({
          where: { id: tool.id },
          data: {
            description: structuredData.description,
            content: content,
            pricingStarting: structuredData.pricing,
            overallRating: rating / 20, // Convert 0-100 to 0-5
            trustScore: rating, // Use 0-100 for trust score
            updatedAt: new Date(),
          },
        })

        results.push({ tool: tool.name, status: "updated" })
      } catch (error) {
        console.error(`Error processing tool ${tool.name}:`, error)
        results.push({ tool: tool.name, status: "failed", error: (error as Error).message })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
