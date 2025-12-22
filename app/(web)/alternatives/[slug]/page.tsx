import { getUrlHostname } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Fragment, Suspense, cache } from "react"
import { RelatedAlternatives } from "~/app/(web)/alternatives/[slug]/related"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { AdCard } from "~/components/web/ads/ad-card"
import { AlternativeCardExternal } from "~/components/web/alternatives/alternative-card-external"
import { AlternativeListSkeleton } from "~/components/web/alternatives/alternative-list"
import { InlineMenu } from "~/components/web/inline-menu"
import { Listing } from "~/components/web/listing"
import { ShareButtons } from "~/components/web/share-buttons"
import { ToolEntry } from "~/components/web/tools/tool-entry"
import { BackButton } from "~/components/web/ui/back-button"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { FaviconImage } from "~/components/web/ui/favicon"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import type { AlternativeOne } from "~/server/web/alternatives/payloads"
import { findAlternative, findAlternativeSlugs } from "~/server/web/alternatives/queries"
import type { CategoryMany } from "~/server/web/categories/payloads"
import { findTool, findToolsWithCategories } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

type CategoryCount = Record<
  string,
  {
    count: number
    category: CategoryMany
  }
>

const getAlternative = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const alternative = await findAlternative({ where: { slug } })

  if (!alternative) {
    notFound()
  }

  return alternative
})

const getMetadata = (alternative: AlternativeOne): Metadata => {
  const year = new Date().getFullYear()
  const count = alternative._count.tools
  const displayCount = count > 10 ? "10+" : count > 1 ? count : ""

  return {
    title: `${displayCount ? `${displayCount} ` : ""}Best ${alternative.name} Alternatives (${year})`,
    description: `A curated collection of the best alternatives to ${alternative.name}. Each listing includes a website screenshot along with a detailed review of its features, pricing & more.`,
  }
}

export const generateStaticParams = async () => {
  const alternatives = await findAlternativeSlugs({})
  return alternatives.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const alternative = await getAlternative(props)
  const url = `/alternatives/${alternative.slug}`

  return {
    ...getMetadata(alternative),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { url, type: "website" },
  }
}

export default async function AlternativePage(props: PageProps) {

  const [alternative, mainTool, tools] = await Promise.all([
    getAlternative(props),
    findTool({ where: { slug: (await props.params).slug } }),

    findToolsWithCategories({
      where: { alternatives: { some: { slug: (await props.params).slug } } },
      orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
    }),
  ])

  // Build ItemList JSON-LD schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${alternative.name} Alternatives`,
    description: `A curated collection of the best alternatives to ${alternative.name}`,
    url: `https://coldemailkit.com/alternatives/${alternative.slug}`,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        url: `https://coldemailkit.com/tools/${tool.slug}`,
        ...(tool.screenshotUrl && { image: tool.screenshotUrl }),
        ...(tool.overallRating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.overallRating,
            ratingCount: tool.totalReviews || 1,
          },
        }),
      },
    })),
  }

  const medalColors = ["text-amber-500", "text-slate-400", "text-orange-700"]
  const { title } = getMetadata(alternative)

  // Sort the categories by count
  const sortedCategories = Object.values(
    tools.reduce<CategoryCount>((acc, tool) => {
      const categories = tool.categories || []

      for (const category of categories) {
        if (!category?.name) continue

        if (!acc[category.name]) {
          acc[category.name] = { count: 0, category }
        }
        acc[category.name].count += 1
      }
      return acc
    }, {}),
  ).sort((a, b) => b.count - a.count)

  // Pick top categories
  const topCategories = sortedCategories.slice(0, 3).map(c => c.category)

  // Pick the top tools
  const bestTools = tools.slice(0, 5).map(tool => (
    <Link key={tool.slug} href={`/tools/${tool.slug}`}>
      {tool.name}
    </Link>
  ))

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/alternatives",
            name: "Alternatives",
          },
          {
            href: `/alternatives/${alternative.slug}`,
            name: alternative.name,
          },
        ]}
      />

      <Section>
        <Section.Content>
          <Intro>
            <IntroTitle>{alternative.name} Alternatives</IntroTitle>

            <IntroDescription className="max-w-4xl">
              {alternative._count.tools
                ? `A curated collection of the ${alternative._count.tools} best alternatives to ${alternative.name}.`
                : `No ${alternative.name} alternatives found yet.`}
            </IntroDescription>
          </Intro>

          {!!tools.length && (
            <Prose>
              <p>
                The best alternative to {alternative.name} is {bestTools.shift()}. If
                that doesn't suit you, we've compiled a{" "}
                <Link href="/about#how-are-rankings-calculated">ranked list</Link> of other
                {alternative.name} alternatives to help you find a suitable replacement.
                {!!bestTools.length && (
                  <>
                    {" "}
                    Other interesting
                    {bestTools.length === 1
                      ? ` alternative to ${alternative.name} is `
                      : ` alternatives to ${alternative.name} are: `}
                    {bestTools.map((alt, index) => (
                      <Fragment key={index}>
                        {index > 0 && index !== bestTools.length - 1 && ", "}
                        {index > 0 && index === bestTools.length - 1 && " and "}
                        {alt}
                      </Fragment>
                    ))}
                    .
                  </>
                )}
              </p>

              {!!topCategories.length && (
                <p>
                  {alternative.name} alternatives are mainly{" "}
                  <Link href={`/categories/${topCategories[0].fullPath}`}>
                    {topCategories[0].label || topCategories[0].name}
                  </Link>
                  {topCategories.length > 1 && " but may also be "}
                  {topCategories.slice(1).map((category, index, arr) => (
                    <Fragment key={category.slug}>
                      {index > 0 && index !== arr.length - 1 && ", "}
                      {index > 0 && index === arr.length - 1 && " or "}
                      <Link href={`/categories/${category.fullPath}`}>
                        {category.label || category.name}
                      </Link>
                    </Fragment>
                  ))}
                  . Browse these if you want a narrower list of alternatives or looking for a
                  specific functionality of {alternative.name}.
                </p>
              )}

              <ShareButtons title={`${title}`} className="not-prose" />
            </Prose>
          )}
        </Section.Content>

        <Section.Sidebar className="max-md:hidden">
          <AlternativeCardExternal alternative={alternative} />
        </Section.Sidebar>
      </Section>

      {!!tools.length && (
        <Section className="mt-4">
          <Section.Content>
            {tools.map((tool, order) => (
              <Fragment key={tool.slug}>
                {(order - 1) % 5 === 0 && (
                  <Card hover={false} className="bg-yellow-500/10" asChild>
                    <Prose>
                      <p>
                        Looking for alternatives to other popular services? Check out
                        other posts in the <Link href="/alternatives">alternatives series</Link> and{" "}
                        <Link href="/">{getUrlHostname(config.site.url)}</Link>, a directory of cold email tools
                        with filters for tags and alternatives for easy browsing and
                        discovery.
                      </p>
                    </Prose>
                  </Card>
                )}

                <ToolEntry id={tool.slug} tool={tool} linkToAffiliate={true} />
              </Fragment>
            ))}

            <BackButton href="/alternatives" />
          </Section.Content>

          <Section.Sidebar className="order-first md:order-last md:max-h-[calc(100vh-5rem)]">
            {(alternative.ad || alternative.adPrice) && (
              <AdCard
                overrideAd={alternative.ad}
                defaultOverride={{ websiteUrl: `/advertise?alternative=${alternative.id}` }}
              />
            )}

            <InlineMenu
              items={tools.map(({ slug, name, faviconUrl }, index) => ({
                id: slug,
                title: name,
                prefix: <FaviconImage src={faviconUrl} title={name} className="size-4" />,
                suffix: index < 3 && <Icon name="lucide/crown" className={medalColors[index]} />,
              }))}
              className="flex-1 lg:mx-5 max-md:hidden"
            >
              <Button
                size="md"
                variant="ghost"
                prefix={<Icon name="lucide/smile-plus" />}
                suffix={<Icon name="lucide/arrow-up-right" />}
                className="font-normal text-muted-foreground hover:outline-none focus-visible:outline-none"
                asChild
              >
                <Link href="/submit">Suggest an alternative</Link>
              </Button>
            </InlineMenu>
          </Section.Sidebar>
        </Section>
      )}

      {/* Related */}
      <Suspense
        fallback={
          <Listing title="Similar alternatives:">
            <AlternativeListSkeleton count={3} />
          </Listing>
        }
      >
        <RelatedAlternatives alternative={alternative} />
      </Suspense>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}

