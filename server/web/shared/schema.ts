import { ReportType } from "@prisma/client"
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server"
import { z } from "zod"
import { config } from "~/config"

export const filterParamsSchema = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault("default"),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(35),
  alternative: parseAsArrayOf(parseAsString).withDefault([]),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  integration: parseAsArrayOf(parseAsString).withDefault([]),
  license: parseAsArrayOf(parseAsString).withDefault([]),
}

export const filterParamsCache = createSearchParamsCache(filterParamsSchema)
export type FilterSchema = Awaited<ReturnType<typeof filterParamsCache.parse>>

export const submitToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.string().min(1, "Website is required").url("Invalid URL").trim(),
  submitterName: z.string().min(1, "Your name is required"),
  submitterEmail: z.string().email("Please enter a valid email address"),
  submitterNote: z.string().max(200),
  newsletterOptIn: z.boolean().optional().default(true),
})

export const newsletterSchema = z.object({
  captcha: z.literal("").optional(),
  value: z.string().email("Please enter a valid email address"),
  referring_site: z.string().optional().default(config.site.url),
  utm_source: z.string().optional().default(config.site.name),
  utm_medium: z.string().optional().default("subscribe_form"),
  utm_campaign: z.string().optional().default("organic"),
  double_opt_override: z.string().optional(),
  reactivate_existing: z.boolean().optional(),
  send_welcome_email: z.boolean().optional(),
})

export const reportSchema = z.object({
  type: z.nativeEnum(ReportType),
  message: z.string().optional(),
})

export const feedbackSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export const adDetailsSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required").max(160),
  websiteUrl: z.string().url("Please enter a valid website URL"),
  buttonLabel: z.string().optional(),
})

export type SubmitToolSchema = z.infer<typeof submitToolSchema>
export type NewsletterSchema = z.infer<typeof newsletterSchema>
export type ReportSchema = z.infer<typeof reportSchema>
export type FeedbackSchema = z.infer<typeof feedbackSchema>
export type ReviewSchema = z.infer<typeof reviewSchema>
export type AdDetailsSchema = z.infer<typeof adDetailsSchema>
