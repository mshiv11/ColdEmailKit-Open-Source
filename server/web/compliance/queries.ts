import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import { complianceManyPayload, complianceOnePayload } from "~/server/web/compliance/payloads"
import { db } from "~/services/db"

export const findCompliances = async ({
    where,
    orderBy,
    ...args
}: Prisma.ComplianceFindManyArgs) => {
    "use cache"

    cacheTag("compliances")
    cacheLife("max")

    return db.compliance.findMany({
        ...args,
        orderBy: orderBy ?? { name: "asc" },
        where: { tools: { some: { status: ToolStatus.Published } }, ...where },
        select: complianceManyPayload,
    })
}

export const findComplianceSlugs = async ({
    where,
    orderBy,
    ...args
}: Prisma.ComplianceFindManyArgs) => {
    "use cache"

    cacheTag("compliances")
    cacheLife("max")

    return db.compliance.findMany({
        ...args,
        orderBy: orderBy ?? { name: "asc" },
        where: { tools: { some: { status: ToolStatus.Published } }, ...where },
        select: { slug: true, updatedAt: true },
    })
}

export const findCompliance = async ({ ...args }: Prisma.ComplianceFindFirstArgs = {}) => {
    "use cache"

    cacheTag("compliance", `compliance-${args.where?.slug}`)
    cacheLife("max")

    return db.compliance.findFirst({
        ...args,
        select: complianceOnePayload,
    })
}
