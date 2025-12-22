import type { Metadata } from "next"
import { Suspense } from "react"
import { IntegrationListing } from "~/app/(web)/integrations/(integrations)/listing"
import { IntegrationListSkeleton } from "~/components/web/integrations/integration-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Integrations used in Cold Email Tools",
  description:
    "Discover top integrations powering popular cold email tools. Learn which technologies are trending and widely used. Perfect for finding the right tools to enhance your outreach strategy.",
  openGraph: { ...metadataConfig.openGraph, url: "/integrations" },
  alternates: { ...metadataConfig.alternates, canonical: "/integrations" },
}

export default function Integrations() {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/integrations",
            name: "Integrations",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<IntegrationListSkeleton />}>
        <IntegrationListing />
      </Suspense>
    </>
  )
}
