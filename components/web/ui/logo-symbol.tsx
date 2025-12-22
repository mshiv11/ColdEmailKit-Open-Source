import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const LogoSymbol = ({ className, ...props }: ComponentProps<"svg">) => {
  // Use a unique ID prefix to avoid SVG ID conflicts when multiple instances are on the page
  const id = "cek-logo"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      height="24"
      width="24"
      role="img"
      aria-label="ColdEmailKit Logo"
      className={cx("size-5 transition-transform duration-200", className)}
      {...props}
    >
      <defs>
        <g id={`${id}-stick`}>
          <rect
            x="46"
            y="10"
            width="8"
            height="40"
            rx="4"
            ry="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </g>
      </defs>
      <g>
        <use href={`#${id}-stick`} />
        <use href={`#${id}-stick`} transform="rotate(45 50 50)" />
        <use href={`#${id}-stick`} transform="rotate(90 50 50)" />
        <use href={`#${id}-stick`} transform="rotate(135 50 50)" />
        <use href={`#${id}-stick`} transform="rotate(180 50 50)" />
        <use href={`#${id}-stick`} transform="rotate(225 50 50)" />
        <use href={`#${id}-stick`} transform="rotate(270 50 50)" />
        <use href={`#${id}-stick`} transform="rotate(315 50 50)" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
      </g>
    </svg>
  )
}
