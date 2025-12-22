"use client"

import { useState, type ComponentProps } from "react"
import { useSession } from "~/lib/auth-client"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ToolClaimDialog } from "~/components/web/dialogs/tool-claim-dialog"
import { ToolReportDialog } from "~/components/web/dialogs/tool-report-dialog"
import { ToolReviewDialog } from "~/components/web/dialogs/tool-review-dialog"
import { cx } from "~/utils/cva"
import type { ToolOne } from "~/server/web/tools/payloads"

type ToolActionsProps = ComponentProps<typeof Stack> & {
  tool: ToolOne
}

export const ToolActions = ({ tool, children, className, ...props }: ToolActionsProps) => {
  const { data: session } = useSession()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isClaimOpen, setIsClaimOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  return (
    <Stack size="sm" wrap={false} className={cx("justify-end", className)} {...props}>
      {!tool.isFeatured && tool.ownerId && tool.ownerId === session?.user.id && (
        <Tooltip tooltip="Promote this tool on the website to get more visibility.">
          <Button
            size="md"
            variant="secondary"
            prefix={<Icon name="lucide/sparkles" className="text-inherit" />}
            className="text-blue-600 dark:text-blue-400"
            asChild
          >
            <Link href={`/submit/${tool.slug}`}>Promote</Link>
          </Button>
        </Tooltip>
      )}

      {!tool.ownerId && (
        <Tooltip tooltip="Claim this tool to get a verified badge and be able to edit it.">
          <Button
            size="md"
            variant="secondary"
            prefix={<Icon name="lucide/badge-check" className="text-inherit" />}
            onClick={() => setIsClaimOpen(true)}
            className="text-blue-600 dark:text-blue-400"
          >
            Claim
          </Button>
        </Tooltip>
      )}

      <Tooltip tooltip="Write a review">
        <Button
          size="md"
          variant="secondary"
          prefix={<Icon name="lucide/star" />}
          onClick={() => setIsReviewOpen(true)}
          aria-label="Review"
        >
          Review
        </Button>
      </Tooltip>

      <Tooltip tooltip="Send a report/suggestion">
        <Button
          size="md"
          variant="secondary"
          prefix={<Icon name="lucide/triangle-alert" />}
          onClick={() => setIsReportOpen(true)}
          aria-label="Report"
        />
      </Tooltip>

      {children}

      <ToolReportDialog tool={tool} isOpen={isReportOpen} setIsOpen={setIsReportOpen} />
      <ToolReviewDialog tool={tool} isOpen={isReviewOpen} setIsOpen={setIsReviewOpen} />

      {!tool.ownerId && (
        <ToolClaimDialog tool={tool} isOpen={isClaimOpen} setIsOpen={setIsClaimOpen} />
      )}
    </Stack>
  )
}
