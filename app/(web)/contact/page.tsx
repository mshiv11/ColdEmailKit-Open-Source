import type { Metadata } from "next"
import { Prose } from "~/components/common/prose"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
    title: "Contact Us",
    description: `Get in touch with the ${config.site.name} team.`,
    openGraph: { ...metadataConfig.openGraph, url: "/contact" },
    alternates: { ...metadataConfig.alternates, canonical: "/contact" },
}

export default function ContactPage() {
    return (
        <>
            <Intro>
                <IntroTitle>{`${metadata.title}`}</IntroTitle>
                <IntroDescription>{metadata.description}</IntroDescription>
            </Intro>

            <Prose>
                <h3 id="get-in-touch">Get in Touch</h3>

                <p>
                    Have questions, suggestions, or want to partner with us? We'd love to hear from you.
                </p>

                <h4>Email</h4>
                <p>
                    For general inquiries, please email us at:{" "}
                    <a href={`mailto:${config.site.email}`}>{config.site.email}</a>
                </p>

                <h4>Advertising</h4>
                <p>
                    Interested in advertising on {config.site.name}? Check out our{" "}
                    <a href="/advertise">advertising options</a> or contact us directly.
                </p>

                <h4>Submit a Tool</h4>
                <p>
                    Want to add your cold email tool to our directory? Visit our{" "}
                    <a href="/submit">submission page</a> to get started.
                </p>
            </Prose>
        </>
    )
}
