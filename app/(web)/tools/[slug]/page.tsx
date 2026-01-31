import { formatDate } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import type { ImageObject } from "schema-dts"
import { FeaturedTools } from "~/app/(web)/tools/[slug]/featured-tools"
import { RelatedTools } from "~/app/(web)/tools/[slug]/related"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { H2, H5 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { AdButton } from "~/components/web/ads/ad-button"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { Discount } from "~/components/web/discount"
import { ExternalLink } from "~/components/web/external-link"
import { Listing } from "~/components/web/listing"
import { Markdown } from "~/components/web/markdown"
import { OverlayImage } from "~/components/web/overlay-image"
import { RepositoryDetails } from "~/components/web/repository-details"
import { ShareButtons } from "~/components/web/share-buttons"
import { StarRating } from "~/components/web/tools/star-rating"
import { ToolFeaturesDisplay } from "~/components/web/tools/tool-features-display"
import { ToolActions } from "~/components/web/tools/tool-actions"
import { ToolAlternatives } from "~/components/web/tools/tool-alternatives"
import { ToolIntegrations } from "~/components/web/tools/tool-integrations"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { FaviconImage } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { Tag } from "~/components/web/ui/tag"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { metadataConfig } from "~/config/metadata"
import { getToolSuffix, isToolPublished } from "~/lib/tools"
import {
  generateSoftwareApplicationSchema,
  generateBreadcrumbSchema,
  jsonLdScriptProps,
  wrapInGraph,
} from "~/lib/schemas"
import { FAQSchema, generateToolFAQs } from "~/components/web/seo/faq-schema"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findTool, findToolSlugs } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findTool({ where: { slug } })

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne): Metadata => {
  return {
    title: `${tool.name} - Overview, Pricing, Features, Pros, and Cons`,
    description: tool.description,
  }
}

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({})
  return tools.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/tools/${tool.slug}`

  // Generate keywords from categories and topics
  const keywords = [
    tool.name,
    `${tool.name} review`,
    `${tool.name} pricing`,
    `${tool.name} alternatives`,
    ...tool.categories.map(c => c.name),
    ...tool.topics.map(t => t.slug),
    "cold email tools",
    "email outreach",
  ].filter(Boolean)

  return {
    ...getMetadata(tool),
    keywords,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: {
      ...metadataConfig.openGraph,
      url,
      type: "website",
      images: tool.screenshotUrl
        ? [{ url: tool.screenshotUrl, width: 1280, height: 720, alt: `${tool.name} screenshot` }]
        : undefined,
    },
  }
}

export default async function ToolPage(props: PageProps) {
  const tool = await getTool(props)
  const { title } = getMetadata(tool)

  // Build breadcrumb items for schema
  const breadcrumbItems = [
    { name: "Tools", href: "/tools" },
    ...(tool.categories?.[0]
      ? [{ name: tool.categories[0].name, href: `/categories/${tool.categories[0].fullPath}` }]
      : []),
    { name: tool.name, href: `/tools/${tool.slug}` },
  ]

  // Build comprehensive JSON-LD for SEO using centralized utilities
  const softwareAppSchema = generateSoftwareApplicationSchema({
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    screenshotUrl: tool.screenshotUrl,
    faviconUrl: tool.faviconUrl,
    overallRating: tool.overallRating,
    totalReviews: tool.totalReviews,
    pricingStarting: tool.pricingStarting,
    categories: tool.categories,
    isSelfHosted: tool.isSelfHosted,
    repositoryUrl: tool.repositoryUrl,
  })

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems)
  const jsonLd = wrapInGraph(softwareAppSchema, breadcrumbSchema)

  // Generate FAQ content for this tool
  const toolFAQs = generateToolFAQs(tool.name, {
    pricing: tool.pricingStarting,
    category: tool.categories?.[0]?.name,
    hasFreeTrial: true, // Most tools have free trials
  })

  return (
    <div className="flex flex-col gap-6 md:gap-12">
      <Breadcrumbs
        items={[
          { name: "Tools", href: "/tools" },
          ...(tool.categories?.[0]
            ? [
              {
                name: tool.categories[0].name,
                href: `/categories/${tool.categories[0].fullPath}`,
              },
            ]
            : []),
          { name: tool.name, href: `/tools/${tool.slug}` },
        ]}
      />

      <Section>
        <Section.Content className="max-md:contents">
          <div className="flex flex-1 flex-col items-start gap-6 max-md:order-1 md:gap-8">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Stack className="w-full">
                <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" />

                <Stack className="flex-1" direction="column" size="xs">
                  <div className="flex items-center gap-2">
                    <H2 as="h1" className="truncate">
                      {tool.name}
                    </H2>

                    {tool.isFeatured && (
                      <Tooltip tooltip="Featured Tool">
                        <Icon
                          name="lucide/crown"
                          className="size-5 text-orange-500 fill-current shrink-0"
                          aria-label="Featured Tool"
                        />
                      </Tooltip>
                    )}

                    {tool.ownerId && <VerifiedBadge size="lg" />}
                  </div>

                  <StarRating
                    rating={tool.overallRating || 0}
                    totalReviews={tool.totalReviews ?? undefined}
                    trustScore={tool.trustScore || undefined}
                    showTrustScore={!!tool.trustScore}
                  />
                </Stack>

                <ToolActions tool={tool} />
              </Stack>

              {tool.description && <IntroDescription>{tool.description}</IntroDescription>}
            </div>

            {!!tool.alternatives.length && (
              <Stack size="lg" direction="column">
                <Note>Alternative to:</Note>

                <ToolAlternatives alternatives={tool.alternatives} />
              </Stack>
            )}

            <Stack direction="column">
              <Stack className="w-full">
                <Button
                  variant="cta"
                  suffix={<Icon name="lucide/arrow-up-right" />}
                  className="sm:min-w-36"
                  asChild
                >
                  <ExternalLink
                    href={tool.affiliateUrl || tool.websiteUrl}
                    doFollow={tool.isFeatured}
                    eventName="click_website"
                    eventProps={{
                      url: tool.websiteUrl,
                      isFeatured: tool.isFeatured,
                      source: "button",
                    }}
                  >
                    Visit {tool.name}
                  </ExternalLink>
                </Button>

                {tool.isSelfHosted && <AdButton type="SelfHosted" />}
              </Stack>

              <Discount
                amount={tool.discountAmount}
                code={tool.discountCode}
                className="text-xs/tight"
              />
            </Stack>
          </div>

          {tool.screenshotUrl && (
            <OverlayImage
              href={tool.affiliateUrl || tool.websiteUrl}
              doFollow={tool.isFeatured}
              eventName="click_website"
              eventProps={{ url: tool.websiteUrl, isFeatured: tool.isFeatured, source: "image" }}
              src={tool.screenshotUrl}
              alt={`Screenshot of ${tool.name} website`}
              className="max-md:order-2"
            >
              Visit {tool.name}
            </OverlayImage>
          )}

          {tool.content && <Markdown code={tool.content} className="max-md:order-4" />}

          {/* Features & Specifications */}
          <ToolFeaturesDisplay
            specifications={tool.specifications as Parameters<typeof ToolFeaturesDisplay>[0]["specifications"]}
            pricingSpecs={tool.pricingSpecs as Parameters<typeof ToolFeaturesDisplay>[0]["pricingSpecs"]}
            inboxFeatures={tool.inboxFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["inboxFeatures"]}
            warmupFeatures={tool.warmupFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["warmupFeatures"]}
            leadsFeatures={tool.leadsFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["leadsFeatures"]}
            enrichmentFeatures={tool.enrichmentFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["enrichmentFeatures"]}
            copywritingFeatures={tool.copywritingFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["copywritingFeatures"]}
            outreachFeatures={tool.outreachFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["outreachFeatures"]}
            deliverabilityFeatures={tool.deliverabilityFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["deliverabilityFeatures"]}
            linkedinFeatures={tool.linkedinFeatures as Parameters<typeof ToolFeaturesDisplay>[0]["linkedinFeatures"]}
            className="max-md:order-5"
          />

          {/* Categories */}
          {!!tool.categories.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-6">
              <H5 as="strong">Categories:</H5>

              <Stack className="gap-2">
                {tool.categories?.map(({ name, slug, fullPath }) => (
                  <Badge key={slug} size="lg" asChild>
                    <Link href={`/categories/${fullPath}`}>{name}</Link>
                  </Badge>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Topics */}
          {!!tool.topics.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-7">
              <H5 as="strong">Topics:</H5>

              <Stack>
                {tool.topics.map(({ slug }) => (
                  <Tag key={slug} href={`/topics/${slug}`} prefix={<Icon name="lucide/hash" />}>
                    {slug}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Integrations */}
          {!!tool.integrations.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-8">
              <H5 as="strong">Integrations:</H5>

              <ToolIntegrations integrations={tool.integrations} />
            </Stack>
          )}

          <ShareButtons title={`${title}`} direction="column" className="max-md:order-9" />
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          {!isToolPublished(tool) && (
            <Card hover={false} className="bg-yellow-500/10 max-md:order-first">
              <H5>
                This is a preview only.{" "}
                {tool.publishedAt &&
                  `${tool.name} will be published on ${formatDate(tool.publishedAt)}`}
              </H5>

              <Note className="-mt-2">
                {tool.name} is not yet published and is only visible on this page. If you want to
                speed up the process, you can expedite the review below.
              </Note>

              <Button size="md" variant="fancy" prefix={<Icon name="lucide/clock" />} asChild>
                <Link href={`/submit/${tool.slug}`}>Publish within 24h</Link>
              </Button>
            </Card>
          )}

          <RepositoryDetails tool={tool} className="max-md:order-5" />

          {/* Advertisement */}
          <Suspense fallback={<AdCardSkeleton className="max-md:order-3" />}>
            <AdCard where={{ type: "ToolPage" }} className="max-md:order-3" />
          </Suspense>

          {/* Featured */}
          <Suspense>
            <FeaturedTools className="max-md:order-10" />
          </Suspense>
        </Section.Sidebar>
      </Section>

      {/* Related */}
      <Suspense
        fallback={
          <Listing title={`Alternatives similar to ${tool.name}:`}>
            <ToolListSkeleton count={3} />
          </Listing>
        }
      >
        <RelatedTools tool={tool} />
      </Suspense>

      {/* JSON-LD */}
      <script {...jsonLdScriptProps(jsonLd)} />

      {/* FAQ Schema for SEO */}
      <FAQSchema faqs={toolFAQs} />
    </div>
  )
}
