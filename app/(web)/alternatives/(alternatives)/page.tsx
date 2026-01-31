import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { AlternativeListingSkeleton } from "~/components/web/alternatives/alternative-listing"
import { AlternativeQuery } from "~/components/web/alternatives/alternative-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import {
  generateCollectionPageSchema,
  jsonLdScriptProps,
  wrapInGraph,
} from "~/lib/schemas"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Cold Email Tool Alternatives",
  description: "Discover top alternatives to popular cold email tools. Compare features, pricing, and reviews to find the best replacement.",
  keywords: [
    "cold email alternatives",
    "email tool alternatives",
    "email outreach alternatives",
    "cold email software comparison",
    "email marketing alternatives",
  ],
  openGraph: { ...metadataConfig.openGraph, url: "/alternatives" },
  alternates: { ...metadataConfig.alternates, canonical: "/alternatives" },
}

export default function Alternatives(props: PageProps) {
  // Generate CollectionPage JSON-LD schema for SEO
  const collectionPageSchema = generateCollectionPageSchema({
    name: "Cold Email Tool Alternatives",
    description: "Discover top alternatives to popular cold email tools. Compare features, pricing, and reviews to find the best replacement.",
    url: "/alternatives",
  })

  const jsonLd = wrapInGraph(collectionPageSchema)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/alternatives",
            name: "Alternatives",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<AlternativeListingSkeleton />}>
        <AlternativeQuery searchParams={props.searchParams} />
      </Suspense>

      {/* JSON-LD CollectionPage Schema for SEO */}
      <script {...jsonLdScriptProps(jsonLd)} />
    </>
  )
}
