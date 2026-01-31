"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, TextFieldInput } from "~/components/admin/feature-inputs"
import {
    type DeliverabilityFeatures,
    defaultDeliverabilityFeatures,
    deliverabilityFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface DeliveraSectionProps {
    value: DeliverabilityFeatures | null | undefined
    onChange: (value: DeliverabilityFeatures) => void
    defaultOpen?: boolean
}

export function DeliverabilitySection({
    value,
    onChange,
    defaultOpen = false,
}: DeliveraSectionProps) {
    const features = parseFeatures(value, defaultDeliverabilityFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultDeliverabilityFeatures).length

    const updateField = <K extends keyof DeliverabilityFeatures>(
        field: K,
        newValue: DeliverabilityFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    return (
        <CollapsibleSection
            title="Deliverability Features"
            description="Email deliverability monitoring and testing"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <RatingInput
                    label={deliverabilityFeaturesLabels.inboxPlacementTesting.label}
                    description={deliverabilityFeaturesLabels.inboxPlacementTesting.description}
                    value={features.inboxPlacementTesting}
                    onChange={(val) => updateField("inboxPlacementTesting", val)}
                />
                <RatingInput
                    label={deliverabilityFeaturesLabels.spamScoreTesting.label}
                    description={deliverabilityFeaturesLabels.spamScoreTesting.description}
                    value={features.spamScoreTesting}
                    onChange={(val) => updateField("spamScoreTesting", val)}
                />
                <RatingInput
                    label={deliverabilityFeaturesLabels.blacklistMonitoring.label}
                    description={deliverabilityFeaturesLabels.blacklistMonitoring.description}
                    value={features.blacklistMonitoring}
                    onChange={(val) => updateField("blacklistMonitoring", val)}
                />
                <RatingInput
                    label={deliverabilityFeaturesLabels.domainReputationMonitoring.label}
                    description={deliverabilityFeaturesLabels.domainReputationMonitoring.description}
                    value={features.domainReputationMonitoring}
                    onChange={(val) => updateField("domainReputationMonitoring", val)}
                />
                <RatingInput
                    label={deliverabilityFeaturesLabels.ipReputationMonitoring.label}
                    description={deliverabilityFeaturesLabels.ipReputationMonitoring.description}
                    value={features.ipReputationMonitoring}
                    onChange={(val) => updateField("ipReputationMonitoring", val)}
                />
                <BooleanInput
                    label={deliverabilityFeaturesLabels.dmarcSpfDkimChecker.label}
                    description={deliverabilityFeaturesLabels.dmarcSpfDkimChecker.description}
                    value={features.dmarcSpfDkimChecker}
                    onChange={(val) => updateField("dmarcSpfDkimChecker", val)}
                />
                <RatingInput
                    label={deliverabilityFeaturesLabels.emailContentAnalysis.label}
                    description={deliverabilityFeaturesLabels.emailContentAnalysis.description}
                    value={features.emailContentAnalysis}
                    onChange={(val) => updateField("emailContentAnalysis", val)}
                />
                <BooleanInput
                    label={deliverabilityFeaturesLabels.deliverabilityAlerts.label}
                    description={deliverabilityFeaturesLabels.deliverabilityAlerts.description}
                    value={features.deliverabilityAlerts}
                    onChange={(val) => updateField("deliverabilityAlerts", val)}
                />
                <BooleanInput
                    label={deliverabilityFeaturesLabels.historicalTracking.label}
                    description={deliverabilityFeaturesLabels.historicalTracking.description}
                    value={features.historicalTracking}
                    onChange={(val) => updateField("historicalTracking", val)}
                />
                <BooleanInput
                    label={deliverabilityFeaturesLabels.providerSpecificTesting.label}
                    description={deliverabilityFeaturesLabels.providerSpecificTesting.description}
                    value={features.providerSpecificTesting}
                    onChange={(val) => updateField("providerSpecificTesting", val)}
                />
                <RatingInput
                    label={deliverabilityFeaturesLabels.remediationGuidance.label}
                    description={deliverabilityFeaturesLabels.remediationGuidance.description}
                    value={features.remediationGuidance}
                    onChange={(val) => updateField("remediationGuidance", val)}
                />
                <TextFieldInput
                    label={deliverabilityFeaturesLabels.monitoringFrequency.label}
                    description={deliverabilityFeaturesLabels.monitoringFrequency.description}
                    value={features.monitoringFrequency}
                    onChange={(val) => updateField("monitoringFrequency", val)}
                    placeholder="e.g. Real-time, Daily, Weekly"
                />
            </div>
        </CollapsibleSection>
    )
}
