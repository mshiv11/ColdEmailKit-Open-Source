import type { Metadata } from "next"
import { Prose } from "~/components/common/prose"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${config.site.name}.`,
  openGraph: { ...metadataConfig.openGraph, url: "/terms" },
  alternates: { ...metadataConfig.alternates, canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>Last updated: December 22, 2025</IntroDescription>
      </Intro>

      <Prose>
        <p>
          These Terms of Service ("Terms") govern your access to and use of the Cold Email Kit
          website and related services (the "Service"). By accessing or using the Service, you agree
          to be bound by these Terms.
        </p>

        <h3>Eligibility</h3>
        <p>
          You may use the Service only if you are capable of forming a binding contract with us and
          are in compliance with these Terms and all applicable laws.
        </p>

        <h3>Your Content and Submissions</h3>
        <ul>
          <li>
            You may submit content such as tool listings, reviews, feedback, or messages ("User
            Content").
          </li>
          <li>
            You represent and warrant that you own or have the necessary rights to submit User
            Content and that it does not infringe any third-party rights or violate any law.
          </li>
          <li>
            You grant us a worldwide, non-exclusive, royalty-free license to host, store, reproduce,
            modify, publish, and display your User Content for operating and improving the Service.
          </li>
          <li>We may moderate, edit, or remove User Content at our discretion.</li>
        </ul>

        <h3>Intellectual Property</h3>
        <p>
          The Service, including text, graphics, logos, trademarks, and software, is owned by or
          licensed to Cold Email Kit and is protected by applicable intellectual property laws.
          Except as expressly permitted, you may not copy, modify, distribute, or create derivative
          works based on the Service.
        </p>

        <h3>Prohibited Conduct</h3>
        <ul>
          <li>
            Accessing or using the Service for unlawful purposes or in violation of these Terms.
          </li>
          <li>
            Attempting to interfere with or disrupt the integrity or performance of the Service.
          </li>
          <li>Scraping or harvesting data from the Service without our prior written consent.</li>
          <li>
            Uploading malicious code, engaging in abusive behavior, or violating the rights of
            others.
          </li>
        </ul>

        <h3>Third-Party Services and Links</h3>
        <p>
          The Service may reference or link to third-party websites, tools, or services. We do not
          control and are not responsible for third-party content or practices. Links are provided
          for convenience and do not constitute endorsement.
        </p>

        <h3>No Professional Advice</h3>
        <p>
          Content provided by the Service is for informational purposes only and does not constitute
          professional advice. You should conduct your own due diligence before making decisions.
        </p>

        <h3>Disclaimers</h3>
        <p>
          The Service is provided on an "as is" and "as available" basis without warranties of any
          kind, whether express or implied, including, but not limited to, warranties of
          merchantability, fitness for a particular purpose, and non-infringement. We do not warrant
          that the Service will be uninterrupted, secure, or error-free.
        </p>

        <h3>Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, in no event shall Cold Email Kit or its affiliates
          be liable for any indirect, incidental, special, consequential, or punitive damages, or
          any loss of profits or revenues, whether incurred directly or indirectly, or any loss of
          data, use, goodwill, or other intangible losses resulting from (a) your access to or use
          of or inability to access or use the Service; (b) any conduct or content of any third
          party on the Service; or (c) unauthorized access, use, or alteration of your transmissions
          or content.
        </p>

        <h3>Indemnification</h3>
        <p>
          You agree to defend, indemnify, and hold harmless Cold Email Kit and its affiliates from
          and against any claims, liabilities, damages, losses, and expenses, including reasonable
          attorney fees, arising out of or in any way connected with your use of the Service or
          violation of these Terms.
        </p>

        <h3>Termination</h3>
        <p>
          We may suspend or terminate your access to the Service at any time, with or without cause
          or notice, if we reasonably believe you have violated these Terms or if necessary to
          protect the Service.
        </p>

        <h3>Governing Law</h3>
        <p>
          These Terms are governed by the laws applicable in your jurisdiction of residence unless
          otherwise required by law. Venue for any dispute will be in the courts having jurisdiction
          over the parties.
        </p>

        <h3>Changes to These Terms</h3>
        <p>
          We may update these Terms from time to time. We will revise the "Last updated" date above
          when changes are made. Your continued use of the Service after any changes constitutes
          acceptance of the updated Terms.
        </p>

        <h3>Contact</h3>
        <p>
          Questions about these Terms? Contact us at{" "}
          <a href="mailto:admin@coldemailkit.com">admin@coldemailkit.com</a>.
        </p>
      </Prose>
    </>
  )
}
