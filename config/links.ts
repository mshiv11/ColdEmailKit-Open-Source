import { siteConfig } from "~/config/site"

export const linksConfig = {
  builtWith: "https://dirstarter.com?atp=mshiv",
  selfHost: "https://easypanel.io",
  author: "https://x.com/RiseWins_",

  // Social media placeholders - update with your accounts
  twitter: "https://x.com/RiseWins_", // Your X/Twitter
  bluesky: "", // Add your Bluesky handle when available
  mastodon: "", // Add your Mastodon handle when available
  linkedin: "", // Add your LinkedIn page when available
  reddit: "", // Add your subreddit when available
  analytics: "", // Add your public analytics URL (e.g., Plausible)

  feeds: [
    { title: "Cold Email Tools", url: `${siteConfig.url}/rss/tools.xml` },
    { title: "Alternatives", url: `${siteConfig.url}/rss/alternatives.xml` },
  ],

  // Other products/resources - customize this section with your preferred links
  // These appear in the footer under "Other Products"
  family: [
    // TODO: Add your own products or partner sites here
    // Example:
    // {
    //   title: "Your Product",
    //   href: "https://yourproduct.com",
    //   description: "Description of your product",
    // },
  ],

  // Tools used to build/run ColdEmailKit - optional, can be removed if not needed
  toolsUsed: [
    {
      title: "Dirstarter",
      href: "https://dirstarter.com?atp=mshiv",
      description: "Next.js directory website boilerplate",
    },
  ],

  // Featured press mentions - add when you get coverage
  featured: [],
}
