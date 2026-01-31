"use client"

import { useState } from "react"
import { Icon } from "~/components/common/icon"
import { H3 } from "~/components/common/heading"
import { Badge } from "~/components/common/badge"
import { cx } from "~/utils/cva"
import { hasAnyFeatures, countFilledFeatures, parseFeatures } from "~/types/specifications"

interface FeatureValue {
    label: string
    description: string
}

interface CollapsibleFeatureSectionProps {
    title: string
    icon?: string
    features: object
    defaults: object
    labels: Record<string, FeatureValue>
    className?: string
}

/**
 * Collapsible section for displaying feature categories on public tool pages
 */
export function CollapsibleFeatureSection({
    title,
    icon = "lucide/list",
    features,
    defaults,
    labels,
    className,
}: CollapsibleFeatureSectionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const parsed = parseFeatures(features, defaults)

    // Check if marked as Not Applicable - don't render
    const notApplicable = (parsed as Record<string, unknown>)._notApplicable
    if (notApplicable === true) {
        return null
    }

    // Don't render if no features are set
    if (!hasAnyFeatures(parsed)) {
        return null
    }

    const filledCount = countFilledFeatures(parsed)

    // Filter entries: skip _notApplicable field and only show non-null/non-default values
    const entries = Object.entries(labels).filter(([key]) => {
        // Skip the N/A toggle field
        if (key === "_notApplicable") return false

        const value = (parsed as Record<string, unknown>)[key]

        // Arrays: show only if non-empty
        if (Array.isArray(value)) return value.length > 0

        // Booleans: only show if true (we don't want to show "No" for unset features)
        if (typeof value === "boolean") return value === true

        // Numbers: only show if > 0 (0 means not set for ratings)
        if (typeof value === "number") return value > 0

        // Strings: show if non-empty
        if (typeof value === "string") return value.length > 0

        // Null/undefined: don't show
        return value !== null && value !== undefined
    })

    if (entries.length === 0) {
        return null
    }

    return (
        <div className={cx("rounded-lg border bg-card overflow-hidden", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <Icon
                        name={isOpen ? "lucide/chevron-down" : "lucide/chevron-right"}
                        className="size-4 text-muted-foreground shrink-0"
                    />
                    <Icon name={icon as Parameters<typeof Icon>[0]["name"]} className="size-4" />
                    <H3 className="text-sm font-medium">{title}</H3>
                </div>

                <Badge variant="outline" className="ml-auto">
                    {entries.length} specs
                </Badge>
            </button>

            {isOpen && (
                <div className="divide-y">
                    {entries.map(([key, label]) => {
                        const value = (parsed as Record<string, unknown>)[key]
                        return (
                            <div key={key} className="flex items-center justify-between px-4 py-3">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{label.label}</p>
                                    <p className="text-xs text-muted-foreground">{label.description}</p>
                                </div>
                                <FeatureValueDisplay value={value} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

/**
 * Renders a feature value appropriately based on its type
 */
function FeatureValueDisplay({ value }: { value: unknown }) {
    // Boolean (only true values are shown due to filtering)
    if (typeof value === "boolean") {
        return (
            <div className="flex items-center gap-1">
                <Icon
                    name="lucide/check"
                    className="size-4 text-green-600"
                />
                <span className="text-sm text-green-600">Yes</span>
            </div>
        )
    }

    // Rating (0-5 number)
    if (typeof value === "number" && value >= 0 && value <= 5) {
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className={cx(
                            "size-2.5 rounded-full",
                            i < value ? "bg-primary" : "bg-muted"
                        )}
                    />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
            </div>
        )
    }

    // Number
    if (typeof value === "number") {
        return <span className="text-sm font-medium">{value.toLocaleString()}</span>
    }

    // String
    if (typeof value === "string") {
        return <span className="text-sm font-medium">{value}</span>
    }

    // Array (multi-select)
    if (Array.isArray(value) && value.length > 0) {
        return (
            <div className="flex flex-wrap gap-1 justify-end">
                {value.slice(0, 3).map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                        {String(item)}
                    </Badge>
                ))}
                {value.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                        +{value.length - 3}
                    </Badge>
                )}
            </div>
        )
    }

    return <span className="text-sm text-muted-foreground">—</span>
}
