"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, TextFieldInput, SelectInput } from "~/components/admin/feature-inputs"
import {
    type InboxFeatures,
    defaultInboxFeatures,
    inboxFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface InboxSectionProps {
    value: InboxFeatures | null | undefined
    onChange: (value: InboxFeatures) => void
    defaultOpen?: boolean
}

export function InboxSection({
    value,
    onChange,
    defaultOpen = false,
}: InboxSectionProps) {
    const features = parseFeatures(value, defaultInboxFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultInboxFeatures).length

    const updateField = <K extends keyof InboxFeatures>(
        field: K,
        newValue: InboxFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    const inboxTypeOptions = [
        { value: "google", label: "Google" },
        { value: "microsoft", label: "Microsoft" },
        { value: "proprietary", label: "Proprietary" },
        { value: "multiple", label: "Multiple" },
    ]

    return (
        <CollapsibleSection
            title="Inbox Features"
            description="Inbox provision and management capabilities"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1} // Exclude _notApplicable from count
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <BooleanInput
                    label={inboxFeaturesLabels.inboxesProvided.label}
                    description={inboxFeaturesLabels.inboxesProvided.description}
                    value={features.inboxesProvided}
                    onChange={(val) => updateField("inboxesProvided", val)}
                />
                <SelectInput
                    label={inboxFeaturesLabels.inboxType.label}
                    description={inboxFeaturesLabels.inboxType.description}
                    value={features.inboxType}
                    onChange={(val) => updateField("inboxType", val as InboxFeatures["inboxType"])}
                    options={inboxTypeOptions}
                />
                <TextFieldInput
                    label={inboxFeaturesLabels.maxInboxes.label}
                    description={inboxFeaturesLabels.maxInboxes.description}
                    value={features.maxInboxes}
                    onChange={(val) => updateField("maxInboxes", val)}
                    placeholder="e.g. Unlimited, 50, 100"
                />
                <TextFieldInput
                    label={inboxFeaturesLabels.costPerInbox.label}
                    description={inboxFeaturesLabels.costPerInbox.description}
                    value={features.costPerInbox}
                    onChange={(val) => updateField("costPerInbox", val)}
                    placeholder="e.g. $3/mo"
                />
                <TextFieldInput
                    label={inboxFeaturesLabels.bulkInboxPricing.label}
                    description={inboxFeaturesLabels.bulkInboxPricing.description}
                    value={features.bulkInboxPricing}
                    onChange={(val) => updateField("bulkInboxPricing", val)}
                    placeholder="e.g. Volume discounts available"
                />
                <BooleanInput
                    label={inboxFeaturesLabels.domainProvisionIncluded.label}
                    description={inboxFeaturesLabels.domainProvisionIncluded.description}
                    value={features.domainProvisionIncluded}
                    onChange={(val) => updateField("domainProvisionIncluded", val)}
                />
                <BooleanInput
                    label={inboxFeaturesLabels.domainSetupIncluded.label}
                    description={inboxFeaturesLabels.domainSetupIncluded.description}
                    value={features.domainSetupIncluded}
                    onChange={(val) => updateField("domainSetupIncluded", val)}
                />
                <BooleanInput
                    label={inboxFeaturesLabels.autoInboxSetup.label}
                    description={inboxFeaturesLabels.autoInboxSetup.description}
                    value={features.autoInboxSetup}
                    onChange={(val) => updateField("autoInboxSetup", val)}
                />
                <TextFieldInput
                    label={inboxFeaturesLabels.inboxAgeOnPurchase.label}
                    description={inboxFeaturesLabels.inboxAgeOnPurchase.description}
                    value={features.inboxAgeOnPurchase}
                    onChange={(val) => updateField("inboxAgeOnPurchase", val)}
                    placeholder="e.g. New, 3+ months aged"
                />
                <RatingInput
                    label={inboxFeaturesLabels.inboxHealthMonitoring.label}
                    description={inboxFeaturesLabels.inboxHealthMonitoring.description}
                    value={features.inboxHealthMonitoring}
                    onChange={(val) => updateField("inboxHealthMonitoring", val)}
                />
                <TextFieldInput
                    label={inboxFeaturesLabels.inboxReplacementPolicy.label}
                    description={inboxFeaturesLabels.inboxReplacementPolicy.description}
                    value={features.inboxReplacementPolicy}
                    onChange={(val) => updateField("inboxReplacementPolicy", val)}
                    placeholder="e.g. Free replacements within 30 days"
                />
            </div>
        </CollapsibleSection>
    )
}
