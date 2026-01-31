import type { AdType } from "@prisma/client"
import { siteConfig } from "~/config/site"
import type { AdOne } from "~/server/web/ads/payloads"

export type AdSpot = {
  label: string
  type: AdType
  description: string
  price: number
  preview?: string
}

export const adsConfig = {
  minPageviewThreshold: 100,

  adSpots: [
    {
      label: "Listing Ad",
      type: "Tools",
      description: "Visible on the every tool listing page",
      price: 15,
      preview: "https://share.cleanshot.com/7CFqSw0b",
    },
  ] satisfies AdSpot[],

  defaultAd: {
    type: "All",
    websiteUrl: "/advertise",
    name: "Your brand here",
    description:
      "Reach out to our audience of professional tech enthusiasts, boost your sales and brand awareness.",
    buttonLabel: `Advertise on ${siteConfig.name}`,
    faviconUrl: null,
  } satisfies AdOne,

  testimonials: [
    {
      quote:
        "Cold Email Kit is a total game-changer for any outreach strategy. As someone deeply embedded in email outreach and partnerships at ContactOut, having the right contact info is only half the battle - it's the execution of the message that converts. Having a high-performing outreach stack is key to writing effective emails and ensuring timely delivery. The platform perfectly categorizes the best-in-class software from email warm-up to AI personalization, saving hours of vetting. It's an essential resource for any email outreach specialist who wants to stop guessing and start hitting the inbox.",
      author: {
        name: "Christian Roy Somcio",
        title: "Head of Partnerships at ContactOut",
        image: "/authors/christian-roy-somcio.jpg",
      },
    },
    {
      quote:
        "I like your platform, it's clean, and informative. As a small company, it's a great opportunity for us to position ourselves against the bigger players.",
      author: {
        name: "Tom Martin",
        title: "Sequence-R",
        image: null,
      },
    },
    {
      quote:
        "The Cold Email Kit database is really helpful in finding the right tool for our recruiting business",
      author: {
        name: "Flora",
        title: "VaraHR",
        image: null,
      },
    },
  ],
}
