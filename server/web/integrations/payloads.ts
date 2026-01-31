import { Prisma, ToolStatus } from "@prisma/client"

export const integrationOnePayload = Prisma.validator<Prisma.IntegrationSelect>()({
  name: true,
  slug: true,
  type: true,
  faviconUrl: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const integrationManyPayload = Prisma.validator<Prisma.IntegrationSelect>()({
  name: true,
  slug: true,
  type: true,
  description: true,
  faviconUrl: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type IntegrationOne = Prisma.IntegrationGetPayload<{ select: typeof integrationOnePayload }>
export type IntegrationMany = Prisma.IntegrationGetPayload<{
  select: typeof integrationManyPayload
}>
