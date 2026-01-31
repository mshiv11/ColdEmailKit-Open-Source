import { ToolStatus } from "@prisma/client"
import { Listing } from "~/components/web/listing"
import { ToolList } from "~/components/web/tools/tool-list"
import type { ToolOne } from "~/server/web/tools/payloads"
import { toolManyPayload } from "~/server/web/tools/payloads"
import { findRelatedTools } from "~/server/web/tools/queries"
import { db } from "~/services/db"

export const RelatedTools = async ({ tool }: { tool: ToolOne }) => {
  try {
    // First, try to get MeiliSearch-based similar tools
    let tools = await findRelatedTools({ id: tool.id })

    // If no results from MeiliSearch, fall back to category-based related tools
    if (!tools.length && tool.categories?.length) {
      const categorySlugs = tool.categories.map(c => c.slug)

      tools = await db.tool.findMany({
        where: {
          status: ToolStatus.Published,
          id: { not: tool.id },
          categories: { some: { slug: { in: categorySlugs } } },
        },
        select: toolManyPayload,
        orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
        take: 3,
      })
    }

    if (!tools.length) {
      return null
    }

    return (
      <Listing title={`Alternatives similar to ${tool.name}:`}>
        <ToolList tools={tools} enableAds={false} />
      </Listing>
    )
  } catch (error) {
    console.error(error)
    return null
  }
}
