import { ToolStatus } from "@prisma/client"
import Link from "next/link"
import { Listing } from "~/components/web/listing"
import { Grid } from "~/components/web/ui/grid"
import { Tile } from "~/components/web/ui/tile"
import { findCategories } from "~/server/web/categories/queries"
import type { IntegrationOne } from "~/server/web/integrations/payloads"

type IntegrationCategoriesProps = {
  integration: IntegrationOne
}

const IntegrationCategories = async ({ integration }: IntegrationCategoriesProps) => {
  const categories = await findCategories({
    where: {
      tools: {
        some: {
          status: ToolStatus.Published,
          integrations: { some: { slug: integration.slug } },
        },
      },
    },
  })

  if (!categories.length) {
    return null
  }

  return (
    <Listing title={`Browse categories with ${integration.name} Integration:`} separated>
      <Grid className="gap-y-3 mt-4">
        {categories.map(category => (
          <Tile key={category.slug} asChild>
            <Link href={`/categories/${category.slug}/integrations/${integration.slug}`}>
              <h6 className="text-muted-foreground text-sm truncate group-hover:text-foreground">
                Best {category.label || category.name} with {integration.name} Integration
              </h6>
            </Link>
          </Tile>
        ))}
      </Grid>
    </Listing>
  )
}

export { IntegrationCategories }
