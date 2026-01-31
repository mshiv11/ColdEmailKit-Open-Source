"use client"

import type { Integration } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import { IntegrationsDeleteDialog } from "./integrations-delete-dialog"

type IntegrationRow = Pick<Integration, "id" | "name" | "slug">

interface IntegrationsTableToolbarActionsProps {
  table: Table<IntegrationRow>
}

export function IntegrationsTableToolbarActions({ table }: IntegrationsTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <IntegrationsDeleteDialog
          integrations={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
    </>
  )
}
