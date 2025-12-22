import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "~/lib/auth"
import { db } from "~/services/db"

const reviewSchema = z.object({
    toolId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const json = await req.json()
        const { toolId, rating, comment } = reviewSchema.parse(json)

        // Check if user already reviewed this tool
        const existingReview = await db.review.findFirst({
            where: {
                userId: session.user.id,
                toolId,
            },
        })

        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this tool" }, { status: 400 })
        }

        const review = await db.review.create({
            data: {
                userId: session.user.id,
                toolId,
                rating,
                comment,
            },
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error("Review creation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
