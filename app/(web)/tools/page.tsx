import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

export const metadata: Metadata = {
    title: "All Tools",
    description: `Browse all tools available on ${config.site.name}.`,
}

type PageProps = {
    searchParams: Promise<SearchParams>
}

export default function ToolsPage(props: PageProps) {
    const breadcrumbItems = [
        {
            href: "/tools",
            name: "Tools",
        },
    ]

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />

            <Intro>
                <IntroTitle>All Tools</IntroTitle>
                <IntroDescription className="max-w-2xl">
                    Browse our collection of {config.site.name} tools.
                </IntroDescription>
            </Intro>

            <Suspense fallback={<ToolListingSkeleton />}>
                <ToolQuery
                    searchParams={props.searchParams}
                    search={{ placeholder: "Search tools..." }}
                    overrideParams={{ perPage: 24 }}
                />
            </Suspense>
        </>
    )
}
