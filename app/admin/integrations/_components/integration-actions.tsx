"use client"

import type { Integration } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { IntegrationsDeleteDialog } from "~/app/admin/integrations/_components/integrations-delete-dialog"
import { Button } from "~/components/common/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { cx } from "~/utils/cva"

type IntegrationActionsProps = ComponentProps<typeof Button> & {
    integration: Pick<Integration, "id" | "slug" | "name">
}

export const IntegrationActions = ({ integration, className, ...props }: IntegrationActionsProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Open menu"
                    variant="secondary"
                    size="sm"
                    prefix={<Icon name="lucide/ellipsis" />}
                    className={cx("data-[state=open]:bg-accent", className)}
                    {...props}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {pathname !== `/admin/integrations/${integration.slug}` && (
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/integrations/${integration.slug}`}>Edit</Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                    <Link href={`/integrations/${integration.slug}`} target="_blank">
                        View
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>

            <IntegrationsDeleteDialog
                open={isDeleteOpen}
                onOpenChange={() => setIsDeleteOpen(false)}
                integrations={[integration]}
                showTrigger={false}
                onSuccess={() => router.push("/admin/integrations")}
            />
        </DropdownMenu>
    )
}
