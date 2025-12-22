"use client"

import type { Integration } from "@prisma/client"
import { useQueryStates } from "nuqs"
import { use, useMemo } from "react"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import { integrationsTableParamsSchema } from "~/server/admin/integrations/schema"
import type { DataTableFilterField } from "~/types"
import { getColumns } from "./integrations-table-columns"
import { IntegrationsTableToolbarActions } from "./integrations-table-toolbar-actions"

type IntegrationRow = Pick<Integration, "id" | "name" | "slug" | "type" | "website" | "faviconUrl" | "createdAt"> & {
    _count: { tools: number }
}

type IntegrationsTableProps = {
    integrationsPromise: Promise<[IntegrationRow[], number]>
}

export function IntegrationsTable({ integrationsPromise }: IntegrationsTableProps) {
    const [integrations, integrationsTotal] = use(integrationsPromise)
    const [{ perPage, sort }] = useQueryStates(integrationsTableParamsSchema)

    const pageCount = Math.ceil(integrationsTotal / perPage)

    // Memoize the columns so they don't re-render on every render
    const columns = useMemo(() => getColumns(), [])

    // Search filters
    const filterFields: DataTableFilterField<IntegrationRow>[] = [
        {
            id: "name",
            label: "Name",
            placeholder: "Search by name...",
        },
    ]

    const { table } = useDataTable({
        data: integrations,
        columns,
        pageCount,
        filterFields,
        shallow: false,
        clearOnDefault: true,
        initialState: {
            pagination: { pageIndex: 0, pageSize: perPage },
            sorting: sort,
            columnPinning: { right: ["actions"] },
        },
        getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    })

    return (
        <DataTable table={table}>
            <DataTableHeader
                title="Integrations"
                total={integrationsTotal}
                callToAction={
                    <Button variant="primary" size="md" prefix={<Icon name="lucide/plus" />} asChild>
                        <Link href="/admin/integrations/new">
                            <div className="max-sm:sr-only">New integration</div>
                        </Link>
                    </Button>
                }
            >
                <DataTableToolbar table={table} filterFields={filterFields}>
                    <IntegrationsTableToolbarActions table={table} />
                    <DateRangePicker align="end" />
                    <DataTableViewOptions table={table} />
                </DataTableToolbar>
            </DataTableHeader>
        </DataTable>
    )
}
