import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { IntegrationsTable } from "~/app/admin/integrations/_components/integrations-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findIntegrationsForTable } from "~/server/admin/integrations/queries"
import { integrationsTableParamsCache } from "~/server/admin/integrations/schema"

type IntegrationsPageProps = {
  searchParams: Promise<SearchParams>
}

const IntegrationsPage = async ({ searchParams }: IntegrationsPageProps) => {
  const search = integrationsTableParamsCache.parse(await searchParams)

  const integrationsPromise = findIntegrationsForTable({
    where: search.name ? { name: { contains: search.name, mode: "insensitive" } } : undefined,
    orderBy: search.sort.length
      ? { [search.sort[0].id]: search.sort[0].desc ? "desc" : "asc" }
      : { name: "asc" },
    take: search.perPage,
    skip: (search.page - 1) * search.perPage,
  })

  return (
    <Suspense fallback={<DataTableSkeleton title="Integrations" />}>
      <IntegrationsTable integrationsPromise={integrationsPromise} />
    </Suspense>
  )
}

export default withAdminPage(IntegrationsPage)
