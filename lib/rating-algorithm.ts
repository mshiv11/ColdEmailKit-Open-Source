/**
 * Proprietary Rating Algorithm
 * 
 * Calculates weighted average ratings across multiple platforms:
 * G2, Trustpilot, Capterra, TrustRadius, and ColdEmailKit (internal)
 * 
 * Platform Rating Scales:
 * - G2: 5-star scale (no conversion needed)
 * - Trustpilot: 5-star scale (no conversion needed)
 * - Capterra: 5-star scale (no conversion needed)
 * - TrustRadius: 10-point scale (converted to 5-point by dividing by 2)
 * - ColdEmailKit: 5-star scale (no conversion needed)
 */

interface PlatformData {
    rating: number | null | undefined
    reviews: number | null | undefined
}

interface RatingInput {
    g2: PlatformData
    trustpilot: PlatformData
    capterra: PlatformData
    trustradius: PlatformData
    coldEmailKit: PlatformData
}

interface RatingResult {
    proprietaryRating: number | null  // 0-5 scale
    totalReviews: number
    confidenceScore: number           // 0-100 percentage
    trustScore: number | null         // 0-100 percentage (matches DB Trust Score field)
}

/**
 * Check if a platform has valid data (rating > 0 and reviews > 0)
 */
function hasValidData(platform: PlatformData): boolean {
    return (
        platform.rating !== null &&
        platform.rating !== undefined &&
        platform.rating > 0 &&
        platform.reviews !== null &&
        platform.reviews !== undefined &&
        platform.reviews > 0
    )
}

/**
 * Get the rating value from a platform, normalized to 5-point scale
 * TrustRadius ratings (0-10) are converted to (0-5) by dividing by 2
 */
function getNormalizedRating(platform: PlatformData, platformName: string): number {
    const rating = platform.rating ?? 0

    // TrustRadius uses 10-point scale, convert to 5-point
    if (platformName === 'trustradius') {
        return rating / 2
    }

    return rating
}

/**
 * Get the reviews count from a platform, defaulting to 0
 */
function getReviews(platform: PlatformData): number {
    return platform.reviews ?? 0
}

/**
 * ColdEmailKit Weight Configuration
 * 
 * ColdEmailKit is the website's own rating and should carry the highest weight.
 * Weight: 40% for ColdEmailKit, remaining 60% distributed equally among external platforms.
 */
const COLDEMAILKIT_WEIGHT = 0.4  // 40% weight for ColdEmailKit
const EXTERNAL_TOTAL_WEIGHT = 0.6  // 60% weight shared by all external platforms

/**
 * Calculate the proprietary rating using weighted average
 * 
 * Algorithm:
 * 1. Collect average ratings from all platforms with valid data (normalized to 5-point scale)
 * 2. Weight distribution:
 *    - ColdEmailKit: 40% (highest weight - website's own rating)
 *    - External platforms: 60% split equally (e.g., 4 platforms = 15% each)
 * 3. Special rules:
 *    - Only ColdEmailKit data → Use ColdEmailKit rating only
 *    - Only external platforms (no ColdEmailKit) → Equal weights among externals
 *    - No data anywhere → Return null
 * 4. Compute weighted average: Σ (Platform_Rating × Weight)
 * 5. Confidence Score: MIN(total_reviews ÷ 50, 1.0) × 100% (0-100)
 * 6. Trust Score: (Overall_Rating / 5) × Confidence (0-100%), capped at 100
 */
export function calculateProprietaryRating(input: RatingInput): RatingResult {
    const externalPlatforms = ['g2', 'trustpilot', 'capterra', 'trustradius'] as const

    // Check which platforms have valid data
    const validExternalPlatforms = externalPlatforms.filter(name =>
        hasValidData(input[name])
    )
    const hasColdEmailKitData = hasValidData(input.coldEmailKit)

    // Calculate total reviews across all platforms
    const totalReviews =
        getReviews(input.g2) +
        getReviews(input.trustpilot) +
        getReviews(input.capterra) +
        getReviews(input.trustradius) +
        getReviews(input.coldEmailKit)

    // Calculate confidence score: MIN(total_reviews / 50, 1.0) * 100
    const confidenceScore = Math.min(totalReviews / 50, 1.0) * 100

    let proprietaryRating: number | null = null

    // Edge case: No data anywhere
    if (validExternalPlatforms.length === 0 && !hasColdEmailKitData) {
        return {
            proprietaryRating: null,
            totalReviews: 0,
            confidenceScore: 0,
            trustScore: null
        }
    }

    // Edge case: Only ColdEmailKit data exists
    if (validExternalPlatforms.length === 0 && hasColdEmailKitData) {
        // 100% ColdEmailKit
        proprietaryRating = getNormalizedRating(input.coldEmailKit, 'coldEmailKit')
    }
    // Edge case: Only external platforms, no ColdEmailKit
    else if (validExternalPlatforms.length > 0 && !hasColdEmailKitData) {
        // Equal weights among external platforms only
        const N = validExternalPlatforms.length
        const weight = 1 / N
        let weightedSum = 0
        for (const platformName of validExternalPlatforms) {
            weightedSum += getNormalizedRating(input[platformName], platformName) * weight
        }
        proprietaryRating = weightedSum
    }
    // Normal case: ColdEmailKit + external platforms
    else {
        // ColdEmailKit gets 40%, externals share 60%
        const coldEmailKitRating = getNormalizedRating(input.coldEmailKit, 'coldEmailKit')
        const externalCount = validExternalPlatforms.length
        const externalWeight = EXTERNAL_TOTAL_WEIGHT / externalCount  // e.g., 60% / 4 = 15% each

        let weightedSum = coldEmailKitRating * COLDEMAILKIT_WEIGHT  // 40% ColdEmailKit

        for (const platformName of validExternalPlatforms) {
            weightedSum += getNormalizedRating(input[platformName], platformName) * externalWeight
        }

        proprietaryRating = weightedSum
    }

    // Round to 2 decimal places
    if (proprietaryRating !== null) {
        proprietaryRating = Math.round(proprietaryRating * 100) / 100
    }

    // Calculate Trust Score as percentage (0-100)
    // Formula: (Rating / 5) * Confidence, capped at 100
    // This gives a 0-100% score that reflects both rating quality and data confidence
    let trustScore: number | null = null
    if (proprietaryRating !== null) {
        // Convert 0-5 rating to 0-100 base, then multiply by confidence factor
        trustScore = (proprietaryRating / 5) * confidenceScore
        // Round to whole number for percentage display
        trustScore = Math.round(trustScore)
        // Cap at 100
        trustScore = Math.min(trustScore, 100)
    }

    return {
        proprietaryRating,
        totalReviews,
        confidenceScore: Math.round(confidenceScore),
        trustScore
    }
}

/**
 * Helper type for form data
 * Note: TrustRadius rating is entered on 0-10 scale and converted internally
 */
export interface PlatformFormData {
    g2Rating: number           // 0-5 scale
    g2Reviews: number
    trustpilotRating: number   // 0-5 scale
    trustpilotReviews: number
    capterraRating: number     // 0-5 scale
    capterraReviews: number
    trustradiusRating: number  // 0-10 scale (converted to 0-5 internally)
    trustradiusReviews: number
    coldEmailKitRating: number // 0-5 scale
    coldEmailKitReviews: number
}

/**
 * Convert form data to RatingInput format
 */
export function formDataToRatingInput(data: PlatformFormData): RatingInput {
    return {
        g2: { rating: data.g2Rating, reviews: data.g2Reviews },
        trustpilot: { rating: data.trustpilotRating, reviews: data.trustpilotReviews },
        capterra: { rating: data.capterraRating, reviews: data.capterraReviews },
        trustradius: { rating: data.trustradiusRating, reviews: data.trustradiusReviews },
        coldEmailKit: { rating: data.coldEmailKitRating, reviews: data.coldEmailKitReviews }
    }
}

