import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import {
  generateCollectionPageSchema,
  jsonLdScriptProps,
  wrapInGraph,
} from "~/lib/schemas"

export const metadata: Metadata = {
  title: "All Cold Email Tools",
  description: `Browse all cold email tools available on ${config.site.name}. Find the perfect tools for your outreach campaigns.`,
  keywords: [
    "cold email tools",
    "email outreach software",
    "cold email automation",
    "email marketing tools",
    "sales email tools",
    "email deliverability",
  ],
  alternates: { ...metadataConfig.alternates, canonical: "/tools" },
  openGraph: { ...metadataConfig.openGraph, url: "/tools" },
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function ToolsPage(props: PageProps) {
  const breadcrumbItems = [
    {
      href: "/tools",
      name: "Tools",
    },
  ]

  // Generate CollectionPage JSON-LD schema for SEO
  const collectionPageSchema = generateCollectionPageSchema({
    name: "All Cold Email Tools",
    description: `Browse all cold email tools available on ${config.site.name}. Find the perfect tools for your outreach campaigns.`,
    url: "/tools",
  })

  const jsonLd = wrapInGraph(collectionPageSchema)

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <Intro>
        <IntroTitle>All Cold Email Tools</IntroTitle>
        <IntroDescription className="max-w-2xl">
          Browse our collection of {config.site.name} tools.
        </IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          search={{ placeholder: "Search tools..." }}
          overrideParams={{ perPage: 24 }}
        />
      </Suspense>

      {/* JSON-LD CollectionPage Schema for SEO */}
      <script {...jsonLdScriptProps(jsonLd)} />
    </>
  )
}
