"use server"

import { slugify } from "@primoui/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"
import { integrationSchema } from "~/server/admin/integrations/schema"
import { db } from "~/services/db"

export const upsertIntegration = adminProcedure
    .createServerAction()
    .input(integrationSchema)
    .handler(async ({ input: { id, tools, ...input } }) => {
        const toolIds = tools?.map(id => ({ id }))
        const slug = input.slug || slugify(input.name)

        const integration = await db.integration.upsert({
            where: { id: id ?? "" },
            create: {
                ...input,
                slug,
                tools: { connect: toolIds },
            },
            update: {
                ...input,
                slug,
                tools: { set: toolIds },
            },
        })

        revalidatePath("/admin/integrations")
        revalidateTag("integrations")
        revalidateTag(`integration-${integration.slug}`)

        return integration
    })

export const deleteIntegrations = adminProcedure
    .createServerAction()
    .input(z.object({ ids: z.array(z.string()) }))
    .handler(async ({ input: { ids } }) => {
        await db.integration.deleteMany({
            where: { id: { in: ids } },
        })

        revalidatePath("/admin/integrations")
        revalidateTag("integrations")

        return true
    })
