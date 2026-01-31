"use client"

import { useState } from "react"
import { Icon } from "~/components/common/icon"
import { H3 } from "~/components/common/heading"
import { cx } from "~/utils/cva"
import {
    type ToolSpecifications,
    defaultSpecifications,
    specificationLabels,
    parseFeatures,
    hasAnyFeatures,
} from "~/types/specifications"

interface ToolSpecificationsProps {
    specifications: ToolSpecifications | null | undefined
    className?: string
}

/**
 * Displays the core specifications as a rating bar table
 */
export function ToolSpecificationsDisplay({ specifications, className }: ToolSpecificationsProps) {
    const specs = parseFeatures(specifications, defaultSpecifications)

    // Don't render if no specifications are set
    if (!hasAnyFeatures(specs)) {
        return null
    }

    // Filter out null and 0 ratings - only show specs with actual ratings > 0
    const entries = (Object.keys(specificationLabels) as Array<keyof ToolSpecifications>)
        .filter(key => {
            const value = specs[key]
            return value !== null && value > 0
        })

    if (entries.length === 0) {
        return null
    }

    return (
        <div className={cx("rounded-lg border bg-card", className)}>
            <div className="p-4 border-b bg-muted/30">
                <H3 className="text-base flex items-center gap-2">
                    <Icon name="lucide/check" className="size-4" />
                    Core Specifications
                </H3>
            </div>

            <div className="divide-y">
                {entries.map((key) => {
                    const value = specs[key]
                    if (value === null) return null

                    return (
                        <div key={key} className="flex items-center justify-between px-4 py-3">
                            <div className="flex-1">
                                <p className="font-medium text-sm">{specificationLabels[key].label}</p>
                                <p className="text-xs text-muted-foreground">{specificationLabels[key].description}</p>
                            </div>
                            <RatingDots value={value} max={5} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * Displays a rating as filled/unfilled dots
 */
function RatingDots({ value, max = 5 }: { value: number; max?: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <div
                    key={i}
                    className={cx(
                        "size-2.5 rounded-full transition-colors",
                        i < value ? "bg-primary" : "bg-muted"
                    )}
                />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
                {value}/{max}
            </span>
        </div>
    )
}
