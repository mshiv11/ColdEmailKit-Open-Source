"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { BooleanInput, TextFieldInput } from "~/components/admin/feature-inputs"
import {
    type PricingSpecs,
    defaultPricingSpecs,
    pricingSpecsLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface PricingSectionProps {
    value: PricingSpecs | null | undefined
    onChange: (value: PricingSpecs) => void
    defaultOpen?: boolean
}

export function PricingSection({
    value,
    onChange,
    defaultOpen = false,
}: PricingSectionProps) {
    const specs = parseFeatures(value, defaultPricingSpecs)
    const filledCount = countFilledFeatures(specs)
    const fieldCount = Object.keys(defaultPricingSpecs).length

    const updateField = <K extends keyof PricingSpecs>(
        field: K,
        newValue: PricingSpecs[K]
    ) => {
        onChange({ ...specs, [field]: newValue })
    }

    return (
        <CollapsibleSection
            title="Pricing Specifications"
            description="Pricing and plan details"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={specs._notApplicable ? 0 : filledCount - (specs._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={specs._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <TextFieldInput
                    label={pricingSpecsLabels.startingPriceMonthly.label}
                    description={pricingSpecsLabels.startingPriceMonthly.description}
                    value={specs.startingPriceMonthly}
                    onChange={(val) => updateField("startingPriceMonthly", val)}
                    placeholder="e.g. $29/mo"
                />
                <BooleanInput
                    label={pricingSpecsLabels.freeTrial.label}
                    description={pricingSpecsLabels.freeTrial.description}
                    value={specs.freeTrial}
                    onChange={(val) => updateField("freeTrial", val)}
                />
                <BooleanInput
                    label={pricingSpecsLabels.freePlan.label}
                    description={pricingSpecsLabels.freePlan.description}
                    value={specs.freePlan}
                    onChange={(val) => updateField("freePlan", val)}
                />
                <TextFieldInput
                    label={pricingSpecsLabels.mostPopularPlanPrice.label}
                    description={pricingSpecsLabels.mostPopularPlanPrice.description}
                    value={specs.mostPopularPlanPrice}
                    onChange={(val) => updateField("mostPopularPlanPrice", val)}
                    placeholder="e.g. $99/mo"
                />
                <BooleanInput
                    label={pricingSpecsLabels.unlimitedInboxes.label}
                    description={pricingSpecsLabels.unlimitedInboxes.description}
                    value={specs.unlimitedInboxes}
                    onChange={(val) => updateField("unlimitedInboxes", val)}
                />
            </div>
        </CollapsibleSection>
    )
}
