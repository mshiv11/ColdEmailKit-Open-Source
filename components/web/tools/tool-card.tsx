import { formatNumber } from "@primoui/utils"
import { cx } from "cva"
import { formatDistanceToNowStrict } from "date-fns"
import type { ComponentProps } from "react"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { BrandLink } from "~/components/web/ui/brand-link"
import { Favicon } from "~/components/web/ui/favicon"
import { Insights } from "~/components/web/ui/insights"
import { Tooltip } from "~/components/common/tooltip"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { StarRating } from "~/components/web/tools/star-rating"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const hasMoreInfo = tool.description || !!tool.alternatives.length
  const lastCommitDate =
    tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true })

  const insights = [
    {
      label: "Reviews",
      value: formatNumber(tool.totalReviews ?? 0, "standard"),
      icon: <Icon name="lucide/star" />,
    },
    {
      label: "Trust Score",
      value: `${tool.trustScore ?? 0}%`,
      icon: <Icon name="lucide/shield" />,
    },
    tool.pricingStarting
      ? {
        label: "Starting Price",
        value: tool.pricingStarting,
        icon: <Icon name="lucide/dollar-sign" />,
      }
      : undefined,
    { label: "Last commit", value: lastCommitDate, icon: <Icon name="lucide/timer" /> },
  ]

  return (
    <Card asChild {...props}>
      <Link href={`/tools/${tool.slug}`}>
        <CardHeader wrap={false}>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <H4 as="h3" className="truncate">
                {tool.name}
              </H4>
              {tool.isFeatured && (
                <Tooltip tooltip="Featured Tool">
                  <Icon
                    name="lucide/crown"
                    className="size-4 text-orange-500 fill-current shrink-0"
                    aria-label="Featured Tool"
                  />
                </Tooltip>
              )}
              {tool.ownerId && <VerifiedBadge size="md" />}
            </div>

            <StarRating
              rating={tool.overallRating || 0}
              className="gap-1.5"
            />
          </div>

          <ToolBadges tool={tool} className="ml-auto self-start" />
        </CardHeader>

        <div className="relative size-full flex flex-col">
          {hasMoreInfo && (
            <Stack
              size="lg"
              direction="column"
              wrap={false}
              className="absolute inset-0 z-10 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {tool.description && (
                <CardDescription className="line-clamp-4">{tool.description}</CardDescription>
              )}

              {!!tool.alternatives.length && (
                <Stack size="sm" className="mt-auto">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    <span className="sr-only">Free </span>Alternative to:
                  </span>

                  {tool.alternatives.map(({ slug, name, faviconUrl }) => (
                    <BrandLink key={slug} name={name} faviconUrl={faviconUrl} />
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          <Stack
            size="lg"
            direction="column"
            className={cx(
              "flex-1",
              hasMoreInfo && "transition-opacity duration-200 group-hover:opacity-0",
            )}
          >
            {tool.tagline && <CardDescription>{tool.tagline}</CardDescription>}
            <Insights
              insights={insights.filter((i): i is NonNullable<typeof i> => !!i && !!i.value)}
              className="mt-auto"
            />
          </Stack>
        </div>
      </Link>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  const insights = [
    { label: "Reviews", value: <Skeleton className="h-4 w-16" />, icon: <Icon name="lucide/star" /> },
    {
      label: "Trust Score",
      value: <Skeleton className="h-4 w-14" />,
      icon: <Icon name="lucide/shield" />,
    },
    {
      label: "Last commit",
      value: <Skeleton className="h-4 w-20" />,
      icon: <Icon name="lucide/timer" />,
    },
  ]

  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-50" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <Stack size="sm">
        <Insights insights={insights} className="mt-auto animate-pulse" />
      </Stack>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
