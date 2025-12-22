import Image from "next/image"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { ExternalLink } from "~/components/web/external-link"
import { cx } from "~/utils/cva"

type OverlayImageProps = ComponentProps<typeof ExternalLink> & {
  src: string
  alt?: string
}

export const OverlayImage = ({ children, className, src, alt, ...props }: OverlayImageProps) => {
  return (
    <Box hover>
      <ExternalLink
        className={cx("not-prose group relative rounded-md overflow-clip", className)}
        {...props}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          width={1280}
          height={1024}
          loading="lazy"
          className="aspect-video h-auto w-full object-cover object-top will-change-transform group-hover:scale-[101%]"
        />
      </ExternalLink>
    </Box>
  )
}
