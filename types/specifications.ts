// ===========================================
// TOOL SPECIFICATIONS & FEATURES TYPE DEFINITIONS
// ===========================================

// ===========================================
// CORE SPECIFICATIONS (10 fields)
// ===========================================
export interface ToolSpecifications {
    leadDatabaseAccess: number | null    // 0-5: Built-in database for finding prospects
    emailFinding: number | null          // 0-5: Ability to discover email addresses
    emailVerification: number | null     // 0-5: Ability to validate email deliverability
    emailSending: number | null          // 0-5: Run cold email campaigns
    emailWarmup: number | null           // 0-5: Warm inboxes to protect deliverability
    inboxProvision: number | null        // 0-5: Provides inboxes instead of BYO
    linkedinAutomation: number | null    // 0-5: Automates LinkedIn outreach actions
    multiStepSequences: number | null    // 0-5: Automated follow-ups and sequences
    unifiedInbox: number | null          // 0-5: Manage replies in one place
    builtInCrm: number | null            // 0-5: Store and manage leads internally
}

export const defaultSpecifications: ToolSpecifications = {
    leadDatabaseAccess: null,
    emailFinding: null,
    emailVerification: null,
    emailSending: null,
    emailWarmup: null,
    inboxProvision: null,
    linkedinAutomation: null,
    multiStepSequences: null,
    unifiedInbox: null,
    builtInCrm: null,
}

export const specificationLabels: Record<keyof ToolSpecifications, { label: string; description: string }> = {
    leadDatabaseAccess: { label: "Lead Database Access", description: "Built-in database for finding prospects" },
    emailFinding: { label: "Email Finding", description: "Ability to discover email addresses" },
    emailVerification: { label: "Email Verification", description: "Ability to validate email deliverability" },
    emailSending: { label: "Email Sending", description: "Run cold email campaigns" },
    emailWarmup: { label: "Email Warm-up", description: "Warm inboxes to protect deliverability" },
    inboxProvision: { label: "Inbox Provision", description: "Provides inboxes instead of BYO" },
    linkedinAutomation: { label: "LinkedIn Automation", description: "Automates LinkedIn outreach actions" },
    multiStepSequences: { label: "Multi-step Sequences", description: "Automated follow-ups and sequences" },
    unifiedInbox: { label: "Unified Inbox", description: "Manage replies in one place" },
    builtInCrm: { label: "Built-in CRM", description: "Store and manage leads internally" },
}

// ===========================================
// PRICING SPECIFICATIONS (5 fields)
// ===========================================
export interface PricingSpecs {
    _notApplicable?: boolean             // Mark entire section as N/A
    startingPriceMonthly: string | null  // Currency string (e.g., "$29/mo")
    freeTrial: boolean | null            // Trial available before payment
    freePlan: boolean | null             // Permanent free version
    mostPopularPlanPrice: string | null  // Currency string
    unlimitedInboxes: boolean | null     // No hard inbox limits
}

export const defaultPricingSpecs: PricingSpecs = {
    _notApplicable: false,
    startingPriceMonthly: null,
    freeTrial: null,
    freePlan: null,
    mostPopularPlanPrice: null,
    unlimitedInboxes: null,
}

export const pricingSpecsLabels: Record<keyof PricingSpecs, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    startingPriceMonthly: { label: "Starting Price (Monthly)", description: "Lowest paid plan" },
    freeTrial: { label: "Free Trial", description: "Trial available before payment" },
    freePlan: { label: "Free Plan", description: "Permanent free version" },
    mostPopularPlanPrice: { label: "Most Popular Plan Price", description: "Commonly chosen plan" },
    unlimitedInboxes: { label: "Unlimited Inboxes", description: "No hard inbox limits" },
}

// ===========================================
// INBOX FEATURES (12 fields)
// ===========================================
export type InboxType = "google" | "microsoft" | "proprietary" | "multiple" | null

export interface InboxFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    inboxesProvided: boolean | null        // Tool supplies inboxes
    inboxType: InboxType                   // Google, Microsoft, or proprietary
    maxInboxes: string | null              // Maximum inboxes allowed
    costPerInbox: string | null            // Currency: Monthly cost per inbox
    bulkInboxPricing: string | null        // Discounts for volume
    domainProvisionIncluded: boolean | null // Domains included
    domainSetupIncluded: boolean | null    // DNS handled automatically
    autoInboxSetup: boolean | null         // One-click setup
    inboxAgeOnPurchase: string | null      // New or aged inboxes
    inboxHealthMonitoring: number | null   // 0-5: Monitor inbox reputation
    inboxReplacementPolicy: string | null  // Replacement rules
    sendingPlatformCompatibility: string[] // Multi-select: Supported sending tools
}

export const defaultInboxFeatures: InboxFeatures = {
    _notApplicable: false,
    inboxesProvided: null,
    inboxType: null,
    maxInboxes: null,
    costPerInbox: null,
    bulkInboxPricing: null,
    domainProvisionIncluded: null,
    domainSetupIncluded: null,
    autoInboxSetup: null,
    inboxAgeOnPurchase: null,
    inboxHealthMonitoring: null,
    inboxReplacementPolicy: null,
    sendingPlatformCompatibility: [],
}

export const inboxFeaturesLabels: Record<keyof InboxFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    inboxesProvided: { label: "Inboxes Provided", description: "Tool supplies inboxes" },
    inboxType: { label: "Inbox Type", description: "Google, Microsoft, or proprietary" },
    maxInboxes: { label: "Max Inboxes", description: "Maximum inboxes allowed" },
    costPerInbox: { label: "Cost Per Inbox", description: "Monthly cost per inbox" },
    bulkInboxPricing: { label: "Bulk Inbox Pricing", description: "Discounts for volume" },
    domainProvisionIncluded: { label: "Domain Provision Included", description: "Domains included" },
    domainSetupIncluded: { label: "Domain Setup Included", description: "DNS handled automatically" },
    autoInboxSetup: { label: "Auto Inbox Setup", description: "One-click setup" },
    inboxAgeOnPurchase: { label: "Inbox Age on Purchase", description: "New or aged inboxes" },
    inboxHealthMonitoring: { label: "Inbox Health Monitoring", description: "Monitor inbox reputation" },
    inboxReplacementPolicy: { label: "Inbox Replacement Policy", description: "Replacement rules" },
    sendingPlatformCompatibility: { label: "Sending Platform Compatibility", description: "Supported sending tools" },
}

// ===========================================
// WARM-UP FEATURES (12 fields)
// ===========================================
export type WarmupNetworkType = "real" | "simulated" | "hybrid" | null

export interface WarmupFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    warmupIncluded: boolean | null         // Built-in warm-up
    warmupPoolSize: string | null          // Size of warm-up network
    warmupNetworkType: WarmupNetworkType   // Real or simulated inboxes
    warmupSpeedControl: number | null      // 0-5: Control warm-up pace
    dailyWarmupVolume: string | null       // Emails sent per day
    warmupDuration: string | null          // Time to full warm-up
    autoReplyOpenSimulation: boolean | null // Simulated engagement
    spamFolderRecovery: boolean | null     // Moves emails from spam
    customWarmupSchedule: boolean | null   // Schedule control
    warmupAnalytics: number | null         // 0-5: Warm-up performance tracking
    warmupHealthScore: boolean | null      // Health score per inbox
    warmupSendingParallel: boolean | null  // Warm while sending
}

export const defaultWarmupFeatures: WarmupFeatures = {
    _notApplicable: false,
    warmupIncluded: null,
    warmupPoolSize: null,
    warmupNetworkType: null,
    warmupSpeedControl: null,
    dailyWarmupVolume: null,
    warmupDuration: null,
    autoReplyOpenSimulation: null,
    spamFolderRecovery: null,
    customWarmupSchedule: null,
    warmupAnalytics: null,
    warmupHealthScore: null,
    warmupSendingParallel: null,
}

export const warmupFeaturesLabels: Record<keyof WarmupFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    warmupIncluded: { label: "Warmup Included", description: "Built-in warm-up" },
    warmupPoolSize: { label: "Warmup Pool Size", description: "Size of warm-up network" },
    warmupNetworkType: { label: "Warmup Network Type", description: "Real or simulated inboxes" },
    warmupSpeedControl: { label: "Warmup Speed Control", description: "Control warm-up pace" },
    dailyWarmupVolume: { label: "Daily Warmup Volume", description: "Emails sent per day" },
    warmupDuration: { label: "Warmup Duration", description: "Time to full warm-up" },
    autoReplyOpenSimulation: { label: "Auto Reply/Open Simulation", description: "Simulated engagement" },
    spamFolderRecovery: { label: "Spam Folder Recovery", description: "Moves emails from spam" },
    customWarmupSchedule: { label: "Custom Warmup Schedule", description: "Schedule control" },
    warmupAnalytics: { label: "Warmup Analytics", description: "Warm-up performance tracking" },
    warmupHealthScore: { label: "Warmup Health Score", description: "Health score per inbox" },
    warmupSendingParallel: { label: "Warmup + Sending Parallel", description: "Warm while sending" },
}

// ===========================================
// LEADS FEATURES (15 fields)
// ===========================================
export interface LeadsFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    databaseSize: string | null            // Total contacts available
    contactSearch: number | null           // 0-5: Find individual prospects
    companySearch: number | null           // 0-5: Find companies
    searchFiltersCount: number | null      // Available filters count
    emailData: number | null               // 0-5: Email coverage quality
    phoneData: number | null               // 0-5: Phone number availability
    mobilePhoneData: boolean | null        // Mobile numbers included
    jobTitleAccuracy: number | null        // 0-5: Accuracy of roles
    companyDataDepth: number | null        // 0-5: Firmographic detail
    technographicData: boolean | null      // Tech stack insights
    intentData: boolean | null             // Buying intent signals
    dataAccuracyRate: string | null        // Claimed accuracy
    creditsIncluded: string | null         // Monthly credits
    costPerCredit: string | null           // Currency: Overages pricing
    realTimeVerification: boolean | null   // Verify before export
}

export const defaultLeadsFeatures: LeadsFeatures = {
    _notApplicable: false,
    databaseSize: null,
    contactSearch: null,
    companySearch: null,
    searchFiltersCount: null,
    emailData: null,
    phoneData: null,
    mobilePhoneData: null,
    jobTitleAccuracy: null,
    companyDataDepth: null,
    technographicData: null,
    intentData: null,
    dataAccuracyRate: null,
    creditsIncluded: null,
    costPerCredit: null,
    realTimeVerification: null,
}

export const leadsFeaturesLabels: Record<keyof LeadsFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    databaseSize: { label: "Database Size", description: "Total contacts available" },
    contactSearch: { label: "Contact Search", description: "Find individual prospects" },
    companySearch: { label: "Company Search", description: "Find companies" },
    searchFiltersCount: { label: "Search Filters Count", description: "Available filters" },
    emailData: { label: "Email Data", description: "Email coverage quality" },
    phoneData: { label: "Phone Data", description: "Phone number availability" },
    mobilePhoneData: { label: "Mobile Phone Data", description: "Mobile numbers included" },
    jobTitleAccuracy: { label: "Job Title Accuracy", description: "Accuracy of roles" },
    companyDataDepth: { label: "Company Data Depth", description: "Firmographic detail" },
    technographicData: { label: "Technographic Data", description: "Tech stack insights" },
    intentData: { label: "Intent Data", description: "Buying intent signals" },
    dataAccuracyRate: { label: "Data Accuracy Rate", description: "Claimed accuracy" },
    creditsIncluded: { label: "Credits Included", description: "Monthly credits" },
    costPerCredit: { label: "Cost Per Credit", description: "Overages pricing" },
    realTimeVerification: { label: "Real-time Verification", description: "Verify before export" },
}

// ===========================================
// ENRICHMENT FEATURES (12 fields)
// ===========================================
export type EnrichmentType = "contact" | "company" | "both" | null

export interface EnrichmentFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    enrichmentType: EnrichmentType         // Contact, company, or both
    dataPointsAvailable: number | null     // Fields enriched count
    emailEnrichment: number | null         // 0-5: Find missing emails
    phoneEnrichment: number | null         // 0-5: Find phone numbers
    companyEnrichment: number | null       // 0-5: Add company data
    socialProfileEnrichment: boolean | null // LinkedIn, social links
    waterfallEnrichment: boolean | null    // Multi-source lookup
    realTimeEnrichment: boolean | null     // Enrich on demand
    bulkEnrichment: number | null          // 0-5: Enrich at scale
    apiEnrichment: number | null           // 0-5: API access
    enrichmentAccuracy: string | null      // Claimed accuracy
    enrichmentCreditsIncluded: string | null // Monthly allowance
}

export const defaultEnrichmentFeatures: EnrichmentFeatures = {
    _notApplicable: false,
    enrichmentType: null,
    dataPointsAvailable: null,
    emailEnrichment: null,
    phoneEnrichment: null,
    companyEnrichment: null,
    socialProfileEnrichment: null,
    waterfallEnrichment: null,
    realTimeEnrichment: null,
    bulkEnrichment: null,
    apiEnrichment: null,
    enrichmentAccuracy: null,
    enrichmentCreditsIncluded: null,
}

export const enrichmentFeaturesLabels: Record<keyof EnrichmentFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    enrichmentType: { label: "Enrichment Type", description: "Contact, company, or both" },
    dataPointsAvailable: { label: "Data Points Available", description: "Fields enriched" },
    emailEnrichment: { label: "Email Enrichment", description: "Find missing emails" },
    phoneEnrichment: { label: "Phone Enrichment", description: "Find phone numbers" },
    companyEnrichment: { label: "Company Enrichment", description: "Add company data" },
    socialProfileEnrichment: { label: "Social Profile Enrichment", description: "LinkedIn, social links" },
    waterfallEnrichment: { label: "Waterfall Enrichment", description: "Multi-source lookup" },
    realTimeEnrichment: { label: "Real-time Enrichment", description: "Enrich on demand" },
    bulkEnrichment: { label: "Bulk Enrichment", description: "Enrich at scale" },
    apiEnrichment: { label: "API Enrichment", description: "API access" },
    enrichmentAccuracy: { label: "Enrichment Accuracy", description: "Claimed accuracy" },
    enrichmentCreditsIncluded: { label: "Credits Included", description: "Monthly allowance" },
}

// ===========================================
// COPYWRITING FEATURES (12 fields)
// ===========================================
export interface CopywritingFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    aiEmailGeneration: number | null       // 0-5: Generate full emails
    personalizationDepth: number | null    // 0-5: Level of customization
    researchAutomation: number | null      // 0-5: Auto prospect research
    dataSourcesUsed: string[]              // Multi-select: Sources used for copy
    toneControl: boolean | null            // Adjust writing style
    templateLibrary: boolean | null        // Pre-built templates
    customTemplateTraining: boolean | null // Train on own emails
    subjectLineGeneration: boolean | null  // Generate subject lines
    abVariantGeneration: boolean | null    // Copy testing
    multiLanguageSupport: boolean | null   // Non-English support
    emailScoring: boolean | null           // Quality scoring
    platformIntegrations: string[]         // Multi-select: Outreach integrations
}

export const defaultCopywritingFeatures: CopywritingFeatures = {
    _notApplicable: false,
    aiEmailGeneration: null,
    personalizationDepth: null,
    researchAutomation: null,
    dataSourcesUsed: [],
    toneControl: null,
    templateLibrary: null,
    customTemplateTraining: null,
    subjectLineGeneration: null,
    abVariantGeneration: null,
    multiLanguageSupport: null,
    emailScoring: null,
    platformIntegrations: [],
}

export const copywritingFeaturesLabels: Record<keyof CopywritingFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    aiEmailGeneration: { label: "AI Email Generation", description: "Generate full emails" },
    personalizationDepth: { label: "Personalization Depth", description: "Level of customization" },
    researchAutomation: { label: "Research Automation", description: "Auto prospect research" },
    dataSourcesUsed: { label: "Data Sources Used", description: "Sources used for copy" },
    toneControl: { label: "Tone Control", description: "Adjust writing style" },
    templateLibrary: { label: "Template Library", description: "Pre-built templates" },
    customTemplateTraining: { label: "Custom Template Training", description: "Train on own emails" },
    subjectLineGeneration: { label: "Subject Line Generation", description: "Generate subject lines" },
    abVariantGeneration: { label: "A/B Variant Generation", description: "Copy testing" },
    multiLanguageSupport: { label: "Multi-language Support", description: "Non-English support" },
    emailScoring: { label: "Email Scoring", description: "Quality scoring" },
    platformIntegrations: { label: "Platform Integrations", description: "Outreach integrations" },
}

// ===========================================
// OUTREACH FEATURES (18 fields across sub-categories)
// ===========================================
export interface OutreachFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    // Sending (8 fields)
    outreachEmailSending: number | null       // 0-5: Core sending engine
    maxEmailsPerDay: string | null         // Daily sending cap
    maxEmailsPerMonth: string | null       // Monthly sending cap
    unlimitedSending: boolean | null       // No email limits
    inboxRotation: number | null           // 0-5: Distribute sends
    smartRotation: boolean | null          // Optimized rotation
    sendingScheduleControl: number | null  // 0-5: Time-based sending
    timezoneSending: boolean | null        // Send by recipient TZ

    // Sequences (5 fields)
    outreachMultiStepSequences: number | null // 0-5: Automated follow-ups
    maxSequenceSteps: string | null        // Sequence depth
    abTesting: number | null               // 0-5: Variant testing
    conditionalLogic: number | null        // 0-5: If/then branching
    autoPauseOnReply: boolean | null       // Stop on reply

    // Personalization (3 fields)
    customVariables: number | null         // 0-5: Merge fields
    spintaxSupport: number | null          // 0-5: Text variations
    aiPersonalization: number | null       // 0-5: AI-based tokens

    // Response (2 fields)
    outreachUnifiedInbox: number | null       // 0-5: Central reply inbox
    aiReplyCategorization: number | null   // 0-5: Auto-sort replies
}

export const defaultOutreachFeatures: OutreachFeatures = {
    _notApplicable: false,
    outreachEmailSending: null,
    maxEmailsPerDay: null,
    maxEmailsPerMonth: null,
    unlimitedSending: null,
    inboxRotation: null,
    smartRotation: null,
    sendingScheduleControl: null,
    timezoneSending: null,
    outreachMultiStepSequences: null,
    maxSequenceSteps: null,
    abTesting: null,
    conditionalLogic: null,
    autoPauseOnReply: null,
    customVariables: null,
    spintaxSupport: null,
    aiPersonalization: null,
    outreachUnifiedInbox: null,
    aiReplyCategorization: null,
}

export const outreachFeaturesLabels: Record<keyof OutreachFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    outreachEmailSending: { label: "Email Sending", description: "Core sending engine" },
    maxEmailsPerDay: { label: "Max Emails Per Day", description: "Daily sending cap" },
    maxEmailsPerMonth: { label: "Max Emails Per Month", description: "Monthly sending cap" },
    unlimitedSending: { label: "Unlimited Sending", description: "No email limits" },
    inboxRotation: { label: "Inbox Rotation", description: "Distribute sends" },
    smartRotation: { label: "Smart Rotation", description: "Optimized rotation" },
    sendingScheduleControl: { label: "Sending Schedule Control", description: "Time-based sending" },
    timezoneSending: { label: "Timezone Sending", description: "Send by recipient TZ" },
    outreachMultiStepSequences: { label: "Multi-step Sequences", description: "Automated follow-ups" },
    maxSequenceSteps: { label: "Max Sequence Steps", description: "Sequence depth" },
    abTesting: { label: "A/B Testing", description: "Variant testing" },
    conditionalLogic: { label: "Conditional Logic", description: "If/then branching" },
    autoPauseOnReply: { label: "Auto-pause on Reply", description: "Stop on reply" },
    customVariables: { label: "Custom Variables", description: "Merge fields" },
    spintaxSupport: { label: "Spintax Support", description: "Text variations" },
    aiPersonalization: { label: "AI Personalization", description: "AI-based tokens" },
    outreachUnifiedInbox: { label: "Unified Inbox", description: "Central reply inbox" },
    aiReplyCategorization: { label: "AI Reply Categorization", description: "Auto-sort replies" },
}

// ===========================================
// DELIVERABILITY FEATURES (12 fields)
// ===========================================
export interface DeliverabilityFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    inboxPlacementTesting: number | null   // 0-5: Inbox vs spam testing
    spamScoreTesting: number | null        // 0-5: Spam risk analysis
    blacklistMonitoring: number | null     // 0-5: Blacklist checks
    domainReputationMonitoring: number | null // 0-5: Domain health tracking
    ipReputationMonitoring: number | null  // 0-5: IP health tracking
    dmarcSpfDkimChecker: boolean | null    // DNS validation
    emailContentAnalysis: number | null    // 0-5: Spam trigger analysis
    deliverabilityAlerts: boolean | null   // Issue notifications
    historicalTracking: boolean | null     // Performance history
    providerSpecificTesting: boolean | null // Gmail, Outlook tests
    remediationGuidance: number | null     // 0-5: Fix recommendations
    monitoringFrequency: string | null     // Real-time or periodic
}

export const defaultDeliverabilityFeatures: DeliverabilityFeatures = {
    _notApplicable: false,
    inboxPlacementTesting: null,
    spamScoreTesting: null,
    blacklistMonitoring: null,
    domainReputationMonitoring: null,
    ipReputationMonitoring: null,
    dmarcSpfDkimChecker: null,
    emailContentAnalysis: null,
    deliverabilityAlerts: null,
    historicalTracking: null,
    providerSpecificTesting: null,
    remediationGuidance: null,
    monitoringFrequency: null,
}

export const deliverabilityFeaturesLabels: Record<keyof DeliverabilityFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    inboxPlacementTesting: { label: "Inbox Placement Testing", description: "Inbox vs spam testing" },
    spamScoreTesting: { label: "Spam Score Testing", description: "Spam risk analysis" },
    blacklistMonitoring: { label: "Blacklist Monitoring", description: "Blacklist checks" },
    domainReputationMonitoring: { label: "Domain Reputation Monitoring", description: "Domain health tracking" },
    ipReputationMonitoring: { label: "IP Reputation Monitoring", description: "IP health tracking" },
    dmarcSpfDkimChecker: { label: "DMARC/SPF/DKIM Checker", description: "DNS validation" },
    emailContentAnalysis: { label: "Email Content Analysis", description: "Spam trigger analysis" },
    deliverabilityAlerts: { label: "Deliverability Alerts", description: "Issue notifications" },
    historicalTracking: { label: "Historical Tracking", description: "Performance history" },
    providerSpecificTesting: { label: "Provider-specific Testing", description: "Gmail, Outlook tests" },
    remediationGuidance: { label: "Remediation Guidance", description: "Fix recommendations" },
    monitoringFrequency: { label: "Monitoring Frequency", description: "Real-time or periodic" },
}

// ===========================================
// LINKEDIN FEATURES (12 fields)
// ===========================================
export type LinkedInConnectionMethod = "api" | "browser" | "hybrid" | "cloud" | null

export interface LinkedInFeatures {
    _notApplicable?: boolean             // Mark entire section as N/A
    linkedinConnectionMethod: LinkedInConnectionMethod // Connection approach
    multipleLinkedinAccounts: boolean | null // Multi-account support
    salesNavigatorSupport: boolean | null  // Navigator integration
    autoConnectionRequests: number | null  // 0-5: Automated connects
    autoLinkedinMessages: number | null    // 0-5: Automated messages
    linkedinMessageSequences: number | null // 0-5: Follow-up chains
    autoProfileViews: number | null        // 0-5: Profile visits
    linkedinProfileScraping: number | null // 0-5: Data extraction
    emailFindingFromLinkedin: number | null // 0-5: Extract emails
    linkedinSafetyFeatures: number | null  // 0-5: Risk protection
    humanLikeBehavior: number | null       // 0-5: Anti-detection logic
    linkedinEmailSequences: number | null  // 0-5: Cross-channel flows
}

export const defaultLinkedInFeatures: LinkedInFeatures = {
    _notApplicable: false,
    linkedinConnectionMethod: null,
    multipleLinkedinAccounts: null,
    salesNavigatorSupport: null,
    autoConnectionRequests: null,
    autoLinkedinMessages: null,
    linkedinMessageSequences: null,
    autoProfileViews: null,
    linkedinProfileScraping: null,
    emailFindingFromLinkedin: null,
    linkedinSafetyFeatures: null,
    humanLikeBehavior: null,
    linkedinEmailSequences: null,
}

export const linkedInFeaturesLabels: Record<keyof LinkedInFeatures, { label: string; description: string }> = {
    _notApplicable: { label: "", description: "" },
    linkedinConnectionMethod: { label: "LinkedIn Connection Method", description: "Connection approach" },
    multipleLinkedinAccounts: { label: "Multiple LinkedIn Accounts", description: "Multi-account support" },
    salesNavigatorSupport: { label: "Sales Navigator Support", description: "Navigator integration" },
    autoConnectionRequests: { label: "Auto Connection Requests", description: "Automated connects" },
    autoLinkedinMessages: { label: "Auto LinkedIn Messages", description: "Automated messages" },
    linkedinMessageSequences: { label: "LinkedIn Message Sequences", description: "Follow-up chains" },
    autoProfileViews: { label: "Auto Profile Views", description: "Profile visits" },
    linkedinProfileScraping: { label: "LinkedIn Profile Scraping", description: "Data extraction" },
    emailFindingFromLinkedin: { label: "Email Finding from LinkedIn", description: "Extract emails" },
    linkedinSafetyFeatures: { label: "LinkedIn Safety Features", description: "Risk protection" },
    humanLikeBehavior: { label: "Human-like Behavior", description: "Anti-detection logic" },
    linkedinEmailSequences: { label: "LinkedIn + Email Sequences", description: "Cross-channel flows" },
}

// ===========================================
// AGGREGATE TYPE FOR COMPLETE TOOL FEATURES
// ===========================================
export interface ToolFeaturesComplete {
    specifications: ToolSpecifications
    pricingSpecs: PricingSpecs
    inboxFeatures: InboxFeatures
    warmupFeatures: WarmupFeatures
    leadsFeatures: LeadsFeatures
    enrichmentFeatures: EnrichmentFeatures
    copywritingFeatures: CopywritingFeatures
    outreachFeatures: OutreachFeatures
    deliverabilityFeatures: DeliverabilityFeatures
    linkedinFeatures: LinkedInFeatures
}

export const defaultToolFeatures: ToolFeaturesComplete = {
    specifications: defaultSpecifications,
    pricingSpecs: defaultPricingSpecs,
    inboxFeatures: defaultInboxFeatures,
    warmupFeatures: defaultWarmupFeatures,
    leadsFeatures: defaultLeadsFeatures,
    enrichmentFeatures: defaultEnrichmentFeatures,
    copywritingFeatures: defaultCopywritingFeatures,
    outreachFeatures: defaultOutreachFeatures,
    deliverabilityFeatures: defaultDeliverabilityFeatures,
    linkedinFeatures: defaultLinkedInFeatures,
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Safely parse JSON features from database, returning defaults if invalid
 */
export function parseFeatures<T>(json: unknown, defaults: T): T {
    if (!json || typeof json !== "object") {
        return defaults
    }
    return { ...defaults, ...(json as T) }
}

/**
 * Check if any features have been set in a feature object
 * Excludes the _notApplicable field and returns false if section is marked N/A
 */
export function hasAnyFeatures<T extends object>(features: T): boolean {
    // If marked as not applicable, treat as no features
    if ((features as Record<string, unknown>)._notApplicable === true) {
        return false
    }

    return Object.entries(features).some(([key, value]) => {
        // Skip the N/A toggle field itself
        if (key === "_notApplicable") return false

        if (Array.isArray(value)) return value.length > 0
        // For booleans, only count true values as "set"
        if (typeof value === "boolean") return value === true
        // For numbers, only count > 0 as "set" (0 is default/not set for ratings)
        if (typeof value === "number") return value > 0
        // For strings, only count non-empty as "set"
        if (typeof value === "string") return value.length > 0
        return value !== null && value !== undefined
    })
}

/**
 * Count the number of filled features in a feature object
 * Excludes the _notApplicable field from count
 */
export function countFilledFeatures<T extends object>(features: T): number {
    return Object.entries(features).filter(([key, value]) => {
        // Skip the N/A toggle field
        if (key === "_notApplicable") return false

        if (Array.isArray(value)) return value.length > 0
        // For booleans, only count true values
        if (typeof value === "boolean") return value === true
        // For numbers, only count > 0
        if (typeof value === "number") return value > 0
        // For strings, only count non-empty
        if (typeof value === "string") return value.length > 0
        return value !== null && value !== undefined
    }).length
}
