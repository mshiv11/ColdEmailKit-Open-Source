import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { cx } from "~/utils/cva"

type StarRatingProps = {
    rating: number
    totalReviews?: number
    className?: string
    showTrustScore?: boolean
    trustScore?: number
}

export function StarRating({ rating, totalReviews, className, showTrustScore, trustScore }: StarRatingProps) {
    // Ensure rating is between 0 and 5
    const clampedRating = Math.max(0, Math.min(5, rating))

    return (
        <Stack className={cx("items-center gap-2", className)}>
            <div className="flex items-center gap-0.5" aria-label={`Rating: ${clampedRating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => {
                    // Calculate how much of this star should be filled
                    // e.g. rating 4.5:
                    // star 1: fill 100%
                    // ...
                    // star 4: fill 100%
                    // star 5: fill 50%
                    const fillPercentage = Math.min(Math.max(clampedRating - (star - 1), 0), 1) * 100

                    return (
                        <div key={star} className="relative size-4">
                            {/* Background (Empty) Star */}
                            <Icon
                                name="lucide/star"
                                className="absolute inset-0 size-4 text-muted-foreground/20 fill-current"
                            />

                            {/* Foreground (Filled) Star - Masked */}
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercentage}%` }}
                            >
                                <Icon
                                    name="lucide/star"
                                    className="size-4 text-yellow-400 fill-current"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center gap-1 text-sm font-medium">
                <span>{clampedRating.toFixed(1)}</span>
                {totalReviews !== undefined && (
                    <span className="text-muted-foreground font-normal">({totalReviews} reviews)</span>
                )}
            </div>

            {showTrustScore && trustScore !== undefined && (
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 ml-2">
                    <span>Trust Score: {trustScore}%</span>
                </div>
            )}
        </Stack>
    )
}
