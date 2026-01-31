"use client"

import { CollapsibleSection } from "~/components/admin/collapsible-section"
import { RatingInput, BooleanInput, TextFieldInput } from "~/components/admin/feature-inputs"
import { H3 } from "~/components/common/heading"
import {
    type OutreachFeatures,
    defaultOutreachFeatures,
    outreachFeaturesLabels,
    parseFeatures,
    countFilledFeatures,
} from "~/types/specifications"

interface OutreachSectionProps {
    value: OutreachFeatures | null | undefined
    onChange: (value: OutreachFeatures) => void
    defaultOpen?: boolean
}

export function OutreachSection({
    value,
    onChange,
    defaultOpen = false,
}: OutreachSectionProps) {
    const features = parseFeatures(value, defaultOutreachFeatures)
    const filledCount = countFilledFeatures(features)
    const fieldCount = Object.keys(defaultOutreachFeatures).length

    const updateField = <K extends keyof OutreachFeatures>(
        field: K,
        newValue: OutreachFeatures[K]
    ) => {
        onChange({ ...features, [field]: newValue })
    }

    return (
        <CollapsibleSection
            title="Outreach Features"
            description="Email sending, sequences, and personalization"
            defaultOpen={defaultOpen}
            fieldCount={fieldCount - 1}
            filledCount={features._notApplicable ? 0 : filledCount - (features._notApplicable !== undefined ? 1 : 0)}
            isNotApplicable={features._notApplicable}
            onNotApplicableChange={(val) => updateField("_notApplicable", val)}
            showNotApplicableToggle={true}
        >
            <div className="space-y-4">
                {/* Sending Section */}
                <div>
                    <H3 className="text-sm font-semibold mb-2 text-muted-foreground">Sending</H3>
                    <div className="space-y-0 border rounded-lg p-3">
                        <RatingInput
                            label={outreachFeaturesLabels.outreachEmailSending.label}
                            description={outreachFeaturesLabels.outreachEmailSending.description}
                            value={features.outreachEmailSending}
                            onChange={(val) => updateField("outreachEmailSending", val)}
                        />
                        <TextFieldInput
                            label={outreachFeaturesLabels.maxEmailsPerDay.label}
                            description={outreachFeaturesLabels.maxEmailsPerDay.description}
                            value={features.maxEmailsPerDay}
                            onChange={(val) => updateField("maxEmailsPerDay", val)}
                            placeholder="e.g. 5000"
                        />
                        <TextFieldInput
                            label={outreachFeaturesLabels.maxEmailsPerMonth.label}
                            description={outreachFeaturesLabels.maxEmailsPerMonth.description}
                            value={features.maxEmailsPerMonth}
                            onChange={(val) => updateField("maxEmailsPerMonth", val)}
                            placeholder="e.g. 100,000"
                        />
                        <BooleanInput
                            label={outreachFeaturesLabels.unlimitedSending.label}
                            description={outreachFeaturesLabels.unlimitedSending.description}
                            value={features.unlimitedSending}
                            onChange={(val) => updateField("unlimitedSending", val)}
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.inboxRotation.label}
                            description={outreachFeaturesLabels.inboxRotation.description}
                            value={features.inboxRotation}
                            onChange={(val) => updateField("inboxRotation", val)}
                        />
                        <BooleanInput
                            label={outreachFeaturesLabels.smartRotation.label}
                            description={outreachFeaturesLabels.smartRotation.description}
                            value={features.smartRotation}
                            onChange={(val) => updateField("smartRotation", val)}
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.sendingScheduleControl.label}
                            description={outreachFeaturesLabels.sendingScheduleControl.description}
                            value={features.sendingScheduleControl}
                            onChange={(val) => updateField("sendingScheduleControl", val)}
                        />
                        <BooleanInput
                            label={outreachFeaturesLabels.timezoneSending.label}
                            description={outreachFeaturesLabels.timezoneSending.description}
                            value={features.timezoneSending}
                            onChange={(val) => updateField("timezoneSending", val)}
                        />
                    </div>
                </div>

                {/* Sequences Section */}
                <div>
                    <H3 className="text-sm font-semibold mb-2 text-muted-foreground">Sequences</H3>
                    <div className="space-y-0 border rounded-lg p-3">
                        <RatingInput
                            label={outreachFeaturesLabels.outreachMultiStepSequences.label}
                            description={outreachFeaturesLabels.outreachMultiStepSequences.description}
                            value={features.outreachMultiStepSequences}
                            onChange={(val) => updateField("outreachMultiStepSequences", val)}
                        />
                        <TextFieldInput
                            label={outreachFeaturesLabels.maxSequenceSteps.label}
                            description={outreachFeaturesLabels.maxSequenceSteps.description}
                            value={features.maxSequenceSteps}
                            onChange={(val) => updateField("maxSequenceSteps", val)}
                            placeholder="e.g. 10 steps"
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.abTesting.label}
                            description={outreachFeaturesLabels.abTesting.description}
                            value={features.abTesting}
                            onChange={(val) => updateField("abTesting", val)}
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.conditionalLogic.label}
                            description={outreachFeaturesLabels.conditionalLogic.description}
                            value={features.conditionalLogic}
                            onChange={(val) => updateField("conditionalLogic", val)}
                        />
                        <BooleanInput
                            label={outreachFeaturesLabels.autoPauseOnReply.label}
                            description={outreachFeaturesLabels.autoPauseOnReply.description}
                            value={features.autoPauseOnReply}
                            onChange={(val) => updateField("autoPauseOnReply", val)}
                        />
                    </div>
                </div>

                {/* Personalization Section */}
                <div>
                    <H3 className="text-sm font-semibold mb-2 text-muted-foreground">Personalization</H3>
                    <div className="space-y-0 border rounded-lg p-3">
                        <RatingInput
                            label={outreachFeaturesLabels.customVariables.label}
                            description={outreachFeaturesLabels.customVariables.description}
                            value={features.customVariables}
                            onChange={(val) => updateField("customVariables", val)}
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.spintaxSupport.label}
                            description={outreachFeaturesLabels.spintaxSupport.description}
                            value={features.spintaxSupport}
                            onChange={(val) => updateField("spintaxSupport", val)}
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.aiPersonalization.label}
                            description={outreachFeaturesLabels.aiPersonalization.description}
                            value={features.aiPersonalization}
                            onChange={(val) => updateField("aiPersonalization", val)}
                        />
                    </div>
                </div>

                {/* Response Section */}
                <div>
                    <H3 className="text-sm font-semibold mb-2 text-muted-foreground">Response Management</H3>
                    <div className="space-y-0 border rounded-lg p-3">
                        <RatingInput
                            label={outreachFeaturesLabels.outreachUnifiedInbox.label}
                            description={outreachFeaturesLabels.outreachUnifiedInbox.description}
                            value={features.outreachUnifiedInbox}
                            onChange={(val) => updateField("outreachUnifiedInbox", val)}
                        />
                        <RatingInput
                            label={outreachFeaturesLabels.aiReplyCategorization.label}
                            description={outreachFeaturesLabels.aiReplyCategorization.description}
                            value={features.aiReplyCategorization}
                            onChange={(val) => updateField("aiReplyCategorization", val)}
                        />
                    </div>
                </div>
            </div>
        </CollapsibleSection>
    )
}
