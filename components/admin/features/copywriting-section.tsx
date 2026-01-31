"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput } from "~/components/admin/feature-inputs"
import {
    type CopywritingFeatures,
    defaultCopywritingFeatures,
    copywritingFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface CopywritingSectionProps {
    value: CopywritingFeatures | null | undefined
    onChange: (value: CopywritingFeatures) => void
    defaultOpen?: boolean
}

export function CopywritingSection({
    value,
    onChange,
    defaultOpen = false,
}: CopywritingSectionProps) {
    const features = parseFeatures(value, defaultCopywritingFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultCopywritingFeatures).length

    const updateField = <K extends keyof CopywritingFeatures>(
        field: K,
        newValue: CopywritingFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    return (
        <CollapsibleSection
            title="Copywriting Features"
            description="AI copywriting and personalization"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-0">
                <RatingInput
                    label={copywritingFeaturesLabels.aiEmailGeneration.label}
                    description={copywritingFeaturesLabels.aiEmailGeneration.description}
                    value={features.aiEmailGeneration}
                    onChange={(val) => updateField("aiEmailGeneration", val)}
                />
                <RatingInput
                    label={copywritingFeaturesLabels.personalizationDepth.label}
                    description={copywritingFeaturesLabels.personalizationDepth.description}
                    value={features.personalizationDepth}
                    onChange={(val) => updateField("personalizationDepth", val)}
                />
                <RatingInput
                    label={copywritingFeaturesLabels.researchAutomation.label}
                    description={copywritingFeaturesLabels.researchAutomation.description}
                    value={features.researchAutomation}
                    onChange={(val) => updateField("researchAutomation", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.toneControl.label}
                    description={copywritingFeaturesLabels.toneControl.description}
                    value={features.toneControl}
                    onChange={(val) => updateField("toneControl", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.templateLibrary.label}
                    description={copywritingFeaturesLabels.templateLibrary.description}
                    value={features.templateLibrary}
                    onChange={(val) => updateField("templateLibrary", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.customTemplateTraining.label}
                    description={copywritingFeaturesLabels.customTemplateTraining.description}
                    value={features.customTemplateTraining}
                    onChange={(val) => updateField("customTemplateTraining", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.subjectLineGeneration.label}
                    description={copywritingFeaturesLabels.subjectLineGeneration.description}
                    value={features.subjectLineGeneration}
                    onChange={(val) => updateField("subjectLineGeneration", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.abVariantGeneration.label}
                    description={copywritingFeaturesLabels.abVariantGeneration.description}
                    value={features.abVariantGeneration}
                    onChange={(val) => updateField("abVariantGeneration", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.multiLanguageSupport.label}
                    description={copywritingFeaturesLabels.multiLanguageSupport.description}
                    value={features.multiLanguageSupport}
                    onChange={(val) => updateField("multiLanguageSupport", val)}
                />
                <BooleanInput
                    label={copywritingFeaturesLabels.emailScoring.label}
                    description={copywritingFeaturesLabels.emailScoring.description}
                    value={features.emailScoring}
                    onChange={(val) => updateField("emailScoring", val)}
                />
            </div>
        </CollapsibleSection>
    )
}
