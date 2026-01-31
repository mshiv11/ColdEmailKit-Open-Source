import { redirect } from "next/navigation"
import { type SearchParams, createLoader, parseAsString } from "nuqs/server"
import { Plan } from "~/components/web/plan"
import { getProductFeatures, getProducts, prepareProductsWithPrices } from "~/lib/products"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { countSubmittedTools } from "~/server/web/tools/queries"

type SubmitProductsProps = {
  tool: ToolOne
  searchParams: Promise<SearchParams>
}

export const SubmitProducts = async ({ tool, searchParams }: SubmitProductsProps) => {
  const loadSearchParams = createLoader({ discountCode: parseAsString.withDefault("") })
  const { discountCode } = await loadSearchParams(searchParams)

  const [queueLength] = await Promise.all([
    // Queue length
    countSubmittedTools({}),
  ])

  const isPublished = isToolPublished(tool)
  const coupon = undefined // TODO: Add Dodo coupon support
  const products = getProducts(isPublished)
  const productsWithPrices = await prepareProductsWithPrices(products)

  return (
    <>
      {productsWithPrices.map(({ product, prices, isDiscounted, isFeatured }) => (
        <Plan
          key={product.id}
          isFeatured={isFeatured}
          tool={tool}
          plan={product}
          features={getProductFeatures(product, isPublished, queueLength)}
          prices={prices}
          coupon={isDiscounted ? coupon : undefined}
        />
      ))}
    </>
  )
}
