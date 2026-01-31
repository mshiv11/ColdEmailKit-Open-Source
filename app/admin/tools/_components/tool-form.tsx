"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { formatDateTime, getRandomString, isValidUrl, slugify } from "@primoui/utils"
import { ToolStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { useServerAction } from "zsa-react"
import { generateFavicon, generateScreenshot } from "~/actions/media"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolGenerateContent } from "~/app/admin/tools/_components/tool-generate-content"
import { ToolPublishActions } from "~/app/admin/tools/_components/tool-publish-actions"
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/common/button"
import { Checkbox } from "~/components/common/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { H3 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Input, inputVariants } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { ExternalLink } from "~/components/web/external-link"
import { Markdown } from "~/components/web/markdown"
import { siteConfig } from "~/config/site"
import { useComputedField } from "~/hooks/use-computed-field"
import { calculateProprietaryRating, formDataToRatingInput } from "~/lib/rating-algorithm"
import { isToolPublished } from "~/lib/tools"
import type { findAlternativeList } from "~/server/admin/alternatives/queries"
import type { findCategoryList } from "~/server/admin/categories/queries"
import type { findIntegrationList } from "~/server/admin/integrations/queries"
import { upsertTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { toolSchema } from "~/server/admin/tools/schema"
import type { ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"
import {
  SpecificationsSection,
  PricingSection,
  InboxSection,
  WarmupSection,
  LeadsSection,
  EnrichmentSection,
  CopywritingSection,
  OutreachSection,
  DeliverabilitySection,
  LinkedInSection,
} from "~/components/admin/features"
import {
  type ToolSpecifications,
  type PricingSpecs,
  type InboxFeatures,
  type WarmupFeatures,
  type LeadsFeatures,
  type EnrichmentFeatures,
  type CopywritingFeatures,
  type OutreachFeatures,
  type DeliverabilityFeatures,
  type LinkedInFeatures,
  parseFeatures,
  defaultSpecifications,
  defaultPricingSpecs,
  defaultInboxFeatures,
  defaultWarmupFeatures,
  defaultLeadsFeatures,
  defaultEnrichmentFeatures,
  defaultCopywritingFeatures,
  defaultOutreachFeatures,
  defaultDeliverabilityFeatures,
  defaultLinkedInFeatures,
} from "~/types/specifications"

const ToolStatusChange = ({ tool }: { tool: ToolOne }) => {
  return (
    <>
      <ExternalLink href={`/tools/${tool.slug}`} className="font-semibold underline inline-block">
        {tool.name}
      </ExternalLink>{" "}
      is now {tool.status.toLowerCase()}.{" "}
      {tool.status === "Scheduled" && (
        <>
          Will be published on {formatDateTime(tool.publishedAt ?? new Date(), "long")} (
          {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
        </>
      )}
    </>
  )
}

// Component to calculate and display proprietary rating metrics
function PlatformRatingsCalculator({
  form,
}: { form: ReturnType<typeof useForm<z.infer<typeof toolSchema>>> }) {
  const [
    g2Rating,
    g2Reviews,
    trustpilotRating,
    trustpilotReviews,
    capterraRating,
    capterraReviews,
    trustradiusRating,
    trustradiusReviews,
    coldEmailKitRating,
    coldEmailKitReviews,
  ] = form.watch([
    "g2Rating",
    "g2Reviews",
    "trustpilotRating",
    "trustpilotReviews",
    "capterraRating",
    "capterraReviews",
    "trustradiusRating",
    "trustradiusReviews",
    "coldEmailKitRating",
    "coldEmailKitReviews",
  ])

  const result = calculateProprietaryRating(
    formDataToRatingInput({
      g2Rating: Number(g2Rating) || 0,
      g2Reviews: Number(g2Reviews) || 0,
      trustpilotRating: Number(trustpilotRating) || 0,
      trustpilotReviews: Number(trustpilotReviews) || 0,
      capterraRating: Number(capterraRating) || 0,
      capterraReviews: Number(capterraReviews) || 0,
      trustradiusRating: Number(trustradiusRating) || 0,
      trustradiusReviews: Number(trustradiusReviews) || 0,
      coldEmailKitRating: Number(coldEmailKitRating) || 0,
      coldEmailKitReviews: Number(coldEmailKitReviews) || 0,
    }),
  )

  // Auto-update the computed fields
  useEffect(() => {
    if (result.proprietaryRating !== null) {
      form.setValue("overallRating", result.proprietaryRating)
    }
    form.setValue("totalReviews", result.totalReviews)
    if (result.trustScore !== null) {
      form.setValue("trustScore", result.trustScore) // Trust Score is already 0-100 percentage
    }
  }, [result.proprietaryRating, result.totalReviews, result.trustScore, form])

  return (
    <div className="mt-4 pt-4 border-t">
      <p className="text-sm font-medium mb-2">Calculated Values (Auto-updated)</p>
      <div className="grid grid-cols-2 @lg:grid-cols-4 gap-4">
        <div className="p-3 bg-background rounded-md border">
          <p className="text-xs text-muted-foreground">Proprietary Rating</p>
          <p className="text-lg font-semibold">
            {result.proprietaryRating !== null ? result.proprietaryRating.toFixed(2) : "N/A"}
          </p>
        </div>
        <div className="p-3 bg-background rounded-md border">
          <p className="text-xs text-muted-foreground">Total Reviews</p>
          <p className="text-lg font-semibold">{result.totalReviews.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-background rounded-md border">
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="text-lg font-semibold">{result.confidenceScore.toFixed(0)}%</p>
        </div>
        <div className="p-3 bg-background rounded-md border">
          <p className="text-xs text-muted-foreground">Trust Score</p>
          <p className="text-lg font-semibold">
            {result.trustScore !== null ? `${result.trustScore}%` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}

interface ToolFormProps extends ComponentProps<"form"> {
  tool?: ToolOne
  alternativesPromise: ReturnType<typeof findAlternativeList>
  categoriesPromise: ReturnType<typeof findCategoryList>
  integrationsPromise: ReturnType<typeof findIntegrationList>
}

export function ToolForm({
  tool,
  alternativesPromise,
  categoriesPromise,
  integrationsPromise,
  className,
  ...props
}: ToolFormProps) {
  const router = useRouter()
  const alternatives = use(alternativesPromise)
  const categories = use(categoriesPromise)
  const integrations = use(integrationsPromise)

  const [isStatusPending, setIsStatusPending] = useState(false)
  const [originalStatus, setOriginalStatus] = useState(tool?.status)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const title = tool ? "Edit Tool" : "Create Tool"

  const form = useForm<z.infer<typeof toolSchema>>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool?.name ?? "",
      slug: tool?.slug ?? "",
      websiteUrl: tool?.websiteUrl ?? "",
      affiliateUrl: tool?.affiliateUrl ?? "",
      tagline: tool?.tagline ?? "",
      description: tool?.description ?? "",
      content: tool?.content ?? "",
      isFeatured: tool?.isFeatured ?? false,
      isSelfHosted: tool?.isSelfHosted ?? false,
      discountCode: tool?.discountCode ?? "",
      discountAmount: tool?.discountAmount ?? "",
      totalReviews: tool?.totalReviews ?? 0,
      trustScore: tool?.trustScore ?? 0,
      pricingStarting: tool?.pricingStarting ?? "",
      bestFor: tool?.bestFor ?? "",
      overallRating: tool?.overallRating ?? 0,
      submitterName: tool?.submitterName ?? "",
      submitterEmail: tool?.submitterEmail ?? "",
      submitterNote: tool?.submitterNote ?? "",
      faviconUrl: tool?.faviconUrl ?? "",
      screenshotUrl: tool?.screenshotUrl ?? "",
      alternatives: tool?.alternatives.map((a: { id: string }) => a.id) ?? [],
      categories: tool?.categories.map((c: { id: string }) => c.id) ?? [],
      integrations: tool?.integrations.map((i: { id: string }) => i.id) ?? [],
      status: tool?.status ?? ToolStatus.Draft,
      publishedAt: tool?.publishedAt ?? null,
      // Platform-specific ratings
      g2Rating: tool?.g2Rating ?? 0,
      g2Reviews: tool?.g2Reviews ?? 0,
      trustpilotRating: tool?.trustpilotRating ?? 0,
      trustpilotReviews: tool?.trustpilotReviews ?? 0,
      capterraRating: tool?.capterraRating ?? 0,
      capterraReviews: tool?.capterraReviews ?? 0,
      trustradiusRating: tool?.trustradiusRating ?? 0,
      trustradiusReviews: tool?.trustradiusReviews ?? 0,
      coldEmailKitRating: tool?.coldEmailKitRating ?? 0,
      coldEmailKitReviews: tool?.coldEmailKitReviews ?? 0,
      // Specifications & Features
      specifications: parseFeatures(tool?.specifications, defaultSpecifications),
      pricingSpecs: parseFeatures(tool?.pricingSpecs, defaultPricingSpecs),
      inboxFeatures: parseFeatures(tool?.inboxFeatures, defaultInboxFeatures),
      warmupFeatures: parseFeatures(tool?.warmupFeatures, defaultWarmupFeatures),
      leadsFeatures: parseFeatures(tool?.leadsFeatures, defaultLeadsFeatures),
      enrichmentFeatures: parseFeatures(tool?.enrichmentFeatures, defaultEnrichmentFeatures),
      copywritingFeatures: parseFeatures(tool?.copywritingFeatures, defaultCopywritingFeatures),
      outreachFeatures: parseFeatures(tool?.outreachFeatures, defaultOutreachFeatures),
      deliverabilityFeatures: parseFeatures(tool?.deliverabilityFeatures, defaultDeliverabilityFeatures),
      linkedinFeatures: parseFeatures(tool?.linkedinFeatures, defaultLinkedInFeatures),
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  })

  // Keep track of the form values
  const [name, slug, websiteUrl, description, content] = form.watch([
    "name",
    "slug",
    "websiteUrl",
    "description",
    "content",
  ])

  // Upsert tool
  const upsertAction = useServerAction(upsertTool, {
    onSuccess: ({ data }) => {
      // If status has changed, show a status change notification
      if (data.status !== originalStatus) {
        toast.success(<ToolStatusChange tool={data} />)
        setOriginalStatus(data.status)
      }

      // Otherwise, just show a success message
      else {
        toast.success(`Tool successfully ${tool ? "updated" : "created"}`)
      }

      // If not updating a tool, or slug has changed, redirect to the new tool
      if (!tool || data.slug !== tool?.slug) {
        router.push(`/admin/tools/${data.slug}`)
      }
    },

    onError: ({ err }) => toast.error(err.message),
    onFinish: () => setIsStatusPending(false),
  })

  // Generate favicon
  const faviconAction = useServerAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.")
      form.setValue("faviconUrl", data)
    },

    onError: ({ err }) => toast.error(err.message),
  })

  // Generate screenshot
  const screenshotAction = useServerAction(generateScreenshot, {
    onSuccess: ({ data }) => {
      toast.success("Screenshot successfully generated. Please save the tool to update.")
      form.setValue("screenshotUrl", data)
    },

    onError: ({ err }) => toast.error(err.message),
  })

  const handleSubmit = form.handleSubmit((data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)?.submitter
    const isStatusChange = submitter?.getAttribute("name") !== "submit"

    if (isStatusChange) {
      setIsStatusPending(true)
    }

    upsertAction.execute({ id: tool?.id, ...data })
  })

  const handleStatusSubmit = (status: ToolStatus, publishedAt: Date | null) => {
    // Update form values
    form.setValue("status", status)
    form.setValue("publishedAt", publishedAt)

    // Submit the form with updated values
    handleSubmit()
  }

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <ToolGenerateContent />

          {tool && <ToolActions tool={tool} size="md" />}
        </Stack>

        {tool && (
          <Note className="w-full">
            {isToolPublished(tool) ? "View:" : "Preview:"}{" "}
            <ExternalLink href={`/tools/${tool.slug}`} className="text-primary underline">
              {siteConfig.url}/{tool.slug}
            </ExternalLink>
            {tool.status === ToolStatus.Scheduled && tool.publishedAt && (
              <>
                <br />
                Scheduled to be published on{" "}
                <strong className="text-foreground">{formatDateTime(tool.publishedAt)}</strong>
              </>
            )}
          </Note>
        )}
      </Stack>

      <form
        onSubmit={handleSubmit}
        className={cx("grid gap-4 @sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliate URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <TextArea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-full items-stretch">
              <Stack className="justify-between">
                <FormLabel>Content</FormLabel>

                {field.value && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPreviewing(prev => !prev)}
                    prefix={
                      isPreviewing ? <Icon name="lucide/pencil" /> : <Icon name="lucide/eye" />
                    }
                    className="-my-1"
                  >
                    {isPreviewing ? "Edit" : "Preview"}
                  </Button>
                )}
              </Stack>

              <FormControl>
                {field.value && isPreviewing ? (
                  <Markdown
                    code={field.value}
                    className={cx(inputVariants(), "max-w-none border leading-normal")}
                  />
                ) : (
                  <TextArea {...field} className="min-h-[300px]" />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 @2xl:grid-cols-2">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSelfHosted"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Self-hosted</FormLabel>
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 @2xl:grid-cols-2">
          <FormField
            control={form.control}
            name="discountCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Amount</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 @2xl:grid-cols-2">
          <FormField
            control={form.control}
            name="totalReviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Reviews</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trustScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trust Score</FormLabel>
                <FormControl>
                  <Input type="number" max={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overallRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating (0-5)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={5} step={0.1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricingStarting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Price</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Free, $10/mo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Platform Ratings Section */}
        <div className="col-span-full border rounded-lg p-4 bg-muted/30">
          <H3 className="mb-4">Platform Ratings</H3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter ratings and review counts from each platform. The proprietary rating will be
            calculated automatically.
          </p>

          <div className="grid gap-4 @lg:grid-cols-2 @2xl:grid-cols-4">
            {/* G2 */}
            <FormField
              control={form.control}
              name="g2Rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>G2 Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      placeholder="e.g. 4.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="g2Reviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>G2 Reviews</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="e.g. 2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trustpilot */}
            <FormField
              control={form.control}
              name="trustpilotRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trustpilot Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      placeholder="e.g. 4.2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trustpilotReviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trustpilot Reviews</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="e.g. 200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capterra */}
            <FormField
              control={form.control}
              name="capterraRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capterra Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      placeholder="e.g. 4.0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capterraReviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capterra Reviews</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="e.g. 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TrustRadius */}
            <FormField
              control={form.control}
              name="trustradiusRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TrustRadius Rating (0-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      placeholder="e.g. 8.6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trustradiusReviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TrustRadius Reviews</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="e.g. 20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ColdEmailKit (Internal) */}
            <FormField
              control={form.control}
              name="coldEmailKitRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ColdEmailKit Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      placeholder="e.g. 4.8"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coldEmailKitReviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ColdEmailKit Reviews</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="e.g. 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Calculated Values Display */}
          <PlatformRatingsCalculator form={form} />
        </div>

        <FormField
          control={form.control}
          name="bestFor"
          render={({ field }) => {
            const options = [
              "Solopreneurs",
              "Agencies",
              "Freelancers",
              "Recruiters",
              "Enterprises",
              "Small business",
            ]
            const selected = field.value ? field.value.split(",") : []

            return (
              <FormItem>
                <FormLabel>Best For</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {options.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`bestFor-${option}`}
                          checked={selected.includes(option)}
                          onCheckedChange={checked => {
                            const newSelected = checked
                              ? [...selected, option]
                              : selected.filter(s => s !== option)
                            field.onChange(newSelected.join(","))
                          }}
                        />
                        <label
                          htmlFor={`bestFor-${option}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Specifications & Features Sections */}
        <div className="col-span-full space-y-2">
          <H3 className="text-base">Specifications & Features</H3>
          <p className="text-sm text-muted-foreground mb-4">
            Detailed specifications and features for comparison. All sections are optional.
          </p>

          <SpecificationsSection
            value={form.watch("specifications") as ToolSpecifications}
            onChange={(val) => form.setValue("specifications", val)}
            defaultOpen={true}
          />

          <PricingSection
            value={form.watch("pricingSpecs") as PricingSpecs}
            onChange={(val) => form.setValue("pricingSpecs", val)}
          />

          <InboxSection
            value={form.watch("inboxFeatures") as InboxFeatures}
            onChange={(val) => form.setValue("inboxFeatures", val)}
          />

          <WarmupSection
            value={form.watch("warmupFeatures") as WarmupFeatures}
            onChange={(val) => form.setValue("warmupFeatures", val)}
          />

          <LeadsSection
            value={form.watch("leadsFeatures") as LeadsFeatures}
            onChange={(val) => form.setValue("leadsFeatures", val)}
          />

          <EnrichmentSection
            value={form.watch("enrichmentFeatures") as EnrichmentFeatures}
            onChange={(val) => form.setValue("enrichmentFeatures", val)}
          />

          <CopywritingSection
            value={form.watch("copywritingFeatures") as CopywritingFeatures}
            onChange={(val) => form.setValue("copywritingFeatures", val)}
          />

          <OutreachSection
            value={form.watch("outreachFeatures") as OutreachFeatures}
            onChange={(val) => form.setValue("outreachFeatures", val)}
          />

          <DeliverabilitySection
            value={form.watch("deliverabilityFeatures") as DeliverabilityFeatures}
            onChange={(val) => form.setValue("deliverabilityFeatures", val)}
          />

          <LinkedInSection
            value={form.watch("linkedinFeatures") as LinkedInFeatures}
            onChange={(val) => form.setValue("linkedinFeatures", val)}
          />
        </div>

        {tool?.submitterEmail && (
          <>
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitter Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitter Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitterNote"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Submitter Note</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Favicon URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={
                    <Icon
                      name="lucide/refresh-cw"
                      className={cx(faviconAction.isPending && "animate-spin")}
                    />
                  }
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || faviconAction.isPending}
                  onClick={() => {
                    faviconAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    })
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Favicon"
                    className="size-8 border box-content rounded-md object-contain"
                  />
                )}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Screenshot URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={
                    <Icon
                      name="lucide/refresh-cw"
                      className={cx(screenshotAction.isPending && "animate-spin")}
                    />
                  }
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || screenshotAction.isPending}
                  onClick={() => {
                    screenshotAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    })
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Screenshot"
                    className="h-8 max-w-32 border box-content rounded-md object-contain"
                  />
                )}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternatives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternatives</FormLabel>
              <RelationSelector
                relations={alternatives}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
                maxSuggestions={10}
                prompt={
                  name &&
                  description &&
                  content &&
                  `From the list of available alternative, proprietary software below, suggest relevant alternatives for this free tool link: 
                  
                  - URL: ${websiteUrl}
                  - Meta title: ${name}
                  - Meta description: ${description}
                  - Content: ${content}. 
                  `
                }
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <RelationSelector
                relations={categories}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
                mapFunction={({ id, name, fullPath }: any) => {
                  const depth = fullPath.split("/").length - 1
                  const prefix = "- ".repeat(depth)
                  return { id, name: `${prefix}${name}` }
                }}
                sortFunction={(a: any, b: any) => {
                  // Split paths into segments for comparison
                  const aSegments = a.fullPath.split("/")
                  const bSegments = b.fullPath.split("/")

                  // Compare each segment
                  for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
                    if (aSegments[i] !== bSegments[i]) {
                      return aSegments[i].localeCompare(bSegments[i])
                    }
                  }

                  // If all segments match up to the shorter path length,
                  // the shorter path comes first
                  return aSegments.length - bSegments.length
                }}
                prompt={
                  name &&
                  description &&
                  `From the list of available categories below, suggest relevant categories for this link: 
                  
                  - URL: ${websiteUrl}
                  - Meta title: ${name}
                  - Meta description: ${description}.
                  `
                }
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="integrations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Integrations</FormLabel>
              <RelationSelector
                relations={integrations}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
                maxSuggestions={10}
                prompt={
                  name &&
                  description &&
                  content &&
                  `From the list of available integrations below, suggest relevant integrations for this tool: 
                  
                  - URL: ${websiteUrl}
                  - Meta title: ${name}
                  - Meta description: ${description}
                  - Content: ${content}. 
                  `
                }
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <ToolPublishActions
            tool={tool}
            isPending={!isStatusPending && upsertAction.isPending}
            isStatusPending={isStatusPending}
            onStatusSubmit={handleStatusSubmit}
          />
        </div>
      </form>
    </Form>
  )
}
