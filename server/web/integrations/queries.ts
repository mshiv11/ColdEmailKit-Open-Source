import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import { integrationManyPayload, integrationOnePayload } from "~/server/web/integrations/payloads"
import { db } from "~/services/db"

export const findIntegrations = async ({
  where,
  orderBy,
  ...args
}: Prisma.IntegrationFindManyArgs) => {
  "use cache"

  cacheTag("integrations")
  cacheLife("max")

  return db.integration.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: integrationManyPayload,
  })
}

export const findIntegrationSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.IntegrationFindManyArgs) => {
  "use cache"

  cacheTag("integrations")
  cacheLife("max")

  return db.integration.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findIntegrationBySlug = async (slug: string) => {
  "use cache"

  cacheTag("integration", `integration-${slug}`)
  cacheLife("max")

  return db.integration.findFirst({
    where: { slug },
    select: integrationOnePayload,
  })
}
