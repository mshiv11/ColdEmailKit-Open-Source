import { z } from "zod"

/**
 * The schema for the content generator.
 * Produces structured content with Key Features, Pros and Cons, and Pricing sections.
 */
export const contentSchema = z.object({
  tagline: z
    .string()
    .describe(
      "A compelling tagline (max 60 chars) that captures the tool's unique value proposition. Avoid tool name, focus on benefits.",
    ),
  description: z
    .string()
    .describe(
      "A concise meta description (max 160 chars) highlighting key features and benefits. Use active voice, avoid tool name.",
    ),
  content: z.string().describe(
    `A detailed Markdown-formatted content with the following structure:

## Key Features
- **Feature Name**: Brief description of the feature and its benefit to users
(List 4-6 key features with bold names and descriptions)

## Pros and Cons

### Pros
- **Pro**: Why this is a strength or advantage
(List 3-5 clear advantages)

### Cons
- **Con**: What limitation or drawback users should know
(List 2-4 honest limitations)

## Pricing
| Plan | Price | Features |
|------|-------|----------|
(Include 2-4 pricing tiers with plan name, price, and key features)

**Free trial**: Yes/No with duration if applicable
**Starting from**: Entry price point

Write like a cold email expert who has hands-on experience. Be specific with numbers and facts. Avoid marketing buzzwords like "Empower", "Streamline", "Revolutionary". Focus on practical value.`,
  ),
})

/**
 * The schema for the description generator.
 */
export const descriptionSchema = contentSchema.pick({ description: true })
