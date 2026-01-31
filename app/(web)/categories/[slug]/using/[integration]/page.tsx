import { lcFirst } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { categoryRedirects } from "~/lib/categories"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { findCategoryBySlug } from "~/server/web/categories/queries"
import type { IntegrationOne } from "~/server/web/integrations/payloads"
import { findIntegrationBySlug } from "~/server/web/integrations/queries"

type PageProps = {
  params: Promise<{ slug: string; integration: string }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug: categorySlug, integration: integrationSlug } = await params
  const [category, integration] = await Promise.all([
    findCategoryBySlug(categorySlug),
    findIntegrationBySlug(integrationSlug),
  ])

  if (!category || !integration) {
    const categoryRedirect = categoryRedirects.find(c => c.source === categorySlug)

    if (categoryRedirect) {
      const url = `/categories/${categoryRedirect.destination.split("/").pop()}/using/${integrationSlug}`
      permanentRedirect(url)
    }

    notFound()
  }

  return { category, integration }
})

const getMetadata = (category: CategoryOne, integration: IntegrationOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Top ${name} using ${integration.name}`,
    description: `A curated collection of the top cold email ${lcFirst(name)} using ${integration.name}. Find and compare tools to enhance your outreach.`,
  }
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { category, integration } = await getCategory(props)
  const url = `/categories/${category.slug}/using/${integration.slug}`

  return {
    ...getMetadata(category, integration),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const { category, integration } = await getCategory(props)
  const { title, description } = getMetadata(category, integration)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/categories",
            name: "Categories",
          },
          {
            href: `/categories/${category.fullPath}`,
            name: category.label || category.name,
          },
          {
            href: `/categories/${category.slug}/using/${integration.slug}`,
            name: `Using ${integration.name}`,
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
          where={{
            categories: { some: { slug: category.slug } },
            integrations: { some: { slug: integration.slug } },
          }}
          search={{ placeholder: `Search ${category.label} using ${integration.name}...` }}
        />
      </Suspense>
    </>
  )
}
