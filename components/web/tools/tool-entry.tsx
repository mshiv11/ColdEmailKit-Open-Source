import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { H2 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { Markdown } from "~/components/web/markdown"
import { OverlayImage } from "~/components/web/overlay-image"
import { StarRating } from "~/components/web/tools/star-rating"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { FaviconImage } from "~/components/web/ui/favicon"
import { VerifiedBadge } from "~/components/web/verified-badge"
import type { ToolManyExtended, ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolEntryProps = ComponentProps<"div"> & {
  tool: ToolOne | ToolManyExtended
  /**
   * When true, the tool name links to the affiliate/website URL (external)
   * instead of the internal tool page. Used on alternatives pages.
   */
  linkToAffiliate?: boolean
}

const ToolEntry = ({
  children,
  className,
  tool,
  linkToAffiliate = false,
  ...props
}: ToolEntryProps) => {
  const internalHref = `/tools/${tool.slug}`

  // Get affiliate URL if available (cast to access optional field)
  const affiliateUrl = (tool as ToolManyExtended).affiliateUrl
  const externalHref = affiliateUrl || tool.websiteUrl
  const isFeatured = (tool as ToolManyExtended).isFeatured

  return (
    <div
      className={cx(
        "flex flex-col gap-6 scroll-mt-20 md:gap-8 [counter-increment:entries]",
        className,
      )}
      {...props}
    >
      <Stack size="lg" className="not-prose relative justify-between">
        <Stack className="self-start before:content-['#'_counter(entries)] before:font-semibold before:text-3xl before:opacity-25 xl:before:absolute xl:before:right-full xl:before:mr-4">
          {linkToAffiliate ? (
            // External link to affiliate/website URL
            <ExternalLink
              href={externalHref}
              doFollow={isFeatured}
              eventName="click_website"
              eventProps={{ url: externalHref, source: "alternative_name", toolSlug: tool.slug }}
              className="group flex items-center gap-3"
            >
              <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <H2 className="leading-tight! truncate underline decoration-transparent group-hover:decoration-foreground/30">
                    {tool.name}
                  </H2>

                  {tool.ownerId && <VerifiedBadge size="lg" />}
                </div>

                <StarRating
                  rating={tool.overallRating || 0}
                  totalReviews={tool.totalReviews || 0}
                  className="gap-1 text-xs"
                />
              </div>
            </ExternalLink>
          ) : (
            // Internal link to tool page
            <Link href={internalHref} className="group flex items-center gap-3">
              <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <H2 className="leading-tight! truncate underline decoration-transparent group-hover:decoration-foreground/30">
                    {tool.name}
                  </H2>

                  {tool.ownerId && <VerifiedBadge size="lg" />}
                </div>

                <StarRating
                  rating={tool.overallRating || 0}
                  totalReviews={tool.totalReviews || 0}
                  className="gap-1 text-xs"
                />
              </div>
            </Link>
          )}
        </Stack>

        <ToolBadges tool={tool} className="ml-auto" />
      </Stack>

      {tool.description && (
        <p className="not-prose -mt-4 w-full text-secondary-foreground text-pretty md:text-lg md:-mt-6">
          {tool.description}
        </p>
      )}

      {tool.screenshotUrl && (
        <OverlayImage
          href={internalHref}
          target="_self"
          doFollow={true}
          src={tool.screenshotUrl}
          alt={`Screenshot of ${tool.name} website`}
          className="not-prose"
        >
          Read more
        </OverlayImage>
      )}

      {children ? (
        <div>{children}</div>
      ) : (
        tool.content && (
          <Markdown
            code={tool.content}
            className="relative max-h-72 overflow-hidden mask-b-from-80%"
          />
        )
      )}

      <Button suffix={<Icon name="lucide/arrow-right" />} className="not-prose self-start" asChild>
        <Link href={internalHref}>Read more</Link>
      </Button>
    </div>
  )
}

export { ToolEntry }
