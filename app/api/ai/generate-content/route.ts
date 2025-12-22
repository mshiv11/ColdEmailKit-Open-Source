import { google } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import { withAdminAuth } from "~/lib/auth-hoc"
import { scrapeWebsiteData } from "~/lib/scraper"
import { contentSchema } from "~/server/admin/shared/schema"

export const maxDuration = 120

const generateContentSchema = z.object({
  url: z.string().url(),
})

export const POST = withAdminAuth(async req => {
  try {
    const { url } = generateContentSchema.parse(await req.json())

    // Step 1: Use Jina to scrape and research the tool's website
    let scrapedData
    try {
      scrapedData = await scrapeWebsiteData(url)
    } catch (scrapeError) {
      console.error("Jina scraping error:", scrapeError)
      return new Response(
        JSON.stringify({ error: "Failed to scrape website. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    // Limit content length to prevent token overflow
    const maxContentLength = 15000
    const truncatedContent = scrapedData.content?.slice(0, maxContentLength) || ""

    // Step 2: Generate structured content like a cold email expert
    const result = streamObject({
      model: google("gemini-2.0-flash"),
      schema: contentSchema,
      system: `You are a cold email expert and software reviewer who has hands-on experience with email outreach tools. 
You write content that helps readers make informed decisions quickly.

Your writing style:
- Direct and practical, like talking to a colleague
- Specific with numbers, pricing, and concrete examples
- Honest about limitations - you've tested these tools yourself
- No marketing fluff or buzzwords like "Empower", "Revolutionary", "Streamline", "Cutting-edge", "Game-changer"
- Focus on what matters for cold email campaigns: deliverability, automation, personalization, scalability, pricing

When writing content, follow this exact Markdown structure:

## Key Features
- **Feature Name**: Practical description of what it does and why it matters for cold email

## Pros and Cons

### Pros
- **Pro Name**: Clear advantage with specific benefit

### Cons
- **Con Name**: Honest limitation users should know about

## Pricing
| Plan | Price | Features |
|------|-------|----------|
| Plan Name | $X/mo | Key features included |

**Free trial**: Yes/No with duration
**Starting from**: Entry price

Be factual. If you don't know specific pricing, say "Check website for current pricing" rather than making it up.`,
      temperature: 0.4,
      prompt: `Research and analyze this cold email tool:

Tool Website: ${url}
Page Title: ${scrapedData.title || "Unknown"}
Meta Description: ${scrapedData.description || "No description"}

Website Content:
${truncatedContent}

Based on this information, generate:
1. A compelling tagline (max 60 chars) - focus on the main benefit
2. A meta description (max 160 chars) - summarize key value
3. Detailed content with Key Features, Pros and Cons, and Pricing sections

Write as if you've personally used this tool for cold email campaigns. Be specific and helpful.`,
      onError: error => {
        console.error("Content generation error:", error)
        throw error
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Generate content API error:", error)
    return new Response(
      JSON.stringify({ error: "Content generation failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})

