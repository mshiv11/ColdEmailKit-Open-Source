import type { Metadata } from "next/types"
import Link from "next/link"
import { Button } from "~/components/common/button"
import { Advertisers } from "~/components/web/advertisers"
import { ExternalLink } from "~/components/web/external-link"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/common/prose"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"

export const metadata: Metadata = {
  title: `Advertise on ${siteConfig.name}`,
  description: `Promote your cold email software, sales tool, or agency to a highly targeted outbound-first audience on ${siteConfig.name}.`,
  openGraph: { ...metadataConfig.openGraph, url: "/advertise" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise" },
}

export default async function AdvertisePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-14 lg:gap-16">
      <Intro alignment="center">
        <IntroTitle>{`${metadata.title}`}</IntroTitle>

        <IntroDescription className="max-w-3xl">
          Promote your cold email software, sales tool, or agency to a highly targeted outbound-first audience.
        </IntroDescription>
      </Intro>

      <Prose className="max-w-3xl mx-auto">
        <p>
          <Link href="/">{siteConfig.name}</Link> is a curated directory and resource hub for cold email tools, outreach platforms,
          lead generation software, email warmup solutions, and outbound agencies. Our audience actively searches
          for tools they can deploy immediately to generate leads, book meetings, and scale outbound revenue.
        </p>
        <p>
          If your product helps teams send better cold emails, improve deliverability, generate leads, or close
          more deals, you are exactly where your buyers already are.
        </p>

        <h2>Why Advertise With {siteConfig.name}</h2>
        <p>
          Our visitors are not browsing casually. They arrive with intent.
        </p>
        <p>
          They are founders, sales leaders, SDRs, growth marketers, and agency owners actively comparing tools,
          evaluating pricing, and deciding what to use next in their outbound stack.
        </p>
        <p>
          {siteConfig.name} is trusted because we focus on clarity, categorization, and practical use cases,
          not hype. That trust transfers directly to advertisers.
        </p>
        <p>
          Whether you are launching a new tool, promoting a mature platform, or scaling an agency, {siteConfig.name} puts
          you in front of buyers at the decision stage.
        </p>

        <h2>Our Audience</h2>
        <ul>
          <li>Founders and SaaS operators running outbound-led growth</li>
          <li>Sales leaders, SDRs, and BDR teams</li>
          <li>Growth marketers focused on lead generation</li>
          <li>Cold email agencies and consultants</li>
          <li>Indie hackers and bootstrapped founders</li>
        </ul>
        <p>
          Most visitors are actively building or optimizing cold email systems and are ready to adopt tools
          that improve results quickly.
        </p>

        <h2>Advertising Options</h2>
        <p>We offer multiple ways to promote your product or service:</p>
        <ul>
          <li>Featured tool placements in key categories</li>
          <li>Homepage and category page visibility</li>
          <li>Sponsored listings with priority positioning</li>
          <li>Newsletter sponsorships</li>
          <li>Custom partnerships and launches</li>
        </ul>
        <p>
          All placements are designed to be contextual and native so your product appears exactly when users
          are researching similar solutions.
        </p>

        <h2>Why It Works</h2>
        <ul>
          <li>Highly targeted outbound-focused traffic</li>
          <li>Buyers with real purchasing intent</li>
          <li>No generic SaaS noise</li>
          <li>Clear positioning next to competing tools</li>
          <li>Built for founders, sellers, and operators</li>
        </ul>
        <p>
          {siteConfig.name} is not a general software directory. It is built specifically for outbound growth.
        </p>

        <h2>Get Started</h2>
        <p>
          Ready to grow your reach? <Link href="/">Explore our directory</Link> to see how your tool could be featured
          alongside the best cold email software on the market. For advertising inquiries, <a href="mailto:admin@coldemailkit.com">reach out to us</a>.
        </p>
        <p>
          Have questions about which advertising option is right for you? <a href="mailto:admin@coldemailkit.com">Email us</a> and
          we'll help you find the perfect fit for your goals and budget.
        </p>
      </Prose>

      {/* NOTE: AdvertisePickers temporarily hidden - uncomment when ready to re-enable booking
      <AdvertisePickers alternative={alternative} />
      */}

      {/* NOTE: Stats temporarily hidden - uncomment when ready to re-enable
      <Stats />
      */}

      {config.ads.testimonials.map(testimonial => (
        <Testimonial key={testimonial.quote} {...testimonial} />
      ))}

      <Advertisers />

      <hr />

      <Intro alignment="center">
        <IntroTitle size="h2" as="h3">
          Contact Us
        </IntroTitle>

        <IntroDescription className="max-w-lg">
          If you want qualified traffic, serious buyers, and visibility inside the cold email ecosystem, let's talk.
          Advertise on {siteConfig.name} and put your product in front of people who actually send emails for a living.
        </IntroDescription>

        <Button className="mt-4 min-w-40" asChild>
          <ExternalLink href="mailto:admin@coldemailkit.com">Contact us</ExternalLink>
        </Button>
      </Intro>
    </div>
  )
}

