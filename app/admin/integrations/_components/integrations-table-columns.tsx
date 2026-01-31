"use client"

import { formatDate } from "@primoui/utils"
import type { Integration } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { IntegrationActions } from "~/app/admin/integrations/_components/integration-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

type IntegrationRow = Pick<
  Integration,
  "id" | "name" | "slug" | "type" | "website" | "faviconUrl" | "createdAt"
> & {
  _count: { tools: number }
}

export const getColumns = (): ColumnDef<IntegrationRow>[] => {
  return [
    {
      id: "select",
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <RowCheckbox
          checked={table.getIsAllPageRowsSelected()}
          ref={input => {
            if (input) {
              input.indeterminate =
                table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
            }
          }}
          onChange={e => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <RowCheckbox
          checked={row.getIsSelected()}
          onChange={e => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      enableHiding: false,
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <DataTableLink
          href={`/admin/integrations/${row.original.slug}`}
          title={row.original.name}
        />
      ),
    },
    {
      accessorKey: "type",
      size: 100,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => <Note>{row.original.type}</Note>,
    },
    {
      accessorKey: "_count.tools",
      size: 80,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tools" />,
      cell: ({ row }) => <Note>{row.original._count.tools}</Note>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => <Note>{formatDate(cell.getValue() as Date)}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <IntegrationActions integration={row.original} className="float-right" />,
    },
  ]
}
