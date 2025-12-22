import type { ComponentProps } from "react"
import ReactMarkdown from "react-markdown"
import { Prose } from "~/components/common/prose"
import { MDXComponents } from "~/components/web/mdx-components"

import rehypeRaw from "rehype-raw"

type MarkdownProps = ComponentProps<typeof Prose> & {
  code: string
}

export const Markdown = ({ code, ...props }: MarkdownProps) => {
  return (
    <Prose {...props}>
      <ReactMarkdown
        components={MDXComponents}
        rehypePlugins={[rehypeRaw]}
      >
        {code}
      </ReactMarkdown>
    </Prose>
  )
}
