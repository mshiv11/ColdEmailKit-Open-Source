"use client"

import type { ComponentProps } from "react"
import { ShowMore } from "~/components/web/show-more"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { IntegrationMany } from "~/server/web/integrations/payloads"

type ToolIntegrationsProps = Omit<ComponentProps<typeof ShowMore>, "items" | "renderItem"> & {
    integrations: IntegrationMany[]
}

export const ToolIntegrations = ({ integrations, limit = 12, ...props }: ToolIntegrationsProps) => {
    if (!integrations.length) return null

    return (
        <ShowMore
            items={integrations}
            limit={limit}
            renderItem={integration => (
                <BrandLink
                    key={integration.slug}
                    href={`/integrations/${integration.slug}`}
                    name={integration.name}
                    faviconUrl={integration.faviconUrl}
                />
            )}
            {...props}
        />
    )
}
