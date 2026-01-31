"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput } from "~/components/admin/feature-inputs"
import {
    type ToolSpecifications,
    defaultSpecifications,
    specificationLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface SpecificationsSectionProps {
    value: ToolSpecifications | null | undefined
    onChange: (value: ToolSpecifications) => void
    defaultOpen?: boolean
}

export function SpecificationsSection({
    value,
    onChange,
    defaultOpen = false,
}: SpecificationsSectionProps) {
    const specs = parseFeatures(value, defaultSpecifications)
    const filledCount = countFilledFeatures(specs)
    const fieldCount = Object.keys(defaultSpecifications).length

    const updateField = <K extends keyof ToolSpecifications>(
        field: K,
        newValue: ToolSpecifications[K]
    ) => {
        onChange({ ...specs, [field]: newValue })
    }

    return (
        <CollapsibleSection
            title="Core Specifications"
            description="Rate the tool's core capabilities (0-5)"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount}
            filledCount={filledCount}
        >
            <div className="space-y-0">
                {(Object.keys(specificationLabels) as Array<keyof ToolSpecifications>).map((key) => (
                    <RatingInput
                        key={key}
                        label={specificationLabels[key].label}
                        description={specificationLabels[key].description}
                        value={specs[key]}
                        onChange={(val) => updateField(key, val)}
                    />
                ))}
            </div>
        </CollapsibleSection>
    )
}
