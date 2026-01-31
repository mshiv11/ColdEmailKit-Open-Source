import Image from "next/image"
import type { ComponentProps } from "react"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"

type AuthorProps = ComponentProps<typeof Stack> & {
  name: string
  image?: string | null
  title?: string
}

export const Author = ({ name, image, title, ...props }: AuthorProps) => {
  // Generate initials from name (e.g., "Tom Martin" -> "TM")
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Stack size="sm" {...props}>
      {image ? (
        <Image
          src={image}
          alt={`${name}'s profile`}
          width={48}
          height={48}
          className="size-12 rounded-full group-hover:[&[href]]:brightness-90"
        />
      ) : (
        <div className="size-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-semibold text-sm">
          {getInitials(name)}
        </div>
      )}

      <div>
        <h3 className="font-medium text-base truncate">{name}</h3>
        {title && <Note>{title}</Note>}
      </div>
    </Stack>
  )
}

