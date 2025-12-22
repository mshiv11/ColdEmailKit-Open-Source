import type { Metadata } from "next"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { ExternalLink } from "~/components/web/external-link"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
    title: "About Us",
    description: `${config.site.name} is your trusted source for cold email tools and reviews.`,
    openGraph: { ...metadataConfig.openGraph, url: "/about" },
    alternates: { ...metadataConfig.alternates, canonical: "/about" },
}

export default function AboutPage() {
    return (
        <>
            <Intro>
                <IntroTitle>{`${metadata.title}`}</IntroTitle>
                <IntroDescription>{metadata.description}</IntroDescription>
            </Intro>

            <Prose>
                <h3 id="our-story">Our Story</h3>

                <p>
                    Cold Email Kit started as a side project in August 2025, born from a simple frustration:
                    there was no single, reliable source for cold email tools on the internet.
                </p>

                <p>
                    I'm{" "}
                    <ExternalLink href="https://x.com/RiseWins_" doFollow>
                        Rise
                    </ExternalLink>
                    , and I created this platform after experiencing firsthand the overwhelming challenge of
                    navigating the cold email landscape. When I started sending cold emails in January 2025,
                    I struggled with tool fatigue — there were dozens of platforms, each promising to be
                    "the best," but no honest, comprehensive resource to help me choose.
                </p>

                <h3 id="from-idea-to-reality">From Idea to Reality</h3>

                <p>
                    Before building anything, I validated the concept with cold email experts and the Reddit
                    community. The response was clear: I wasn't alone in this struggle. Sales development
                    representatives, agencies, and founders all faced the same problem — too many tools,
                    not enough clarity.
                </p>

                <p>So in August 2025, Cold Email Kit was born.</p>

                <p>
                    The growth exceeded my expectations. Within six weeks, we secured our first sponsor.
                    Our no-nonsense approach to tool reviews resonated with the community, earning us a
                    feature on Reddit and attracting attention from SDRs, agencies, and cold email experts
                    across the industry.
                </p>

                <h3 id="our-mission">Our Mission</h3>

                <p>
                    Cold Email Kit exists to eliminate tool fatigue in the cold email space. We provide
                    critical, to-the-point reviews that cut through the marketing noise and help you make
                    informed decisions about which tools deserve your time and money.
                </p>

                <p>
                    Whether you're a founder sending your first cold email or an agency managing campaigns
                    at scale, we're here to simplify your tool selection process so you can focus on what
                    matters: sending emails that convert.
                </p>

                <hr />

                <p>
                    Questions or feedback? Reach out to{" "}
                    <ExternalLink href="https://x.com/RiseWins_" doFollow>
                        Rise on X/Twitter
                    </ExternalLink>
                    .
                </p>
            </Prose>
        </>
    )
}
