import { IntegrationType } from "@prisma/client"
import { useMemo } from "react"
import { type ComponentProps, Fragment } from "react"
import { H6 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { EmptyList } from "~/components/web/empty-list"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { Grid } from "~/components/web/ui/grid"
import type { IntegrationMany } from "~/server/web/integrations/payloads"
import { cx } from "~/utils/cva"

type IntegrationListProps = ComponentProps<typeof Grid> & {
  integrations: IntegrationMany[]
  showCount?: boolean
}

const integrationTypeOrder = [
  "Language",
  "Framework",
  "Tool",
  "SaaS",
  "Analytics",
  "Monitoring",
  "Cloud",
  "ETL",
  "DB",
  "CI",
  "Hosting",
  "API",
  "Storage",
  "Messaging",
  "App",
  "Network",
  // Add other types if needed
] as const

const IntegrationList = ({ integrations, className, showCount = false, ...props }: IntegrationListProps) => {
  const groupedIntegrations = useMemo(() => {
    return (
      Object.entries(
        integrations.reduce<Record<IntegrationType, IntegrationMany[]>>(
          (acc, integration) => {
            const type = integration.type
            acc[type] = acc[type] || []
            acc[type].push(integration)
            return acc
          },
          {} as Record<IntegrationType, IntegrationMany[]>,
        ),
      ) as [IntegrationType, IntegrationMany[]][]
    ).sort(([a], [b]) => {
      // @ts-expect-error - IntegrationType is a string enum
      return integrationTypeOrder.indexOf(a) - integrationTypeOrder.indexOf(b)
    })
  }, [integrations])

  if (!integrations.length) {
    return <EmptyList>No integrations found for this project. We're working on it!</EmptyList>
  }

  return (
    <div
      className={cx(
        "w-full flex flex-col divide-y divide-foreground/10 overflow-clip border-y border-foreground/10",
        className,
      )}
      {...props}
    >
      {groupedIntegrations.map(([type, integrationList]) => (
        <Fragment key={type}>
          <div className="flex flex-wrap gap-3 py-3 overflow-clip md:gap-4 md:py-4">
            <H6 as="strong" className="relative w-24 mt-0.5 text-foreground md:w-28">
              {type}
              <hr className="absolute -inset-y-5 right-0 z-10 h-auto w-px border-r" />
            </H6>

            <Stack size="lg" className="flex-1">
              {integrationList.map(integration => (
                <BrandLink
                  key={integration.slug}
                  href={`/integrations/${integration.slug}`}
                  name={integration.name}
                  faviconUrl={integration.faviconUrl}
                >
                  {showCount && `(${integration._count.tools})`}
                </BrandLink>
              ))}
            </Stack>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

const IntegrationListSkeleton = () => {
  return (
    <div className="flex flex-col divide-y divide-foreground/10 overflow-clip border-y border-foreground/10">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex flex-wrap gap-3 py-3 overflow-clip md:gap-4 md:py-4">
          <H6 as="strong" className="relative w-24 mt-0.5 text-foreground md:w-28">
            <Skeleton className="h-6 w-20" />
            <hr className="absolute -inset-y-5 right-0 z-10 h-auto w-px border-r" />
          </H6>

          <Stack size="lg" className="flex-1">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-32" />
            ))}
          </Stack>
        </div>
      ))}
    </div>
  )
}

export { IntegrationList, IntegrationListSkeleton }
