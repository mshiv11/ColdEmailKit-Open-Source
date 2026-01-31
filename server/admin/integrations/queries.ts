import type { Prisma } from "@prisma/client"
import { db } from "~/services/db"

export const findIntegrationList = async (args?: Prisma.IntegrationFindManyArgs) => {
  return db.integration.findMany({
    ...args,
    select: { id: true, name: true, slug: true, type: true, faviconUrl: true },
    orderBy: args?.orderBy ?? { name: "asc" },
  })
}

export const findIntegrationBySlug = async (slug: string) => {
  return db.integration.findUnique({
    where: { slug },
    include: {
      tools: {
        select: { id: true, name: true, slug: true },
      },
    },
  })
}

export const findIntegrationsForTable = async ({
  where,
  orderBy,
  take,
  skip,
}: Prisma.IntegrationFindManyArgs) => {
  return db.$transaction([
    db.integration.findMany({
      where,
      orderBy,
      take,
      skip,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        website: true,
        faviconUrl: true,
        createdAt: true,
        _count: { select: { tools: true } },
      },
    }),
    db.integration.count({ where }),
  ])
}
