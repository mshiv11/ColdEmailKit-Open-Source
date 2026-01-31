"use client"

import { ToolSpecificationsDisplay } from "./tool-specifications"
import { CollapsibleFeatureSection } from "./collapsible-feature-section"
import { H2 } from "~/components/common/heading"
import {
    type ToolSpecifications,
    type PricingSpecs,
    type InboxFeatures,
    type WarmupFeatures,
    type LeadsFeatures,
    type EnrichmentFeatures,
    type CopywritingFeatures,
    type OutreachFeatures,
    type DeliverabilityFeatures,
    type LinkedInFeatures,
    defaultPricingSpecs,
    defaultInboxFeatures,
    defaultWarmupFeatures,
    defaultLeadsFeatures,
    defaultEnrichmentFeatures,
    defaultCopywritingFeatures,
    defaultOutreachFeatures,
    defaultDeliverabilityFeatures,
    defaultLinkedInFeatures,
    pricingSpecsLabels,
    inboxFeaturesLabels,
    warmupFeaturesLabels,
    leadsFeaturesLabels,
    enrichmentFeaturesLabels,
    copywritingFeaturesLabels,
    outreachFeaturesLabels,
    deliverabilityFeaturesLabels,
    linkedInFeaturesLabels,
    parseFeatures,
    hasAnyFeatures,
} from "~/types/specifications"

interface ToolFeaturesDisplayProps {
    specifications?: ToolSpecifications | null
    pricingSpecs?: PricingSpecs | null
    inboxFeatures?: InboxFeatures | null
    warmupFeatures?: WarmupFeatures | null
    leadsFeatures?: LeadsFeatures | null
    enrichmentFeatures?: EnrichmentFeatures | null
    copywritingFeatures?: CopywritingFeatures | null
    outreachFeatures?: OutreachFeatures | null
    deliverabilityFeatures?: DeliverabilityFeatures | null
    linkedinFeatures?: LinkedInFeatures | null
    className?: string
}

/**
 * Composite component displaying all tool specifications and features
 * for the public tool page
 */
export function ToolFeaturesDisplay({
    specifications,
    pricingSpecs,
    inboxFeatures,
    warmupFeatures,
    leadsFeatures,
    enrichmentFeatures,
    copywritingFeatures,
    outreachFeatures,
    deliverabilityFeatures,
    linkedinFeatures,
    className,
}: ToolFeaturesDisplayProps) {
    // Check if there are any features to display
    const hasSpecs = specifications && hasAnyFeatures(parseFeatures(specifications, {}))
    const hasPricing = pricingSpecs && hasAnyFeatures(parseFeatures(pricingSpecs, {}))
    const hasInbox = inboxFeatures && hasAnyFeatures(parseFeatures(inboxFeatures, {}))
    const hasWarmup = warmupFeatures && hasAnyFeatures(parseFeatures(warmupFeatures, {}))
    const hasLeads = leadsFeatures && hasAnyFeatures(parseFeatures(leadsFeatures, {}))
    const hasEnrichment = enrichmentFeatures && hasAnyFeatures(parseFeatures(enrichmentFeatures, {}))
    const hasCopywriting = copywritingFeatures && hasAnyFeatures(parseFeatures(copywritingFeatures, {}))
    const hasOutreach = outreachFeatures && hasAnyFeatures(parseFeatures(outreachFeatures, {}))
    const hasDeliverability = deliverabilityFeatures && hasAnyFeatures(parseFeatures(deliverabilityFeatures, {}))
    const hasLinkedin = linkedinFeatures && hasAnyFeatures(parseFeatures(linkedinFeatures, {}))

    const hasAnyContent = hasSpecs || hasPricing || hasInbox || hasWarmup ||
        hasLeads || hasEnrichment || hasCopywriting || hasOutreach ||
        hasDeliverability || hasLinkedin

    if (!hasAnyContent) {
        return null
    }

    return (
        <div className={className}>
            <H2 className="text-xl mb-4">Features & Specifications</H2>

            <div className="space-y-3">
                {/* Core Specifications - Always expanded */}
                <ToolSpecificationsDisplay specifications={specifications} />

                {/* Feature Categories - Collapsible */}
                <CollapsibleFeatureSection
                    title="Pricing Details"
                    icon="lucide/credit-card"
                    features={pricingSpecs ?? {}}
                    defaults={defaultPricingSpecs}
                    labels={pricingSpecsLabels}
                />

                <CollapsibleFeatureSection
                    title="Inbox Features"
                    icon="lucide/inbox"
                    features={inboxFeatures ?? {}}
                    defaults={defaultInboxFeatures}
                    labels={inboxFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="Warm-up Features"
                    icon="lucide/flame"
                    features={warmupFeatures ?? {}}
                    defaults={defaultWarmupFeatures}
                    labels={warmupFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="Lead Database"
                    icon="lucide/users"
                    features={leadsFeatures ?? {}}
                    defaults={defaultLeadsFeatures}
                    labels={leadsFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="Data Enrichment"
                    icon="lucide/database"
                    features={enrichmentFeatures ?? {}}
                    defaults={defaultEnrichmentFeatures}
                    labels={enrichmentFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="AI Copywriting"
                    icon="lucide/pen-tool"
                    features={copywritingFeatures ?? {}}
                    defaults={defaultCopywritingFeatures}
                    labels={copywritingFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="Email Outreach"
                    icon="lucide/send"
                    features={outreachFeatures ?? {}}
                    defaults={defaultOutreachFeatures}
                    labels={outreachFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="Deliverability"
                    icon="lucide/shield-check"
                    features={deliverabilityFeatures ?? {}}
                    defaults={defaultDeliverabilityFeatures}
                    labels={deliverabilityFeaturesLabels}
                />

                <CollapsibleFeatureSection
                    title="LinkedIn Features"
                    icon="lucide/linkedin"
                    features={linkedinFeatures ?? {}}
                    defaults={defaultLinkedInFeatures}
                    labels={linkedInFeaturesLabels}
                />
            </div>
        </div>
    )
}
