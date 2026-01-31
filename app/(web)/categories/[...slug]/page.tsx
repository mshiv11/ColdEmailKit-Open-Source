import { lcFirst } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { Badge } from "~/components/common/badge"
import { H6 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { categoryRedirects } from "~/lib/categories"
import {
  generateCollectionPageSchema,
  generateFAQPageSchema,
  generateItemListSchema,
  jsonLdScriptProps,
  wrapInGraph,
} from "~/lib/schemas"
import { FAQSchema, generateCategoryFAQs } from "~/components/web/seo/faq-schema"
import type { CategoryOne } from "~/server/web/categories/payloads"
import {
  findCategoryByPath,
  findCategoryDescendants,
  findCategorySlugs,
  findCategoryTree,
} from "~/server/web/categories/queries"
import { findTools } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await findCategoryByPath(slug.join("/"))

  if (!category) {
    const categoryRedirect = categoryRedirects.find(c => c.source === slug.join("/"))

    if (categoryRedirect) {
      const url = `/categories/${categoryRedirect.destination}`
      permanentRedirect(url)
    }

    notFound()
  }

  return category
})

const getMetadata = (category: CategoryOne): Metadata => {
  const name = category.label || `${category.name} Tools`
  const descriptionText = category.description
    ? lcFirst(category.description)
    : `${category.name.toLowerCase()} automation, outreach, and email campaigns`

  return {
    title: `${name}`,
    description: `A curated collection of the best cold email tools for ${descriptionText}. Compare features, pricing, and reviews.`,
  }
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ fullPath }) => ({ slug: fullPath.split("/") }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const category = await getCategory(props)
  const url = `/categories/${category.fullPath}`

  // Generate keywords for category page
  const keywords = [
    category.name,
    `${category.name} tools`,
    `best ${category.name} software`,
    "cold email tools",
    "email outreach",
    "cold email software",
  ]

  return {
    ...getMetadata(category),
    keywords,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const category = await getCategory(props)
  const { title, description } = getMetadata(category)

  const [descendants, tree, tools] = await Promise.all([
    findCategoryDescendants(category.slug),
    findCategoryTree(category.fullPath),
    // Fetch tools for schema (limited to top 10 for performance)
    findTools({
      where: { categories: { some: { slug: category.slug } } },
      orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
      take: 10,
    }),
  ])

  // Generate CollectionPage + ItemList JSON-LD schema for SEO
  const itemListSchema = generateItemListSchema(tools, {
    name: `Best ${category.name} Tools`,
    description: `${description}`,
    url: `/categories/${category.fullPath}`,
    itemType: "SoftwareApplication",
    maxItems: 10,
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${title}`,
    description: `${description}`,
    url: `/categories/${category.fullPath}`,
    numberOfItems: category._count.tools,
    mainEntity: itemListSchema,
  })

  const jsonLd = wrapInGraph(collectionPageSchema)

  // Generate FAQ content for category
  const categoryFAQs = generateCategoryFAQs(category.name)

  const breadcrumbItems = [
    {
      href: "/categories",
      name: "Categories",
    },
    ...tree.map(cat => ({
      href: `/categories/${cat.fullPath}`,
      name: cat.label || cat.name,
    })),
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-2xl">{description}</IntroDescription>

        {!!category.subcategories.length && (
          <Stack className="mt-4 max-w-3xl gap-2">
            <H6 as="strong" className="text-secondary-foreground">
              Subcategories:
            </H6>

            {category.subcategories?.map(({ name, slug, fullPath }) => (
              <Badge key={slug} asChild>
                <Link href={`/categories/${fullPath}`}>{name}</Link>
              </Badge>
            ))}
          </Stack>
        )}
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ categories: { some: { slug: { in: descendants } } } }}
          search={{ placeholder: `Search ${category.label}...` }}
        />
      </Suspense>

      {/* JSON-LD CollectionPage Schema for SEO */}
      <script {...jsonLdScriptProps(jsonLd)} />

      {/* FAQ Schema for SEO */}
      <FAQSchema faqs={categoryFAQs} />
    </>
  )
}
