import type { Integration } from "@prisma/client"
import { IntegrationType } from "@prisma/client"
import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
} from "nuqs/server"
import { z } from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const integrationsTableParamsSchema = {
    name: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(25),
    sort: getSortingStateParser<Integration>().withDefault([{ id: "name", desc: false }]),
    from: parseAsString.withDefault(""),
    to: parseAsString.withDefault(""),
    operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const integrationsTableParamsCache = createSearchParamsCache(integrationsTableParamsSchema)
export type IntegrationsTableSchema = Awaited<ReturnType<typeof integrationsTableParamsCache.parse>>

export const integrationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    type: z.nativeEnum(IntegrationType).default("Language"),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    faviconUrl: z.string().url().optional().or(z.literal("")),
    tools: z.array(z.string()).optional(),
})

export type IntegrationSchema = z.infer<typeof integrationSchema>
