"use client"

import type { Integration } from "@prisma/client"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog"
import { Icon } from "~/components/common/icon"
import { deleteIntegrations } from "~/server/admin/integrations/actions"

type IntegrationsDeleteDialogProps = ComponentProps<typeof Dialog> & {
  integrations: Pick<Integration, "id" | "name">[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const IntegrationsDeleteDialog = ({
  integrations,
  showTrigger = true,
  onSuccess,
  ...props
}: IntegrationsDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteIntegrations, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Integrations deleted")
      onSuccess?.()
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md" prefix={<Icon name="lucide/trash" />}>
            Delete ({integrations.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{integrations.length}</span>
            {integrations.length === 1 ? " integration" : " integrations"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            size="md"
            variant="destructive"
            className="min-w-28"
            onClick={() => execute({ ids: integrations.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
