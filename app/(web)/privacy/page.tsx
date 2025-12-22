import type { Metadata } from "next"
import { Prose } from "~/components/common/prose"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: `Privacy policy for ${config.site.name}.`,
    openGraph: { ...metadataConfig.openGraph, url: "/privacy" },
    alternates: { ...metadataConfig.alternates, canonical: "/privacy" },
}

export default function PrivacyPage() {
    return (
        <>
            <Intro>
                <IntroTitle>{`${metadata.title}`}</IntroTitle>
                <IntroDescription>Last updated: September 28, 2025</IntroDescription>
            </Intro>

            <Prose>
                <p>
                    Your privacy is important to us. This Privacy Policy explains how Cold Email Kit
                    ("we", "our", or "us") collects, uses, and safeguards information when you use our
                    website and related services (collectively, the "Service").
                </p>

                <h3>Who We Are</h3>
                <p>
                    Cold Email Kit operates an informational directory of outreach tools. If you have
                    questions about this policy or your data, contact us at{" "}
                    <a href="mailto:admin@coldemailkit.com">admin@coldemailkit.com</a>.
                </p>

                <h3>Scope</h3>
                <p>
                    This policy covers information processed when you browse our website, submit a tool,
                    contact us, or otherwise interact with the Service. It does not cover third-party
                    websites or services that we link to.
                </p>

                <h3>Information We Collect</h3>
                <ul>
                    <li>
                        <strong>Information you provide:</strong> content from the "Submit Tool" flow
                        (e.g., tool name, website, descriptions, pricing), contact messages, and any
                        information provided when you communicate with us.
                    </li>
                    <li>
                        <strong>Usage data:</strong> pages visited, referrers, timestamps, and general
                        device/browser information collected in aggregate for performance and security.
                    </li>
                    <li>
                        <strong>Cookies/local storage:</strong> used to support essential site functionality
                        and remember preferences. See "Cookies and Similar Technologies" below.
                    </li>
                    <li>
                        <strong>User-generated content:</strong> reviews or article content you submit
                        (if applicable).
                    </li>
                </ul>

                <h3>How We Use Information</h3>
                <ul>
                    <li>Operate, maintain, and improve the Service and its content.</li>
                    <li>Review and publish submissions, moderate content, and prevent abuse.</li>
                    <li>Respond to inquiries and provide support.</li>
                    <li>Monitor performance, troubleshoot issues, and maintain security.</li>
                    <li>Perform analytics to understand aggregate usage and improve UX.</li>
                    <li>Comply with legal obligations and enforce our terms.</li>
                </ul>

                <h3>Legal Bases for Processing (EEA/UK)</h3>
                <ul>
                    <li><strong>Consent</strong> (e.g., non-essential cookies, optional communications).</li>
                    <li>
                        <strong>Legitimate interests</strong> (e.g., operating, securing, and improving the
                        Service, preventing abuse, analytics in a privacy-conscious manner).
                    </li>
                    <li>
                        <strong>Contract</strong> (e.g., processing submissions you ask us to review/publish).
                    </li>
                    <li><strong>Legal obligation</strong> (e.g., responding to lawful requests, record keeping).</li>
                </ul>

                <h3>Cookies and Similar Technologies</h3>
                <p>
                    We use essential cookies and may use privacy-friendly analytics. You can control
                    cookies via your browser settings. Blocking essential cookies may impact site
                    functionality.
                </p>

                <h3>Sharing and Disclosure</h3>
                <p>
                    We do not sell personal information. We share information only as needed with service
                    providers that help us operate the Service, under appropriate safeguards, for example:
                </p>
                <ul>
                    <li>Hosting and deployment (e.g., static site hosting/CDN).</li>
                    <li>Database and storage (for managing submissions and media).</li>
                    <li>Communications (to respond to your messages).</li>
                    <li>Security and analytics (to protect the Service and understand aggregate usage).</li>
                </ul>

                <h3>International Transfers</h3>
                <p>
                    Our service providers may process data in countries outside your own. Where required,
                    we implement safeguards designed to protect your information in line with applicable laws.
                </p>

                <h3>Data Retention</h3>
                <p>
                    We retain information only as long as necessary for the purposes described above, to
                    comply with legal obligations, resolve disputes, and enforce agreements. Criteria may
                    include account status, the nature of the data, and legal requirements.
                </p>

                <h3>Security</h3>
                <p>
                    We use reasonable administrative, technical, and organizational measures to protect
                    information. No method of transmission or storage is 100% secure, and we cannot
                    guarantee absolute security.
                </p>

                <h3>Your Rights</h3>
                <p>
                    Depending on your location, you may have rights to access, correct, delete, restrict,
                    or object to processing of your information, and to portability. You can also withdraw
                    consent where processing is based on consent. To exercise these rights, contact{" "}
                    <a href="mailto:admin@coldemailkit.com">admin@coldemailkit.com</a>.
                </p>
                <p>
                    You may also have the right to lodge a complaint with your local supervisory authority.
                    We encourage you to contact us first so we can address your concerns.
                </p>

                <h3>Children's Privacy</h3>
                <p>
                    The Service is not directed to children under the age where parental consent is
                    required (e.g., 13/16). We do not knowingly collect personal information from children.
                </p>

                <h3>Changes to This Policy</h3>
                <p>
                    We may update this Privacy Policy from time to time. We will revise the "Last updated"
                    date above when changes are made. Material changes may be communicated more prominently.
                </p>

                <h3>Contact</h3>
                <p>
                    If you have any questions about this policy or our practices, contact us at{" "}
                    <a href="mailto:admin@coldemailkit.com">admin@coldemailkit.com</a>.
                </p>
            </Prose>
        </>
    )
}
