"use server"

import { slugify } from "@primoui/utils"
import { ToolStatus } from "@prisma/client"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { removeS3Directories } from "~/lib/media"
import { notifySubmitterOfToolPublished } from "~/lib/notifications"
import { notifySubmitterOfToolScheduled } from "~/lib/notifications"
import { getToolRepositoryData } from "~/lib/repositories"
import { adminProcedure } from "~/lib/safe-actions"
import { analyzeRepositoryIntegration } from "~/lib/integration-analysis"
import { toolSchema } from "~/server/admin/tools/schema"
import { db } from "~/services/db"
import { tryCatch } from "~/utils/helpers"

export const fetchToolRepositoryData = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })

    if (!tool.repositoryUrl) {
      throw new Error("Tool does not have a repository URL")
    }

    const data = await getToolRepositoryData(tool.repositoryUrl)

    if (!data) {
      throw new Error("Could not fetch repository data")
    }

    await db.tool.update({
      where: { id },
      data,
    })

    revalidateTag(`tool-${tool.slug}`)
    revalidatePath("/admin/tools")
  })

export const upsertTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input }) => {
    const { id, alternatives, categories, integrations, notifySubmitter, ...data } = input

    // Convert empty string to null for unique optional fields
    if (data.repositoryUrl === "") {
      data.repositoryUrl = null
    }

    if (!data.slug) {
      data.slug = slugify(data.name)
    }

    const existingTool = await db.tool.findUnique({
      where: { slug: data.slug },
    })

    if (existingTool && existingTool.id !== id) {
      throw new Error("A tool with this slug already exists")
    }

    const tool = await db.tool.upsert({
      where: { id: id ?? "" },
      create: {
        ...data,
        alternatives: {
          connect: alternatives?.map(id => ({ id })),
        },
        categories: {
          connect: categories?.map(id => ({ id })),
        },
        integrations: {
          connect: integrations?.map(id => ({ id })),
        },
      },
      update: {
        ...data,
        alternatives: {
          set: alternatives?.map(id => ({ id })),
        },
        categories: {
          set: categories?.map(id => ({ id })),
        },
        integrations: {
          set: integrations?.map(id => ({ id })),
        },
      },
    })

    if (notifySubmitter) {
      if (tool.status === ToolStatus.Published && tool.publishedAt) {
        after(async () => {
          await notifySubmitterOfToolPublished(tool)
        })
      } else if (tool.status === ToolStatus.Scheduled && tool.publishedAt) {
        after(async () => {
          await notifySubmitterOfToolScheduled(tool)
        })
      }
    }

    revalidatePath("/admin/tools")
    revalidatePath("/tools")
    revalidatePath(`/tools/${tool.slug}`)
    revalidateTag(`tool-${tool.slug}`)

    return tool
  })

export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true },
    })

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    })

    for (const tool of tools) {
      if (tool.slug) {
        await removeS3Directories([`tools/${tool.slug}`])
      }
    }

    revalidatePath("/admin/tools")
    revalidatePath("/tools")
  })

export const analyzeToolIntegration = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })

    // Get analysis and cache it
    const integration = await analyzeRepositoryIntegration(tool.repositoryUrl)

    // Update tool with new integration
    await db.tool.update({
      where: { id: tool.id },
      data: { integrations: { set: integration.map(slug => ({ slug })) } },
    })

    // Revalidate the tool
    revalidateTag(`tool-${tool.slug}`)
  })
