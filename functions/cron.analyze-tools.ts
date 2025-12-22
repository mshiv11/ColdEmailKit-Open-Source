import { ToolStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import { analyzeRepositoryIntegration } from "~/lib/integration-analysis"
import { inngest } from "~/services/inngest"

export const analyzeTools = inngest.createFunction(
  { id: `${config.site.slug}.analyze-tools` },
  { cron: "TZ=Europe/Warsaw 0 0 * * 1" }, // Every Monday at midnight

  async ({ step, db, logger }) => {
    const batchSize = 5

    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
        select: { id: true, repositoryUrl: true },
      })
    })

    await step.run("analyze-repository-integrations", async () => {
      for (let i = 0; i < tools.length; i += batchSize) {
        const batch = tools.slice(i, i + batchSize)

        const promises = batch.map(async (tool, index) => {
          // Skip tools without a repository URL
          if (!tool.repositoryUrl) {
            return null
          }

          logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}, tool ${index + 1}`)

          // Get analysis and cache it
          const integration = await analyzeRepositoryIntegration(tool.repositoryUrl)

          // Update tool with new integration
          return await db.tool.update({
            where: { id: tool.id },
            data: { integrations: { set: integration.map(slug => ({ slug })) } },
          })
        })

        await Promise.all(promises)
      }
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("tools")
      revalidateTag("tool")
    })
  },
)
