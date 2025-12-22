import { Prisma, ToolStatus } from "@prisma/client"

export const complianceOnePayload = Prisma.validator<Prisma.ComplianceSelect>()({
    id: true,
    name: true,
    slug: true,
    description: true,
    _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const complianceManyPayload = Prisma.validator<Prisma.ComplianceSelect>()({
    id: true,
    name: true,
    slug: true,
    description: true,
    _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type ComplianceOne = Prisma.ComplianceGetPayload<{ select: typeof complianceOnePayload }>
export type ComplianceMany = Prisma.ComplianceGetPayload<{
    select: typeof complianceManyPayload
}>
