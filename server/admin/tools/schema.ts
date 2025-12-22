import { type Tool, ToolStatus } from "@prisma/client"
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { z } from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const toolsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  sort: getSortingStateParser<Tool>().withDefault([{ id: "createdAt", desc: true }]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  status: parseAsArrayOf(z.nativeEnum(ToolStatus)).withDefault([]),
}

export const toolsTableParamsCache = createSearchParamsCache(toolsTableParamsSchema)
export type ToolsTableSchema = Awaited<ReturnType<typeof toolsTableParamsCache.parse>>

export const toolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  websiteUrl: z.string().min(1, "Website is required").url(),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  repositoryUrl: z.string().optional().or(z.literal("")),
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  faviconUrl: z.string().optional().or(z.literal("")),
  screenshotUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isSelfHosted: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional().or(z.literal("")),
  submitterNote: z.string().optional(),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  totalReviews: z.coerce.number().optional(),
  trustScore: z.coerce.number().optional(),
  pricingStarting: z.string().optional(),
  bestFor: z.string().optional(),
  overallRating: z.coerce.number().min(0).max(5).optional(),

  // Platform-specific ratings and reviews
  g2Rating: z.coerce.number().min(0).max(5).optional(),
  g2Reviews: z.coerce.number().min(0).optional(),
  trustpilotRating: z.coerce.number().min(0).max(5).optional(),
  trustpilotReviews: z.coerce.number().min(0).optional(),
  capterraRating: z.coerce.number().min(0).max(5).optional(),
  capterraReviews: z.coerce.number().min(0).optional(),
  trustradiusRating: z.coerce.number().min(0).max(10).optional(), // TrustRadius uses 0-10 scale
  trustradiusReviews: z.coerce.number().min(0).optional(),
  coldEmailKitRating: z.coerce.number().min(0).max(5).optional(),
  coldEmailKitReviews: z.coerce.number().min(0).optional(),

  publishedAt: z.coerce.date().nullish(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  alternatives: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  notifySubmitter: z.boolean().default(true),
})

export type ToolSchema = z.infer<typeof toolSchema>
