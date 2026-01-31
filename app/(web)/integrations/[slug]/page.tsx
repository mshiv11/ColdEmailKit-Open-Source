import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { IntegrationCategories } from "~/app/(web)/integrations/[slug]/categories"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import {
  generateCollectionPageSchema,
  jsonLdScriptProps,
  wrapInGraph,
} from "~/lib/schemas"
import type { IntegrationOne } from "~/server/web/integrations/payloads"
import { findIntegrationBySlug, findIntegrationSlugs } from "~/server/web/integrations/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getIntegration = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const integration = await findIntegrationBySlug(slug)

  if (!integration) {
    notFound()
  }

  return integration
})

const getMetadata = (integration: IntegrationOne): Metadata => {
  return {
    title: `Top Cold Email Tools with ${integration.name} Integration`,
    description: `A curated collection of the ${integration._count.tools} best cold email tools with ${integration.name} Integration. Find the most popular and trending tools to learn from, contribute to, or use in your own projects.`,
  }
}

export const generateStaticParams = async () => {
  const integrations = await findIntegrationSlugs({})
  return integrations.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const integration = await getIntegration(props)
  const url = `/integrations/${integration.slug}`

  // Generate keywords for integration page
  const keywords = [
    `${integration.name} integration`,
    `cold email tools ${integration.name}`,
    `${integration.name} email automation`,
    "cold email integrations",
    "email outreach tools",
  ]

  return {
    ...getMetadata(integration),
    keywords,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function IntegrationPage(props: PageProps) {
  const integration = await getIntegration(props)
  const { title, description } = getMetadata(integration)

  // Generate CollectionPage JSON-LD schema for SEO
  const collectionPageSchema = generateCollectionPageSchema({
    name: `${title}`,
    description: `${description}`,
    url: `/integrations/${integration.slug}`,
    numberOfItems: integration._count.tools,
  })

  const jsonLd = wrapInGraph(collectionPageSchema)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/integrations",
            name: "Integrations",
          },
          {
            href: `/integrations/${integration.slug}`,
            name: integration.name,
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ integrations: { some: { slug: integration.slug } } }}
          search={{ placeholder: `Search tools with ${integration.name} Integration...` }}
        />
      </Suspense>

      <Suspense>
        <IntegrationCategories integration={integration} />
      </Suspense>

      {/* JSON-LD CollectionPage Schema for SEO */}
      <script {...jsonLdScriptProps(jsonLd)} />
    </>
  )
}
