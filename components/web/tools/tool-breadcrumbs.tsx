import Link from "next/link"
import { Fragment } from "react"
import { Icon } from "~/components/common/icon"
import { cx } from "~/utils/cva"

type BreadcrumbItem = {
  label: string
  href?: string
}

type ToolBreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function ToolBreadcrumbs({ items, className }: ToolBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cx("text-sm text-muted-foreground", className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={index}>
              {index > 0 && <Icon name="lucide/chevron-right" className="size-4" />}
              <li className={cx("flex items-center", isLast && "font-medium text-foreground")}>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:underline hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
