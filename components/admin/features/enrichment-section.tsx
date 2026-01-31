"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, TextFieldInput, NumberFieldInput, SelectInput } from "~/components/admin/feature-inputs"
import {
    type EnrichmentFeatures,
    defaultEnrichmentFeatures,
    enrichmentFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface EnrichmentSectionProps {
    value: EnrichmentFeatures | null | undefined
    onChange: (value: EnrichmentFeatures) => void
    defaultOpen?: boolean
}

export function EnrichmentSection({
    value,
    onChange,
    defaultOpen = false,
}: EnrichmentSectionProps) {
    const features = parseFeatures(value, defaultEnrichmentFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultEnrichmentFeatures).length

    const updateField = <K extends keyof EnrichmentFeatures>(
        field: K,
        newValue: EnrichmentFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    const enrichmentTypeOptions = [
        { value: "contact", label: "Contact Only" },
        { value: "company", label: "Company Only" },
        { value: "both", label: "Both" },
    ]

    return (
        <CollapsibleSection
            title="Enrichment Features"
            description="Data enrichment capabilities"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <SelectInput
                    label={enrichmentFeaturesLabels.enrichmentType.label}
                    description={enrichmentFeaturesLabels.enrichmentType.description}
                    value={features.enrichmentType}
                    onChange={(val) => updateField("enrichmentType", val as EnrichmentFeatures["enrichmentType"])}
                    options={enrichmentTypeOptions}
                />
                <NumberFieldInput
                    label={enrichmentFeaturesLabels.dataPointsAvailable.label}
                    description={enrichmentFeaturesLabels.dataPointsAvailable.description}
                    value={features.dataPointsAvailable}
                    onChange={(val) => updateField("dataPointsAvailable", val)}
                    placeholder="e.g. 50+"
                />
                <RatingInput
                    label={enrichmentFeaturesLabels.emailEnrichment.label}
                    description={enrichmentFeaturesLabels.emailEnrichment.description}
                    value={features.emailEnrichment}
                    onChange={(val) => updateField("emailEnrichment", val)}
                />
                <RatingInput
                    label={enrichmentFeaturesLabels.phoneEnrichment.label}
                    description={enrichmentFeaturesLabels.phoneEnrichment.description}
                    value={features.phoneEnrichment}
                    onChange={(val) => updateField("phoneEnrichment", val)}
                />
                <RatingInput
                    label={enrichmentFeaturesLabels.companyEnrichment.label}
                    description={enrichmentFeaturesLabels.companyEnrichment.description}
                    value={features.companyEnrichment}
                    onChange={(val) => updateField("companyEnrichment", val)}
                />
                <BooleanInput
                    label={enrichmentFeaturesLabels.socialProfileEnrichment.label}
                    description={enrichmentFeaturesLabels.socialProfileEnrichment.description}
                    value={features.socialProfileEnrichment}
                    onChange={(val) => updateField("socialProfileEnrichment", val)}
                />
                <BooleanInput
                    label={enrichmentFeaturesLabels.waterfallEnrichment.label}
                    description={enrichmentFeaturesLabels.waterfallEnrichment.description}
                    value={features.waterfallEnrichment}
                    onChange={(val) => updateField("waterfallEnrichment", val)}
                />
                <BooleanInput
                    label={enrichmentFeaturesLabels.realTimeEnrichment.label}
                    description={enrichmentFeaturesLabels.realTimeEnrichment.description}
                    value={features.realTimeEnrichment}
                    onChange={(val) => updateField("realTimeEnrichment", val)}
                />
                <RatingInput
                    label={enrichmentFeaturesLabels.bulkEnrichment.label}
                    description={enrichmentFeaturesLabels.bulkEnrichment.description}
                    value={features.bulkEnrichment}
                    onChange={(val) => updateField("bulkEnrichment", val)}
                />
                <RatingInput
                    label={enrichmentFeaturesLabels.apiEnrichment.label}
                    description={enrichmentFeaturesLabels.apiEnrichment.description}
                    value={features.apiEnrichment}
                    onChange={(val) => updateField("apiEnrichment", val)}
                />
                <TextFieldInput
                    label={enrichmentFeaturesLabels.enrichmentAccuracy.label}
                    description={enrichmentFeaturesLabels.enrichmentAccuracy.description}
                    value={features.enrichmentAccuracy}
                    onChange={(val) => updateField("enrichmentAccuracy", val)}
                    placeholder="e.g. 95%+"
                />
                <TextFieldInput
                    label={enrichmentFeaturesLabels.enrichmentCreditsIncluded.label}
                    description={enrichmentFeaturesLabels.enrichmentCreditsIncluded.description}
                    value={features.enrichmentCreditsIncluded}
                    onChange={(val) => updateField("enrichmentCreditsIncluded", val)}
                    placeholder="e.g. 500/month"
                />
            </div>
        </CollapsibleSection>
    )
}
