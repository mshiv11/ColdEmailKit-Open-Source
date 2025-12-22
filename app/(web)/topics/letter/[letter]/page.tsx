import type { Metadata } from "next"
import { Suspense } from "react"
import { TopicListing } from "~/app/(web)/topics/letter/[letter]/listing"
import { LetterPicker } from "~/components/web/letter-picker"
import { TopicListSkeleton } from "~/components/web/topics/topic-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  params: Promise<{ letter: string }>
}

const metadata: Metadata = {
  title: "Cold Email Tool Topics",
  description: "Discover top topics to find your best cold email tool options.",
  robots: { index: false, follow: false }, // Temporarily hidden from search engines
}

export const generateStaticParams = async () => {
  return `${config.site.alphabet}&`.split("").map(letter => ({ letter }))
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { letter } = await params
  const url = `/topics/letter/${letter}`

  return {
    ...metadata,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function Topics(props: PageProps) {
  const params = await props.params
  const letter = decodeURIComponent(params.letter)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/topics",
            name: "Topics",
          },
          {
            href: `/topics/letter/${letter}`,
            name: letter.toUpperCase(),
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <LetterPicker path="/topics/letter" />

      <Suspense fallback={<TopicListSkeleton />}>
        <TopicListing params={props.params} />
      </Suspense>
    </>
  )
}
