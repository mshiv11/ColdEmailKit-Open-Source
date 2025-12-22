import { getUrlHostname } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Fragment, Suspense, cache } from "react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { InlineMenu } from "~/components/web/inline-menu"
import { ShareButtons } from "~/components/web/share-buttons"
import { ToolEntry } from "~/components/web/tools/tool-entry"
import { BackButton } from "~/components/web/ui/back-button"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { FaviconImage } from "~/components/web/ui/favicon"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import type { ComplianceOne } from "~/server/web/compliance/payloads"
import { findCompliance, findComplianceSlugs } from "~/server/web/compliance/queries"
import { findToolsWithCategories } from "~/server/web/tools/queries"

type PageProps = {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

const getCompliance = cache(async ({ params }: PageProps) => {
    const { slug } = await params
    const compliance = await findCompliance({ where: { slug } })

    if (!compliance) {
        notFound()
    }

    return compliance
})

const getMetadata = (compliance: ComplianceOne): Metadata => {
    const year = new Date().getFullYear()
    const count = compliance._count.tools
    const displayCount = count > 10 ? "10+" : count > 1 ? count : ""

    return {
        title: `${displayCount ? `${displayCount} ` : ""}Best ${compliance.name} Compliant Tools in ${year}`,
        description: `A curated collection of the best tools that are ${compliance.name} compliant.`,
    }
}

export const generateStaticParams = async () => {
    const compliances = await findComplianceSlugs({})
    return compliances.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
    const compliance = await getCompliance(props)
    const url = `/compliance/${compliance.slug}`

    return {
        ...getMetadata(compliance),
        alternates: { ...metadataConfig.alternates, canonical: url },
        openGraph: { url, type: "website" },
    }
}

export default async function CompliancePage(props: PageProps) {
    const [compliance, tools] = await Promise.all([
        getCompliance(props),

        findToolsWithCategories({
            where: { compliances: { some: { slug: (await props.params).slug } } },
            orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
        }),
    ])

    const medalColors = ["text-amber-500", "text-slate-400", "text-orange-700"]
    const { title } = getMetadata(compliance)

    return (
        <>
            <Breadcrumbs
                items={[
                    {
                        href: "/compliance",
                        name: "Compliance",
                    },
                    {
                        href: `/compliance/${compliance.slug}`,
                        name: compliance.name,
                    },
                ]}
            />

            <Section>
                <Section.Content>
                    <Intro>
                        <IntroTitle>{compliance.name} Compliant Tools</IntroTitle>

                        <IntroDescription className="max-w-4xl">
                            {compliance._count.tools
                                ? `A curated collection of the ${compliance._count.tools} best tools that are ${compliance.name} compliant.`
                                : `No ${compliance.name} compliant tools found yet.`}
                        </IntroDescription>
                    </Intro>

                    {!!tools.length && (
                        <Prose>
                            <p>
                                {compliance.description || `Browse our list of tools that adhere to the ${compliance.name} standard.`}
                            </p>

                            <ShareButtons title={`${title}`} className="not-prose" />
                        </Prose>
                    )}
                </Section.Content>
            </Section>

            {!!tools.length && (
                <Section className="mt-4">
                    <Section.Content>
                        {tools.map((tool, order) => (
                            <Fragment key={tool.slug}>
                                {(order - 1) % 5 === 0 && (
                                    <Card hover={false} className="bg-yellow-500/10" asChild>
                                        <Prose>
                                            <p>
                                                Looking for other compliant tools? Check out
                                                other standards in the <Link href="/compliance">compliance directory</Link> and{" "}
                                                <Link href="/">{getUrlHostname(config.site.url)}</Link>, a directory of cold email tools.
                                            </p>
                                        </Prose>
                                    </Card>
                                )}

                                <ToolEntry id={tool.slug} tool={tool} />
                            </Fragment>
                        ))}

                        <BackButton href="/compliance" />
                    </Section.Content>

                    <Section.Sidebar className="order-first md:order-last md:max-h-[calc(100vh-5rem)]">
                        <InlineMenu
                            items={tools.map(({ slug, name, faviconUrl }, index) => ({
                                id: slug,
                                title: name,
                                prefix: <FaviconImage src={faviconUrl} title={name} className="size-4" />,
                                suffix: index < 3 && <Icon name="lucide/crown" className={medalColors[index]} />,
                            }))}
                            className="flex-1 lg:mx-5 max-md:hidden"
                        >
                            <Button
                                size="md"
                                variant="ghost"
                                prefix={<Icon name="lucide/smile-plus" />}
                                suffix={<Icon name="lucide/arrow-up-right" />}
                                className="font-normal text-muted-foreground hover:outline-none focus-visible:outline-none"
                                asChild
                            >
                                <Link href="/submit">Suggest a tool</Link>
                            </Button>
                        </InlineMenu>
                    </Section.Sidebar>
                </Section>
            )}
        </>
    )
}
