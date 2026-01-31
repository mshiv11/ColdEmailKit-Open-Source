"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, SelectInput } from "~/components/admin/feature-inputs"
import {
    type LinkedInFeatures,
    defaultLinkedInFeatures,
    linkedInFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface LinkedInSectionProps {
    value: LinkedInFeatures | null | undefined
    onChange: (value: LinkedInFeatures) => void
    defaultOpen?: boolean
}

export function LinkedInSection({
    value,
    onChange,
    defaultOpen = false,
}: LinkedInSectionProps) {
    const features = parseFeatures(value, defaultLinkedInFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultLinkedInFeatures).length

    const updateField = <K extends keyof LinkedInFeatures>(
        field: K,
        newValue: LinkedInFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    const connectionMethodOptions = [
        { value: "api", label: "API" },
        { value: "browser", label: "Browser Extension" },
        { value: "hybrid", label: "Hybrid" },
        { value: "cloud", label: "Cloud-based" },
    ]

    return (
        <CollapsibleSection
            title="LinkedIn Features"
            description="LinkedIn automation and outreach"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <SelectInput
                    label={linkedInFeaturesLabels.linkedinConnectionMethod.label}
                    description={linkedInFeaturesLabels.linkedinConnectionMethod.description}
                    value={features.linkedinConnectionMethod}
                    onChange={(val) => updateField("linkedinConnectionMethod", val as LinkedInFeatures["linkedinConnectionMethod"])}
                    options={connectionMethodOptions}
                />
                <BooleanInput
                    label={linkedInFeaturesLabels.multipleLinkedinAccounts.label}
                    description={linkedInFeaturesLabels.multipleLinkedinAccounts.description}
                    value={features.multipleLinkedinAccounts}
                    onChange={(val) => updateField("multipleLinkedinAccounts", val)}
                />
                <BooleanInput
                    label={linkedInFeaturesLabels.salesNavigatorSupport.label}
                    description={linkedInFeaturesLabels.salesNavigatorSupport.description}
                    value={features.salesNavigatorSupport}
                    onChange={(val) => updateField("salesNavigatorSupport", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.autoConnectionRequests.label}
                    description={linkedInFeaturesLabels.autoConnectionRequests.description}
                    value={features.autoConnectionRequests}
                    onChange={(val) => updateField("autoConnectionRequests", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.autoLinkedinMessages.label}
                    description={linkedInFeaturesLabels.autoLinkedinMessages.description}
                    value={features.autoLinkedinMessages}
                    onChange={(val) => updateField("autoLinkedinMessages", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.linkedinMessageSequences.label}
                    description={linkedInFeaturesLabels.linkedinMessageSequences.description}
                    value={features.linkedinMessageSequences}
                    onChange={(val) => updateField("linkedinMessageSequences", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.autoProfileViews.label}
                    description={linkedInFeaturesLabels.autoProfileViews.description}
                    value={features.autoProfileViews}
                    onChange={(val) => updateField("autoProfileViews", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.linkedinProfileScraping.label}
                    description={linkedInFeaturesLabels.linkedinProfileScraping.description}
                    value={features.linkedinProfileScraping}
                    onChange={(val) => updateField("linkedinProfileScraping", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.emailFindingFromLinkedin.label}
                    description={linkedInFeaturesLabels.emailFindingFromLinkedin.description}
                    value={features.emailFindingFromLinkedin}
                    onChange={(val) => updateField("emailFindingFromLinkedin", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.linkedinSafetyFeatures.label}
                    description={linkedInFeaturesLabels.linkedinSafetyFeatures.description}
                    value={features.linkedinSafetyFeatures}
                    onChange={(val) => updateField("linkedinSafetyFeatures", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.humanLikeBehavior.label}
                    description={linkedInFeaturesLabels.humanLikeBehavior.description}
                    value={features.humanLikeBehavior}
                    onChange={(val) => updateField("humanLikeBehavior", val)}
                />
                <RatingInput
                    label={linkedInFeaturesLabels.linkedinEmailSequences.label}
                    description={linkedInFeaturesLabels.linkedinEmailSequences.description}
                    value={features.linkedinEmailSequences}
                    onChange={(val) => updateField("linkedinEmailSequences", val)}
                />
            </div>
        </CollapsibleSection>
    )
}
