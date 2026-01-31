"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, TextFieldInput, SelectInput } from "~/components/admin/feature-inputs"
import {
    type WarmupFeatures,
    defaultWarmupFeatures,
    warmupFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface WarmupSectionProps {
    value: WarmupFeatures | null | undefined
    onChange: (value: WarmupFeatures) => void
    defaultOpen?: boolean
}

export function WarmupSection({
    value,
    onChange,
    defaultOpen = false,
}: WarmupSectionProps) {
    const features = parseFeatures(value, defaultWarmupFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultWarmupFeatures).length

    const updateField = <K extends keyof WarmupFeatures>(
        field: K,
        newValue: WarmupFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    const networkTypeOptions = [
        { value: "real", label: "Real Inboxes" },
        { value: "simulated", label: "Simulated" },
        { value: "hybrid", label: "Hybrid" },
    ]

    return (
        <CollapsibleSection
            title="Warm-up Features"
            description="Email warm-up capabilities"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <BooleanInput
                    label={warmupFeaturesLabels.warmupIncluded.label}
                    description={warmupFeaturesLabels.warmupIncluded.description}
                    value={features.warmupIncluded}
                    onChange={(val) => updateField("warmupIncluded", val)}
                />
                <TextFieldInput
                    label={warmupFeaturesLabels.warmupPoolSize.label}
                    description={warmupFeaturesLabels.warmupPoolSize.description}
                    value={features.warmupPoolSize}
                    onChange={(val) => updateField("warmupPoolSize", val)}
                    placeholder="e.g. 100k+ inboxes"
                />
                <SelectInput
                    label={warmupFeaturesLabels.warmupNetworkType.label}
                    description={warmupFeaturesLabels.warmupNetworkType.description}
                    value={features.warmupNetworkType}
                    onChange={(val) => updateField("warmupNetworkType", val as WarmupFeatures["warmupNetworkType"])}
                    options={networkTypeOptions}
                />
                <RatingInput
                    label={warmupFeaturesLabels.warmupSpeedControl.label}
                    description={warmupFeaturesLabels.warmupSpeedControl.description}
                    value={features.warmupSpeedControl}
                    onChange={(val) => updateField("warmupSpeedControl", val)}
                />
                <TextFieldInput
                    label={warmupFeaturesLabels.dailyWarmupVolume.label}
                    description={warmupFeaturesLabels.dailyWarmupVolume.description}
                    value={features.dailyWarmupVolume}
                    onChange={(val) => updateField("dailyWarmupVolume", val)}
                    placeholder="e.g. 50 emails/day"
                />
                <TextFieldInput
                    label={warmupFeaturesLabels.warmupDuration.label}
                    description={warmupFeaturesLabels.warmupDuration.description}
                    value={features.warmupDuration}
                    onChange={(val) => updateField("warmupDuration", val)}
                    placeholder="e.g. 2-4 weeks"
                />
                <BooleanInput
                    label={warmupFeaturesLabels.autoReplyOpenSimulation.label}
                    description={warmupFeaturesLabels.autoReplyOpenSimulation.description}
                    value={features.autoReplyOpenSimulation}
                    onChange={(val) => updateField("autoReplyOpenSimulation", val)}
                />
                <BooleanInput
                    label={warmupFeaturesLabels.spamFolderRecovery.label}
                    description={warmupFeaturesLabels.spamFolderRecovery.description}
                    value={features.spamFolderRecovery}
                    onChange={(val) => updateField("spamFolderRecovery", val)}
                />
                <BooleanInput
                    label={warmupFeaturesLabels.customWarmupSchedule.label}
                    description={warmupFeaturesLabels.customWarmupSchedule.description}
                    value={features.customWarmupSchedule}
                    onChange={(val) => updateField("customWarmupSchedule", val)}
                />
                <RatingInput
                    label={warmupFeaturesLabels.warmupAnalytics.label}
                    description={warmupFeaturesLabels.warmupAnalytics.description}
                    value={features.warmupAnalytics}
                    onChange={(val) => updateField("warmupAnalytics", val)}
                />
                <BooleanInput
                    label={warmupFeaturesLabels.warmupHealthScore.label}
                    description={warmupFeaturesLabels.warmupHealthScore.description}
                    value={features.warmupHealthScore}
                    onChange={(val) => updateField("warmupHealthScore", val)}
                />
                <BooleanInput
                    label={warmupFeaturesLabels.warmupSendingParallel.label}
                    description={warmupFeaturesLabels.warmupSendingParallel.description}
                    value={features.warmupSendingParallel}
                    onChange={(val) => updateField("warmupSendingParallel", val)}
                />
            </div>
        </CollapsibleSection>
    )
}
