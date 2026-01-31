"use client"

import { useState, type ReactNode } from "react"
import { Icon } from "~/components/common/icon"
import { H3 } from "~/components/common/heading"
import { Badge } from "~/components/common/badge"
import { cx } from "~/utils/cva"

interface CollapsibleSectionProps {
    title: string
    description?: string
    defaultOpen?: boolean
    children: ReactNode
    fieldCount?: number
    filledCount?: number
    className?: string
    // Not Applicable toggle
    isNotApplicable?: boolean
    onNotApplicableChange?: (value: boolean) => void
    showNotApplicableToggle?: boolean
}

export function CollapsibleSection({
    title,
    description,
    defaultOpen = false,
    children,
    fieldCount,
    filledCount,
    className,
    isNotApplicable = false,
    onNotApplicableChange,
    showNotApplicableToggle = false,
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen && !isNotApplicable)

    const handleToggleClick = () => {
        if (!isNotApplicable) {
            setIsOpen(!isOpen)
        }
    }

    const handleNotApplicableToggle = () => {
        if (onNotApplicableChange) {
            onNotApplicableChange(!isNotApplicable)
            if (!isNotApplicable) {
                setIsOpen(false) // Collapse when marking as N/A
            }
        }
    }

    return (
        <div className={cx(
            "col-span-full border rounded-lg overflow-hidden transition-opacity",
            isNotApplicable && "opacity-60",
            className
        )}>
            {/* Header row - using div with flex to avoid button nesting */}
            <div className={cx(
                "flex items-center justify-between p-4 bg-muted/30",
                !isNotApplicable && "hover:bg-muted/50 transition-colors"
            )}>
                {/* Clickable area for expand/collapse */}
                <button
                    type="button"
                    onClick={handleToggleClick}
                    className={cx(
                        "flex items-center gap-3 flex-1 text-left",
                        isNotApplicable && "cursor-default"
                    )}
                >
                    <Icon
                        name={isOpen && !isNotApplicable ? "lucide/chevron-down" : "lucide/chevron-right"}
                        className="size-5 text-muted-foreground shrink-0"
                    />
                    <div>
                        <H3 className={cx("text-base", isNotApplicable && "line-through text-muted-foreground")}>
                            {title}
                        </H3>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                </button>

                {/* Right side - badges and N/A toggle (outside the expand button) */}
                <div className="flex items-center gap-2 ml-auto">
                    {isNotApplicable && (
                        <Badge variant="warning" className="bg-amber-100 text-amber-800">
                            N/A
                        </Badge>
                    )}

                    {!isNotApplicable && fieldCount !== undefined && (
                        <Badge variant="outline">
                            {filledCount !== undefined ? `${filledCount}/${fieldCount}` : `${fieldCount} fields`}
                        </Badge>
                    )}

                    {showNotApplicableToggle && (
                        <button
                            type="button"
                            onClick={handleNotApplicableToggle}
                            className={cx(
                                "ml-2 text-xs px-2 py-1 rounded hover:bg-muted transition-colors",
                                isNotApplicable
                                    ? "text-green-600 hover:text-green-700"
                                    : "text-amber-600 hover:text-amber-700"
                            )}
                        >
                            {isNotApplicable ? "Enable" : "Mark N/A"}
                        </button>
                    )}
                </div>
            </div>

            {isOpen && !isNotApplicable && (
                <div className="p-4 border-t bg-background">
                    {children}
                </div>
            )}
        </div>
    )
}
