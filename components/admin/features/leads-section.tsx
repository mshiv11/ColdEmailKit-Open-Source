"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, TextFieldInput, NumberFieldInput } from "~/components/admin/feature-inputs"
import {
    type LeadsFeatures,
    defaultLeadsFeatures,
    leadsFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface LeadsSectionProps {
    value: LeadsFeatures | null | undefined
    onChange: (value: LeadsFeatures) => void
    defaultOpen?: boolean
}

export function LeadsSection({
    value,
    onChange,
    defaultOpen = false,
}: LeadsSectionProps) {
    const features = parseFeatures(value, defaultLeadsFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultLeadsFeatures).length

    const updateField = <K extends keyof LeadsFeatures>(
        field: K,
        newValue: LeadsFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    return (
        <CollapsibleSection
            title="Leads Features"
            description="Lead database and search capabilities"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <TextFieldInput
                    label={leadsFeaturesLabels.databaseSize.label}
                    description={leadsFeaturesLabels.databaseSize.description}
                    value={features.databaseSize}
                    onChange={(val) => updateField("databaseSize", val)}
                    placeholder="e.g. 500M+ contacts"
                />
                <RatingInput
                    label={leadsFeaturesLabels.contactSearch.label}
                    description={leadsFeaturesLabels.contactSearch.description}
                    value={features.contactSearch}
                    onChange={(val) => updateField("contactSearch", val)}
                />
                <RatingInput
                    label={leadsFeaturesLabels.companySearch.label}
                    description={leadsFeaturesLabels.companySearch.description}
                    value={features.companySearch}
                    onChange={(val) => updateField("companySearch", val)}
                />
                <NumberFieldInput
                    label={leadsFeaturesLabels.searchFiltersCount.label}
                    description={leadsFeaturesLabels.searchFiltersCount.description}
                    value={features.searchFiltersCount}
                    onChange={(val) => updateField("searchFiltersCount", val)}
                    placeholder="e.g. 25"
                />
                <RatingInput
                    label={leadsFeaturesLabels.emailData.label}
                    description={leadsFeaturesLabels.emailData.description}
                    value={features.emailData}
                    onChange={(val) => updateField("emailData", val)}
                />
                <RatingInput
                    label={leadsFeaturesLabels.phoneData.label}
                    description={leadsFeaturesLabels.phoneData.description}
                    value={features.phoneData}
                    onChange={(val) => updateField("phoneData", val)}
                />
                <BooleanInput
                    label={leadsFeaturesLabels.mobilePhoneData.label}
                    description={leadsFeaturesLabels.mobilePhoneData.description}
                    value={features.mobilePhoneData}
                    onChange={(val) => updateField("mobilePhoneData", val)}
                />
                <RatingInput
                    label={leadsFeaturesLabels.jobTitleAccuracy.label}
                    description={leadsFeaturesLabels.jobTitleAccuracy.description}
                    value={features.jobTitleAccuracy}
                    onChange={(val) => updateField("jobTitleAccuracy", val)}
                />
                <RatingInput
                    label={leadsFeaturesLabels.companyDataDepth.label}
                    description={leadsFeaturesLabels.companyDataDepth.description}
                    value={features.companyDataDepth}
                    onChange={(val) => updateField("companyDataDepth", val)}
                />
                <BooleanInput
                    label={leadsFeaturesLabels.technographicData.label}
                    description={leadsFeaturesLabels.technographicData.description}
                    value={features.technographicData}
                    onChange={(val) => updateField("technographicData", val)}
                />
                <BooleanInput
                    label={leadsFeaturesLabels.intentData.label}
                    description={leadsFeaturesLabels.intentData.description}
                    value={features.intentData}
                    onChange={(val) => updateField("intentData", val)}
                />
                <TextFieldInput
                    label={leadsFeaturesLabels.dataAccuracyRate.label}
                    description={leadsFeaturesLabels.dataAccuracyRate.description}
                    value={features.dataAccuracyRate}
                    onChange={(val) => updateField("dataAccuracyRate", val)}
                    placeholder="e.g. 95%+"
                />
                <TextFieldInput
                    label={leadsFeaturesLabels.creditsIncluded.label}
                    description={leadsFeaturesLabels.creditsIncluded.description}
                    value={features.creditsIncluded}
                    onChange={(val) => updateField("creditsIncluded", val)}
                    placeholder="e.g. 1000/month"
                />
                <TextFieldInput
                    label={leadsFeaturesLabels.costPerCredit.label}
                    description={leadsFeaturesLabels.costPerCredit.description}
                    value={features.costPerCredit}
                    onChange={(val) => updateField("costPerCredit", val)}
                    placeholder="e.g. $0.05"
                />
                <BooleanInput
                    label={leadsFeaturesLabels.realTimeVerification.label}
                    description={leadsFeaturesLabels.realTimeVerification.description}
                    value={features.realTimeVerification}
                    onChange={(val) => updateField("realTimeVerification", val)}
                />
            </div>
        </CollapsibleSection>
    )
}
